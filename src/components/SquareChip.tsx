import styled from "styled-components";
import { typography } from "../styles/typography";

interface Props {
  label: string;
  selected?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

const SquareChip = ({
  label,
  selected = false,
  onClick,
  disabled = false,
  className,
}: Props) => {
  return (
    <Btn
      onClick={onClick}
      disabled={disabled}
      className={className}
      $selected={selected}
    >
      {label}
    </Btn>
  );
};

const Btn = styled.button<{ $selected: boolean }>`
  width: 100%;
  height: 45px;

  border-radius: 6px;
  border: 1.5px solid
    ${({ $selected }) =>
      $selected ? "var(--color-primary-500)" : "var(--color-gray-300)"};

  background: ${({ $selected }) =>
    $selected
      ? "color-mix(in srgb, var(--color-primary-50), transparent)"
      : "transparent"};

  color: var(--color-gray-600);
  font-family: Pretendard;

  ${({ $selected }) => ($selected ? typography.t14sb : typography.t14r)};

  cursor: pointer;
  user-select: none;

  transition:
    background-color 160ms ease,
    border-color 160ms ease,
    transform 80ms ease;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

export default SquareChip;
