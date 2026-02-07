import { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

type PickerMode = "single" | "multiple";

interface Props {
  mode?: PickerMode;
  value: string | string[];
  onChange: (next: string | string[]) => void;
  disabled?: boolean;
  popoverAlign?: "start" | "end";
  icon: React.ReactNode;
}

function isYYYYMMDD(v: string) {
  return /^(\d{4})-(\d{2})-(\d{2})$/.test(v.trim());
}

function parseYYYYMMDD(v: string): Date | undefined {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v.trim());
  if (!m) return undefined;
  const y = Number(m[1]);
  const mo = Number(m[2]) - 1;
  const d = Number(m[3]);
  const dt = new Date(y, mo, d);
  if (Number.isNaN(dt.getTime())) return undefined;
  if (dt.getFullYear() !== y || dt.getMonth() !== mo || dt.getDate() !== d) {
    return undefined;
  }
  return dt;
}

function toYYYYMMDD(d: Date) {
  return format(d, "yyyy-MM-dd");
}

function sortYYYYMMDD(list: string[]) {
  return [...list].sort((a, b) => a.localeCompare(b));
}

const DatePicker = ({
  mode = "single",
  value,
  onChange,
  disabled = false,
  popoverAlign = "end",
  icon,
}: Props) => {
  const anchorRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);

  const selectedSingle = useMemo(() => {
    if (mode !== "single") return undefined;
    return typeof value === "string" ? parseYYYYMMDD(value) : undefined;
  }, [mode, value]);

  const selectedMultiple = useMemo(() => {
    if (mode !== "multiple") return undefined;
    const arr = Array.isArray(value) ? value : [];
    return arr.map((v) => parseYYYYMMDD(v)).filter(Boolean) as Date[];
  }, [mode, value]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    const onMouseDown = (e: MouseEvent) => {
      const el = anchorRef.current;
      if (!el) return;
      if (e.target instanceof Node && !el.contains(e.target)) {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("mousedown", onMouseDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("mousedown", onMouseDown);
    };
  }, [open]);

  return (
    <Anchor ref={anchorRef}>
      <IconButton
        type="button"
        disabled={disabled}
        aria-label="달력 열기"
        onClick={(e) => {
          e.preventDefault();
          if (disabled) return;
          setOpen((v) => !v);
        }}
      >
        <IconSlot>{icon}</IconSlot>
      </IconButton>

      {open && (
        <Popover $align={popoverAlign} role="dialog" aria-label="날짜 선택">
          {mode === "single" ? (
            <DayPicker
              mode="single"
              selected={selectedSingle}
              onSelect={(d) => {
                if (!d) return;
                onChange(toYYYYMMDD(d));
                setOpen(false);
              }}
              locale={ko}
              captionLayout="dropdown"
              fromYear={2020}
              toYear={2035}
              showOutsideDays
              className="rdp"
            />
          ) : (
            <DayPicker
              mode="multiple"
              selected={selectedMultiple}
              onSelect={(ds) => {
                const picked = (ds ?? [])
                  .map((d) => toYYYYMMDD(d))
                  .filter((v) => isYYYYMMDD(v));
                onChange(sortYYYYMMDD(picked));
              }}
              locale={ko}
              captionLayout="dropdown"
              fromYear={2020}
              toYear={2035}
              showOutsideDays
              className="rdp"
            />
          )}
        </Popover>
      )}
    </Anchor>
  );
};

const Anchor = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
`;

const IconButton = styled.button`
  width: 28px;
  height: 28px;
  display: grid;
  place-items: center;
  border: 0;
  background: transparent;
  padding: 0;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px var(--color-primary-200);
    border-radius: 6px;
  }
`;

const IconSlot = styled.span`
  display: grid;
  place-items: center;
  svg {
    width: 28px;
    height: 28px;
  }

  & > svg path {
    stroke: var(--color-gray-300);
  }
`;

const Popover = styled.div<{ $align: "start" | "end" }>`
  position: absolute;
  top: calc(100% + 10px);
  ${({ $align }) => ($align === "start" ? "left: 0;" : "right: 0;")}

  z-index: 50;
  background: var(--color-white);
  border: 1px solid var(--color-gray-200);
  border-radius: 12px;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.14);
  padding: 10px;

  .rdp {
    --rdp-cell-size: 30px;
    --rdp-accent-color: var(--color-primary-500);
    --rdp-outline: 2px solid var(--color-primary-200);
    margin: 0;
  }

  .rdp-table {
    border-collapse: separate;
    border-spacing: 10px 8px;
  }

  .rdp-caption {
    padding: 8px 10px 6px 10px;
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    column-gap: 8px;
  }

  .rdp-caption_dropdowns {
    justify-content: start;
    gap: 6px;
  }

  .rdp-caption_label {
    font-size: 13px;
    font-weight: 600;
    color: var(--color-gray-700);
  }

  .rdp-nav {
    display: inline-flex;
    gap: 6px;
    align-items: center;
  }

  .rdp-nav_button {
    width: 26px;
    height: 26px;
    border-radius: 8px;
  }

  .rdp-weekday {
    font-size: 12px;
    font-weight: 500;
    color: var(--color-gray-400);
    padding-bottom: 4px;
  }

  .rdp-day_button {
    width: var(--rdp-cell-size);
    height: var(--rdp-cell-size);
    border-radius: 999px;
    font-size: 15px;
    font-weight: 500;
    color: var(--color-gray-700);
  }

  .rdp-day:not(.rdp-day_disabled):not(.rdp-day_outside):not(.rdp-day_today):not(
      .rdp-today
    ):not(.rdp-day--today)
    .rdp-day_button:hover {
    background: var(--color-primary-50);
  }

  .rdp-day_selected .rdp-day_button,
  .rdp-day_selected .rdp-day_button:hover,
  .rdp-day_selected .rdp-day_button:focus-visible {
    border-color: var(--color-primary-500);
    background: color-mix(in srgb, var(--color-primary-500), transparent);
    color: var(--color-gray-700);
    font-weight: 700;
  }

  .rdp-day_today .rdp-day_button,
  .rdp-today .rdp-day_button,
  .rdp-day--today .rdp-day_button {
    background: var(--color-primary-500);
    color: var(--color-white);
    font-weight: 700;
    border-color: transparent;
  }

  .rdp-day_today.rdp-day_selected .rdp-day_button,
  .rdp-today.rdp-day_selected .rdp-day_button,
  .rdp-day--today.rdp-day_selected .rdp-day_button {
    background: var(--color-primary-50);
    border-color: var(--color-primary-500);
    background: color-mix(in srgb, var(--color-primary-500) 12%, transparent);
    color: var(--color-gray-700);
  }

  .rdp-day_outside .rdp-day_button {
    color: var(--color-gray-300);
  }
`;

export default DatePicker;
