export const HIGH_SCHOOL_GRADE_LABELS = [
  "고등학교 1학년",
  "고등학교 2학년",
  "고등학교 3학년",
] as const;

export const getHighSchoolGradeLabel = (grade?: string | null): string => {
  if (!grade) return "-";

  const num = Number(grade);

  if (!Number.isInteger(num)) return "-";

  return HIGH_SCHOOL_GRADE_LABELS[num - 1] ?? "-";
};
