import { useState, useEffect } from "react";
import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";
import WeekNavigator from "../../components/mentor/WeekNavigator";
import PlanList, { type DailyPlan } from "../../components/mentor/PlanList";
import { fetchWeeklyPlan } from "../../api/plan";
import type { LabelStatus } from "../../components/SubmitLabel";
import { dateUtils } from "../../utils/dateUtils";
import type { SubjectKey } from "../../components/SubjectAddButton";
import { typography } from "../../styles/typography";

const DAYS = [
  "일요일",
  "월요일",
  "화요일",
  "수요일",
  "목요일",
  "금요일",
  "토요일",
];

const WeeklyPlanPage = () => {
  const { menteeId } = useParams<{ menteeId: string }>();
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [weeklyPlans, setWeeklyPlans] = useState<DailyPlan[]>([]);
  const [loading, setLoading] = useState(false);

  // 현재 날짜 기준 해당 주의 월요일 계산
  const getMonday = (d: Date) => {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
  };

  useEffect(() => {
    if (!menteeId) return;

    const fetchPlans = async () => {
      try {
        setLoading(true);
        const mondayDate = getMonday(currentDate);
        const startDate = dateUtils.formatToAPIDate(mondayDate);

        const sundayDate = new Date(mondayDate);
        sundayDate.setDate(mondayDate.getDate() + 6);
        const endDate = dateUtils.formatToAPIDate(sundayDate);

        const subjects: SubjectKey[] = ["KOREAN", "MATH", "ENGLISH"];

        const responses = await Promise.all(
          subjects.map((s) => fetchWeeklyPlan(menteeId, startDate, endDate, s))
        );

        const mergedByDate: Record<string, any[]> = {};
        responses.forEach((dailyResponses) => {
          dailyResponses.forEach((dayResponse) => {
            if (!mergedByDate[dayResponse.date]) {
              mergedByDate[dayResponse.date] = [];
            }
            mergedByDate[dayResponse.date].push(...dayResponse.tasks);
          });
        });

        const weekDates = Array.from({ length: 7 }).map((_, i) => {
          const d = new Date(mondayDate);
          d.setDate(mondayDate.getDate() + i);
          return dateUtils.formatToAPIDate(d);
        });

        const todayStr = dateUtils.formatToAPIDate(new Date());

        const transformedPlans: DailyPlan[] = weekDates.map((dateStr) => {
          const date = new Date(dateStr);
          const dayLabel = DAYS[date.getDay()];
          const isToday = todayStr === dateStr;
          const tasks = mergedByDate[dateStr] || [];

          return {
            day: dayLabel,
            count: tasks.length,
            isToday,
            plans: tasks.map((task) => {
              let status: LabelStatus = "NOT_SUBMITTED";
              if (task.completed) {
                status = "SUBMITTED";
              } else if (dateStr >= todayStr) {
                status = "SCHEDULED";
              }

              return {
                subject: task.taskSubject as SubjectKey,
                title: task.taskName,
                status,
                hasQuestion: task.hasProofShot,
                isFeedbackCompleted: task.hasFeedback,
                onFeedbackClick: () => {
                  navigate(`/mentor/mentees/${menteeId}/plan/${task.taskId}/feedback`, {
                    state: { 
                      taskName: task.taskName,
                      status: status
                    }
                  });
                },
              };
            }),
          };
        });

        setWeeklyPlans(transformedPlans);
      } catch (error) {
        console.error("Failed to fetch weekly plans:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, [menteeId, currentDate, navigate]);

  return (
    <Container>
      <NavigatorWrapper>
        <WeekNavigator
          currentDate={currentDate}
          onDateChange={setCurrentDate}
        />
      </NavigatorWrapper>

      <ContentArea>
        {loading ? (
          <StateText>로딩 중...</StateText>
        ) : (
          <PlanList data={weeklyPlans} />
        )}
      </ContentArea>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-bottom: 40px;
`;

const NavigatorWrapper = styled.div`
  width: 100%;
`;

const ContentArea = styled.div`
  width: 100%;
`;

const StateText = styled.div`
  padding: 40px;
  text-align: center;
  color: var(--color-gray-500);
  ${typography.t16m}
`;

export default WeeklyPlanPage;
