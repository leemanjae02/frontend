import styled, { css } from "styled-components";

import MonthIcon from "../assets/images/icon/month.svg?react";
import WeekIcon from "../assets/images/icon/week.svg?react";

export type ViewMode = "month" | "week";

interface Props {
  value: ViewMode;
  onChange: (next: ViewMode) => void;
  className?: string;
}

const ScheduleToggle = ({ value, onChange, className }: Props) => {
  const isMonth = value === "month";

  return (
    <Wrap className={className}>
      <Slider $pos={value} />

      <Item type="button" $side="left" onClick={() => onChange("month")}>
        <IconWrap $active={isMonth}>
          <MonthIcon />
        </IconWrap>
      </Item>

      <Item type="button" $side="right" onClick={() => onChange("week")}>
        <IconWrap $active={!isMonth}>
          <WeekIcon />
        </IconWrap>
      </Item>
    </Wrap>
  );
};

const Wrap = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr;

  width: 64px;
  padding: 5px 0px;

  border-radius: 4px;
  background: var(--color-gray-100);

  transition: background-color 180ms ease;
`;

const Slider = styled.div<{ $pos: ViewMode }>`
  position: absolute;
  top: 4px;
  left: 5px;

  width: calc(52% - 10px);
  height: calc(100% - 8.5px);

  border-radius: 4px;
  background: var(--color-white);

  transition:
    transform 220ms ease,
    box-shadow 220ms ease;

  box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.15);

  ${({ $pos }) =>
    $pos === "week" &&
    css`
      transform: translateX(calc(100% + 8px));
    `}
`;

const Item = styled.button<{ $side?: "left" | "right" }>`
  position: relative;
  z-index: 1;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 100%;

  border: 0;
  background: transparent;
  padding: 0;
  cursor: pointer;

  ${({ $side }) =>
    $side === "left" &&
    `
      justify-content: flex-end;
      padding-right: 5.5px;
    `}

  ${({ $side }) =>
    $side === "right" &&
    `
      justify-content: flex-start;
      padding-left: 6px;
    `}

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px var(--color-primary-200);
    border-radius: 12px;
  }
`;

const IconWrap = styled.span<{ $active: boolean }>`
  width: 20px;
  height: 22px;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  color: ${({ $active }) =>
    $active ? "var(--color-primary-500)" : "var(--color-gray-400)"};

  & > svg path {
    stroke: currentColor;
  }
`;

export default ScheduleToggle;
