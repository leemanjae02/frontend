import { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";

import TodoDetailHeader from "./TodoDetailHeader";
import NumberBadge, { type NumberBadgeVariant } from "../NumberBadge";
import Indicator from "./Indicator";
import OverallFeedback from "./OverallFeedback";
import PhotoFeedback from "./PhotoFeedback";
import PhotoQnA from "./PhotoQnA";

import type { SubjectKey } from "../SubjectAddButton";
import {
  fetchTaskFeedbackDetail,
  type TaskFeedbackDetailData,
  type TaskFeedbackItem,
} from "../../api/task";
import { getFileUrl } from "../../api/file";

interface BadgeVM {
  id: string;
  x: number;
  y: number;
  value: number;
  variant: NumberBadgeVariant;
}

interface PhotoFeedbackItemVM {
  index: number;
  title: string | null;
  detail: string;
}

interface PhotoFeedbackSectionVM {
  photoNumber: number;
  defaultOpen?: boolean;
  items: PhotoFeedbackItemVM[];
}

interface OverlayVM {
  todoTitle: string;
  subject: string;

  // 실제로는 imageFileId -> url 로 변환해서 채워넣기
  photos: string[];

  overallMentorName: string;
  overallComment: string;

  badgesByPhoto: Record<number, BadgeVM[]>;

  photoFeedbacks: PhotoFeedbackSectionVM[];

  photoQnAByPhoto: Record<
    number,
    { index: number; question: string; answer?: string }[]
  >;
}

function onlyRegisteredFeedbacks(feedbacks: TaskFeedbackItem[]) {
  return (feedbacks ?? []).filter((f) => f.registerStatus === "CONFIRMED");
}

async function transformToOverlayVM(
  api: TaskFeedbackDetailData,
): Promise<OverlayVM> {
  const proofShots = api.proofShots ?? [];

  const photos = await Promise.all(
    proofShots.map(async (ps) => {
      try {
        return await getFileUrl(ps.imageFileId);
      } catch (e) {
        console.error("이미지 URL 조회 실패:", ps.imageFileId, e);
        return ""; // 실패 시 빈 문자열
      }
    }),
  );

  const badgesByPhoto: Record<number, BadgeVM[]> = {};
  const photoQnAByPhoto: Record<
    number,
    { index: number; question: string; answer?: string }[]
  > = {};

  const photoFeedbacks: PhotoFeedbackSectionVM[] = proofShots.map((ps, idx) => {
    // QnA 섹션 데이터(질문/답변)
    const qnaItems = (ps.questions ?? []).map((q) => ({
      index: q.questionNumber,
      question: q.content,
      answer: q.answer ?? undefined,
    }));
    photoQnAByPhoto[idx] = qnaItems;

    // 뱃지(질문 위치 + REGISTERED 피드백 위치)
    const qBadges: BadgeVM[] = (ps.questions ?? [])
      .filter((q) => q.annotation)
      .map((q) => ({
        id: `q-${q.questionId}`,
        x: (q.annotation!.percentX ?? 0) / 100,
        y: (q.annotation!.percentY ?? 0) / 100,
        value: q.questionNumber,
        variant: "question",
      }));

    const registeredFeedbacks = onlyRegisteredFeedbacks(ps.feedbacks ?? []);

    const fBadges: BadgeVM[] = registeredFeedbacks
      .filter((f) => f.annotation)
      .map((f) => ({
        id: `f-${f.feedbackId}`,
        x: (f.annotation!.percentX ?? 0) / 100,
        y: (f.annotation!.percentY ?? 0) / 100,
        value: f.feedbackNumber,
        variant: f.starred ? "important" : "feedback",
      }));

    badgesByPhoto[idx] = [...qBadges, ...fBadges];

    // 사진별 피드백 섹션(REGISTERED만)
    const feedbackItems: PhotoFeedbackItemVM[] = registeredFeedbacks.map(
      (f) => ({
        index: f.feedbackNumber,
        title: f.starred
          ? "중요한 피드백이에요. 꼭 읽고 학습에 적용해보세요."
          : null,
        detail: f.content,
      }),
    );

    return {
      photoNumber: idx + 1,
      defaultOpen: idx === 0, // 첫 사진만 기본 open
      items: feedbackItems,
    };
  });

  return {
    todoTitle: api.todoTitle,
    subject: api.subjectKey,
    photos,
    overallMentorName: api.overallMentorName,
    overallComment: api.overallComment,

    badgesByPhoto,
    photoFeedbacks,
    photoQnAByPhoto,
  };
}

interface Props {
  isOpen: boolean;
  onClose: () => void;

  taskId: number | null;
  subject: string;
  title: string;
}

const FeedbackDetailOverlay = ({
  isOpen,
  onClose,
  taskId,
  subject,
  title,
}: Props) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [data, setData] = useState<OverlayVM | null>(null);

  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  const carouselRef = useRef<HTMLDivElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  useEffect(() => {
    if (!isOpen) return;

    if (!taskId) {
      setData(null);
      setError("taskId가 없습니다.");
      return;
    }

    let ignore = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);
        setActivePhotoIndex(0);

        const apiData = await fetchTaskFeedbackDetail(taskId);
        if (ignore) return;

        const vm = await transformToOverlayVM(apiData);
        if (ignore) return;

        setData(vm);
      } catch (e) {
        console.error(e);
        if (ignore) return;
        setData(null);
        setError("피드백을 불러오지 못했습니다.");
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, [isOpen, taskId]);

  useEffect(() => {
    if (!isOpen) return;
    if (!data) return;

    // 이미지 없을 수도 있으니 안전하게
    if (carouselRef.current) {
      carouselRef.current.scrollTo({ left: 0, behavior: "auto" });
    }
    setActivePhotoIndex(0);
  }, [isOpen, data]);

  const hasPhotos = (data?.photos?.filter(Boolean).length ?? 0) > 0;

  const shouldShowOverall = hasPhotos ? activePhotoIndex === 0 : true;

  const activeBadges = useMemo(() => {
    if (!data) return [];
    return data.badgesByPhoto[activePhotoIndex] ?? [];
  }, [data, activePhotoIndex]);

  const activeQnAItems = useMemo(() => {
    if (!data) return [];
    return data.photoQnAByPhoto[activePhotoIndex] ?? [];
  }, [data, activePhotoIndex]);

  const shouldShowPhotoQnA = hasPhotos && activeQnAItems.length > 0;

  const activePhotoFeedbackSection = useMemo(() => {
    if (!data) return null;
    return data.photoFeedbacks.find(
      (sec) => sec.photoNumber === activePhotoIndex + 1,
    );
  }, [data, activePhotoIndex]);

  const shouldShowPhotoFeedback =
    hasPhotos && (activePhotoFeedbackSection?.items?.length ?? 0) > 0;

  const handleScroll = () => {
    if (!carouselRef.current) return;
    const scrollLeftVal = carouselRef.current.scrollLeft;
    const width = carouselRef.current.offsetWidth;
    const newIndex = Math.round(scrollLeftVal / width);
    setActivePhotoIndex(newIndex);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!carouselRef.current) return;

    isDown.current = true;
    setIsDragging(true);

    startX.current = e.pageX - carouselRef.current.offsetLeft;
    scrollLeft.current = carouselRef.current.scrollLeft;
  };

  const handleMouseLeave = () => {
    isDown.current = false;
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    isDown.current = false;
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDown.current || !carouselRef.current) return;
    e.preventDefault();

    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.2;
    carouselRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!carouselRef.current) return;

    isDown.current = true;
    setIsDragging(true);

    startX.current = e.touches[0].pageX - carouselRef.current.offsetLeft;
    scrollLeft.current = carouselRef.current.scrollLeft;
  };

  const handleTouchEnd = () => {
    isDown.current = false;
    setIsDragging(false);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDown.current || !carouselRef.current) return;

    const x = e.touches[0].pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.2;
    carouselRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const handleIndicatorChange = (index: number) => {
    if (!carouselRef.current) return;
    const width = carouselRef.current.offsetWidth;

    carouselRef.current.scrollTo({
      left: width * index,
      behavior: "smooth",
    });
  };

  if (!isOpen) return null;

  return (
    <Container $isOpen={isOpen}>
      <TodoDetailHeader
        title={title || data?.todoTitle || ""}
        subject={(subject || data?.subject || "KOREAN") as SubjectKey}
        onClickBack={onClose}
      />

      <Body>
        {loading ? <StateText>불러오는 중...</StateText> : null}
        {!loading && error ? <StateText>{error}</StateText> : null}

        {!loading && !error && data ? (
          <>
            {hasPhotos ? (
              <PhotoArea>
                <CarouselContainer
                  ref={carouselRef}
                  $isDragging={isDragging}
                  onScroll={handleScroll}
                  onMouseDown={handleMouseDown}
                  onMouseLeave={handleMouseLeave}
                  onMouseUp={handleMouseUp}
                  onMouseMove={handleMouseMove}
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                  onTouchMove={handleTouchMove}
                >
                  {data.photos.map((src, idx) => (
                    <ImageSlide key={idx}>
                      <ImageWrapper>
                        {src ? (
                          <Photo src={src} alt="" draggable={false} />
                        ) : (
                          <StateText>이미지를 불러오지 못했습니다.</StateText>
                        )}

                        {idx === activePhotoIndex &&
                          activeBadges.map((b) => (
                            <BadgeSpot
                              key={b.id}
                              style={{
                                left: `${b.x * 100}%`,
                                top: `${b.y * 100}%`,
                              }}
                            >
                              <NumberBadge
                                value={b.value}
                                variant={b.variant}
                              />
                            </BadgeSpot>
                          ))}
                      </ImageWrapper>
                    </ImageSlide>
                  ))}
                </CarouselContainer>

                <IndicatorWrap>
                  <Indicator
                    count={data.photos.length}
                    activeIndex={activePhotoIndex}
                    onChange={handleIndicatorChange}
                  />
                </IndicatorWrap>
              </PhotoArea>
            ) : null}

            {shouldShowOverall ? (
              <OverallFeedback
                mentorName={data.overallMentorName}
                details={data.overallComment}
                defaultOpen
              />
            ) : null}

            {/* 사진별 질문(QnA): 해당 사진에 질문이 있을 때만 */}
            {shouldShowPhotoQnA ? (
              <PhotoQnA
                title="나의 질문"
                items={activeQnAItems.map((q) => ({
                  index: q.index,
                  question: q.question,
                  answer: q.answer,
                }))}
                defaultOpen
              />
            ) : null}

            {/* 사진별 피드백: REGISTERED 피드백이 있을 때만 */}
            {shouldShowPhotoFeedback && activePhotoFeedbackSection ? (
              <Sections>
                <PhotoFeedback
                  key={activePhotoFeedbackSection.photoNumber}
                  photoNumber={activePhotoFeedbackSection.photoNumber}
                  items={activePhotoFeedbackSection.items}
                  defaultOpen
                />
              </Sections>
            ) : null}
          </>
        ) : null}
      </Body>
    </Container>
  );
};

const Container = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: var(--vh, 100%);
  background: var(--color-white);
  z-index: 1000;

  display: flex;
  flex-direction: column;

  transform: ${({ $isOpen }) =>
    $isOpen ? "translateY(0)" : "translateY(100%)"};
  transition: transform 0.3s cubic-bezier(0.25, 1, 0.5, 1);
`;

const Body = styled.main`
  width: 100%;
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const StateText = styled.div`
  padding: 20px 16px;
  color: var(--color-gray-500);
  font-size: 14px;
`;

const PhotoArea = styled.section`
  padding: 16px;
`;

const CarouselContainer = styled.div<{ $isDragging: boolean }>`
  width: 100%;
  overflow-x: auto;
  display: flex;

  scroll-snap-type: ${({ $isDragging }) =>
    $isDragging ? "none" : "x mandatory"};

  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    display: none;
  }

  cursor: ${({ $isDragging }) => ($isDragging ? "grabbing" : "grab")};
`;

const ImageSlide = styled.div`
  flex: 0 0 100%;
  width: 100%;
  scroll-snap-align: center;
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
  background: color-mix(in srgb, var(--color-gray-100) 30%, transparent);
`;

const Photo = styled.img`
  width: 100%;
  height: auto;
  display: block;

  touch-action: none;
  user-select: none;
  -webkit-user-drag: none;
  -webkit-touch-callout: none;
`;

const BadgeSpot = styled.div`
  position: absolute;
  transform: translate(-50%, -50%);
`;

const IndicatorWrap = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 16px;
`;

const Sections = styled.div`
  width: 100%;
`;

export default FeedbackDetailOverlay;
