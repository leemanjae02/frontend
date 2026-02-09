import { useEffect, useMemo, useState } from "react";
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

// 파일 다운로드 api 연동 후 지울 예정
function getProofShotImageUrl(imageFileId: number) {
  if (typeof imageFileId === "string") return imageFileId;

  return `${import.meta.env.VITE_API_URL}/files/${imageFileId}`;
}

function onlyRegisteredFeedbacks(feedbacks: TaskFeedbackItem[]) {
  return (feedbacks ?? []).filter((f) => f.registerStatus === "REGISTERED");
}

function transformToOverlayVM(api: TaskFeedbackDetailData): OverlayVM {
  const proofShots = api.proofShots ?? [];

  const photos = proofShots.map((ps) => getProofShotImageUrl(ps.imageFileId));

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
      })
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

        setData(transformToOverlayVM(apiData));
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

  // if (!isOpen) return null;

  const hasPhotos = (data?.photos?.length ?? 0) > 0;

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
      (sec) => sec.photoNumber === activePhotoIndex + 1
    );
  }, [data, activePhotoIndex]);

  const shouldShowPhotoFeedback =
    hasPhotos && (activePhotoFeedbackSection?.items?.length ?? 0) > 0;

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
                <PhotoFrame>
                  <Photo src={data.photos[activePhotoIndex]} alt="" />
                  {activeBadges.map((b) => (
                    <BadgeSpot
                      key={b.id}
                      style={{ left: `${b.x * 100}%`, top: `${b.y * 100}%` }}
                    >
                      <NumberBadge value={b.value} variant={b.variant} />
                    </BadgeSpot>
                  ))}
                </PhotoFrame>

                <IndicatorWrap>
                  <Indicator
                    count={data.photos.length}
                    activeIndex={activePhotoIndex}
                    onChange={(next) => setActivePhotoIndex(next)}
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
  height: 100%;
  background: var(--color-white);
  z-index: 9999;

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

const PhotoFrame = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
  background: color-mix(in srgb, var(--color-gray-100) 30%, transparent);
`;

const Photo = styled.img`
  width: 100%;
  height: auto;
  display: block;
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
