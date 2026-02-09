import { useState } from "react";
import styled from "styled-components";
import { typography } from "../../styles/typography";
import BottomArrow from "../../assets/images/icon/bottom.svg?react";
import TopArrow from "../../assets/images/icon/top.svg?react";

interface PlanAccordionProps {
  day: string; // "월요일", "화요일" ...
  count: number;
  isToday?: boolean; // 오늘 여부 (배경색/테두리 결정)
  defaultOpen?: boolean;
  children: React.ReactNode;
}

const PlanAccordion = ({
  day,
  count,
  isToday = false,
  defaultOpen = false,
  children,
}: PlanAccordionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Container $isToday={isToday}>
      <Header onClick={() => setIsOpen(!isOpen)} $isToday={isToday}>
        <HeaderLeft>
          <Day>{day}</Day>
          <CountInfo>
            <CountNum>{count}</CountNum>개의 할 일
          </CountInfo>
          {isToday && <TodayTag>오늘</TodayTag>}
        </HeaderLeft>
        <ArrowWrapper>{isOpen ? <TopArrow /> : <BottomArrow />}</ArrowWrapper>
      </Header>
      <ContentWrapper $isOpen={isOpen}>
        <ContentInner>{children}</ContentInner>
      </ContentWrapper>
    </Container>
  );
};

const Container = styled.div<{ $isToday: boolean }>`
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 12px;

  /* 테두리 및 배경색 설정 */
  border: 1px solid
    ${({ $isToday }) =>
      $isToday ? "var(--color-primary-500)" : "var(--color-gray-200)"};
  background-color: ${({ $isToday }) =>
    $isToday ? "var(--color-primary-50)" : "var(--color-gray-50)"};

  transition: all 0.2s ease;
`;

const Header = styled.div<{ $isToday: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  cursor: pointer;
  user-select: none;

  /* 헤더 배경색은 컨테이너 배경색을 따라감 (투명) */
  background-color: transparent;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Day = styled.span`
  ${typography.t16sb}
  color: var(--color-gray-900);
`;

const CountInfo = styled.span`
  ${typography.t14r}
  color: var(--color-gray-600);
  display: flex;
  align-items: center;
  gap: 2px;
`;

const CountNum = styled.span`
  /* 숫자만 굵게 할지 여부는 시안에 따라 결정 */
  /* ${typography.t14sb} */
`;

const TodayTag = styled.span`
  ${typography.t12sb}
  color: var(--color-white);
  background-color: var(--color-primary-400);
  padding: 2px 8px;
  border-radius: 999px; /* 둥근 뱃지 */
`;

const ArrowWrapper = styled.div`
  color: var(--color-gray-600);
  svg {
    width: 24px;
    height: 24px;
    path {
      stroke: currentColor;
    }
  }
`;

const ContentWrapper = styled.div<{ $isOpen: boolean }>`
  display: grid;
  grid-template-rows: ${({ $isOpen }) => ($isOpen ? "1fr" : "0fr")};
  transition: grid-template-rows 0.3s ease-in-out;
  background-color: white; /* 내부는 항상 흰색 */

  /* 펼쳐졌을 때 상단 경계선 추가 (선택 사항) */
  border-top: ${({ $isOpen }) =>
    $isOpen ? "1px solid var(--color-gray-100)" : "none"};
`;

const ContentInner = styled.div`
  overflow: hidden;
`;

export default PlanAccordion;
