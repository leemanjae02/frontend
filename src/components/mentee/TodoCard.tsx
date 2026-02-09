import styled from "styled-components";
import Checkbox from "../Checkbox";
import { typography } from "../../styles/typography";
import type { SubjectKey } from "../SubjectAddButton";

import cameraIconSrc from "../../assets/images/icon/camera_blue.svg";
import fileIconSrc from "../../assets/images/icon/report_blue.svg";
import feedbackUnreadIconSrc from "../../assets/images/icon/chat_blue.svg";
import feedbackReadIconSrc from "../../assets/images/icon/chat_gray.svg";
import TeacherIcon from "../../assets/images/icon/teacher.svg?react";

type FeedbackState = "NONE" | "UNREAD" | "READ";

export interface TodoCardProps {
  title: string;
  subject?: SubjectKey;

  done: boolean;
  onToggleDone?: () => void;

  onClick?: () => void;

  hasPhoto?: boolean;
  hasFile?: boolean;

  feedback?: FeedbackState;

  fromMentor?: boolean;

  disabled?: boolean;
  className?: string;
}

const SUBJECT_COLORS: Record<SubjectKey, string> = {
  KOREAN: "var(--color-orange-500)",
  ENGLISH: "var(--color-pink-500)",
  MATH: "var(--color-blue-500)",
};

const TodoCard = ({
  title,
  subject,
  done,
  onToggleDone,
  onClick,

  hasPhoto = false,
  hasFile = false,

  feedback = "NONE",
  fromMentor = false,

  disabled = false,
  className,
}: TodoCardProps) => {
  const feedbackIcon =
    feedback === "UNREAD"
      ? feedbackUnreadIconSrc
      : feedback === "READ"
        ? feedbackReadIconSrc
        : null;

  const hasMeta = hasPhoto || hasFile;
  const checkedColor = subject ? SUBJECT_COLORS[subject] : undefined;

  return (
    <Wrap
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={className}
      $hasMeta={hasMeta}
    >
      <Left
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.preventDefault()}
      >
        <Checkbox
          checked={done}
          onChange={onToggleDone ? () => onToggleDone() : undefined}
          checkedColor={checkedColor}
        />
      </Left>

      <Center>
        <TitleRow>
          <Title $done={done}>{title}</Title>
          {feedbackIcon ? <FeedbackIcon src={feedbackIcon} alt="" /> : null}
        </TitleRow>

        {hasMeta ? (
          <MetaRow>
            {hasPhoto && <MetaIcon src={cameraIconSrc} alt="" />}
            {hasFile && <MetaIcon src={fileIconSrc} alt="" />}
          </MetaRow>
        ) : null}
      </Center>

      <Right $hasMeta={hasMeta}>
        {fromMentor ? (
          <MentorIconCircle $color={checkedColor || "var(--color-gray-400)"}>
            <StyledTeacherIcon />
          </MentorIconCircle>
        ) : null}
      </Right>
    </Wrap>
  );
};

const Wrap = styled.button<{ $hasMeta: boolean }>`
  width: 100%;
  min-height: 56px;

  padding: 10px 12px;

  border: 0;
  border-radius: 6px;
  background: var(--color-white);

  display: grid;
  grid-template-columns: auto 1fr auto;
  column-gap: 12px;
  align-items: ${({ $hasMeta }) => ($hasMeta ? "start" : "center")};

  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1);

  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px var(--color-primary-200),
      0px 2px 10px rgba(0, 0, 0, 0.06);
  }
`;

const Left = styled.div`
  display: inline-flex;
  align-items: center;
`;

const Center = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const TitleRow = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
`;

const Title = styled.div<{ $done: boolean }>`
  ${typography.t14sb}
  color: ${({ $done }) =>
    $done ? "var(--color-gray-400)" : "var(--color-black)"};
  text-decoration: ${({ $done }) => ($done ? "line-through" : "none")};
  text-decoration-thickness: 1.5px;
  text-decoration-color: var(--color-gray-400);

  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const FeedbackIcon = styled.img`
  width: 22px;
  height: 22px;
  display: block;
  flex: 0 0 auto;
`;

const MetaRow = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 5px;
`;

const MetaIcon = styled.img`
  width: 20px;
  height: 20px;
  display: block;
`;

const Right = styled.div<{ $hasMeta: boolean }>`
  display: inline-flex;
  justify-content: flex-end;

  align-items: ${({ $hasMeta }) => ($hasMeta ? "flex-start" : "center")};
`;

const MentorIconCircle = styled.div<{ $color: string }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledTeacherIcon = styled(TeacherIcon)`
  width: 20px;
  height: 20px;
  display: block;

  path {
    stroke: var(--color-white);
  }
`;

export default TodoCard;
