// hooks/useFileUpload.ts
import { useState, useCallback } from "react";
import { uploadFile } from "../api/file";
import type { FileUploadResponse } from "../api/file";

interface UseFileUploadOptions {
  onSuccess?: (response: FileUploadResponse) => void;
  onError?: (error: unknown) => void;
}

export const useFileUpload = (options?: UseFileUploadOptions) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  // 파일 업로드 함수 (UI에서 직접 호출 가능)
  const upload = useCallback(
    async (file: File, folderPath: string = "/images") => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await uploadFile(file, folderPath);

        // 성공 콜백 실행
        if (options?.onSuccess) {
          options.onSuccess(response);
        }
        return response;
      } catch (err) {
        setError(err);
        // 에러 콜백 실행
        if (options?.onError) {
          options.onError(err);
        } else {
          // TODO: 에러 처리 (디자인 시안 나오면 커스텀 모달로 교체)
        }
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [options]
  );

  /**
   * input의 onChange 이벤트 핸들러용 헬퍼 함수
   * <input type="file" onChange={handleFileChange} /> 형태로 바로 쓸 수 있게 제공
   */
  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>, folderPath?: string) => {
      const file = e.target.files?.[0];
      if (!file) return;

      await upload(file, folderPath);

      // 같은 파일 재선택 가능하게 value 초기화
      e.target.value = "";
    },
    [upload]
  );

  return {
    upload, // 직접 파일을 넘겨서 업로드할 때 (Drag & Drop 등)
    handleFileChange, // Input Change 이벤트에 연결할 때
    isLoading, // 로딩 상태
    error, // 에러 객체
  };
};
