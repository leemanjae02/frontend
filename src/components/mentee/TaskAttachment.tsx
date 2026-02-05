import React, { useState } from "react";
import styled, { css } from "styled-components";
import CameraIcon from "../../assets/images/icon/camera.svg?react";
import ReportIcon from "../../assets/images/icon/report.svg?react";
import DownloadIcon from "../../assets/images/icon/download.svg?react";
import { typography } from "../../styles/typography";
import { downloadFile } from "../../api/file";

export type ResourceMode = "UPLOAD_PHOTO" | "VIEW_PDF" | "VIEW_LINK";

interface TaskAttachmentProps {
  mode: ResourceMode;
  title: string;
  url?: string;
  fileId?: number;
  // 오버레이를 여는 트리거 함수 (데이터 처리는 상위에서 함)
  onOpenUpload?: () => void;
}

const TaskAttachment: React.FC<TaskAttachmentProps> = ({
  mode,
  title,
  url,
  fileId,
  onOpenUpload,
}) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleClick = async () => {
    // A. 사진 업로드 모드 -> 부모에게 "열어줘!" 요청만 보냄
    if (mode === "UPLOAD_PHOTO") {
      if (onOpenUpload) onOpenUpload();
      return;
    }

    // B. PDF 다운로드 모드
    if (mode === "VIEW_PDF" && fileId) {
      if (isDownloading) return;
      try {
        setIsDownloading(true);
        await downloadFile(fileId, title);
      } catch (error) {
        console.error("다운로드 에러:", error);
        // TODO: 에러 처리 (디자인 시안 나오면 커스텀 모달로 교체)
      } finally {
        setIsDownloading(false);
      }
      return;
    }

    // C. 단순 링크 이동
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const getIcon = () => {
    switch (mode) {
      case "UPLOAD_PHOTO":
        return <CameraIcon />;
      case "VIEW_PDF":
        return <ReportIcon />;
      case "VIEW_LINK":
        return <ReportIcon />;
      default:
        return <DownloadIcon />;
    }
  };

  return (
    <Container $mode={mode} onClick={handleClick}>
      <LeftSection>
        <IconBox>{getIcon()}</IconBox>
        <Title>{isDownloading ? "다운로드 중..." : title}</Title>
      </LeftSection>

      {mode !== "UPLOAD_PHOTO" && (
        <ActionIcon>{mode === "VIEW_PDF" ? <DownloadIcon /> : null}</ActionIcon>
      )}
    </Container>
  );
};

// ... (스타일 컴포넌트 생략 - 기존 코드 그대로 사용) ...
const Container = styled.div<{ $mode: ResourceMode }>`
  width: 100%;
  min-height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  box-sizing: border-box;
  text-decoration: none;
  cursor: pointer;
  user-select: none;
  ${({ $mode }) => {
    switch ($mode) {
      case "UPLOAD_PHOTO":
        return css`
          background-color: rgba(55, 109, 255, 0.1);
          color: var(--color-black);
        `;
      default:
        return css`
          background-color: rgba(231, 231, 231, 0.5);
          color: var(--color-black);
        `;
    }
  }}
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  overflow: hidden;
`;

const IconBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background-color: var(--color-blue-500);
  font-size: 18px;
  flex-shrink: 0;
  & > svg path {
    stroke: white;
  }
`;

const Title = styled.span`
  ${typography.t14sb}
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ActionIcon = styled.div`
  color: var(--color-gray-400);
  font-size: 14px;
  display: flex;
  align-items: center;
`;

export default TaskAttachment;
