
import styled from "styled-components";
import { typography } from "../../styles/typography";
import LeftArrowIcon from "../../assets/images/icon/left.svg?react";
import RightArrowIcon from "../../assets/images/icon/right.svg?react";

interface Props {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  className?: string;
}

const WeekNavigator = ({ currentDate, onDateChange, className }: Props) => {
  const getWeekOfMonth = (date: Date) => {
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const firstDayOfWeek = firstDayOfMonth.getDay() || 7; // 월요일 시작 기준 (1~7)
    const offset = firstDayOfWeek - 1;
    return Math.ceil((date.getDate() + offset) / 7);
  };

  const month = currentDate.getMonth() + 1;
  const weekNumber = getWeekOfMonth(currentDate);

  const handlePrevWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    onDateChange(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    onDateChange(newDate);
  };

  return (
    <Container className={className}>
      <DateText>
        {month}월 {weekNumber}주차
      </DateText>
      <ButtonGroup>
        <NavButton onClick={handlePrevWeek} aria-label="이전 주">
          <LeftArrowIcon />
        </NavButton>
        <NavButton onClick={handleNextWeek} aria-label="다음 주">
          <RightArrowIcon />
        </NavButton>
      </ButtonGroup>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
`;

const DateText = styled.h2`
  ${typography.t24sb}
  color: var(--color-black);
  margin: 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const NavButton = styled.button`
  width: 32px;
  height: 32px;
  background: var(--color-white);
  border: 1px solid var(--color-gray-200);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;

  &:hover {
    background-color: var(--color-gray-50);
  }

  svg {
    width: 20px;
    height: 20px;
    path {
      stroke: var(--color-gray-600);
    }
  }
`;

export default WeekNavigator;
