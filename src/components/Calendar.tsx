import { useState, useMemo, useRef, useCallback, memo } from "react";
import styled from "styled-components";
import { Swiper, SwiperSlide } from "swiper/react";
import { Virtual } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

import "swiper/css";
import "swiper/css/virtual";

import { dateUtils } from "../utils/dateUtils";
import ScheduleToggle from "./ScheduleToggle";
import MonthlyCalendar from "./MonthlyCalendar";
import YearMonthPickerModal from "./YearMonthPickerModal";

type DateKey = `${number}-${string}-${string}`;

interface CalendarProps {
  selectedDate: Date;
  onDateClick: (date: string) => void;

  viewMode: "week" | "month";
  onChangeViewMode: (mode: "week" | "month") => void;
  monthDate: Date;
  onChangeMonthDate: (nextMonthDate: Date) => void;
  remainingCountByDate?: Record<DateKey, number>;
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
  padding: 5px 16px 20px;
`;

const TitleButton = styled.button<{ $clickable: boolean }>`
  border: 0;
  background: transparent;
  padding: 0;
  margin: 0;

  font-size: 18px;
  font-weight: 700;
  color: var(--color-black);

  cursor: ${({ $clickable }) => ($clickable ? "pointer" : "default")};

  &:hover {
    color: ${({ $clickable }) =>
      $clickable ? "var(--color-primary-500)" : "var(--color-black)"};
  }
  &:active {
    transform: ${({ $clickable }) => ($clickable ? "translateY(1px)" : "none")};
  }
`;

const CalendarContainer = styled.div<{ $mode: "week" | "month" }>`
  overflow: hidden;
  height: ${({ $mode }) => ($mode === "week" ? "57px" : "")};
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
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
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
  ),
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
  },
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

function formatYMD(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

const Calendar = ({
  selectedDate,
  onDateClick,
  viewMode,
  onChangeViewMode,
  monthDate,
  onChangeMonthDate,
  remainingCountByDate,
}: CalendarProps) => {
  const [initialDate] = useState(() => new Date());

  const [currentWeekIndex, setCurrentWeekIndex] = useState(INITIAL_INDEX);

  const swiperRef = useRef<SwiperType | null>(null);

  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const referenceDate = useMemo(() => {
    const weekOffset = currentWeekIndex - INITIAL_INDEX;
    return dateUtils.addDays(initialDate, weekOffset * 7);
  }, [currentWeekIndex, initialDate]);

  const handleSlideChange = useCallback((swiper: SwiperType) => {
    setCurrentWeekIndex(swiper.activeIndex);
  }, []);

  const handleDateClick = useCallback(
    (date: Date) => {
      onDateClick(formatYMD(date));
    },
    [onDateClick],
  );

  const headerTitle =
    viewMode === "week"
      ? dateUtils.formatHeaderDate(referenceDate)
      : `${monthDate.getFullYear()}년 ${monthDate.getMonth() + 1}월`;

  const handleChangeViewMode = useCallback(
    (mode: "week" | "month") => {
      onChangeViewMode(mode);

      if (mode === "month") {
        onChangeMonthDate(
          new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1),
        );
      }

      if (mode === "week") {
        setIsPickerOpen(false);
      }
    },
    [onChangeViewMode, onChangeMonthDate, selectedDate],
  );

  const handleSelectDateInMonth = useCallback(
    (next: Date) => {
      if (
        next.getFullYear() !== monthDate.getFullYear() ||
        next.getMonth() !== monthDate.getMonth()
      ) {
        onChangeMonthDate(new Date(next.getFullYear(), next.getMonth(), 1));
      }
      handleDateClick(next);
    },
    [handleDateClick, monthDate, onChangeMonthDate],
  );

  const handlePickMonth = useCallback(
    (year: number, monthIndex0: number) => {
      const nextMonth = new Date(year, monthIndex0, 1);
      onChangeMonthDate(nextMonth);
      setIsPickerOpen(false);

      if (
        selectedDate.getFullYear() !== year ||
        selectedDate.getMonth() !== monthIndex0
      ) {
        onDateClick(formatYMD(nextMonth));
      }
    },
    [onChangeMonthDate, onDateClick, selectedDate],
  );

  return (
    <Wrapper>
      <Header>
        <TitleButton
          type="button"
          $clickable={viewMode === "month"}
          onClick={() => {
            if (viewMode === "month") setIsPickerOpen(true);
          }}
        >
          {headerTitle}
        </TitleButton>

        <ScheduleToggle value={viewMode} onChange={handleChangeViewMode} />
      </Header>

      <CalendarContainer $mode={viewMode}>
        {viewMode === "week" ? (
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
        ) : (
          <MonthlyCalendar
            selectedDate={selectedDate}
            monthDate={monthDate}
            remainingCountByDate={remainingCountByDate}
            onSelectDate={handleSelectDateInMonth}
            onChangeMonth={(nextMonth) => {
              onChangeMonthDate(nextMonth);
            }}
          />
        )}
      </CalendarContainer>

      {viewMode === "month" && isPickerOpen ? (
        <YearMonthPickerModal
          baseMonth={monthDate}
          minYear={2020}
          maxYear={2035}
          onClose={() => setIsPickerOpen(false)}
          onPick={handlePickMonth}
        />
      ) : null}
    </Wrapper>
  );
};

export default Calendar;
