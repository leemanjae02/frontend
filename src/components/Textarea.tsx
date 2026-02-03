import { forwardRef, useState, useId } from "react";
import type { TextareaHTMLAttributes } from "react";
import styled, { css } from "styled-components";
import { typography } from "../styles/typography";
import type { InputStatus } from "../@types/InputStatus";
import CharacterCount from "./CharacterCount";

type CountPosition = "top" | "bottom";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string; // 텍스트 영역 라벨
  status?: InputStatus;
  helperText?: string; // 텍스트 영역 하단 도움말 텍스트
  showCount?: boolean; // 텍스트 영역 글자 수 표시 여부
  countPosition?: CountPosition; // 텍스트 영역 글자 수 표시 위치
  value: string | number; // 텍스트 영역 값
  disabled?: boolean; // 텍스트 영역 비활성화 여부
}

const TextareaContainer = styled.div<{
  $status: InputStatus;
  $isFocused: boolean;
  $disabled?: boolean;
}>`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  height: 134px;
  padding: 10px 12px;
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
  transition: border-color 0.2s ease-in-out, background-color 0.2s;

  ${({ $disabled, $status }) =>
    !$disabled &&
    css`
      &:hover {
        border-color: ${$status === "error"
          ? "var(--color-error)"
          : "var(--color-primary-500)"};
      }
    `}
`;

const StyledTextarea = styled.textarea`
  border: none;
  outline: none;
  ${typography.t16r}
  color: var(--color-black);
  background: transparent;
  padding: 0;
  width: 100%;
  height: 100%;
  resize: none;

  &::placeholder {
    color: var(--color-gray-300);
  }

  &::-webkit-scrollbar {
    width: 0;
  }

  &:disabled {
    cursor: not-allowed;
    color: var(--color-gray-300);
  }
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

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      id,
      status = "default",
      helperText,
      showCount = false,
      countPosition = "bottom",
      value,
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
        <TextareaContainer
          $status={status}
          $isFocused={isFocused}
          $disabled={disabled}
        >
          <StyledTextarea
            ref={ref}
            id={inputId}
            value={value}
            maxLength={maxLength}
            disabled={disabled}
            onFocus={(e) => {
              if (disabled) return; // disabled면 포커스 실행 안 함
              setIsFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              onBlur?.(e);
            }}
            {...props}
          />
        </TextareaContainer>

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

Textarea.displayName = "Textarea";
export default Textarea;
