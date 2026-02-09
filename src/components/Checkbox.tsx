import { forwardRef, useId } from "react";
import type { InputHTMLAttributes } from "react";
import styled from "styled-components";

import CheckboxIcon from "../assets/images/icon/checkbox_default.svg?react";

interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  label?: string;
  checkedColor?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      checked,
      defaultChecked,
      disabled,
      onChange,
      className,
      checkedColor,
      ...rest
    },
    ref,
  ) => {
    const autoId = useId();
    const id = rest.id ?? autoId;

    const isControlled = checked !== undefined;
    const isChecked = isControlled ? checked : defaultChecked;

    return (
      <Wrapper className={className}>
        <HiddenCheckbox
          ref={ref}
          id={id}
          type="checkbox"
          checked={checked}
          defaultChecked={defaultChecked}
          disabled={disabled}
          onChange={onChange}
          {...rest}
        />

        <Label htmlFor={id} $disabled={!!disabled}>
          <StyledIcon
            $isChecked={!!isChecked}
            $checkedColor={checkedColor}
            aria-hidden="true"
          />
          {label ? <Text>{label}</Text> : null}
        </Label>
      </Wrapper>
    );
  },
);

const Wrapper = styled.div`
  position: relative;
  display: inline-flex;
`;

const HiddenCheckbox = styled.input`
  position: absolute;
  left: 0;
  top: 0;

  width: 1px;
  height: 1px;
  margin: -1px;
  border: 0;
  padding: 0;
  overflow: hidden;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  white-space: nowrap;

  &:focus-visible + label {
    outline: none;
    box-shadow: 0 0 0 3px var(--color-primary-200);
    border-radius: 10px;
  }
`;

const Label = styled.label<{ $disabled: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 10px;

  cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};
  user-select: none;
  opacity: ${({ $disabled }) => ($disabled ? 0.6 : 1)};
`;

const StyledIcon = styled(CheckboxIcon)<{
  $isChecked: boolean;
  $checkedColor?: string;
}>`
  width: 24px;
  height: 24px;
  display: block;

  rect {
    fill: ${({ $isChecked, $checkedColor }) =>
      $isChecked
        ? $checkedColor || "var(--color-primary-500)"
        : "var(--color-gray-200)"};
    transition: fill 0.2s ease;
  }
`;

const Text = styled.span`
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  color: var(--color-black);
`;

Checkbox.displayName = "Checkbox";
export default Checkbox;
