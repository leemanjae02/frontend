import { useMemo, useState } from "react";
import styled from "styled-components";

const YearMonthPickerModal = ({
  baseMonth,
  onClose,
  onPick,
  minYear,
  maxYear,
}: {
  baseMonth: Date;
  onClose: () => void;
  onPick: (year: number, monthIndex0: number) => void;
  minYear: number;
  maxYear: number;
}) => {
  const [year, setYear] = useState(baseMonth.getFullYear());
  const [month0, setMonth0] = useState(baseMonth.getMonth()); // 0~11

  const years = useMemo(() => {
    const arr: number[] = [];
    for (let y = minYear; y <= maxYear; y++) arr.push(y);
    return arr;
  }, [minYear, maxYear]);

  return (
    <ModalOverlay onClick={onClose}>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        <ModalTitle>년/월 선택</ModalTitle>

        <PickerRow>
          <Select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}년
              </option>
            ))}
          </Select>

          <Select
            value={month0}
            onChange={(e) => setMonth0(Number(e.target.value))}
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <option key={i} value={i}>
                {i + 1}월
              </option>
            ))}
          </Select>
        </PickerRow>

        <ModalActions>
          <ActionBtn type="button" $variant="ghost" onClick={onClose}>
            취소
          </ActionBtn>
          <ActionBtn
            type="button"
            $variant="primary"
            onClick={() => onPick(year, month0)}
          >
            적용
          </ActionBtn>
        </ModalActions>
      </ModalCard>
    </ModalOverlay>
  );
};

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(3px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalCard = styled.div`
  width: 320px;
  border-radius: 12px;
  background: var(--color-white);
  padding: 16px;
  box-sizing: border-box;
`;

const ModalTitle = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: var(--color-black);
  margin-bottom: 12px;
`;

const PickerRow = styled.div`
  display: flex;
  gap: 10px;
`;

const Select = styled.select`
  flex: 1;
  height: 44px;
  border: 1px solid var(--color-gray-200);
  border-radius: 10px;
  padding: 0 12px;
  font-size: 14px;
  background: var(--color-white);
`;

const ModalActions = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 14px;
`;

const ActionBtn = styled.button<{ $variant: "primary" | "ghost" }>`
  flex: 1;
  height: 44px;
  border-radius: 10px;
  border: ${({ $variant }) =>
    $variant === "ghost" ? "1px solid var(--color-gray-200)" : "none"};
  background: ${({ $variant }) =>
    $variant === "primary" ? "var(--color-primary-500)" : "var(--color-white)"};
  color: ${({ $variant }) =>
    $variant === "primary" ? "var(--color-white)" : "var(--color-black)"};
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
`;

export default YearMonthPickerModal;
