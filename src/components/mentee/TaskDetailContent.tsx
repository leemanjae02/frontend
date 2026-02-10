import React from "react";
import styled, { css } from "styled-components";
import { typography } from "../../styles/typography";
import TeacherIcon from "../../assets/images/icon/teacher.svg?react";
import ChatIcon from "../../assets/images/icon/chat.svg?react";
import TaskAttachment from "./TaskAttachment";
import type { SubjectKey } from "../SubjectAddButton";

export interface AttachmentData {
  id: number | string;
  type: "PDF" | "LINK";
  title: string;
  url?: string;
  fileId?: number;
}

export interface TaskDetailData {
  title: string;
  subject: string;
  subjectKey: string;
  targetTime: number;
  actualTime?: number;
  isMentorAssigned: boolean;
  hasFeedback: boolean;
  attachments?: AttachmentData[];
  mentorFeedback?: {
    mentorName: string;
    content: string;
  };
}

interface TaskDetailProps {
  data: TaskDetailData;
  onOpenPhotoUpload?: () => void;
  onOpenFeedbackDetail?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const SUBJECT_COLORS: Record<SubjectKey, string> = {
  KOREAN: "var(--color-orange-500)",
  ENGLISH: "var(--color-pink-500)",
  MATH: "var(--color-blue-500)",
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 20px;
  overflow-y: auto;
  max-height: 80vh;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const MentorBadge = styled.div<{ $bgColor: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background-color: ${({ $bgColor }) => $bgColor};
  border-radius: 50%;

  svg {
    width: 24px;
    height: 24px;
    path {
      stroke: var(--color-white);
    }
  }
`;

const Title = styled.h2`
  ${typography.t18sb}
  color: var(--color-black);
  margin: 0;
  line-height: 1.35;
  text-align: left;
  word-break: keep-all;
`;

const ResourceList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const InfoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px 0;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
`;

const Label = styled.span`
  ${typography.t14sb}
  color: var(--color-gray-500);
`;

const Value = styled.span`
  ${typography.t14sb}
  color: var(--color-black);
`;

const FeedbackBox = styled.div`
  border-top: 1px solid var(--color-gray-100);
  background-color: var(--color-white);
  padding: 16px 0 0 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FeedbackHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  ${typography.t16sb}
  color: var(--color-blue-500);
  svg path {
    stroke: var(--color-blue-500);
  }
`;

const FeedbackContent = styled.p<{ $expanded: boolean }>`
  ${typography.t14r}
  color: var(--color-gray-800);
  margin: 0;
  line-height: 1.5;
  white-space: pre-wrap;
  ${({ $expanded }) =>
    !$expanded &&
    css`
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    `}
  text-align: left;
`;

const MoreButton = styled.button`
  background: none;
  border: none;
  color: var(--color-gray-400);
  ${typography.t12r}
  cursor: pointer;
  align-self: flex-end;
  padding: 4px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 4px;
`;

const ActionButton = styled.button<{ $variant: "secondary" | "danger" }>`
  flex: 1;
  height: 48px;
  border-radius: 10px;
  ${typography.t16sb}
  cursor: pointer;
  border: none;
  ${({ $variant }) =>
    $variant === "secondary"
      ? css`
          background-color: var(--color-primary-50);
          color: var(--color-primary-500);
        `
      : css`
          background-color: var(--color-primary-500);
          color: var(--color-white);
        `}
`;

const TaskDetailContent: React.FC<TaskDetailProps> = ({
  data,
  onOpenPhotoUpload,
  onOpenFeedbackDetail,
  onEdit,
  onDelete,
}) => {
  const shouldShowUpload =
    !data.mentorFeedback && data.subjectKey !== "RESOURCE";

  const subjectColor =
    SUBJECT_COLORS[data.subjectKey as SubjectKey] || "var(--color-gray-400)";

  return (
    <Container>
      {/* 1. Header */}
      <Header>
        {data.isMentorAssigned && (
          <MentorBadge $bgColor={subjectColor}>
            <TeacherIcon />
          </MentorBadge>
        )}
        <Title>{data.title}</Title>
      </Header>

      {/* 2. Resources */}
      <ResourceList>
        {shouldShowUpload && (
          <TaskAttachment
            mode="UPLOAD_PHOTO"
            title="사진 업로드하기"
            onOpenUpload={onOpenPhotoUpload}
          />
        )}

        {data.attachments?.map((item, idx) => (
          <TaskAttachment
            key={idx}
            mode={item.type === "PDF" ? "VIEW_PDF" : "VIEW_LINK"}
            title={item.title}
            url={item.url}
            fileId={item.fileId}
          />
        ))}
      </ResourceList>

      {/* 3. Info */}
      <InfoList>
        <InfoRow>
          <Label>과목</Label>
          <Value>{data.subject}</Value>
        </InfoRow>
        <InfoRow>
          <Label>목표 설정 시간</Label>
          <Value>{data.targetTime}분</Value>
        </InfoRow>
        {data.actualTime !== undefined && (
          <InfoRow>
            <Label>실제 소요 시간</Label>
            <Value>{data.actualTime}분</Value>
          </InfoRow>
        )}
      </InfoList>

      {/* 4. Feedback */}
      {data.mentorFeedback && (
        <FeedbackBox>
          <FeedbackHeader>
            <ChatIcon />
            {data.mentorFeedback.mentorName} 멘토의 피드백
          </FeedbackHeader>
          <FeedbackContent $expanded={false}>
            {data.mentorFeedback.content}
          </FeedbackContent>
          <MoreButton
            type="button"
            onClick={onOpenFeedbackDetail}
            disabled={!onOpenFeedbackDetail}
          >
            자세히 보기
          </MoreButton>
        </FeedbackBox>
      )}

      {/* 5. Actions (멘토 할당 글이 아닐 때만 수정/삭제 가능) */}
      {!data.isMentorAssigned && (
        <ButtonGroup>
          <ActionButton $variant="secondary" onClick={onEdit}>
            수정
          </ActionButton>
          <ActionButton $variant="danger" onClick={onDelete}>
            삭제
          </ActionButton>
        </ButtonGroup>
      )}
    </Container>
  );
};

export default TaskDetailContent;
