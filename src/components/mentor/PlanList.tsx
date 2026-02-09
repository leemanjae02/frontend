import styled from "styled-components";
import PlanAccordion from "./PlanAccordion";
import PlanItem, { type PlanItemProps } from "./PlanItem";

export interface DailyPlan {
  day: string;
  count: number;
  isToday?: boolean;
  plans: PlanItemProps[];
}

interface PlanListProps {
  data: DailyPlan[];
}

const PlanList = ({ data }: PlanListProps) => {
  return (
    <ListContainer>
      {data.map((item, index) => (
        <PlanAccordion
          key={index}
          day={item.day}
          count={item.plans.length}
          isToday={item.isToday}
          defaultOpen={item.isToday || index === 0}
        >
          {item.plans.map((plan, idx) => (
            <PlanItem
              key={`${item.day}-${idx}`}
              {...plan}
            />
          ))}
        </PlanAccordion>
      ))}
    </ListContainer>
  );
};

const ListContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export default PlanList;