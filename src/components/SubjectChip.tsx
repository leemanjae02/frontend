import styled from "styled-components";
import { typography } from "../styles/typography";
import type { SubjectKey } from "./SubjectAddButton";

const SUBJECT_CONFIG: Record<SubjectKey, { label: string; bg: string }> = {
  KOREAN: {
    label: "국어",
    bg: "var(--color-orange-500)",
  },
  ENGLISH: {
    label: "영어",
    bg: "var(--color-pink-500)",
  },
  MATH: {
    label: "수학",
    bg: "var(--color-blue-500)",
  },
  RESOURCE: {
    label: "자료",
    bg: "var(--color-gray-600)",
  },
};

interface Props {
  subject: SubjectKey;
  className?: string;
}

const SubjectChip = ({ subject, className }: Props) => {
  const cfg = SUBJECT_CONFIG[subject];

  return (
    <Chip className={className} $bg={cfg.bg}>
      {cfg.label}
    </Chip>
  );
};

const Chip = styled.span<{ $bg: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  padding: 2px 8px;
  border-radius: 8px;

  background: ${({ $bg }) => $bg};
  color: var(--color-white);

  ${typography.t12sb}
`;

export default SubjectChip;
