import axiosInstance from "./axiosInstance";
import type { TaskDetailData } from "../components/mentee/TaskDetailContent";

// --- [1] 백엔드 응답 타입 (Swagger 기준) ---
interface TaskDetailsResponse {
  taskId: number;
  taskName: string;
  createdBy: "ROLE_MENTOR" | "ROLE_MENTEE";
  subject: string; // "KOREAN", "MATH" ...
  goalMinutes: number;
  actualMinutes: number;
  worksheets: Array<{
    fileId: number;
    fileName: string;
    fileContentType: string;
  }>;
  columnLinks: Array<{
    link: string;
  }>;
}

interface FeedbackResponse {
  answer: string | null;
  mentorName: string;
  generalComment: string;
}

// --- [2] 변환 함수 (Adapter) ---
const transformData = (
  details: TaskDetailsResponse,
  feedback: FeedbackResponse | null
): TaskDetailData => {
  // 과목 한글 매핑
  const subjectMap: Record<string, string> = {
    KOREAN: "국어",
    MATH: "수학",
    ENGLISH: "영어",
  };

  // 첨부파일 변환
  const pdfs = details.worksheets.map((f) => ({
    id: f.fileId,
    type: "PDF" as const,
    title: f.fileName,
    fileId: f.fileId,
  }));

  // 링크 변환
  const links = details.columnLinks.map((l, idx) => ({
    id: `link-${idx}`,
    type: "LINK" as const,
    title: l.link,
    url: l.link,
  }));

  return {
    title: details.taskName,
    subject: subjectMap[details.subject] || details.subject,
    targetTime: details.goalMinutes,
    actualTime: details.actualMinutes > 0 ? details.actualMinutes : undefined,
    isMentorAssigned: details.createdBy === "ROLE_MENTOR",
    attachments: [...pdfs, ...links],
    mentorFeedback: feedback?.generalComment
      ? {
          mentorName: feedback.mentorName,
          content: feedback.generalComment,
        }
      : undefined,
  };
};

// --- [3] API 호출 함수 (Service) ---
export const fetchTaskDetail = async (
  taskId: number
): Promise<TaskDetailData> => {
  try {
    // 두 API 동시에 호출 (병렬 처리)
    const [detailsRes, feedbackRes] = await Promise.all([
      axiosInstance.get<TaskDetailsResponse>(`/tasks/${taskId}/details`),
      axiosInstance
        .get<FeedbackResponse>(`/tasks/${taskId}/feedback`)
        .catch(() => ({ data: null })),
      // 피드백은 없을 수도 있으니 에러 시 null 처리 (또는 백엔드 응답에 따라 조정)
    ]);

    // 변환 후 반환
    return transformData(detailsRes.data, feedbackRes.data || null);
  } catch (error) {
    console.error("Task Detail Fetch Error:", error);
    throw error;
  }
};
