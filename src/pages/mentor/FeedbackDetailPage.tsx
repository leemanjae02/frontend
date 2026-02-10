import { useState, useRef, useMemo, useEffect } from "react";
import styled from "styled-components";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { typography } from "../../styles/typography";
import Button from "../../components/Button";
import Textarea from "../../components/Textarea";
import NumberBadge from "../../components/NumberBadge";
import ImportantStar from "../../components/mentor/ImportantStar";
import Indicator from "../../components/mentee/Indicator";
import LeftArrowIcon from "../../assets/images/icon/left.svg?react";
import RightArrowIcon from "../../assets/images/icon/right.svg?react";
import DeleteIcon from "../../assets/images/icon/minus-1.svg?react";
import UploadIcon from "../../assets/images/icon/upload.svg?react";
import PersonIcon from "../../assets/images/icon/person.svg?react";
import PenIcon from "../../assets/images/icon/pen.svg?react";

import {
  getMentorTaskDetail,
  getTemporaryFeedback,
  saveMentorFeedback,
  saveTemporaryFeedback,
  type MentorTaskDetailResponse,
  type SaveTemporaryFeedbackRequest,
  type SaveFeedbackRequest,
} from "../../api/mentorFeedback";
import { getFileUrl } from "../../api/file";

// --- Types ---

interface Marker {
  id: number | string;
  type: "MENTOR" | "MENTEE";
  x: number; // percentage
  y: number;
  number: number;
  content?: string; // mentee's question content
  reply?: string; // mentor's feedback
  isStarred?: boolean;
}

interface FeedbackImage {
  proofShotId: number;
  url: string;
  markers: Marker[];
}

interface FeedbackState {
  todoTitle: string;
  menteeName: string;
  images: FeedbackImage[];
  generalReview: string;
  isEditMode: boolean;
}

const ImageMarker = ({
  marker,
  onMarkerClick,
}: {
  marker: Marker;
  onMarkerClick: (id: string | number) => void;
}) => {
  return (
    <MarkerPin
      $x={marker.x}
      $y={marker.y}
      onClick={(e) => {
        e.stopPropagation();
        onMarkerClick(marker.id);
      }}
    >
      <NumberBadge
        value={marker.number}
        variant={
          marker.type === "MENTEE"
            ? "question"
            : marker.isStarred
            ? "important"
            : "feedback"
        }
        onClick={() => onMarkerClick(marker.id)}
      />
    </MarkerPin>
  );
};

// --- Page Component ---

const FeedbackDetailPage = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const initialTaskName = location.state?.taskName || "";
  const taskStatus = location.state?.status;
  const isReadOnly = taskStatus === "SCHEDULED";

  const [state, setState] = useState<FeedbackState>({
    todoTitle: initialTaskName,
    menteeName: "",
    generalReview: "",
    images: [],
    isEditMode: false,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const isApiProcessing = useRef(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const imageRef = useRef<HTMLImageElement>(null);
  const feedbackRefs = useRef<Record<string | number, HTMLDivElement | null>>(
    {}
  );

  const currentImage = state.images[currentImageIndex];

  // --- Data Fetching ---

  const transformResponse = async (
    data: MentorTaskDetailResponse,
    isEditMode: boolean
  ): Promise<FeedbackState> => {
    let menteeOrder = 1;
    let mentorOrder = 1;

    const images: FeedbackImage[] = await Promise.all(
      data.proofShots.map(async (ps) => {
        const markers: Marker[] = [];

        // Map Mentee Questions
        ps.questions.forEach((q) => {
          if (q.annotation) {
            markers.push({
              id: `q-${q.questionId}`,
              type: "MENTEE",
              x: q.annotation.percentX,
              y: q.annotation.percentY,
              number: menteeOrder++,
              content: q.content,
              reply: q.answer || "",
            });
          }
        });

        // Map Mentor Feedbacks
        ps.feedbacks.forEach((f) => {
          if (f.annotation) {
            markers.push({
              id: `f-${f.feedbackId}`,
              type: "MENTOR",
              x: f.annotation.percentX,
              y: f.annotation.percentY,
              number: mentorOrder++,
              reply: f.content,
              isStarred: f.starred,
            });
          }
        });

        // Fetch actual URL from /files API
        let imageUrl = "";
        try {
          imageUrl = await getFileUrl(ps.imageFileId);
        } catch (e) {
          console.error(`Failed to fetch URL for fileId ${ps.imageFileId}`, e);
        }

        return {
          proofShotId: ps.proofShotId,
          url: imageUrl,
          markers: markers.sort((a, b) => a.number - b.number),
        };
      })
    );

    return {
      todoTitle: data.taskName,
      menteeName: data.menteeName,
      generalReview: data.generalComment || "",
      images,
      isEditMode,
    };
  };

  useEffect(() => {
    if (!taskId) return;

    const loadData = async () => {
      try {
        setLoading(true);
        let data: MentorTaskDetailResponse | null = null;
        let isEditMode = false;

        // 1. 임시저장 데이터 먼저 확인
        try {
          const tempData = await getTemporaryFeedback(taskId);
          const hasTempContent =
            tempData.generalComment ||
            tempData.proofShots.some(
              (ps) =>
                ps.feedbacks.length > 0 || ps.questions.some((q) => q.answer)
            );

          if (hasTempContent) {
            data = tempData;
            isEditMode = true;
            console.log("Loaded from temporary feedback");
          }
        } catch (tempErr) {
          console.log("No temporary feedback found or error:", tempErr);
        }

        // 2. 임시저장이 없거나 데이터가 비어있으면 상세조회 호출
        if (!data) {
          data = await getMentorTaskDetail(taskId);
          const hasMentorFeedback =
            data.generalComment ||
            data.proofShots.some((ps) => ps.feedbacks.length > 0);

          if (hasMentorFeedback) {
            isEditMode = true;
            console.log("Loaded from finalized feedback");
          }
        }

        const transformed = await transformResponse(data, isEditMode);
        setState(transformed);
      } catch (err) {
        console.error("Mentor task data fetch failed:", err);
        alert("데이터를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [taskId]);

  // --- Auto Save (Debounce 10s) ---

  useEffect(() => {
    if (!taskId || loading || isReadOnly || saving) return;

    const timer = setTimeout(async () => {
      if (isApiProcessing.current || saving) return;

      try {
        isApiProcessing.current = true;
        const payload: SaveTemporaryFeedbackRequest = {
          generalComment: state.generalReview,
          proofShotFeedbacks: state.images.map((img) => ({
            proofShotId: img.proofShotId,
            feedbacks: img.markers
              .filter((m) => m.type === "MENTOR")
              .map((m) => ({
                content: m.reply || "",
                starred: !!m.isStarred,
                percentX: m.x,
                percentY: m.y,
              })),
          })),
          questionAnswers: state.images.flatMap((img) =>
            img.markers
              .filter((m) => m.type === "MENTEE")
              .map((m) => ({
                questionId: parseInt(String(m.id).replace("q-", "")),
                content: m.reply || "",
              }))
          ),
        };

        await saveTemporaryFeedback(taskId, payload);
        console.log("임시저장 완료");
      } catch (err) {
        console.error("임시저장 실패:", err);
      } finally {
        isApiProcessing.current = false;
      }
    }, 10000); // 10 seconds

    return () => clearTimeout(timer);
  }, [state.generalReview, state.images, taskId, loading, saving, isReadOnly]);

  // --- Handlers ---

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isReadOnly || !imageRef.current || state.images.length === 0) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    if (x < 0 || x > 100 || y < 0 || y > 100) return;

    const newMarker: Marker = {
      id: `new-${Date.now()}`,
      type: "MENTOR",
      x,
      y,
      number: 0,
      reply: "",
      isStarred: false,
    };

    const newImages = [...state.images];
    newImages[currentImageIndex].markers.push(newMarker);

    let mOrder = 1;
    let fOrder = 1;
    newImages.forEach((img) => {
      img.markers.forEach((m) => {
        if (m.type === "MENTEE") m.number = mOrder++;
        else m.number = fOrder++;
      });
    });

    setState({ ...state, images: newImages });

    setTimeout(() => {
      feedbackRefs.current[newMarker.id]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      const textarea =
        feedbackRefs.current[newMarker.id]?.querySelector("textarea");
      textarea?.focus();
    }, 100);
  };

  const deleteMarker = (markerId: number | string) => {
    const newImages = state.images.map((img) => ({
      ...img,
      markers: img.markers.filter((m) => m.id !== markerId),
    }));

    let mOrder = 1;
    let fOrder = 1;
    newImages.forEach((img) => {
      img.markers.forEach((m) => {
        if (m.type === "MENTEE") m.number = mOrder++;
        else m.number = fOrder++;
      });
    });

    setState({ ...state, images: newImages });
  };

  const handleMarkerClick = (markerId: string | number) => {
    feedbackRefs.current[markerId]?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
    const textarea = feedbackRefs.current[markerId]?.querySelector("textarea");
    textarea?.focus();
  };

  const updateMarkerReply = (markerId: string | number, value: string) => {
    const newImages = state.images.map((img) => ({
      ...img,
      markers: img.markers.map((m) =>
        m.id === markerId ? { ...m, reply: value } : m
      ),
    }));
    setState({ ...state, images: newImages });
  };

  const toggleMarkerStar = (markerId: string | number) => {
    const newImages = state.images.map((img) => ({
      ...img,
      markers: img.markers.map((m) =>
        m.id === markerId ? { ...m, isStarred: !m.isStarred } : m
      ),
    }));
    setState({ ...state, images: newImages });
  };

  const handleSave = async () => {
    if (!isSavable || saving || !taskId || isApiProcessing.current) return;

    setSaving(true);
    isApiProcessing.current = true;
    try {
      const payload: SaveFeedbackRequest = {
        generalComment: state.generalReview,
        proofShotFeedbacks: state.images.map((img) => ({
          proofShotId: img.proofShotId,
          feedbacks: img.markers
            .filter((m) => m.type === "MENTOR")
            .map((m) => ({
              content: m.reply || "",
              starred: !!m.isStarred,
              percentX: m.x,
              percentY: m.y,
            })),
        })),
        questionAnswers: state.images.flatMap((img) =>
          img.markers
            .filter((m) => m.type === "MENTEE")
            .map((m) => ({
              questionId: parseInt(String(m.id).replace("q-", "")),
              content: m.reply || "",
            }))
        ),
      };

      await saveMentorFeedback(taskId, payload);

      alert("피드백이 저장되었습니다.");
      navigate(-1);
    } catch (e) {
      console.error(e);
      alert("저장에 실패했습니다.");
    } finally {
      setSaving(false);
      isApiProcessing.current = false;
    }
  };

  const allMarkers = useMemo(() => {
    return state.images
      .flatMap((img) => img.markers)
      .sort((a, b) => a.number - b.number);
  }, [state.images]);

  const menteeQuestions = useMemo(() => {
    return allMarkers.filter((m) => m.type === "MENTEE");
  }, [allMarkers]);

  const mentorFeedbacks = useMemo(() => {
    return allMarkers.filter((m) => m.type === "MENTOR");
  }, [allMarkers]);

  const isSavable = useMemo(() => {
    return state.generalReview.trim().length > 0;
  }, [state.generalReview]);

  if (loading) {
    return <LoadingContainer>데이터를 불러오는 중...</LoadingContainer>;
  }

  return (
    <Container>
      <NavBar>
        <Logo>설스터디</Logo>
        <UserProfile>
          <UserIcon />
          <span>윤서영 멘토</span>
        </UserProfile>
      </NavBar>

      <ContentHeader>
        <HeaderLeft>
          <TitleWrapper>
            <Title>{state.todoTitle}</Title>
            <EditIcon
              onClick={() => {
                const menteeId = location.pathname.split("/")[3];
                navigate(`/mentor/mentees/${menteeId}/todo/${taskId}/edit`);
              }}
              aria-label="수정하기"
            />
          </TitleWrapper>
          <MenteeName>{state.menteeName}</MenteeName>
        </HeaderLeft>
        <HeaderRight>
          {!isReadOnly && (
            <HeaderButton
              variant="primary"
              disabled={!isSavable || saving}
              onClick={handleSave}
            >
              {saving
                ? "저장 중..."
                : state.isEditMode
                ? "최종 피드백 수정하기"
                : "최종 피드백 저장하기"}
            </HeaderButton>
          )}
        </HeaderRight>
      </ContentHeader>

      <MainContent>
        <ViewerSection>
          <ImageArea>
            {state.images.length > 0 && currentImage ? (
              <ImageContainer onClick={handleImageClick}>
                <StyledImage
                  ref={imageRef}
                  src={currentImage.url}
                  alt="인증샷"
                  draggable={false}
                />
                {currentImage.markers.map((m) => (
                  <ImageMarker
                    key={m.id}
                    marker={m}
                    onMarkerClick={handleMarkerClick}
                  />
                ))}
              </ImageContainer>
            ) : (
              <EmptyViewer>
                <UploadIconWrapper>
                  <UploadIcon />
                </UploadIconWrapper>
                <EmptyText>업로드된 사진이 없어요</EmptyText>
              </EmptyViewer>
            )}
          </ImageArea>

          {state.images.length > 0 && (
            <IndicatorRow>
              <NavBtn
                onClick={() =>
                  setCurrentImageIndex((prev) => Math.max(0, prev - 1))
                }
                disabled={currentImageIndex === 0}
              >
                <LeftArrowIcon />
              </NavBtn>
              <Indicator
                count={state.images.length}
                activeIndex={currentImageIndex}
                onChange={(idx) => setCurrentImageIndex(idx)}
              />
              <NavBtn
                onClick={() =>
                  setCurrentImageIndex((prev) =>
                    Math.min(state.images.length - 1, prev + 1)
                  )
                }
                disabled={currentImageIndex === state.images.length - 1}
              >
                <RightArrowIcon />
              </NavBtn>
            </IndicatorRow>
          )}
        </ViewerSection>

        <FormSection>
          <FormTitle>피드백 작성</FormTitle>
          <FormGuide>
            이미지에 표시된 번호 별로 구체적인 피드백을 작성하세요.
          </FormGuide>

          <FormGroup>
            <FormLabel>
              멘토의 총평 <Required>*</Required>
            </FormLabel>
            <Textarea
              placeholder={
                "학생의 전반적인 학습 태도와 풀이 완성도에 대한 총평을 작성해주세요."
              }
              value={state.generalReview}
              onChange={(e) =>
                setState({ ...state, generalReview: e.target.value })
              }
              maxLength={200}
              showCount={!isReadOnly}
              countPosition="bottom"
              disabled={isReadOnly}
            />
          </FormGroup>

          {menteeQuestions.length > 0 && (
            <>
              <Divider />
              <SectionHeader>
                <TitleGroup>
                  <FormTitle>멘티의 질문</FormTitle>
                  <Required>*</Required>
                </TitleGroup>
              </SectionHeader>
              <FeedbackList>
                {menteeQuestions.map((m) => (
                  <div
                    key={m.id}
                    ref={(el) => {
                      feedbackRefs.current[m.id] = el;
                    }}
                  >
                    <MenteeQuestionCard>
                      <CardHeader>
                        <BadgeGroup>
                          <NumberBadge value={m.number} variant="question" />
                          <MenteeQuestionText>{m.content}</MenteeQuestionText>
                        </BadgeGroup>
                      </CardHeader>
                      <Textarea
                        placeholder={
                          isReadOnly
                            ? "질문이 없습니다."
                            : "질문에 대한 답변을 작성해주세요."
                        }
                        value={m.reply || ""}
                        onChange={(e) =>
                          updateMarkerReply(m.id, e.target.value)
                        }
                        rows={3}
                        disabled={isReadOnly}
                      />
                    </MenteeQuestionCard>
                  </div>
                ))}{" "}
              </FeedbackList>
            </>
          )}

          <Divider />

          <SectionHeader>
            <FormTitle>번호별 상세 피드백</FormTitle>
            {mentorFeedbacks.length > 0 && (
              <WritingCount>{mentorFeedbacks.length}개 작성 중</WritingCount>
            )}
          </SectionHeader>

          <FeedbackList>
            {mentorFeedbacks.length === 0 ? (
              <EmptyFeedbackArea>
                <p>왼쪽 이미지를 클릭하여 피드백 위치를 지정하세요.</p>
              </EmptyFeedbackArea>
            ) : (
              mentorFeedbacks.map((m) => (
                <div
                  key={m.id}
                  ref={(el) => {
                    feedbackRefs.current[m.id] = el;
                  }}
                >
                  <FeedbackCard $isStarred={!!m.isStarred}>
                    <CardHeader>
                      <BadgeGroup>
                        <NumberBadge
                          value={m.number}
                          variant={m.isStarred ? "important" : "feedback"}
                        />
                      </BadgeGroup>{" "}
                      <CardActions>
                        {!isReadOnly && (
                          <>
                            <ImportantStar
                              value={!!m.isStarred}
                              onChange={() => toggleMarkerStar(m.id)}
                              size={24}
                            />
                            <DeleteButton onClick={() => deleteMarker(m.id)}>
                              <DeleteIcon />
                            </DeleteButton>
                          </>
                        )}
                      </CardActions>
                    </CardHeader>
                    <Textarea
                      placeholder="피드백 내용을 작성해주세요."
                      value={m.reply || ""}
                      onChange={(e) => updateMarkerReply(m.id, e.target.value)}
                      rows={3}
                      disabled={isReadOnly}
                    />
                  </FeedbackCard>
                </div>
              ))
            )}
          </FeedbackList>
        </FormSection>
      </MainContent>
    </Container>
  );
};

// --- Styles ---

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  background-color: var(--color-white);
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
`;

const LoadingContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  ${typography.t18sb}
  color: var(--color-gray-500);
`;

const NavBar = styled.header`
  height: 64px;
  min-height: 64px;
  padding: 0 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--color-white);
  z-index: 10;
`;

const Logo = styled.div`
  background-color: var(--color-primary-500);
  color: var(--color-white);
  padding: 6px 12px;
  border-radius: 4px;
  ${typography.t16sb}
`;

const UserProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 16px;
  background-color: color-mix(in srgb, var(--color-blue-500) 10%, transparent);
  border-radius: 8px;
  color: var(--color-blue-500);
  ${typography.t14sb}
  cursor: pointer;
`;

const UserIcon = styled(PersonIcon)`
  width: 20px;
  height: 20px;
  path {
    fill: var(--color-blue-500);
  }
`;

const ContentHeader = styled.div`
  height: 90px;
  min-height: 90px;
  padding: 0 120px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--color-white);
  border-bottom: 1px solid var(--color-gray-100);
`;

const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Title = styled.h1`
  ${typography.t24sb}
  color: var(--color-black);
  margin: 0;
`;

const EditIcon = styled(PenIcon)`
  width: 24px;
  height: 24px;
  cursor: pointer;
  path {
    stroke: var(--color-gray-400);
  }
  &:hover {
    path {
      stroke: var(--color-blue-500);
    }
  }
`;

const MenteeName = styled.span`
  ${typography.t16r}
  color: var(--color-gray-400);
  text-align: left;
`;

const HeaderRight = styled.div``;

const HeaderButton = styled(Button)`
  width: 170px;
  height: 48px;
  background-color: var(--color-primary-500);
  border-radius: 8px;
  ${typography.t16sb}
  color: var(--color-white);
  &:hover:not(:disabled) {
    background-color: var(--color-primary-600);
  }
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  overflow: hidden;
  padding: 0 120px;
`;

const ViewerSection = styled.section`
  flex: 4;
  min-width: 0;
  height: 100%;
  overflow: hidden;
  background-color: var(--color-gray-50);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 40px;
  box-sizing: border-box;
  border-right: 1px solid var(--color-gray-100);
`;

const ImageArea = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const ImageContainer = styled.div`
  position: relative;
  max-width: 100%;
  max-height: 100%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  cursor: crosshair;
  background-color: var(--color-white);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledImage = styled.img`
  display: block;
  max-width: 100%;
  max-height: calc(100vh - 250px);
  object-fit: contain;
  user-select: none;
`;

const EmptyViewer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
`;

const UploadIconWrapper = styled.div`
  svg {
    width: 48px;
    height: 48px;
    path {
      stroke: var(--color-gray-300);
    }
  }
`;

const EmptyText = styled.p`
  ${typography.t16sb}
  color: var(--color-gray-400);
  margin: 0;
`;

const MarkerPin = styled.div<{ $x: number; $y: number; $isStarred?: boolean }>`
  position: absolute;
  left: ${({ $x }) => $x}%;
  top: ${({ $y }) => $y}%;
  transform: translate(-50%, -50%);
  z-index: 5;
  cursor: pointer;
`;

const IndicatorRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-top: 24px;
`;

const NavBtn = styled.button`
  width: 40px;
  height: 40px;
  background-color: var(--color-white);
  border: 1px solid var(--color-gray-200);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  svg {
    width: 24px;
    height: 24px;
    path {
      stroke: var(--color-gray-400);
    }
  }
  &:disabled {
    opacity: 0.2;
    cursor: not-allowed;
  }
  &:hover:not(:disabled) {
    background-color: var(--color-gray-50);
  }
`;

const FormSection = styled.section`
  flex: 6;
  min-width: 0;
  height: 100%;
  padding: 32px 0px 32px 40px;
  overflow-y: auto;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  background-color: var(--color-white);
`;

const FormGuide = styled.p`
  ${typography.t12r}
  text-align: left;
  color: var(--color-gray-500);
  margin-bottom: 24px;
`;

const FormTitle = styled.h2`
  ${typography.t18sb}
  color: var(--color-black);
  margin: 0;
  text-align: left;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const FormLabel = styled.label`
  ${typography.t16sb};
  text-align: left;
  color: var(--color-black);
`;

const Required = styled.span`
  color: var(--color-primary-500);
`;

const Divider = styled.div`
  height: 1px;
  background-color: var(--color-gray-100);
  margin: 32px 0;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
  margin-bottom: 20px;
`;

const TitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const WritingCount = styled.span`
  ${typography.t12sb}
  color: var(--color-blue-500);
`;

const FeedbackList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const FeedbackCard = styled.div<{ $isStarred?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-bottom: 32px;
`;

const MenteeQuestionCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-bottom: 32px;
  border-bottom: 1px solid var(--color-gray-50);
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
`;

const BadgeGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const CardActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const DeleteButton = styled.button`
  background: none;
  border: 1px solid var(--color-gray-200);
  border-radius: 4px;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  svg {
    width: 14px;
    height: 14px;
    path {
      stroke: var(--color-gray-400);
    }
  }
`;

const MenteeQuestionText = styled.span`
  ${typography.t16sb}
  color: var(--color-black);
  line-height: 1.5;
`;

const EmptyFeedbackArea = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  color: var(--color-gray-400);
  ${typography.t14r}
`;

export default FeedbackDetailPage;
