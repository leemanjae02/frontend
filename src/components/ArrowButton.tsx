import styled from "styled-components";
import Left from "../assets/images/icon/left.svg?react";
import Right from "../assets/images/icon/right.svg?react";

type Direction = "left" | "right";

interface Props {
  direction: Direction;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

const ArrowButton = ({
  direction,
  onClick,
  disabled = false,
  className,
}: Props) => {
  const Icon = direction === "left" ? Left : Right;

  return (
    <Btn onClick={onClick} disabled={disabled} className={className}>
      <Icon />
    </Btn>
  );
};

const Btn = styled.button`
  width: 36px;
  height: 36px;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  border: 0;
  padding: 0;
  border-radius: 6px;

  background: transparent;
  color: var(--color-gray-600);

  cursor: pointer;
  user-select: none;

  transition:
    background-color 140ms ease,
    transform 80ms ease,
    color 140ms ease;

  & > svg {
    width: 24px;
    height: 24px;
  }
  & > svg path {
    stroke: currentColor;
  }

  &:hover:not(:disabled) {
    background: color-mix(in srgb, var(--color-gray-100) 40%, transparent);
  }

  &:active:not(:disabled) {
    background: color-mix(in srgb, var(--color-gray-100), transparent);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

export default ArrowButton;
