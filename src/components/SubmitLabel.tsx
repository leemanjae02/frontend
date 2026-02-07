import styled from "styled-components";
import { typography } from "../styles/typography";

// 임시 enum
export type LabelStatus = "SUBMITTED" | "NOT_SUBMITTED" | "SCHEDULED";

const STATUS_CONFIG: Record<
  LabelStatus,
  {
    text: string;
    bgColor: string;
    dotColor: string;
  }
> = {
  SUBMITTED: {
    text: "제출 완료",
    bgColor: "color-mix(in srgb, var(--color-blue-500) 15%, transparent)",
    dotColor: "var(--color-blue-500)",
  },
  NOT_SUBMITTED: {
    text: "미제출",
    bgColor: "color-mix(in srgb, var(--color-orange-500) 15%, transparent);",
    dotColor: "var(--color-orange-500)",
  },
  SCHEDULED: {
    text: "예정",
    bgColor: "var(--color-gray-100)",
    dotColor: "var(--color-gray-300)",
  },
};

interface LabelProps {
  status: LabelStatus;
}

const SubmitLabel = ({ status }: LabelProps) => {
  const config = STATUS_CONFIG[status];

  return (
    <Wrapper $bgColor={config.bgColor}>
      <Dot $color={config.dotColor} />
      {config.text}
    </Wrapper>
  );
};

const Wrapper = styled.span<{
  $bgColor: string;
}>`
  display: inline-flex;
  align-items: center;
  gap: 6px;

  padding: 2px 8px;
  border-radius: 20px;

  background-color: ${({ $bgColor }) => $bgColor};

  ${typography.t12r}
`;

const Dot = styled.span<{ $color: string }>`
  width: 10px;
  height: 10px;
  border-radius: 6px;
  display: inline-block;
  flex-shrink: 0;
  box-sizing: border-box;
  background-color: ${({ $color }) => $color};
`;

export default SubmitLabel;
