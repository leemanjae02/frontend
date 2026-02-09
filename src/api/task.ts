import axiosInstance from "./axiosInstance";
import type { TaskDetailData } from "../components/mentee/TaskDetailContent";
import { dateUtils } from "../utils/dateUtils";
import { mockFetchTaskFeedbackDetail } from "../mock/menteeTaskFeedback.mock";

// =============================================================================
// [SECTION 1] 할 일 목록 조회 (캘린더/리스트 화면)
// Method: GET
// Endpoint: /tasks
// =============================================================================

// 목록 조회 응답 데이터 타입
export interface DailyTask {
  taskId: number;
  taskSubject: string; // "KOREAN", "MATH" 등
  taskDate: string; // "2026-02-05"
  taskName: string;
  createdBy: "ROLE_MENTOR" | "ROLE_MENTEE";
  completed: boolean;
  readFeedback: boolean;
  hasFeedback: boolean;
  hasWorksheet: boolean;
  hasProofShot: boolean;
}

export interface TaskListResponse {
  completedTaskAmount: number;
  taskAmount: number;
  goalMinutesTotal: number;
  actualMinutesTotal: number;
  tasks: DailyTask[];
}

// 1-2. 목록 조회 API 함수 (전체 응답 반환)
export const getTasksByDate = async (date: Date): Promise<TaskListResponse> => {
  try {
    const { data } = await axiosInstance.get<TaskListResponse>("/tasks", {
      params: { date: dateUtils.formatToAPIDate(date) },
    });
    return data;
  } catch (error) {
    console.error("목록 조회 실패:", error);
    throw error;
  }
};

// =============================================================================
// [SECTION 2] 할 일 상세 조회 (바텀시트/모달)
// Method: GET
// Endpoint: /tasks/{taskId}/details
// =============================================================================

// 2-1. 상세 조회 응답 데이터 타입
interface TaskDetailResponse {
  taskId: number;
  taskName: string;
  createdBy: "ROLE_MENTOR" | "ROLE_MENTEE";
  subject: string; // 주의: 목록조회(taskSubject)와 다름
  goalMinutes: number;
  actualMinutes: number;
  hasFeedback: boolean;
  generalComment: string | null;
  mentorName: string | null;
  worksheets: Array<{
    fileId: number;
    fileName: string;
    fileContentType: string;
  }>;
  columnLinks: Array<{
    link: string;
  }>;
}

// 2-2. UI 데이터 변환 함수 (Adapter)
const transformDetailData = (data: TaskDetailResponse): TaskDetailData => {
  const subjectMap: Record<string, string> = {
    KOREAN: "국어",
    MATH: "수학",
    ENGLISH: "영어",
    RESOURCE: "자료",
  };

  const pdfs = data.worksheets.map((f) => ({
    id: f.fileId,
    type: "PDF" as const,
    title: f.fileName,
    fileId: f.fileId,
  }));

  const links = data.columnLinks.map((l, idx) => ({
    id: `link-${idx}`,
    type: "LINK" as const,
    title: l.link,
    url: l.link,
  }));

  return {
    title: data.taskName,
    subject: subjectMap[data.subject] || data.subject,
    subjectKey: data.subject, // 원본 키 보존 ("KOREAN", "ENGLISH" 등)
    targetTime: data.goalMinutes,
    actualTime: data.actualMinutes > 0 ? data.actualMinutes : undefined,
    isMentorAssigned: data.createdBy === "ROLE_MENTOR",
    hasFeedback: data.hasFeedback,
    attachments: [...pdfs, ...links],
    mentorFeedback: data.generalComment
      ? {
          mentorName: data.mentorName || "멘토",
          content: data.generalComment,
        }
      : undefined,
  };
};

// 2-3. 상세 조회 API 함수
export const fetchTaskDetail = async (
  taskId: number,
): Promise<TaskDetailData> => {
  try {
    const { data } = await axiosInstance.get<TaskDetailResponse>(
      `/tasks/${taskId}/details`,
    );
    return transformDetailData(data);
  } catch (error) {
    console.error("상세 조회 실패:", error);
    throw error;
  }
};

// =============================================================================
// [SECTION 3] 할 일 추가 (멘티용)
// Method: POST
// Endpoint: /tasks/mentee
// =============================================================================

// 할 일 추가 요청 타입
export interface CreateTaskRequest {
  subject: string; // "KOREAN", "MATH" ...
  date: string; // "yyyy-MM-dd"
  taskName: string;
  goalMinutes: number;
}

// 3-2. 할 일 추가 API 함수
export const createTask = async (payload: CreateTaskRequest): Promise<void> => {
  try {
    // 응답값은 필요하면 리턴 타입 변경 (보통 생성 후에는 목록을 새로고침 하므로 void 처리)
    await axiosInstance.post("/tasks/mentee", payload);
  } catch (error) {
    console.error("할 일 추가 실패:", error);
    throw error;
  }
};
// =============================================================================
// [SECTION 4] 할 일 수정
// Method: PATCH (또는 PUT)
// Endpoint: /tasks/{taskId}
// =============================================================================

export interface UpdateTaskRequest {
  taskName: string;
  goalMinutes: number;
}

export const updateTask = async (
  taskId: number,
  payload: UpdateTaskRequest,
): Promise<void> => {
  try {
    await axiosInstance.put(`/tasks/mentee/${taskId}`, payload);
  } catch (error) {
    console.error("할 일 수정 실패:", error);
    throw error;
  }
};
// =============================================================================
// [SECTION 5] 할 일 삭제 (멘티)
// Method: DELETE
// Endpoint: /tasks/{taskId}/mentee
// =============================================================================

export const deleteTask = async (taskId: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/tasks/${taskId}/mentee`);
  } catch (error) {
    console.error("할 일 삭제 실패:", error);
    throw error;
  }
};

// =============================================================================
// [SECTION 6] 할 일 완료 토글
// Method: PATCH
// Endpoint: /tasks/{taskId}/completed
// =============================================================================

export const toggleTaskComplete = async (
  taskId: number,
  date: Date,
  actualMinutes?: number,
): Promise<void> => {
  try {
    await axiosInstance.patch(`/tasks/${taskId}/completed`, {
      currentDate: dateUtils.formatToAPIDate(date),
      actualMinutes,
    });
  } catch (error) {
    console.error("완료 토글 실패:", error);
    throw error;
  }
};

// [SECTION 7] 할 일 피드백 상세 조회

export type RegisterStatus = "TEMPORARY" | "REGISTERED";

export interface FeedbackAnnotation {
  annotationId: number;
  annotationNumber: number;
  percentX: number;
  percentY: number;
}

export interface TaskFeedbackQuestion {
  questionId: number;
  questionNumber: number;
  content: string;
  answer: string | null;
  annotation: FeedbackAnnotation | null;
}

export interface TaskFeedbackItem {
  feedbackId: number;
  feedbackNumber: number;
  content: string;
  starred: boolean;
  registerStatus: RegisterStatus;
  annotation: FeedbackAnnotation | null;
}

export interface TaskFeedbackProofShot {
  proofShotId: number;
  imageFileId: number;

  questions: TaskFeedbackQuestion[];

  feedbacks: TaskFeedbackItem[];
}

// 서버 응답 타입
export interface TaskFeedbackResponse {
  taskId: number;
  subject: "KOREAN" | "ENGLISH" | "MATH" | "RESOURCE" | string;
  taskName: string;
  mentorName: string;
  generalComment: string;
  proofShots: TaskFeedbackProofShot[];
}

export interface TaskFeedbackDetailData {
  taskId: number;
  subjectKey: string;
  subjectLabel: string;
  todoTitle: string;

  overallMentorName: string;
  overallComment: string;

  proofShots: Array<{
    proofShotId: number;
    imageFileId: any;
    questions: TaskFeedbackQuestion[];
    feedbacks: TaskFeedbackItem[];
  }>;
}

const subjectLabelMap: Record<string, string> = {
  KOREAN: "국어",
  ENGLISH: "영어",
  MATH: "수학",
  RESOURCE: "자료",
};

const transformTaskFeedbackData = (
  data: TaskFeedbackResponse,
): TaskFeedbackDetailData => {
  return {
    taskId: data.taskId,
    subjectKey: data.subject,
    subjectLabel: subjectLabelMap[data.subject] || data.subject,
    todoTitle: data.taskName,

    overallMentorName: data.mentorName || "멘토",
    overallComment: data.generalComment ?? "",

    proofShots: (data.proofShots || []).map((ps) => ({
      proofShotId: ps.proofShotId,
      imageFileId: ps.imageFileId,
      questions: ps.questions || [],
      feedbacks: ps.feedbacks || [],
    })),
  };
};

// 피드백 상세 조회 API 함수
// export const fetchTaskFeedbackDetail = async (
//   taskId: number,
// ): Promise<TaskFeedbackDetailData> => {
//   try {
//     const { data } = await axiosInstance.get<TaskFeedbackResponse>(
//       `/tasks/${taskId}/feedback`,
//     );
//     return transformTaskFeedbackData(data);
//   } catch (error) {
//     console.error("피드백 상세 조회 실패:", error);
//     throw error;
//   }
// };

// 임시 데이터 버전
export const fetchTaskFeedbackDetail = async (
  taskId: number,
): Promise<TaskFeedbackDetailData> => {
  const useMock = import.meta.env.VITE_USE_MOCK_FEEDBACK === "true";

  if (useMock) {
    return mockFetchTaskFeedbackDetail(taskId);
  }

  try {
    const { data } = await axiosInstance.get<TaskFeedbackResponse>(
      `/tasks/${taskId}/feedback`,
    );
    return transformTaskFeedbackData(data);
  } catch (error) {
    console.error("피드백 상세 조회 실패:", error);
    throw error;
  }
};

// =============================================================================
// [SECTION X] 할 일 추가 (멘토용)
// Method: POST
// Endpoint: /tasks/mentor
// =============================================================================

export interface CreateMentorTaskRequest {
  menteeId: number;
  subject: "KOREAN" | "ENGLISH" | "MATH" | "RESOURCE" | string;

  dates: string[];

  taskNames: string[];
  goalMinutes: number;

  worksheets?: Array<{ fileId: number }>;
  columnLinks?: Array<{ link: string }>;
}

export const createTasksByMentor = async (
  payload: CreateMentorTaskRequest,
): Promise<DailyTask[]> => {
  try {
    const { data } = await axiosInstance.post<DailyTask[]>(
      "/tasks/mentor",
      payload,
    );
    return data;
  } catch (error) {
    console.error("멘토 할 일 추가 실패:", error);
    throw error;
  }
};
