import { useMemo, useState } from "react";
import styled, { css } from "styled-components";
import { typography } from "../styles/typography";
import type { SubjectKey1 } from "./SubjectAddButton";

interface SubjectItem {
  key: SubjectKey1;
  label: string;
  activeBg: string;
  activeBorder?: string;
}

const DEFAULT_SUBJECTS: SubjectItem[] = [
  { key: "KOREAN", label: "국어", activeBg: "var(--color-orange-500)" },
  { key: "ENGLISH", label: "영어", activeBg: "var(--color-pink-500)" },
  { key: "MATH", label: "수학", activeBg: "var(--color-blue-500)" },
  { key: "RESOURCE", label: "자료", activeBg: "var(--color-gray-500)" },
];

interface Props {
  value?: SubjectKey1;
  defaultValue?: SubjectKey1;
  onChange?: (next: SubjectKey1) => void;
  subjects?: readonly SubjectItem[];
  disabled?: boolean;
  className?: string;
}

const SubjectSelectButton = ({
  value,
  defaultValue = "KOREAN",
  onChange,
  subjects = DEFAULT_SUBJECTS,
  disabled = false,
  className,
}: Props) => {
  const isControlled = value !== undefined;
  const [inner, setInner] = useState<SubjectKey1>(defaultValue);
  const selected = isControlled ? (value as SubjectKey1) : inner;

  const items = useMemo(() => subjects, [subjects]);

  const handleSelect = (next: SubjectKey1) => {
    if (disabled) return;
    if (!isControlled) setInner(next);
    onChange?.(next);
  };

  return (
    <Wrap className={className}>
      {items.map((it) => {
        const active = it.key === selected;
        return (
          <ItemButton
            key={it.key}
            type="button"
            onClick={() => handleSelect(it.key)}
            $active={active}
            $activeBg={it.activeBg}
            disabled={disabled}
          >
            {it.label}
          </ItemButton>
        );
      })}
    </Wrap>
  );
};

const Wrap = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;

  &[aria-disabled="true"] {
    opacity: 0.7;
    pointer-events: none;
  }
`;

const ItemButton = styled.button<{
  $active: boolean;
  $activeBg: string;
}>`
  width: 60px;
  height: 40px;
  border-radius: 50px;

  border: 1px solid var(--color-gray-200);
  background: var(--color-white);

  ${typography.t16r}
  color: var(--color-gray-700);

  cursor: pointer;
  user-select: none;

  transition:
    background-color 180ms ease,
    color 180ms ease,
    border-color 180ms ease,
    transform 80ms ease;

  ${({ $active, $activeBg }) =>
    $active &&
    css`
      background: ${$activeBg};
      border-color: ${$activeBg};
      color: var(--color-white);
    `}

  &:disabled {
    cursor: not-allowed;
    transform: none;
    opacity: 0.7;
    background: var(--color-gray-100);
    color: var(--color-gray-300);
  }
`;

export default SubjectSelectButton;
