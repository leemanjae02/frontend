import type { PhotoFeedbackItem } from "./components/mentee/PhotoFeedback";

export const mockTodoFeedbackDetail = {
  todoTitle: "미적분 RPM 오답노트 작성",
  subject: "MATH" as const,
  overallMentorName: "이서영",
  photos: [
    "https://picsum.photos/700/900?1",
    "https://picsum.photos/700/900?2",
  ],
  badgesByPhoto: {
    0: [
      { id: 1, value: 1, variant: "feedback" as const, x: 0.52, y: 0.76 },
      { id: 2, value: 2, variant: "important" as const, x: 0.18, y: 0.63 },
    ],
  } as Record<number, any[]>,
  photoFeedbacks: [
    {
      photoNumber: 1,
      defaultOpen: true,
      items: [
        {
          index: 1,
          title: "중요한 피드백이에요. 꼭 읽고 학습에 적용해보세요.",
          detail: "정의를 먼저 정리하고 예제를 다시 풀어보자.",
        } satisfies PhotoFeedbackItem,
      ],
    },
  ],
};
