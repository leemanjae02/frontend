import axiosInstance from "./axiosInstance";
import type { SubjectKey } from "../components/SubjectAddButton";

export interface PlanTask {
  taskId: number;
  taskSubject: SubjectKey;
  taskDate: string; // "YYYY-MM-DD"
  taskName: string;
  createdBy: "ROLE_MENTOR" | "ROLE_MENTEE";
  completed: boolean;
  readFeedback: boolean;
  hasFeedback: boolean;
  hasWorksheet: boolean;
  hasProofShot: boolean;
}

export interface DailyPlanResponse {
  date: string; // "YYYY-MM-DD"
  tasks: PlanTask[];
}

// 주간 학습 계획 조회 API
export const fetchWeeklyPlan = async (
  menteeId: number | string,
  startDate: string, // "YYYY-MM-DD"
  endDate: string, // "YYYY-MM-DD"
  subject?: SubjectKey
): Promise<DailyPlanResponse[]> => {
  const response = await axiosInstance.get<DailyPlanResponse[]>(
    `/tasks/duration`,
    {
      params: { menteeId, startDate, endDate, subject },
    }
  );
  return response.data;
};
