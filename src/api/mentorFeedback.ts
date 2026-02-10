import axiosInstance from "./axiosInstance";
import type { SubjectKey } from "../components/SubjectAddButton";

export type RegisterStatus = "TEMPORARY" | "CONFIRMED";

export interface Annotation {
  annotationId: number;
  annotationNumber: number;
  percentX: number;
  percentY: number;
}

export interface Question {
  questionId: number;
  questionNumber: number;
  content: string;
  answer: string | null;
  annotation: Annotation | null;
}

export interface Feedback {
  feedbackId: number;
  feedbackNumber: number;
  content: string;
  starred: boolean;
  registerStatus: RegisterStatus;
  annotation: Annotation | null;
}

export interface ProofShot {
  proofShotId: number;
  imageFileId: number;
  questions: Question[];
  feedbacks: Feedback[];
}

export interface MentorTaskDetailResponse {
  taskId: number;
  mentorName: string;
  taskName: string;
  menteeName: string;
  proofShots: ProofShot[];
  generalComment: string | null;
  subject: SubjectKey;
}

export interface SaveTemporaryFeedbackRequest {
  generalComment: string;
  proofShotFeedbacks: {
    proofShotId: number;
    feedbacks: {
      content: string;
      starred: boolean;
      percentX: number;
      percentY: number;
    }[];
  }[];
  questionAnswers: {
    questionId: number;
    content: string;
  }[];
}

export interface SaveFeedbackRequest {
  generalComment: string;
  proofShotFeedbacks: {
    proofShotId: number;
    feedbacks: {
      content: string;
      starred: boolean;
      percentX: number;
      percentY: number;
    }[];
  }[];
  questionAnswers: {
    questionId: number;
    content: string;
  }[];
}

/**
 * 멘토가 멘티의 할 일을 상세 조회합니다. (최종 저장된 피드백 포함)
 */
export const getMentorTaskDetail = async (
  taskId: number | string
): Promise<MentorTaskDetailResponse> => {
  const { data } = await axiosInstance.get<MentorTaskDetailResponse>(
    `/mentors/tasks/${taskId}`
  );
  return data;
};

/**
 * 멘토가 임시저장한 피드백을 조회합니다.
 */
export const getTemporaryFeedback = async (
  taskId: number | string
): Promise<MentorTaskDetailResponse> => {
  const { data } = await axiosInstance.get<MentorTaskDetailResponse>(
    `/mentors/tasks/${taskId}/feedback/temporary`
  );
  return data;
};

/**
 * 멘토가 작성 중인 피드백을 임시저장합니다.
 */
export const saveTemporaryFeedback = async (
  taskId: number | string,
  payload: SaveTemporaryFeedbackRequest
): Promise<void> => {
  await axiosInstance.put(
    `/mentors/tasks/${taskId}/feedback/temporary`,
    payload
  );
};

/**
 * 멘토가 피드백을 최종 저장합니다.
 */
export const saveMentorFeedback = async (
  taskId: number | string,
  payload: SaveFeedbackRequest
): Promise<void> => {
  await axiosInstance.put(`/mentors/tasks/${taskId}/feedback`, payload);
};
