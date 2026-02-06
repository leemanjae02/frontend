import styled from "styled-components";

interface Props {
  count: number;
  activeIndex: number;
  onChange?: (nextIndex: number) => void; // 점 직접 클릭해서 이동
  className?: string;
}

const Indicator = ({ count, activeIndex, onChange, className }: Props) => {
  const safeCount = Math.max(0, count);

  return (
    <Wrap className={className}>
      {Array.from({ length: safeCount }).map((_, idx) => {
        const active = idx === activeIndex;
        return (
          <DotButton
            key={idx}
            $active={active}
            onClick={onChange ? () => onChange(idx) : undefined}
            disabled={!onChange}
          />
        );
      })}
    </Wrap>
  );
};

const Wrap = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

const DotButton = styled.button<{ $active: boolean }>`
  width: 6px;
  height: 6.1px;

  border-radius: 100%;

  border: 0;
  padding: 0;

  background: ${({ $active }) =>
    $active ? "var(--color-gray-500)" : "var(--color-gray-100)"};

  cursor: pointer;

  &:disabled {
    cursor: default;
  }
`;

export default Indicator;
