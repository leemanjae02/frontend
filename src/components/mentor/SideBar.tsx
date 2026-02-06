import React from "react";
import styled, { css } from "styled-components";
import { typography } from "../../styles/typography";

import PlanIcon from "../../assets/images/icon/pencil.svg?react";
import TodoIcon from "../../assets/images/icon/check.svg?react";
import ResourceIcon from "../../assets/images/icon/doc.svg?react";
import ReportIcon from "../../assets/images/icon/clock.svg?react";

export type MenteeSideMenuKey = "PLAN" | "TODO" | "RESOURCE" | "REPORT";

interface Props {
  activeKey: MenteeSideMenuKey;
  onChange: (key: MenteeSideMenuKey) => void;
  className?: string;
}

interface ItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const MENU_ITEMS: Array<{
  key: MenteeSideMenuKey;
  label: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
}> = [
  { key: "PLAN", label: "주간 학습 계획", Icon: PlanIcon },
  { key: "TODO", label: "할 일 등록", Icon: TodoIcon },
  { key: "RESOURCE", label: "자료 관리", Icon: ResourceIcon },
  { key: "REPORT", label: "주간 학습 리포트 발송", Icon: ReportIcon },
];

const SideMenuItem = ({ icon, label, active = false, onClick }: ItemProps) => {
  return (
    <ItemButton onClick={onClick} $active={active}>
      <IconBox>{icon}</IconBox>
      <Label>{label}</Label>
    </ItemButton>
  );
};

const MenteeSideMenuBar = ({ activeKey, onChange, className }: Props) => {
  return (
    <Wrap className={className}>
      {MENU_ITEMS.map(({ key, label, Icon }) => (
        <SideMenuItem
          key={key}
          icon={<Icon />}
          label={label}
          active={activeKey === key}
          onClick={() => onChange(key)}
        />
      ))}
    </Wrap>
  );
};

const Wrap = styled.aside`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ItemButton = styled.button<{ $active: boolean }>`
  width: 100%;
  height: 60px;
  padding: 0 16px;

  border: 0;
  border-radius: 10px;
  background: transparent;

  display: flex;
  align-items: center;
  gap: 12px;

  cursor: pointer;
  text-align: left;
  box-sizing: border-box;

  ${typography.t16sb}
  color: var(--color-black);

  &:hover {
    background: var(--color-gray-50);
  }

  ${({ $active }) =>
    $active &&
    css`
      background: color-mix(in srgb, var(--color-primary-50) 55%, white);
      &:hover {
        background: color-mix(in srgb, var(--color-primary-50) 55%, white);
      }
    `}
`;

const IconBox = styled.span`
  width: 24px;
  height: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;

  svg {
    width: 24px;
    height: 24px;
    display: block;
  }
`;

const Label = styled.span`
  ${typography.t16sb}
  color: var(--color-black);
`;

export default MenteeSideMenuBar;
