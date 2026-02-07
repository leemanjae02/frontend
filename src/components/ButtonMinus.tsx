import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import styled from "styled-components";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: number;
}

const ButtonMinus = forwardRef<HTMLButtonElement, Props>(
  ({ size = 44, ...rest }, ref) => {
    return (
      <Btn ref={ref} $size={size} {...rest}>
        <Minus />
      </Btn>
    );
  },
);

const Btn = styled.button<{ $size: number }>`
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  border-radius: 6px;
  border: 1px solid var(--color-gray-300);
  background: var(--color-white);

  cursor: pointer;
  user-select: none;

  transition:
    background-color 160ms ease,
    border-color 160ms ease,
    transform 80ms ease;

  &:hover:not(:disabled) {
    background: var(--color-gray-50);
    border-color: var(--color-gray-300);
  }

  &:active:not(:disabled) {
    background: var(--color-gray-100);
    transform: translateY(1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const Minus = styled.span`
  width: 16px;
  height: 1.5px;
  border-radius: 999px;
  background: var(--color-black);
`;

ButtonMinus.displayName = "MinusButton";
export default ButtonMinus;
