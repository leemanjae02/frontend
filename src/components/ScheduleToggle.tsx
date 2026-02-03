import styled, { css } from "styled-components";

import monthOff from "../assets/month.svg";
import monthOn from "../assets/month_on.svg";
import weekOff from "../assets/week.svg";
import weekOn from "../assets/week_on.svg";

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

      <Item type="button" onClick={() => onChange("month")}>
        <Icon src={isMonth ? monthOn : monthOff} alt="월간" />
      </Item>

      <Item type="button" onClick={() => onChange("week")}>
        <Icon src={!isMonth ? weekOn : weekOff} alt="주간" />
      </Item>
    </Wrap>
  );
};

const Wrap = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr;

  width: 80px;
  padding: 8px 0px;

  border-radius: 6px;
  background: var(--color-gray-100);

  transition: background-color 180ms ease;
`;

const Slider = styled.div<{ $pos: ViewMode }>`
  position: absolute;
  top: 4px;
  left: 4px;

  width: calc(50% - 8px);
  height: calc(100% - 8px);

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

const Item = styled.button`
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

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px var(--color-primary-200);
    border-radius: 12px;
  }
`;

const Icon = styled.img`
  width: 24px;
  height: 24px;
  display: block;
`;

export default ScheduleToggle;
