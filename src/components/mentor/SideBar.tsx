import React from "react";
import styled from "styled-components";
import { NavLink, useLocation, useParams } from "react-router-dom";
import { typography } from "../../styles/typography";

import PlanIcon from "../../assets/images/icon/pen.svg?react";
import TodoIcon from "../../assets/images/icon/check.svg?react";
import ResourceIcon from "../../assets/images/icon/report.svg?react";

export type MenteeSideMenuKey = "plan" | "todo" | "resources" | "reports";

interface Props {
  className?: string;
}

interface ItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  end?: boolean;
  isActiveForce?: boolean;
}

const MENU_ITEMS: Array<{
  key: MenteeSideMenuKey;
  label: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  end?: boolean;
}> = [
  { key: "plan", label: "주간 학습 계획", Icon: PlanIcon },
  { key: "todo", label: "할 일 등록", Icon: TodoIcon },
  { key: "resources", label: "자료 관리", Icon: ResourceIcon },
];

const SideMenuItem = ({ to, icon, label, end = false, isActiveForce }: ItemProps) => {
  return (
    <ItemLink
      to={to}
      end={end}
      className={({ isActive }) => (isActive || isActiveForce ? "active" : "")}
    >
      <IconBox>{icon}</IconBox>
      <Label>{label}</Label>
    </ItemLink>
  );
};

const MenteeSideMenuBar = ({ className }: Props) => {
  const { menteeId } = useParams();
  const location = useLocation();

    const isTodoEdit =

      location.pathname.includes("/todo/") && location.pathname.includes("/edit");

  

    return (

      <Wrap className={className}>

        {MENU_ITEMS.map(({ key, label, Icon }) => {

          // 편집 모드여도 사이드바 텍스트는 '할 일 등록' 그대로 유지

          // 단, 활성화(active) 처리를 위해 to 경로는 기본 등록 페이지로 하되

          // NavLink의 isActive 판정은 react-router-dom이 알아서 처리 (하지만 /edit은 하위 경로라 기본적으로 active됨)

          // 만약 명시적으로 처리해야 한다면 className 로직을 수정해야 함.

          // 현재 ItemLink는 NavLink를 쓰고 있으므로 to와 현재 URL이 다르면 active가 안 될 수 있음.

          

          // 요구사항: "그 등록으로 라우팅하면 되고" -> 클릭 시 등록 페이지로 이동

          // "edit 모드여도 사이드바는 할 일 등록이고" -> 텍스트 고정

          

          const isActive = 

              key === 'todo' && isTodoEdit 

              ? true 

              : undefined; // undefined면 NavLink 기본 동작 따름

  

          return (

            <SideMenuItem

              key={key}

              to={`/mentor/mentees/${menteeId}/${key}`}

              icon={<Icon />}

              label={label}

              isActiveForce={isActive}

            />

          );

        })}

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
