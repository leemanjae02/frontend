import styled from "styled-components";
import { typography } from "../../styles/typography";

interface MarkerProps {
  x: number; // % 좌표 (0~100)
  y: number; // % 좌표 (0~100)
  number: number; // 순서 번호
  onClick?: () => void;
}

const MarkerContainer = styled.div<{ $x: number; $y: number }>`
  position: absolute;
  left: ${({ $x }) => $x}%;
  top: ${({ $y }) => $y}%;
  transform: translate(-50%, -50%);
  z-index: 10;
  cursor: pointer;
`;

const MarkerCircle = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: var(--color-primary-500);
  border: 2px solid var(--color-white);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  ${typography.t14sb}
  color: var(--color-white);
`;

const Marker = ({ x, y, number, onClick }: MarkerProps) => {
  return (
    <MarkerContainer $x={x} $y={y} onClick={onClick}>
      <MarkerCircle>{number}</MarkerCircle>
    </MarkerContainer>
  );
};

export default Marker;
