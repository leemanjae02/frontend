import styled from "styled-components";
import { typography } from "../../styles/typography";
import type { SubjectKey } from "../SubjectAddButton";
import RightIcon from "../../assets/images/icon/right.svg?react";
import { useEffect, useMemo, useState } from "react";

interface Props {
  subjectLabel: string;
  subjectKey?: SubjectKey;
  percent: number;
  onClick?: () => void;
}

function clampPercent(n: number) {
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(100, Math.round(n)));
}

function getAccent(subjectKey?: SubjectKey) {
  switch (subjectKey) {
    case "KOREAN":
      return "var(--color-orange-500)";
    case "ENGLISH":
      return "var(--color-pink-500)";
    case "MATH":
      return "var(--color-blue-500)";
    default:
      return "var(--color-primary-500)";
  }
}

const SubjectProgressCard = ({
  subjectLabel,
  subjectKey,
  percent,
  onClick,
}: Props) => {
  const p = clampPercent(percent);
  const accent = useMemo(() => getAccent(subjectKey), [subjectKey]);

  const [fillPercent, setFillPercent] = useState(0);

  useEffect(() => {
    setFillPercent(0);

    const raf = requestAnimationFrame(() => {
      setFillPercent(p);
    });

    return () => cancelAnimationFrame(raf);
  }, [p]);

  return (
    <Card type="button" onClick={onClick} $accent={accent}>
      <TopRow>
        <LeftTitle>
          <SubjectText>{subjectLabel}</SubjectText>
          <SubText>오늘 학습 진행률</SubText>
        </LeftTitle>

        <RightPercent $accent={accent}>{p}%</RightPercent>
      </TopRow>

      <Bar>
        <Fill $percent={fillPercent} />
      </Bar>

      <BottomRow>
        <MoreText>자세히 보기</MoreText>
        <Chevron>
          <RightIcon />
        </Chevron>
      </BottomRow>
    </Card>
  );
};

const Card = styled.button<{ $accent: string }>`
  width: 100%;
  border: 0;
  background: var(--color-white);
  border-radius: 12px;
  padding: 14px 16px;
  text-align: left;
  cursor: pointer;

  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.06);

  color: ${({ $accent }) => $accent};
`;

const TopRow = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
`;

const LeftTitle = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
  min-width: 0;
`;

const SubjectText = styled.span`
  ${typography.t16sb}
  color: var(--color-black);
  white-space: nowrap;
`;

const SubText = styled.span`
  ${typography.t14r}
  color: var(--color-gray-500);
  white-space: nowrap;
`;

const RightPercent = styled.span<{ $accent: string }>`
  ${typography.t18sb}
  color: ${({ $accent }) => $accent};
  white-space: nowrap;
`;

const Bar = styled.div`
  margin-top: 10px;
  width: 100%;
  height: 10px;
  background: var(--color-gray-100);
  border-radius: 999px;
  overflow: hidden;
`;

const Fill = styled.div<{ $percent: number }>`
  height: 100%;
  border-radius: 999px;
  background: currentColor;
  width: ${({ $percent }) => `${$percent}%`};

  transition: width 700ms cubic-bezier(0.22, 1, 0.36, 1);
  will-change: width;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

const BottomRow = styled.div`
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  //   gap: 3px;
`;

const MoreText = styled.span`
  ${typography.t12sb}
  color: var(--color-gray-300);
`;

const Chevron = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  color: var(--color-gray-300);

  svg {
    width: 25px;
    height: 25px;
  }

  & > svg path {
    stroke: currentColor;
  }
`;

export default SubjectProgressCard;
