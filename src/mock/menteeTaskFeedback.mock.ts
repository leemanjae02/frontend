// import type { TaskFeedbackDetailData } from "../api/task";

// export const mockFetchTaskFeedbackDetail = async (
//   taskId: number,
// ): Promise<TaskFeedbackDetailData> => {
//   const photos = [
//     "https://picsum.photos/id/1015/900/1200",
//     "https://picsum.photos/id/1025/900/1200",
//     "https://picsum.photos/id/1035/900/1200",
//     "https://picsum.photos/id/1045/900/1200",
//   ];

//   return {
//     taskId,
//     subjectKey: "KOREAN",
//     subjectLabel: "국어",
//     todoTitle: "문학 비문학 3개 풀기",

//     overallMentorName: "윤서영",
//     overallComment:
//       "전체적으로 풀이 방향이 좋아요. 다만 2번 문제는 근거 문장을 더 명확히 잡아보면 좋아요.",

//     proofShots: [
//       {
//         proofShotId: 1,
//         imageFileId: photos[0],
//         questions: [
//           //   {
//           //     questionId: 11,
//           //     questionNumber: 1,
//           //     content: "1번 문제에서 선택지 ③을 고른 이유는?",
//           //     answer: "지문 마지막 문장이 결론처럼 보여서요.",
//           //     annotation: {
//           //       annotationId: 111,
//           //       annotationNumber: 1,
//           //       percentX: 28,
//           //       percentY: 35,
//           //     },
//           //   },
//         ],
//         feedbacks: [],
//       },

//       {
//         proofShotId: 2,
//         imageFileId: photos[1],
//         questions: [
//           {
//             questionId: 12,
//             questionNumber: 2,
//             content: "2번 문제에서 핵심 근거 문장을 표시해보자.",
//             answer: null,
//             annotation: {
//               annotationId: 112,
//               annotationNumber: 2,
//               percentX: 62,
//               percentY: 44,
//             },
//           },
//         ],
//         feedbacks: [
//           {
//             feedbackId: 21,
//             feedbackNumber: 1,
//             content:
//               "2번은 ‘따라서/그러므로’ 앞 문장이 근거인 경우가 많아요. 그 문장을 먼저 체크해보세요.",
//             starred: true,
//             registerStatus: "REGISTERED",
//             annotation: {
//               annotationId: 121,
//               annotationNumber: 1,
//               percentX: 70,
//               percentY: 52,
//             },
//           },
//           {
//             feedbackId: 23,
//             feedbackNumber: 2,
//             content:
//               "(임시저장) 이 피드백은 아직 REGISTERED가 아니므로 화면에 안 나와야 함",
//             starred: false,
//             registerStatus: "TEMPORARY",
//             annotation: {
//               annotationId: 123,
//               annotationNumber: 2,
//               percentX: 50,
//               percentY: 60,
//             },
//           },
//         ],
//         // questions: [],
//         // feedbacks: [],
//       },

//       {
//         proofShotId: 3,
//         imageFileId: photos[2],
//         questions: [],
//         feedbacks: [
//           {
//             feedbackId: 31,
//             feedbackNumber: 3,
//             content: "근거 문장 인용이 들어가면 답안 설득력이 훨씬 좋아져요.",
//             starred: false,
//             registerStatus: "REGISTERED",
//             annotation: {
//               annotationId: 131,
//               annotationNumber: 3,
//               percentX: 30,
//               percentY: 25,
//             },
//           },
//         ],
//       },

//       {
//         proofShotId: 4,
//         imageFileId: photos[3],
//         questions: [
//           //   {
//           //     questionId: 41,
//           //     questionNumber: 4,
//           //     content: "이 문장과 아래 문장을 연결하는 근거는 무엇인가요?",
//           //     answer: "앞 문장이 조건을 제시하고, 뒷 문장이 결과를 설명해요.",
//           //     annotation: {
//           //       annotationId: 141,
//           //       annotationNumber: 4,
//           //       percentX: 55,
//           //       percentY: 72,
//           //     },
//           //   },
//         ],
//         feedbacks: [],
//       },
//     ],
//   };
// };

import type { TaskFeedbackDetailData } from "../api/task";

export const mockFetchTaskFeedbackDetail = async (
  taskId: number,
): Promise<TaskFeedbackDetailData> => {
  return {
    taskId,
    subjectKey: "KOREAN",
    subjectLabel: "국어",
    todoTitle: "문학 비문학 3개 풀기",

    overallMentorName: "윤서영",
    overallComment: "사진 안올리고 땡이니 너 안되겠다.",

    proofShots: [],
  };
};
