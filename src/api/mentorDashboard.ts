import axiosInstance from "./axiosInstance";
import { dateUtils } from "../utils/dateUtils";
import type { SubjectKey } from "../components/SubjectAddButton";

export interface MentorDashboardMenteeItem {
  menteeId: number;
  menteeName: string;
  grade: string;
  subjects: SubjectKey[];
  recentTaskDate: string;
  recentTaskName: string;
  submitted: boolean;
}

export interface GetMentorDashboardMenteesResponse {
  totalMenteeCount: number;
  submittedMenteeCount: number;
  notSubmittedMenteeCount: number;
  mentees: MentorDashboardMenteeItem[];
}

export const getMentorDashboardMentees = async (
  date: Date,
): Promise<GetMentorDashboardMenteesResponse> => {
  try {
    const { data } = await axiosInstance.get<GetMentorDashboardMenteesResponse>(
      "/mentors/dashboard/mentees",
      {
        params: {
          date: dateUtils.formatToAPIDate(date),
        },
      },
    );

    return data;
  } catch (error) {
    console.error("멘티 관리 리스트 조회 실패:", error);
    throw error;
  }
};

// [Mentor Dashboard] 피드백 작성 필요 항목 전체 조회
export interface FeedbackRequiredTasksResponse {
  taskCount: number;
  menteeNames: string[];
}

export const getFeedbackRequiredTasks = async (
  date: Date,
): Promise<FeedbackRequiredTasksResponse> => {
  try {
    const { data } = await axiosInstance.get<FeedbackRequiredTasksResponse>(
      "/mentors/dashboard/feedback-required-tasks",
      {
        params: { date: dateUtils.formatToAPIDate(date) },
      },
    );
    return data;
  } catch (error) {
    console.error("피드백 미작성 과제 조회 실패:", error);
    throw error;
  }
};

// [Mentor Dashboard] 학습 미이행(업로드 미제출) 멘티 전체 조회
export interface UnfinishedTasksResponse {
  taskCount: number;
  menteeCount: number;
  menteeNames: string[];
}

export const getUnfinishedTasks = async (
  date: Date,
): Promise<UnfinishedTasksResponse> => {
  try {
    const { data } = await axiosInstance.get<UnfinishedTasksResponse>(
      "/mentors/dashboard/unfinished-tasks",
      {
        params: { date: dateUtils.formatToAPIDate(date) },
      },
    );
    return data;
  } catch (error) {
    console.error("학습 미이행(업로드 미제출) 조회 실패:", error);
    throw error;
  }
};

export type GetMentorMenteeInfoResponse = {
  menteeId: number;
  menteeName: string;
  grade: string | null;
  subjects: SubjectKey[];
};

/**
 * 멘토가 특정 멘티의 기본 정보 조회
 */
export const getMentorMenteeInfo = async (
  menteeId: number,
): Promise<GetMentorMenteeInfoResponse> => {
  const { data } = await axiosInstance.get<GetMentorMenteeInfoResponse>(
    `/mentor/mentee/${menteeId}`,
  );
  return data;
};
