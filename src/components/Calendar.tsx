import { useState, useMemo, useRef, useCallback, memo } from "react";
import styled from "styled-components";
import { Swiper, SwiperSlide } from "swiper/react";
import { Virtual } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

import "swiper/css";
import "swiper/css/virtual";

import { dateUtils } from "../utils/dateUtils";
import ScheduleToggle from "./ScheduleToggle";

interface CalendarProps {
  selectedDate: Date;
  onDateClick: (date: string) => void;
}

const DAY_NAMES = ["일", "월", "화", "수", "목", "금", "토"];
const TARGET_INDEX = 1; // 2번째 슬롯
const TOTAL_WEEKS = 52 * 10; // 10년치
const INITIAL_INDEX = Math.floor(TOTAL_WEEKS / 2);

const Wrapper = styled.div`
  width: 100%;
  max-width: 390px;
  margin: 0 auto;
  position: relative;
  user-select: none;
  background-color: var(--color-white);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
`;

const DateTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: var(--color-black);
  margin: 0;
`;

const CalendarContainer = styled.div`
  overflow: hidden;
  height: 57px; /* Weekly 높이 고정 */
  transition: height 0.3s ease;
`;

const SwiperWrapper = styled.div`
  padding: 0 16px;

  .swiper {
    width: 100%;
    overflow: hidden;
  }
  .swiper-slide {
    width: 100% !important;
    box-sizing: border-box;
  }
`;

const WeekRow = styled.div`
  display: flex;
  gap: 8px;
  width: 100%;
  box-sizing: border-box;
`;

/* 날짜 카드 Component */
const DayItem = styled.div.attrs<{
  $isSelected: boolean;
  $isCurrentMonth: boolean;
}>(({ $isSelected, $isCurrentMonth }) => ({
  style: {
    backgroundColor: $isSelected
      ? "var(--color-primary-500)"
      : "var(--color-gray-100)",
    color: $isSelected
      ? "var(--color-white)"
      : !$isCurrentMonth
      ? "var(--color-gray-300)"
      : "var(--color-black)",
  },
}))<{ $isSelected: boolean; $isCurrentMonth: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;

  width: 44px;
  height: 57px;

  border-radius: 12px;
  cursor: pointer;
  will-change: transform, background-color;
  transition: background-color 0.2s ease, color 0.2s ease;
`;

const DayName = styled.span<{ $isSelected: boolean }>`
  font-size: 12px;
  margin-bottom: 4px;
  color: ${({ $isSelected }) =>
    $isSelected ? "rgba(255,255,255, 0.9)" : "var(--color-gray-500)"};
`;

const DayNumber = styled.span`
  font-size: 20px;
  font-weight: 700;
`;

const MemoDayItem = memo(
  ({
    date,
    isSelected,
    isCurrentMonth,
    onClick,
  }: {
    date: Date;
    isSelected: boolean;
    isCurrentMonth: boolean;
    onClick: (date: Date) => void;
  }) => (
    <DayItem
      onClick={() => onClick(date)}
      $isSelected={isSelected}
      $isCurrentMonth={isCurrentMonth}
    >
      <DayName $isSelected={isSelected}>{DAY_NAMES[date.getDay()]}</DayName>
      <DayNumber>{date.getDate()}</DayNumber>
    </DayItem>
  )
);

MemoDayItem.displayName = "MemoDayItem";

const WeekSlide = memo(
  ({
    weekDates,
    selectedDate,
    referenceMonth,
    onDateClick,
  }: {
    weekDates: Date[];
    selectedDate: Date;
    referenceMonth: number;
    onDateClick: (d: Date) => void;
  }) => {
    return (
      <WeekRow>
        {weekDates.map((date, i) => {
          const isSelected = dateUtils.isSameDay(date, selectedDate);
          const isCurrentMonth = date.getMonth() === referenceMonth;
          return (
            <MemoDayItem
              key={i}
              date={date}
              isSelected={isSelected}
              isCurrentMonth={isCurrentMonth}
              onClick={onDateClick}
            />
          );
        })}
      </WeekRow>
    );
  }
);

WeekSlide.displayName = "WeekSlide";

const getRollingWeekDays = (refDate: Date): Date[] => {
  const startDate = dateUtils.addDays(refDate, -TARGET_INDEX);
  return Array.from({ length: 7 }, (_, i) => dateUtils.addDays(startDate, i));
};

const getWeekDataByIndex = (index: number, initialDate: Date): Date[] => {
  const weekOffset = index - INITIAL_INDEX;
  const targetDate = dateUtils.addDays(initialDate, weekOffset * 7);
  return getRollingWeekDays(targetDate);
};

const Calendar = ({ selectedDate, onDateClick }: CalendarProps) => {
  const [initialDate] = useState(() => new Date());

  const [currentWeekIndex, setCurrentWeekIndex] = useState(INITIAL_INDEX);
  const [viewMode, setViewMode] = useState<"week" | "month">("week");

  const swiperRef = useRef<SwiperType | null>(null);

  const referenceDate = useMemo(() => {
    const weekOffset = currentWeekIndex - INITIAL_INDEX;
    return dateUtils.addDays(initialDate, weekOffset * 7);
  }, [currentWeekIndex, initialDate]);

  const handleSlideChange = useCallback((swiper: SwiperType) => {
    setCurrentWeekIndex(swiper.activeIndex);
  }, []);

  const handleDateClick = useCallback(
    (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`;

      onDateClick(formattedDate);
    },
    [onDateClick]
  );

  return (
    <Wrapper>
      <Header>
        <DateTitle>{dateUtils.formatHeaderDate(referenceDate)}</DateTitle>
        <ScheduleToggle
          value={viewMode}
          onChange={(mode) => setViewMode(mode)}
        />
      </Header>

      <CalendarContainer>
        <SwiperWrapper>
          <Swiper
            modules={[Virtual]}
            virtual
            spaceBetween={8}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            onSlideChange={handleSlideChange}
            initialSlide={INITIAL_INDEX}
            slidesPerView={1}
            speed={300}
            touchRatio={1}
            resistanceRatio={0.7}
          >
            {Array.from({ length: TOTAL_WEEKS }, (_, index) => {
              return (
                <SwiperSlide key={index} virtualIndex={index}>
                  <WeekSlide
                    weekDates={getWeekDataByIndex(index, initialDate)}
                    selectedDate={selectedDate}
                    referenceMonth={referenceDate.getMonth()}
                    onDateClick={handleDateClick}
                  />
                </SwiperSlide>
              );
            })}
          </Swiper>
        </SwiperWrapper>
      </CalendarContainer>
    </Wrapper>
  );
};

export default Calendar;
