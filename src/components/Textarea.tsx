import { forwardRef, useState, useId } from "react";
import styled, { css } from "styled-components";
import { typography } from "../styles/typography";
import { colors } from "../styles/colors";
import type { TextareaProps, InputStatus } from "../@types/TextareaType";

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
    $disabled ? colors.gray100 : colors.white};
  border: 1px solid
    ${({ $status, $isFocused, $disabled }) => {
      if ($disabled) return colors.gray200;
      if ($status === "error") return colors.error;
      if ($isFocused) return colors.primary500;
      return colors.gray200;
    }};
  transition: border-color 0.2s ease-in-out, background-color 0.2s;

  ${({ $disabled, $status }) =>
    !$disabled &&
    css`
      &:hover {
        border-color: ${$status === "error" ? colors.error : colors.primary500};
      }
    `}
`;

const StyledTextarea = styled.textarea`
  border: none;
  outline: none;
  ${typography.t16r}
  color: ${colors.black};
  background: transparent;
  padding: 0;
  width: 100%;
  height: 100%;
  resize: none;

  &::placeholder {
    color: ${colors.gray300};
  }

  &::-webkit-scrollbar {
    width: 0;
  }

  &:disabled {
    cursor: not-allowed;
    color: ${colors.gray300};
  }
`;

const BottomWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 4px;
  padding: 0 4px;
  font-size: 12px;
`;

const Message = styled.span<{ $status: InputStatus }>`
  color: ${({ $status }) =>
    $status === "error" ? colors.error : colors.black};
`;

const Count = styled.span`
  color: ${colors.gray300};
  margin-left: auto;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  font-weight: 500;
  text-align: left;
  color: ${colors.black};
`;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      id,
      status = "default",
      helperText,
      showCount = false,
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

    return (
      <div style={{ width: "100%" }}>
        {label && <Label htmlFor={inputId}>{label}</Label>}
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

        {(helperText || showCount) && (
          <BottomWrapper>
            {helperText && <Message $status={status}>{helperText}</Message>}

            {showCount && (
              <Count>
                {String(value ?? "").length}
                {maxLength ? ` / ${maxLength}` : ""}
              </Count>
            )}
          </BottomWrapper>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
