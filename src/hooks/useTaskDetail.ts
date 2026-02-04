import { useState, useEffect, useCallback } from "react";
import { fetchTaskDetail } from "../api/task";
import type { TaskDetailData } from "../components/mentee/TaskDetailContent";

export interface UseTaskDetailReturn {
  data: TaskDetailData | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  setData: React.Dispatch<React.SetStateAction<TaskDetailData | null>>; // 정확한 타입
}

export const useTaskDetail = (taskId: number | null): UseTaskDetailReturn => {
  const [data, setData] = useState<TaskDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // 데이터 가져오기 함수 (재사용 가능하도록 분리)
  const loadData = useCallback(async () => {
    if (!taskId) return;

    setIsLoading(true);
    try {
      const result = await fetchTaskDetail(taskId);
      setData(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [taskId]);

  // taskId가 바뀌면 자동으로 호출
  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    data, // 변환된 데이터
    isLoading, // 로딩 중 여부
    error, // 에러 객체
    refetch: loadData, // 필요할 때(예: 수정 후) 다시 불러오는 함수
    setData, // 낙관적 업데이트 등을 위해 직접 수정 필요할 때 사용
  };
};
