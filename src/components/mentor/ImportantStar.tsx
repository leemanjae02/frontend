import styled from "styled-components";

import Star from "../../assets/images/icon/star.svg";
import BlueStar from "../../assets/images/icon/star.svg?react";

type Props = {
  value: boolean; // true면 파란별
  onChange?: (next: boolean) => void;

  size?: number;
  disabled?: boolean;
  className?: string;
};

export default function ImportantStar({
  value,
  onChange,
  size = 28,
  disabled = false,
  className,
}: Props) {
  const toggle = () => {
    if (disabled) return;
    onChange?.(!value);
  };

  return (
    <Btn
      onClick={toggle}
      disabled={disabled}
      $size={size}
      className={className}
      title={value ? "중요한 피드백" : ""}
    >
      {value ? (
        <FilledIcon />
      ) : (
        <OutlineImg src={Star} alt="" draggable={false} />
      )}
    </Btn>
  );
}

const Btn = styled.button<{ $size: number }>`
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;

  display: inline-grid;
  place-items: center;

  padding: 0;
  border: 0;
  background: transparent;

  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const OutlineImg = styled.img`
  width: 100%;
  height: 100%;
  display: block;
`;

const FilledIcon = styled(BlueStar)`
  width: 100%;
  height: 100%;
  display: block;

  path {
    fill: var(--color-blue-500);
    stroke: var(--color-blue-500);
  }
`;
