import React from "react";
import styled, { css } from "styled-components";
import { typography } from "../styles/typography";
// 버튼 Props 정의
interface ButtonSmallProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  children: React.ReactNode;
  variant?: "primary" | "weak";
}

const StyledButton = styled.button<{ $variant: "primary" | "weak" }>`
  /* --- 1. 레이아웃 & 크기 --- */
  width: 108px;
  height: 36px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
  transition: all 0.2s ease;

  /* --- 2. 폰트 스타일 --- */
  ${typography.t14sb}

  /* --- 3. 색상 테마 --- */

  ${({ $variant }) =>
    $variant === "primary"
      ? css`
          /* [기본 상태: Green] */
          background-color: var(--color-primary-500);
          color: white;
          border: none;

          /* [Hover 상태] */
          &:hover:not(:disabled) {
            background-color: var(--color-primary-600);
          }

          /* [Active/Pressed 상태] */
          &:active:not(:disabled) {
            background-color: var(--color-primary-700);
          }
        `
      : css`
          /* [Default (Weak)] */
          background-color: var(--color-primary-50);
          color: var(--color-primary-500);
          border: 1px solid var(--color-primary-500);

          /* [Hover (Weak)] */
          &:hover:not(:disabled) {
            background-color: var(--color-primary-100);
          }

          /* [Click (Weak)] */
          &:active:not(:disabled) {
            background-color: var(--color-primary-200);
          }
        `}

  /* ★ [수정] 아이콘 스타일 (선 아이콘 기준) ★ */
  svg {
    /* 1. 안쪽 배경 흰색을 제거 (투명하게) */
    fill: none;

    /* 2. 선 색상을 텍스트 색상(currentColor)으로 설정 */
    stroke: currentColor;

    /* 혹시 path 내부에 fill이 지정되어 있을 경우 대비 */
    path {
      fill: none;
      stroke: currentColor;
    }
  }

  /* [비활성화 상태: Gray] */
  &:disabled {
    background-color: var(--color-gray-200);
    color: var(--color-gray-400); /* 텍스트 연한 회색 */
    border: none;
    cursor: not-allowed;
    /* currentColor 덕분에 아이콘 선 색상도 자동으로 연한 회색이 됨 */
  }
`;

export const ButtonSmall: React.FC<ButtonSmallProps> = ({
  icon,
  children,
  variant = "primary",
  ...props
}) => {
  return (
    <StyledButton $variant={variant} {...props}>
      {icon && (
        <span style={{ display: "flex", alignItems: "center" }}>{icon}</span>
      )}
      {children}
    </StyledButton>
  );
};

export default ButtonSmall;
