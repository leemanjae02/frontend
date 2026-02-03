import { forwardRef, useId } from "react";
import type { InputHTMLAttributes } from "react";
import styled from "styled-components";

import checkOn from "../assets/checkbox_checked.svg";
import checkOff from "../assets/checkbox_default.svg";

interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  label?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    { label, checked, defaultChecked, disabled, onChange, className, ...rest },
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
          <Icon src={isChecked ? checkOn : checkOff} alt="" />
          {label ? <Text>{label}</Text> : null}
        </Label>
      </Wrapper>
    );
  },
);

const Wrapper = styled.div`
  display: inline-flex;
`;

const HiddenCheckbox = styled.input`
  position: absolute;
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

const Icon = styled.img`
  width: 36px;
  height: 36px;
  display: block;
`;

const Text = styled.span`
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  color: var(--color-black);
`;

Checkbox.displayName = "Checkbox";
export default Checkbox;
