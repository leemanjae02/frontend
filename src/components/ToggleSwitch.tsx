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
const THUMB = 21;
const GAP = 1.5;

const Button = styled.button<{ $on: boolean; $disabled: boolean }>`
  position: relative;
  width: ${WIDTH}px;
  height: ${HEIGHT}px;

  border: 0;
  border-radius: 999px;
  background: ${({ $on }) =>
    $on ? "var(--color-primary-600)" : "var(--color-gray-200)"};

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
  position: absolute;
  top: 50%;

  width: ${THUMB}px;
  height: ${THUMB}px;
  border-radius: 50%;
  background: var(--color-white);

  left: ${({ $on }) => ($on ? `calc(100% - ${THUMB + GAP}px)` : `${GAP}px`)};
  transform: translateY(-50%);

  transition: left 200ms ease;
`;

export default ToggleSwitch;
