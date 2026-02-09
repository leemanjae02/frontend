import axios from "axios"; // S3 직접 다운로드용 (인터셉터 없는 순수 axios)
import axiosInstance from "./axiosInstance"; // 백엔드 API 호출용

// 1. API 응답 타입 정의
export interface FileUploadResponse {
  fileId: number;
  url: string;
  originalName: string;
  contentType: string;
}

// 다운로드 URL 조회 응답 타입 (Swagger 기준)
interface FileUrlResponse {
  fileId: number;
  url: string; // 실제 파일이 있는 주소 (S3 등)
}

/**
 * 파일 업로드 함수
 * @param file 업로드할 파일 객체
 * @param folderPath (선택) 저장될 폴더 경로 (기본값: '/images')
 */
export const uploadFile = async (
  file: File,
  folderPath: string = "/images",
): Promise<FileUploadResponse> => {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("folderPath", folderPath);

  try {
    const response = await axiosInstance.post<FileUploadResponse>(
      "/files",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error("File Upload Failed:", error);
    throw error;
  }
};

/**
 * [헬퍼 함수] URL을 이용해 실제 파일을 브라우저에 다운로드
 * - S3 등 외부 링크일 수 있으므로 axiosInstance 대신 기본 axios 사용
 */
export const downloadFileFromUrl = async (
  fileUrl: string,
  fileName: string,
): Promise<void> => {
  try {
    const response = await axios.get(fileUrl, {
      responseType: "blob", // 파일 데이터(Binary) 수신 설정 (필수)
    });

    // 1. Blob URL 생성
    const url = window.URL.createObjectURL(new Blob([response.data]));

    // 2. 가상 링크 생성 및 클릭
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();

    // 3. 뒷정리
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Blob Download Failed:", error);
    // CORS 등으로 Blob 다운로드 실패 시 최후의 수단: 새 탭으로 열기
    window.open(fileUrl, "_blank");
  }
};

/**
 * [메인] 파일 다운로드 함수
 * 1. 백엔드에 fileId를 보내 다운로드 URL을 요청
 * 2. 받아온 URL로 실제 파일 다운로드 실행
 */
export const downloadFile = async (
  fileId: number,
  fileName: string,
): Promise<void> => {
  try {
    // [Step 1] 서버에 다운로드 URL 요청 (GET /files?fileId=123)
    const { data } = await axiosInstance.get<FileUrlResponse>("/files", {
      params: { fileId }, // 쿼리 파라미터로 전송
    });

    if (!data.url) {
      throw new Error("서버로부터 파일 URL을 받아오지 못했습니다.");
    }

    // [Step 2] 받아온 URL로 실제 파일 다운로드 실행
    await downloadFileFromUrl(data.url, fileName);
  } catch (error) {
    console.error("Download Process Failed:", error);
    throw error;
  }
};

// =============================================================================
// 인증샷 + 질문 마커 저장 API
// =============================================================================

// 질문 마커 데이터 타입
export interface QuestionMarker {
  content: string; // 질문 내용
  percentX: number; // 이미지 내 가로 위치 백분율 (0~100)
  percentY: number; // 이미지 내 세로 위치 백분율 (0~100)
}

// 인증샷 데이터 타입
export interface ProofShotData {
  imageFileId: number; // 업로드된 이미지의 ID
  questions: QuestionMarker[];
}

// 요청 바디 타입
export interface SubmitProofShotsRequest {
  proofShots: ProofShotData[];
}

/**
 * 인증샷 및 질문 마커 저장
 * @param taskId 과제 ID
 * @param data 인증샷 + 질문 데이터
 */
export const submitProofShots = async (
  taskId: number,
  data: SubmitProofShotsRequest,
): Promise<void> => {
  try {
    await axiosInstance.put(`/tasks/${taskId}/submit`, data);
  } catch (error) {
    console.error("인증샷 저장 실패:", error);
    throw error;
  }
};

// url만 조회
export const getFileUrl = async (fileId: number): Promise<string> => {
  const { data } = await axiosInstance.get<FileUrlResponse>("/files", {
    params: { fileId },
  });

  if (!data?.url) {
    throw new Error("서버로부터 파일 URL을 받아오지 못했습니다.");
  }

  return data.url;
};
