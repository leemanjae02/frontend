import type { MentorMenteeRow } from "../components/mentor/MenteeListTable";
import type { MentorResourceRow } from "../components/mentor/ResourceListTable";

interface MenteeInfoData {
  menteeId?: number | string;
  name: string;
  gradeLabel: string;
  subjects: string[];
}

export const mockMentorMenteeRows: MentorMenteeRow[] = [
  {
    menteeId: 1,
    name: "김태우",
    gradeLabel: "고등학교 2학년",
    subjectsLabel: "영어, 수학",
    recentStudyLabel: "2026-02-05 / 영단어 10개 외우기",
    status: "SUBMITTED",
  },
  {
    menteeId: 2,
    name: "이만재",
    gradeLabel: "고등학교 3학년",
    subjectsLabel: "국어, 영어, 수학",
    recentStudyLabel: "2026-02-01 / 평가원모의고사 풀이",
    status: "SUBMITTED",
  },
  {
    menteeId: 3,
    name: "김준",
    gradeLabel: "고등학교 3학년",
    subjectsLabel: "국어, 영어, 수학",
    recentStudyLabel: "2026-02-05 / RPM 3단원 오답노트",
    status: "NOT_SUBMITTED",
  },
  {
    menteeId: 4,
    name: "김다은",
    gradeLabel: "고등학교 1학년",
    subjectsLabel: "국어, 수학",
    recentStudyLabel: "2026-02-04 / 작품 분석 2편",
    status: "SUBMITTED",
  },
  {
    menteeId: 5,
    name: "이서영",
    gradeLabel: "고등학교 2학년",
    subjectsLabel: "국어, 영어",
    recentStudyLabel: "2026-02-04 / 시대인재 국어",
    status: "SUBMITTED",
  },
  {
    menteeId: 6,
    name: "주현지",
    gradeLabel: "고등학교 3학년",
    subjectsLabel: "영어",
    recentStudyLabel: "2026-02-05 / 9월 모의고사 오답노트",
    status: "SUBMITTED",
  },
];

export const toMenteeInfoData = (row: MentorMenteeRow): MenteeInfoData => ({
  menteeId: row.menteeId,
  name: row.name,
  gradeLabel: row.gradeLabel,
  subjects: row.subjectsLabel
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),
});

/** id로 멘티 row 찾기 */
export const getMockMenteeById = (menteeId: string | number) => {
  const idNum = Number(menteeId);
  return mockMentorMenteeRows.find((r) => Number(r.menteeId) === idNum) ?? null;
};

export const mockMentorResources: MentorResourceRow[] = [
  {
    resourceId: 1,
    title: "오답노트 양식",
    createdAtLabel: "2026.02.03",
    subjectLabel: "수학",
  },
  {
    resourceId: 2,
    title: "학습지 풀이과정 양식",
    createdAtLabel: "2026.02.03",
    subjectLabel: "수학",
  },
  {
    resourceId: 3,
    title: "영단어 시험지",
    createdAtLabel: "2026.02.03",
    subjectLabel: "영어",
  },
  {
    resourceId: 4,
    title: "영단어 시험지",
    createdAtLabel: "2026.02.03",
    subjectLabel: "영어",
  },
  {
    resourceId: 5,
    title: "영단어 시험지",
    createdAtLabel: "2026.02.03",
    subjectLabel: "영어",
  },
  {
    resourceId: 6,
    title: "영단어 시험지",
    createdAtLabel: "2026.02.03",
    subjectLabel: "영어",
  },
];

export type MentorResourceDetail = {
  resourceId: number | string;
  subjectLabel: string; // "국어" 등
  title: string; // 자료명
  resourceText: string; // 링크 or 파일명
  resourceHref?: string; // 링크면 넣기
};

export const mockMentorResourceDetails: MentorResourceDetail[] = [
  {
    resourceId: 1,
    subjectLabel: "수학",
    title: "오답노트 양식",
    resourceText: "오답노트_양식.pdf",
  },
  {
    resourceId: 2,
    subjectLabel: "국어",
    title: "학습지 풀이과정 양식",
    resourceText: "https://youtu.be/m9EX8hoPwaY?si=1p6VMMnyQHytzp0u",
    resourceHref: "https://youtu.be/m9EX8hoPwaY?si=1p6VMMnyQHytzp0u",
  },
  {
    resourceId: 3,
    subjectLabel: "영어",
    title: "영단어 시험지",
    resourceText: "영단어_시험지_01.pdf",
  },
  {
    resourceId: 4,
    subjectLabel: "영어",
    title: "영단어 시험지",
    resourceText: "영단어_시험지_02.pdf",
  },
  {
    resourceId: 5,
    subjectLabel: "영어",
    title: "영단어 시험지",
    resourceText: "https://example.com/vocab-test",
    resourceHref: "https://example.com/vocab-test",
  },
  {
    resourceId: 6,
    subjectLabel: "영어",
    title: "영단어 시험지",
    resourceText: "https://example.com/vocab-test-2",
    resourceHref: "https://example.com/vocab-test-2",
  },
];

export function getMockMentorResourceDetail(resourceId: number | string) {
  return (
    mockMentorResourceDetails.find(
      (r) => String(r.resourceId) === String(resourceId),
    ) ?? null
  );
}
