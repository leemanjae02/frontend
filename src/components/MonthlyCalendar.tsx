import { useMemo } from "react";
import styled, { css } from "styled-components";
import { typography } from "../styles/typography";

type DateKey = `${number}-${string}-${string}`; // "YYYY-MM-DD"

type Props = {
  selectedDate: Date;
  monthDate?: Date;

  onSelectDate: (next: Date) => void;
  onChangeMonth?: (nextMonthDate: Date) => void;

  remainingCountByDate?: Record<DateKey, number>;

  weekLabels?: string[];

  className?: string;
};

const WEEK_DEFAULT = ["월", "화", "수", "목", "금", "토", "일"];

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function toKey(d: Date): DateKey {
  const y = d.getFullYear();
  const m = pad2(d.getMonth() + 1);
  const day = pad2(d.getDate());
  return `${y}-${m}-${day}` as DateKey;
}

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function daysInMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export default function MonthlyCalendar({
  selectedDate,
  monthDate,
  onSelectDate,
  remainingCountByDate = {},
  weekLabels = WEEK_DEFAULT,
  className,
}: Props) {
  const baseMonth = monthDate ?? selectedDate;

  const today = useMemo(() => new Date(), []);
  const monthStart = useMemo(() => startOfMonth(baseMonth), [baseMonth]);

  const firstDay = monthStart.getDay();
  const firstDayMonBased = (firstDay + 6) % 7;

  // 이 달이 6주가 필요한 지
  const gridSize = useMemo(() => {
    const totalCells = firstDayMonBased + daysInMonth(baseMonth);
    const weeks = Math.ceil(totalCells / 7);
    return weeks === 6 ? 42 : 35;
  }, [firstDayMonBased, baseMonth]);

  const gridStart = useMemo(() => {
    const d = new Date(monthStart);
    d.setDate(d.getDate() - firstDayMonBased);
    return d;
  }, [monthStart, firstDayMonBased]);

  const days = useMemo(() => {
    return Array.from({ length: gridSize }).map((_, i) => {
      const d = new Date(gridStart);
      d.setDate(gridStart.getDate() + i);
      const inMonth =
        d.getFullYear() === baseMonth.getFullYear() &&
        d.getMonth() === baseMonth.getMonth();

      const key = toKey(d);
      const remain = remainingCountByDate[key] ?? 0;

      const selected = isSameDay(d, selectedDate);
      const isToday = isSameDay(d, today);

      return { d, inMonth, key, remain, selected, isToday };
    });
  }, [
    gridStart,
    baseMonth,
    remainingCountByDate,
    selectedDate,
    today,
    gridSize,
  ]);

  const weeks = useMemo(() => {
    const result: Array<typeof days> = [];
    for (let i = 0; i < days.length; i += 7) {
      result.push(days.slice(i, i + 7));
    }
    return result;
  }, [days]);

  return (
    <Wrap className={className}>
      <WeekHeaderRow>
        {weekLabels.map((w) => (
          <WeekHeaderCell key={w}>{w}</WeekHeaderCell>
        ))}
      </WeekHeaderRow>

      <Weeks>
        {weeks.map((week, weekIdx) => (
          <WeekLineRow key={weekIdx}>
            {week.map(({ d, inMonth, key, remain, selected, isToday }) => (
              <DayCell key={key}>
                <DayButton
                  type="button"
                  $selected={selected}
                  onClick={() => onSelectDate(new Date(d))}
                >
                  <DayNumber
                    $inMonth={inMonth}
                    $selected={selected}
                    $today={isToday}
                  >
                    {d.getDate()}
                  </DayNumber>
                </DayButton>

                {remain > 0 ? (
                  <RemainText>{remain}</RemainText>
                ) : (
                  <RemainSpacer />
                )}
              </DayCell>
            ))}
          </WeekLineRow>
        ))}
      </Weeks>
    </Wrap>
  );
}

const Wrap = styled.div`
  width: 100%;
  background: var(--color-white);
`;

const WeekHeaderRow = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  border-bottom: 1px solid var(--color-gray-100);
  padding: 8px;
`;

const WeekHeaderCell = styled.div`
  text-align: center;
  font-size: 12px;
  color: var(--color-gray-400);
`;

const Weeks = styled.div`
  padding: 0 8px;
`;

const WeekLineRow = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);

  padding: 8px 0;

  border-bottom: 1px solid var(--color-gray-100);
`;

const DayCell = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const DayButton = styled.button<{
  $selected: boolean;
}>`
  width: 30px;
  height: 30px;
  border: 0;
  border-radius: 999px;
  background: ${({ $selected }) =>
    $selected ? "var(--color-primary-500)" : "transparent"};
  display: grid;
  place-items: center;
  cursor: pointer;

  &:active {
    transform: scale(0.98);
  }
`;

const DayNumber = styled.span<{
  $inMonth: boolean;
  $selected: boolean;
  $today: boolean;
}>`
  ${({ $today }) =>
    $today
      ? css`
          ${typography.t14sb}
        `
      : css`
          ${typography.t14r}
        `}
  color: ${({ $inMonth, $selected, $today }) => {
    if ($selected) return "var(--color-white)";
    if ($today) return "var(--color-primary-500)";
    return $inMonth ? "var(--color-black)" : "var(--color-gray-300)";
  }};
`;

const RemainText = styled.div`
  padding-top: 3px;
  ${typography.t12sb}
  color: var(--color-primary-300);
`;

const RemainSpacer = styled.div`
  height: 18px;
`;
