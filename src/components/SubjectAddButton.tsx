import styled from "styled-components";
import { typography } from "../styles/typography";
import plus from "../assets/images/icon/plus-1.svg";

export type SubjectKey = "KOREAN" | "ENGLISH" | "MATH" | "RESOURCE";

interface Props {
  subject: SubjectKey;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

const SUBJECT_CONFIG: Record<SubjectKey, { label: string; color: string }> = {
  KOREAN: { label: "국어", color: "var(--color-orange-500)" },
  ENGLISH: { label: "영어", color: "var(--color-pink-500)" },
  MATH: { label: "수학", color: "var(--color-blue-500)" },
  RESOURCE: { label: "자료", color: "var(--color-gray-600)" },
};

const SubjectAddButton = ({
  subject,
  onClick,
  disabled = false,
  className,
}: Props) => {
  const cfg = SUBJECT_CONFIG[subject];
  const isResource = subject === "RESOURCE";

  return (
    <Wrap
      type="button"
      onClick={isResource ? undefined : onClick}
      disabled={disabled}
      className={className}
      $isResource={isResource}
    >
      <Label $color={cfg.color}>{cfg.label}</Label>
      {!isResource && (
        <PlusCircle>
          <Icon src={plus} alt="" />
        </PlusCircle>
      )}
    </Wrap>
  );
};

const Wrap = styled.button<{ $isResource?: boolean }>`
  width: ${({ $isResource }) => ($isResource ? "52px" : "80px")};
  height: 38px;
  padding: ${({ $isResource }) => ($isResource ? "9px 12px" : "9px 7px")};

  display: flex;
  align-items: center;
  justify-content: ${({ $isResource }) =>
    $isResource ? "center" : "space-around"};

  border: 0;
  border-radius: 999px;
  background: color-mix(in srgb, var(--color-gray-100) 50%, transparent);

  cursor: ${({ $isResource }) => ($isResource ? "default" : "pointer")};
  user-select: none;
  pointer-events: ${({ $isResource }) => ($isResource ? "none" : "auto")};

  transition: transform 80ms ease;

  &:hover:not(:disabled) {
    transform: ${({ $isResource }) => ($isResource ? "none" : "translateY(-1px)")};
  }

  &:active:not(:disabled) {
    transform: ${({ $isResource }) => ($isResource ? "none" : "translateY(1px)")};
  }

  &:disabled {
    opacity: ${({ $isResource }) => ($isResource ? "1" : "0.6")};
    cursor: ${({ $isResource }) => ($isResource ? "default" : "not-allowed")};
    box-shadow: none;
    transform: none;
  }
`;

const Label = styled.span<{ $color: string }>`
  ${typography.t16m}
  color: ${({ $color }) => $color};
`;

const PlusCircle = styled.span`
  width: 21px;
  height: 21px;
  border-radius: 20px;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  background: var(--color-white);
  color: var(--color-gray-400);

  font-family: var(--font-sans);

  box-shadow: -2px 2px 4px rgba(0, 0, 0, 0.05);
`;

const Icon = styled.img`
  width: 15px;
  height: 15px;
`;

export default SubjectAddButton;
