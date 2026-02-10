import { useMemo, useRef, useState } from "react";
import styled, { css } from "styled-components";
import { typography } from "../styles/typography";

type DateKey = `${number}-${string}-${string}`;

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

const SWIPE_THRESHOLD_PX = 50;
const SWIPE_START_PX = 10;

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

function addMonths(d: Date, delta: number) {
  return new Date(d.getFullYear(), d.getMonth() + delta, 1);
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
  onChangeMonth,
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

  const canSwipe = Boolean(onChangeMonth);

  const startRef = useRef<{ x: number; y: number } | null>(null);
  const decidedRef = useRef<null | "H" | "V">(null);
  const [isSwiping, setIsSwiping] = useState(false);

  const commitMonthChange = (direction: "prev" | "next") => {
    if (!onChangeMonth) return;
    const next = addMonths(baseMonth, direction === "next" ? 1 : -1);
    onChangeMonth(next);
  };

  const begin = (x: number, y: number) => {
    if (!canSwipe) return;
    startRef.current = { x, y };
    decidedRef.current = null;
    setIsSwiping(false);
  };

  const move = (x: number, y: number, preventDefault?: () => void) => {
    if (!canSwipe) return;
    if (!startRef.current) return;

    const dx = x - startRef.current.x;
    const dy = y - startRef.current.y;

    // 아직 방향 결정을 안 했으면 판단
    if (!decidedRef.current) {
      if (Math.abs(dx) < SWIPE_START_PX && Math.abs(dy) < SWIPE_START_PX)
        return;

      decidedRef.current = Math.abs(dx) > Math.abs(dy) ? "H" : "V";
      if (decidedRef.current === "H") setIsSwiping(true);
    }

    // 가로 스와이프라고 결정되면 스크롤에 이벤트 뺏기지 않게 막기
    if (decidedRef.current === "H") {
      preventDefault?.();
    }
  };

  const end = (x: number, y: number) => {
    if (!canSwipe) return;
    if (!startRef.current) return;

    const dx = x - startRef.current.x;
    const dy = y - startRef.current.y;

    // 세로 스크롤로 결정된 경우는 아무것도 하지 않음
    if (decidedRef.current === "V" || Math.abs(dy) > Math.abs(dx)) {
      startRef.current = null;
      decidedRef.current = null;
      setIsSwiping(false);
      return;
    }

    // 임계치 넘으면 달 변경
    if (dx <= -SWIPE_THRESHOLD_PX) commitMonthChange("next");
    else if (dx >= SWIPE_THRESHOLD_PX) commitMonthChange("prev");

    startRef.current = null;
    decidedRef.current = null;
    setIsSwiping(false);
  };

  return (
    <Wrap className={className}>
      <SwipeLayer
        $swiping={isSwiping}
        onMouseDown={(e) => begin(e.clientX, e.clientY)}
        onMouseMove={(e) => {
          if (!startRef.current) return;
          move(e.clientX, e.clientY);
          // 드래그 중 텍스트 선택 방지
          if (decidedRef.current === "H") e.preventDefault();
        }}
        onMouseUp={(e) => end(e.clientX, e.clientY)}
        onMouseLeave={(e) => {
          if (!startRef.current) return;
          end(e.clientX, e.clientY);
        }}
        // touch
        onTouchStart={(e) => {
          const t = e.touches[0];
          begin(t.clientX, t.clientY);
        }}
        onTouchMove={(e) => {
          const t = e.touches[0];
          move(t.clientX, t.clientY, () => e.preventDefault());
        }}
        onTouchEnd={(e) => {
          const t = e.changedTouches[0];
          if (!t) return;
          end(t.clientX, t.clientY);
        }}
      />
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
                  onClick={() => {
                    if (isSwiping) return;
                    onSelectDate(new Date(d));
                  }}
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
  position: relative;
  width: 100%;
  background: var(--color-white);
`;

const SwipeLayer = styled.div<{ $swiping: boolean }>`
  position: absolute;
  inset: 0;
  z-index: 5;

  touch-action: pan-y;

  ${({ $swiping }) =>
    $swiping
      ? css`
          cursor: grabbing;
        `
      : css`
          cursor: grab;
        `}

  -webkit-user-select: none;
  user-select: none;
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
  position: relative;
  z-index: 6;

  &:active {
    transform: scale(0.98);
  }

  -webkit-tap-highlight-color: transparent;
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
