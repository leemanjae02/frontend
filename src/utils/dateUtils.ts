export const dateUtils = {
  /**
   * API 요청용 날짜 포맷 (YYYY-MM-DD)
   */
  formatToAPIDate: (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  },

  /**
   * 헤더용 날짜 포맷 (YYYY년 M월 D일)
   */
  formatHeaderDate: (date: Date): string => {
    return `${date.getFullYear()}년 ${
      date.getMonth() + 1
    }월 ${date.getDate()}일`;
  },

  /**
   * 두 날짜가 같은 날인지 비교 (년, 월, 일)
   */
  isSameDay: (d1: Date, d2: Date): boolean => {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  },

  /**
   * 특정 날짜가 속한 주의 시작일(월요일) 구하기
   */
  getStartOfWeek: (date: Date): Date => {
    const d = new Date(date);
    const day = d.getDay(); // 0(일) ~ 6(토)
    // 월요일(1)을 기준으로 보정 (일요일이면 -6, 그 외에는 1을 뺌)
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  },

  /**
   * 주간 데이터 생성 (7일 배열)
   */
  getWeekDays: (currentDate: Date): Date[] => {
    const startOfWeek = dateUtils.getStartOfWeek(currentDate);
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      return d;
    });
  },

  /**
   * 월간 데이터 생성 (해당 월의 모든 날짜 + 앞뒤 패딩, 총 42일)
   */
  getMonthDays: (currentDate: Date): Date[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // 해당 월의 1일
    const firstDayOfMonth = new Date(year, month, 1);
    // 달력 시작일 (첫 주의 월요일 찾기)
    const startCalendar = dateUtils.getStartOfWeek(firstDayOfMonth);

    return Array.from({ length: 42 }).map((_, i) => {
      const d = new Date(startCalendar);
      d.setDate(startCalendar.getDate() + i);
      return d;
    });
  },

  addDays: (date: Date, amount: number): Date => {
    const d = new Date(date);
    d.setDate(d.getDate() + amount);
    return d;
  },

  addMonths: (date: Date, amount: number): Date => {
    const d = new Date(date);
    d.setMonth(d.getMonth() + amount);
    return d;
  },
};
