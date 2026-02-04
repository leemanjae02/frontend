import styled from "styled-components";
import { typography } from "../../styles/typography";
import RightArrowIcon from "../../assets/images/icon/right.svg?react";

export interface DashboardSummaryData {
  todoCount: {
    done: number;
    total: number;
  };
  minutes: {
    goal: number;
    done: number;
  };
}

interface Props {
  summary?: DashboardSummaryData;
  loading?: boolean;
  onClickSubjectStats?: () => void;
  className?: string;
}

const Dashboard = ({
  summary,
  loading = false,
  onClickSubjectStats,
  className,
}: Props) => {
  const done = summary?.todoCount.done ?? 0;
  const total = summary?.todoCount.total ?? 0;
  const goalMin = summary?.minutes.goal ?? 0;
  const doneMin = summary?.minutes.done ?? 0;

  return (
    <Wrap className={className}>
      <Card>
        <Top>
          <Col>
            <Label>할일</Label>
            <Value>{loading ? "0/0" : `${done}/${total}`}</Value>
          </Col>

          <Divider />

          <Col>
            <Label>목표</Label>
            <Value>{loading ? "0분" : `${goalMin}분`}</Value>
          </Col>

          <Divider />

          <Col>
            <Label>완료</Label>
            <Value>{loading ? "0분" : `${doneMin}분`}</Value>
          </Col>
        </Top>
      </Card>

      <BottomButton
        type="button"
        onClick={onClickSubjectStats}
        disabled={loading}
      >
        <BottomText>과목 별 통계 보기</BottomText>
        <RightArrowIcon />
      </BottomButton>
    </Wrap>
  );
};

const Wrap = styled.section`
  width: 100%;
`;

const Card = styled.div`
  border: 1px solid var(--color-gray-100);
  border-radius: 10px 10px 0 0;
  background: var(--color-white);
`;

const Top = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr auto 1fr;
  align-items: center;
`;

const Col = styled.div`
  padding: 10px 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: center;
  justify-content: center;
`;

const Divider = styled.div`
  width: 0.8px;
  height: 78px;
  background: var(--color-gray-100);
`;

const Label = styled.div`
  ${typography.t12r}
  color: var(--color-gray-600);
`;

const Value = styled.div`
  ${typography.t24sb}
  color: var(--color-primary-500);
`;

const BottomButton = styled.button`
  width: 100%;
  height: 32px;

  border: 0;
  border-radius: 0 0 10px 10px;
  cursor: pointer;

  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;

  padding: 0 8px;

  color: var(--color-white);
  ${typography.t12r}

  & > svg path {
    stroke: currentColor;
  }

  background: linear-gradient(41deg, #2aa971 0%, #61d07f 100%);
`;

const BottomText = styled.span`
  display: inline-flex;
  align-items: center;
`;

export default Dashboard;
