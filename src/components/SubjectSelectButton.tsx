import { useMemo, useState } from "react";
import styled, { css } from "styled-components";
import { typography } from "../styles/typography";
import type { SubjectKey } from "./SubjectAddButton";

interface SubjectItem {
  key: SubjectKey;
  label: string;
  activeBg: string;
  activeBorder?: string;
}

const DEFAULT_SUBJECTS: SubjectItem[] = [
  { key: "KOREAN", label: "국어", activeBg: "var(--color-orange-500)" },
  { key: "ENGLISH", label: "영어", activeBg: "var(--color-pink-500)" },
  { key: "MATH", label: "수학", activeBg: "var(--color-blue-500)" },
];

interface Props {
  value?: SubjectKey;
  defaultValue?: SubjectKey;
  onChange?: (next: SubjectKey) => void;
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
  const [inner, setInner] = useState<SubjectKey>(defaultValue);
  const selected = isControlled ? (value as SubjectKey) : inner;

  const items = useMemo(() => subjects, [subjects]);

  const handleSelect = (next: SubjectKey) => {
    if (disabled) return;
    if (!isControlled) setInner(next);
    onChange?.(next);
  };

  return (
    <Wrap className={className} aria-disabled={disabled}>
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

  &:hover:not(:disabled) {
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: translateY(1px);
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px var(--color-primary-200);
  }

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
  }
`;

export default SubjectSelectButton;
