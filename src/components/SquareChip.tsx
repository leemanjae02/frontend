import styled from "styled-components";
import type { ReactNode, ButtonHTMLAttributes } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  children?: ReactNode;
  selected?: boolean;
}

const SquareChip = ({
  label,
  children,
  selected = false,
  className,
  ...buttonProps
}: Props) => {
  return (
    <Btn
      type="button"
      className={className}
      $selected={selected}
      {...buttonProps}
    >
      {children ?? label}
    </Btn>
  );
};

const Btn = styled.button<{ $selected: boolean }>`
  width: 100%;
  height: 133px;

  border-radius: 6px;
  border: 1.5px solid
    ${({ $selected }) =>
      $selected ? "var(--color-primary-500)" : "var(--color-gray-300)"};

  background: ${({ $selected }) =>
    $selected
      ? "color-mix(in srgb, var(--color-primary-50), transparent)"
      : "transparent"};

  font-family: Pretendard;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;
  user-select: none;

  transition:
    background-color 160ms ease,
    border-color 160ms ease,
    transform 80ms ease;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

export default SquareChip;
