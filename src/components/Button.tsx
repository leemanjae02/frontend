import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import styled, { css } from "styled-components";
import { typography } from "../styles/typography";

type ButtonVariant = "primary" | "secondary" | "dark";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  title?: string;
  variant?: ButtonVariant;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ title, children, variant = "primary", ...rest }, ref) => {
    return (
      <StyledButton ref={ref} $variant={variant} {...rest}>
        {children ?? title}
      </StyledButton>
    );
  },
);

const variantStyles: Record<ButtonVariant, ReturnType<typeof css>> = {
  primary: css`
    background: var(--color-primary-500);
    color: var(--color-white);

    &:hover:not(:disabled) {
      background: var(--color-primary-600);
    }

    &:active:not(:disabled) {
      background: var(--color-primary-700);
    }

    &:disabled {
      background: var(--color-gray-200);
      color: var(--color-gray-400);
      cursor: not-allowed;
    }
  `,
  secondary: css`
    background: var(--color-primary-50);
    color: var(--color-primary-700);

    &:hover:not(:disabled) {
      background: var(--color-primary-100);
    }

    &:active:not(:disabled) {
      background: var(--color-primary-200);
    }
  `,
  dark: css`
    background: var(--color-gray-500);
    color: var(--color-white);

    &:hover:not(:disabled) {
      background: var(--color-gray-600);
    }

    &:active:not(:disabled) {
      background: var(--color-gray-700);
    }
  `,
};

const StyledButton = styled.button<{ $variant: ButtonVariant }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  ${typography.t16m}

  width: 100%;
  height: 48px;

  border: 0;
  border-radius: 4px;

  cursor: pointer;

  transition:
    background-color 160ms ease,
    color 160ms ease,
    box-shadow 160ms ease,
    transform 80ms ease;

  &:active:not(:disabled) {
    transform: translateY(1px);
  }

  &:disabled {
    transform: none;
  }

  ${({ $variant }) => variantStyles[$variant]}
`;

Button.displayName = "Button";
export default Button;
