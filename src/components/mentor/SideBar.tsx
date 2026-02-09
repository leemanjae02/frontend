import React, { useEffect } from "react";
import styled from "styled-components";
import { NavLink, useLocation, useParams } from "react-router-dom";
import { typography } from "../../styles/typography";

import PlanIcon from "../../assets/images/icon/pen.svg?react";
import TodoIcon from "../../assets/images/icon/check.svg?react";
import ResourceIcon from "../../assets/images/icon/report.svg?react";
import ReportIcon from "../../assets/images/icon/clock.svg?react";

export type MenteeSideMenuKey = "plan" | "todo" | "resources" | "reports";

interface Props {
  className?: string;
}

interface ItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  end?: boolean;
}

const MENU_ITEMS: Array<{
  key: MenteeSideMenuKey;
  label: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  end?: boolean;
}> = [
  { key: "plan", label: "주간 학습 계획", Icon: PlanIcon },
  { key: "todo", label: "할 일 등록", Icon: TodoIcon, end: true },
  { key: "resources", label: "자료 관리", Icon: ResourceIcon },
  { key: "reports", label: "주간 학습 리포트 발송", Icon: ReportIcon },
];

const SideMenuItem = ({ to, icon, label, end = false }: ItemProps) => {
  return (
    <ItemLink
      to={to}
      end={end}
      className={({ isActive }) => (isActive ? "active" : "")}
    >
      <IconBox>{icon}</IconBox>
      <Label>{label}</Label>
    </ItemLink>
  );
};

const MenteeSideMenuBar = ({ className }: Props) => {
  const { menteeId } = useParams();
  const location = useLocation();

  useEffect(() => {
    console.log("[SideBar mounted]");
    console.log("[SideBar] pathname:", location.pathname);
  }, []);

  useEffect(() => {
    console.log("[SideBar pathname changed]", location.pathname);
  }, [location.pathname]);

  return (
    <Wrap className={className}>
      {MENU_ITEMS.map(({ key, label, Icon, end }) => (
        <SideMenuItem
          key={key}
          to={`/mentor/mentees/${menteeId}/${key}`}
          icon={<Icon />}
          label={label}
          end={end}
        />
      ))}
    </Wrap>
  );
};

const Wrap = styled.aside`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const ItemLink = styled(NavLink)`
  width: 100%;
  height: 48px;
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
  text-decoration: none;

  &:hover {
    background: color-mix(in srgb, var(--color-primary-100) 50%, white);
  }

  &.active {
    background: color-mix(in srgb, var(--color-primary-50), white);
  }

  &.active:hover {
    background: color-mix(in srgb, var(--color-primary-100) 50%, white);
  }
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
  ${typography.t16m}
  color: var(--color-black);
`;

export default MenteeSideMenuBar;
