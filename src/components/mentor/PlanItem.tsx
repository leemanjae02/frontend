import styled from "styled-components";
import SubjectChip from "../SubjectChip";
import Button from "../Button";
import SubmitLabel, { type LabelStatus } from "../SubmitLabel";
import { typography } from "../../styles/typography";
import type { SubjectKey } from "../SubjectAddButton";
import QuestionIcon from "../../assets/images/icon/question.svg?react";

export interface PlanItemProps {
  subject: SubjectKey;
  title: string;
  status: LabelStatus; // SubmitLabel의 상태 사용
  hasQuestion?: boolean; // 질문 여부 (아이콘 표시용)
  onFeedbackClick?: () => void;
}

const PlanItem = ({
  subject,
  title,
  status,
  hasQuestion = false,
  onFeedbackClick,
}: PlanItemProps) => {
  return (
    <Container>
      <Content>
        <Header>
          <SubjectChip subject={subject} />
          <Title>{title}</Title>
          {hasQuestion && (
            <QuestionBadge aria-label="질문 있음" />
          )}
        </Header>
        <Footer>
          <SubmitLabel status={status} />
        </Footer>
      </Content>
      <Action>
        {status === "SUBMITTED" && (
          <StyledButton
            variant="primary"
            onClick={onFeedbackClick}
            title="피드백하기"
          >
            피드백하기
          </StyledButton>
        )}
      </Action>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center; /* 세로 중앙 정렬 */
  justify-content: space-between;
  padding: 16px 20px;
  background-color: var(--color-white);
  border-bottom: 1px solid var(--color-gray-100);
  &:hover {
    background-color: var(--color-gray-50);
    cursor: pointer;
  }
  &:last-child {
    border-bottom: none;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  min-width: 0; /* flex item 축소 허용 */
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap; /* 제목이 길어지면 줄바꿈? 보통은 말줄임 */
`;

const Title = styled.span`
  ${typography.t14sb}
  color: var(--color-gray-900);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
`;

const QuestionBadge = styled(QuestionIcon)`
  width: 24px;
  height: 24px;

  path {
    stroke: var(--color-blue-500);
  }
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
`;

const Action = styled.div`
  flex-shrink: 0;
  margin-left: 16px;
`;

const StyledButton = styled(Button)`
  width: 200px;
  height: 48px;
  ${typography.t14sb}
`;
export default PlanItem;
