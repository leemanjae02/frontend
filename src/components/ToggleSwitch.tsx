import styled from "styled-components";

interface ToggleProps {
  on: boolean;
  onChange?: (next: boolean) => void;
  disabled?: boolean;
}

const ToggleSwitch = ({ on, onChange, disabled = false }: ToggleProps) => {
  return (
    <Button
      type="button"
      $on={on}
      $disabled={disabled}
      onClick={() => !disabled && onChange?.(!on)}
    >
      <Thumb $on={on} />
    </Button>
  );
};

const WIDTH = 48;
const HEIGHT = 24;
const PADDING = 1;
const THUMB = 20;
const MOVE = WIDTH - PADDING * 2 - THUMB;

const Button = styled.button<{ $on: boolean; $disabled: boolean }>`
  position: relative;
  width: ${WIDTH}px;
  height: ${HEIGHT}px;
  padding: ${PADDING}px;

  border: 0;
  border-radius: 999px;
  background: ${({ $on }) =>
    $on ? "var(--color-primary-600)" : "var(--color-gray-300)"};

  cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};
  user-select: none;

  transition: background-color 180ms ease;

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px var(--color-primary-200);
  }

  ${({ $disabled }) =>
    $disabled &&
    `
      opacity: 0.6;
    `}
`;

const Thumb = styled.span<{ $on: boolean }>`
  display: block;
  width: ${THUMB}px;
  height: ${THUMB}px;

  border-radius: 50%;
  background: var(--color-white);

  transform: translateX(${({ $on }) => ($on ? MOVE : 0)}px);
  transition: transform 200ms ease;

  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.12);
`;

export default ToggleSwitch;
