import axiosInstance from "./axiosInstance";
import type { SubjectKey } from "../components/SubjectAddButton";

export interface LearningStatusItem {
  subject: SubjectKey; // "KOREAN" | "ENGLISH" | "MATH"
  taskAmount: number;
  completedTaskAmount: number;
}

export interface SubjectTaskItem {
  taskId: number;
  taskSubject: SubjectKey;
  taskDate: string; // "YYYY-MM-DD"
  taskName: string;
  createdBy: "ROLE_MENTOR" | "ROLE_MENTEE"; // 서버 스펙에 맞춰 조정 가능
  completed: boolean;
  readFeedback: boolean;
  hasFeedback: boolean;
  hasWorksheet: boolean;
  hasProofShot: boolean;
  isResource: boolean;
}

export interface SubjectLearningStatusResponse {
  todayTasks: SubjectTaskItem[];
  historyTasks: SubjectTaskItem[];
}

/**
 * 전체 학습 현황 조회
 */
export async function getLearningStatus(date: string) {
  const { data } = await axiosInstance.get<LearningStatusItem[]>(
    "/users/me/learning-status",
    { params: { date } },
  );
  return data;
}

/**
 * 과목별 학습 현황(히스토리) 조회
 */
export async function getSubjectLearningStatus(
  subject: SubjectKey,
  date: string,
) {
  const { data } = await axiosInstance.get<SubjectLearningStatusResponse>(
    `/users/me/learning-status/${subject}`,
    { params: { date } },
  );
  return data;
}
