import { useState, useCallback } from "react";
import { downloadFile } from "../api/file";

export const useFileDownload = () => {
  const [isDownloading, setIsDownloading] = useState(false);

  const download = useCallback(async (fileId: number, fileName: string) => {
    setIsDownloading(true);
    try {
      await downloadFile(fileId, fileName);
    } catch (error) {
      console.error(error);
      // TODO: 에러 처리 (디자인 시안 나오면 커스텀 모달로 교체)
    } finally {
      setIsDownloading(false);
    }
  }, []);

  return {
    download,
    isDownloading,
  };
};
