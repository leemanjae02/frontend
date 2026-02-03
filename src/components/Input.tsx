import { forwardRef, useState, useId } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";
import styled from "styled-components";
import { typography } from "../styles/typography";
import type { InputStatus } from "../@types/InputStatus";
import CharacterCount from "./CharacterCount";

type CountPosition = "top" | "bottom";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  id?: string; // 컴포넌트 내부에서 사용하는 고유 id
  label?: string; // 입력 필드 라벨
  status?: InputStatus;
  helperText?: string; // 입력 필드 하단 도움말 텍스트
  leftIcon?: ReactNode; // 입력 필드 왼쪽 아이콘
  rightIcon?: ReactNode; // 입력 필드 오른쪽 아이콘
  showCount?: boolean; // 입력 필드 글자 수 표시 여부
  countPosition?: CountPosition; // 입력 필드 글자 수 표시 위치
  value: string | number; // 입력 필드 값
  disabled?: boolean; // 입력 필드 비활성화 여부
}

const InputContainer = styled.div<{
  $status: InputStatus;
  $isFocused: boolean;
  $disabled?: boolean;
}>`
  display: flex;
  align-items: center;
  height: 44px;
  padding: 10px 12px;
  gap: 12px;
  border-radius: 4px;
  background-color: ${({ $disabled }) =>
    $disabled ? "var(--color-gray-100)" : "var(--color-white)"};
  border: 1px solid
    ${({ $status, $isFocused, $disabled }) => {
      if ($disabled) return "var(--color-gray-200)";
      if ($status === "error") return "var(--color-error)";
      if ($isFocused) return "var(--color-primary-500)";
      return "var(--color-gray-200)";
    }};
  box-sizing: border-box;
  transition: border-color 0.2s ease-in-out;

  &:hover {
    border-color: ${({ $status, $disabled }) =>
      $disabled
        ? "var(--color-gray-200)"
        : $status === "error"
        ? "var(--color-error)"
        : "var(--color-primary-500)"};
  }
`;

const StyledInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  ${typography.t16r};
  color: var(--color-black);
  background: transparent;
  padding: 0;
  width: 100%;
  &::placeholder {
    color: var(--color-gray-300);
  }
  &:disabled {
    cursor: not-allowed;
    color: var(--color-gray-300);
  }
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-gray-300);
  & > svg path {
    stroke: currentColor;
  }
  font-size: 24px;
  min-width: 24px;
`;

const BottomWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 4px;
  font-size: 12px;
`;

const Message = styled.span<{ $status: InputStatus }>`
  color: ${({ $status }) =>
    $status === "error" ? "var(--color-error)" : "var(--color-black)"};
`;

const StyledCharacterCount = styled(CharacterCount)`
  margin: 0;
  margin-left: auto;
`;

const TopCountWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
`;

const Label = styled.label`
  display: block;
  ${typography.t16sb}
  text-align: left;
  color: var(--color-black);
`;

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      id,
      status = "default",
      helperText,
      leftIcon,
      rightIcon,
      value,
      showCount = false,
      countPosition = "bottom",
      maxLength,
      disabled,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const [isFocused, setIsFocused] = useState(false);

    const showTopCount = showCount && countPosition === "top";
    const showBottomCount = showCount && countPosition === "bottom";

    return (
      <div style={{ width: "100%" }}>
        {(label || showTopCount) && (
          <TopCountWrapper>
            {label && <Label htmlFor={inputId}>{label}</Label>}
            {showTopCount && (
              <StyledCharacterCount value={value} maxLength={maxLength} />
            )}
          </TopCountWrapper>
        )}

        <InputContainer
          $status={status}
          $isFocused={isFocused}
          $disabled={disabled}
        >
          {leftIcon && <IconWrapper>{leftIcon}</IconWrapper>}

          <StyledInput
            ref={ref}
            id={inputId}
            maxLength={maxLength}
            disabled={disabled}
            value={value}
            onFocus={(e) => {
              if (disabled) return;
              setIsFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              onBlur?.(e);
            }}
            {...props}
          />

          {rightIcon && <IconWrapper>{rightIcon}</IconWrapper>}
        </InputContainer>

        {(helperText || showBottomCount) && (
          <BottomWrapper>
            {helperText && <Message $status={status}>{helperText}</Message>}
            {showBottomCount && (
              <StyledCharacterCount value={value} maxLength={maxLength} />
            )}
          </BottomWrapper>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
