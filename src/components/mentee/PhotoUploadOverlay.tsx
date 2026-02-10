import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import { typography } from "../../styles/typography";

import CameraIcon from "../../assets/images/icon/camera.svg?react";
import TrashIcon from "../../assets/images/icon/delete-1.svg?react";
import DangerIcon from "../../assets/images/icon/info.svg?react";
import ButtonSmall from "../ButtonSmall";
import TodoDetailHeader from "./TodoDetailHeader";
import QuestionForm from "./QuestionForm";
import type { QuestionMarker } from "../../api/file";
import type { SubjectKey } from "../SubjectAddButton";

import Indicator from "./Indicator";
import NumberBadge from "../NumberBadge";
import { createPortal } from "react-dom";

// 이미지별 마커 데이터 타입
export interface ImageMarkerData {
  imageUrl: string;
  file: File;
  fileId?: number; // 업로드 후 서버에서 받은 ID
  markers: QuestionMarker[];
}

interface PhotoUploadOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  initialImages: string[];
  initialFiles?: File[];
  onSave: (
    finalImages: string[],
    files: File[],
    markersData: ImageMarkerData[]
  ) => void;
  subject: string;
  title: string;
}

const Container = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: white;
  z-index: 9999;
  display: flex;
  flex-direction: column;

  transform: ${({ $isOpen }) =>
    $isOpen ? "translateY(0)" : "translateY(100%)"};
  transition: transform 0.3s cubic-bezier(0.25, 1, 0.5, 1);

  pointer-events: ${({ $isOpen }) => ($isOpen ? "auto" : "none")};
`;

const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: white;
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  overflow: hidden;
  position: relative;
`;

const ContentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  background-color: white;
`;

const CounterText = styled.div`
  ${typography.t16sb}
  color: var(--color-black);

  span {
    color: var(--color-gray-500);
    font-weight: 400;
  }
`;

const HelpText = styled.p`
  ${typography.t12r}
  color: var(--color-gray-500);
  text-align: center;
  margin: 0;
  padding: 8px 16px;
`;

const EmptyState = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: var(--color-gray-500);
  ${typography.t14r}
  margin-bottom: 60px;
  & > div:nth-child(1) {
    color: var(--color-black);
    ${typography.t16m}
  }
`;

const CarouselContainer = styled.div<{ $isDragging: boolean }>`
  flex: 1;
  display: flex;
  align-items: center;
  overflow-x: auto;
  scroll-snap-type: ${({ $isDragging }) =>
    $isDragging ? "none" : "x mandatory"};

  &::-webkit-scrollbar {
    display: none;
  }

  cursor: ${({ $isDragging }) => ($isDragging ? "grabbing" : "grab")};
`;

const ImageSlide = styled.div`
  flex: 0 0 100%;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  scroll-snap-align: center;
  box-sizing: border-box;
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PreviewImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  user-select: none;
  -webkit-user-drag: none;
`;

const StyledIndicatorWrapper = styled.div`
  position: absolute;
  bottom: 24px;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
`;

const MarkerSpot = styled.div<{ $x: number; $y: number }>`
  position: absolute;
  left: ${({ $x }) => $x}%;
  top: ${({ $y }) => $y}%;
  transform: translate(-50%, -50%);
  z-index: 10;
`;

const StyledTrashIcon = styled(TrashIcon)`
  path {
    stroke: var(--color-primary-500);
  }
`;

const StyledDangerIcon = styled(DangerIcon)`
  path {
    stroke: var(--color-error);
  }
`;

const Footer = styled.div`
  padding: 16px 24px;
  padding-bottom: calc(16px + env(safe-area-inset-bottom));
  background-color: white;
  display: flex;
  gap: 12px;
  position: relative; /* 경고창 위치 기준점 */
`;

const DeleteButton = styled.button`
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--color-primary-50);
  border-radius: 4px;
  background-color: var(--color-primary-50);
  cursor: pointer;
`;

const SaveButton = styled.button<{ $active: boolean }>`
  flex: 1;
  height: 52px;
  border-radius: 4px;
  background-color: ${({ $active }) =>
    $active ? "var(--color-primary-500)" : "var(--color-gray-200)"};
  color: ${({ $active }) =>
    $active ? "var(--color-white)" : "var(--color-gray-300)"};
  ${typography.t16sb}
  border: none;
  cursor: ${({ $active }) => ($active ? "pointer" : "default")};
`;

const WarningToast = styled.div`
  position: absolute;
  bottom: calc(100% + 12px); /* Footer 바로 위 12px 간격 */
  left: 24px;
  right: 24px;
  padding: 12px 16px;
  background-color: #fce8e8; /* 붉은 배경 */
  border-radius: 8px;

  display: flex;
  align-items: center;
  gap: 8px;

  /* 텍스트 스타일 */
  span {
    color: var(--color-error); /* 붉은 글씨 */
    ${typography.t14r}
  }

  z-index: 10;
`;

const PhotoUploadOverlay: React.FC<PhotoUploadOverlayProps> = ({
  isOpen,
  onClose,
  initialImages,
  initialFiles = [],
  onSave,
  subject,
  title,
}) => {
  const [imageData, setImageData] = useState<ImageMarkerData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // 질문 입력 팝업 상태
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [pendingPosition, setPendingPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [editingMarkerIndex, setEditingMarkerIndex] = useState<number | null>(
    null
  );

  // 제한 초과 경고 표시 상태
  const [showLimitWarning, setShowLimitWarning] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  // 드래그 관련 상태 및 Refs
  const [isDragging, setIsDragging] = useState(false);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const dragStartPos = useRef({ x: 0, y: 0 }); // 클릭 vs 드래그 구분용

  const MAX_IMAGES = 10;
  const hasImages = imageData.length > 0;

  // 초기화
  useEffect(() => {
    if (isOpen) {
      const initialData: ImageMarkerData[] = initialImages.map((url, idx) => ({
        imageUrl: url,
        file: initialFiles[idx],
        markers: [],
      }));
      setImageData(initialData);
      setCurrentIndex(0);
      setIsPopupOpen(false);
      setPendingPosition(null);
      setEditingMarkerIndex(null);
      setShowLimitWarning(false); // 초기화 시 경고 숨김
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // 파일 선택 처리
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // 새로운 파일을 선택하려고 할 때 우선 경고창을 끕니다.
      setShowLimitWarning(false);

      const newFiles = Array.from(e.target.files);
      const remainingSlots = MAX_IMAGES - imageData.length;

      // 10장 초과 시 경고창 활성화
      if (newFiles.length > remainingSlots) {
        setShowLimitWarning(true);
        e.target.value = "";
        return;
      }

      const newData: ImageMarkerData[] = newFiles.map((file) => ({
        imageUrl: URL.createObjectURL(file),
        file,
        markers: [],
      }));

      setImageData((prev) => [...prev, ...newData]);

      setTimeout(() => {
        if (carouselRef.current) {
          carouselRef.current.scrollTo({
            left: carouselRef.current.scrollWidth,
            behavior: "smooth",
          });
        }
      }, 100);

      e.target.value = "";
    }
  };

  // 캐러셀 스크롤 처리
  const handleScroll = () => {
    // 드래그 중에는 인덱스 업데이트를 건너뛰어 성능 최적화 (선택 사항)
    if (carouselRef.current) {
      const scrollLeftVal = carouselRef.current.scrollLeft;
      const width = carouselRef.current.offsetWidth;
      const newIndex = Math.round(scrollLeftVal / width);
      setCurrentIndex(newIndex);
    }
  };

  // 드래그 이벤트 핸들러
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    isDown.current = true;
    setIsDragging(true); // 스냅 해제 및 커서 변경
    if (carouselRef.current) {
      startX.current = e.pageX - carouselRef.current.offsetLeft;
      scrollLeft.current = carouselRef.current.scrollLeft;
      dragStartPos.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleMouseLeave = () => {
    isDown.current = false;
    setIsDragging(false); // 스냅 복구
  };

  const handleMouseUp = () => {
    isDown.current = false;
    setIsDragging(false); // 스냅 복구
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDown.current) return;
    e.preventDefault();
    if (carouselRef.current) {
      const x = e.pageX - carouselRef.current.offsetLeft;
      const walk = (x - startX.current) * 1.5; // 스크롤 속도 조절
      carouselRef.current.scrollLeft = scrollLeft.current - walk;
    }
  };

  // 이미지 삭제
  const handleDelete = () => {
    if (!hasImages) return;
    const nextData = imageData.filter((_, idx) => idx !== currentIndex);
    setImageData(nextData);
    if (currentIndex >= nextData.length) {
      setCurrentIndex(Math.max(0, nextData.length - 1));
    }

    // 삭제해서 공간이 생기면 경고창도 닫아주는 것이 자연스러움 (선택 사항)
    setShowLimitWarning(false);
  };

  const handleIndicatorChange = (index: number) => {
    if (carouselRef.current) {
      const width = carouselRef.current.offsetWidth;
      carouselRef.current.scrollTo({
        left: width * index,
        behavior: "smooth",
      });
    }
  };

  // 이미지 클릭 - 마커 위치 지정
  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    // 드래그 여부 확인 (5px 이상 움직였으면 클릭 무시)
    const dist = Math.sqrt(
      Math.pow(e.clientX - dragStartPos.current.x, 2) +
        Math.pow(e.clientY - dragStartPos.current.y, 2)
    );
    if (dist > 5) return;

    const img = e.currentTarget;
    const rect = img.getBoundingClientRect();
    const percentX = ((e.clientX - rect.left) / rect.width) * 100;
    const percentY = ((e.clientY - rect.top) / rect.height) * 100;

    if (percentX < 0 || percentX > 100 || percentY < 0 || percentY > 100)
      return;

    setPendingPosition({ x: percentX, y: percentY });
    setIsPopupOpen(true);
  };

  // 질문 등록/수정
  const handleQuestionSubmit = (content: string) => {
    if (editingMarkerIndex !== null) {
      setImageData((prev) =>
        prev.map((data, idx) =>
          idx === currentIndex
            ? {
                ...data,
                markers: data.markers.map((marker, mIdx) =>
                  mIdx === editingMarkerIndex ? { ...marker, content } : marker
                ),
              }
            : data
        )
      );
    } else if (pendingPosition) {
      const newMarker: QuestionMarker = {
        content,
        percentX: pendingPosition.x,
        percentY: pendingPosition.y,
      };
      setImageData((prev) =>
        prev.map((data, idx) =>
          idx === currentIndex
            ? { ...data, markers: [...data.markers, newMarker] }
            : data
        )
      );
    }

    setIsPopupOpen(false);
    setPendingPosition(null);
    setEditingMarkerIndex(null);
  };

  const handleMarkerClick = (markerIndex: number) => {
    setEditingMarkerIndex(markerIndex);
    setIsPopupOpen(true);
  };

  const handleMarkerDelete = () => {
    if (editingMarkerIndex === null) return;
    setImageData((prev) =>
      prev.map((data, idx) =>
        idx === currentIndex
          ? {
              ...data,
              markers: data.markers.filter(
                (_, mIdx) => mIdx !== editingMarkerIndex
              ),
            }
          : data
      )
    );
    setIsPopupOpen(false);
    setEditingMarkerIndex(null);
  };

  const handleSave = () => {
    if (!hasImages) return;
    const images = imageData.map((d) => d.imageUrl);
    const files = imageData.map((d) => d.file);
    onSave(images, files, imageData);
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <Container $isOpen={isOpen}>
      <HeaderWrapper>
        <TodoDetailHeader
          title={title}
          subject={subject as SubjectKey}
          onClickBack={onClose}
        />
        <ContentHeader>
          <CounterText>
            공부 인증 사진
            <span>
              ({imageData.length}/{MAX_IMAGES})
            </span>
          </CounterText>
          <ButtonSmall
            onClick={() => fileInputRef.current?.click?.()}
            disabled={imageData.length >= MAX_IMAGES}
            icon={<CameraIcon />}
          >
            사진 추가
          </ButtonSmall>
        </ContentHeader>
      </HeaderWrapper>

      <Content>
        {!hasImages ? (
          <EmptyState>
            <div>아직 업로드된 사진이 없어요.</div>
            <div>카메라로 과제 수행 결과를 찍어 올려주세요</div>
          </EmptyState>
        ) : (
          <>
            <HelpText>사진을 클릭하여 질문을 등록할 수 있어요</HelpText>
            <CarouselContainer
              ref={carouselRef}
              $isDragging={isDragging}
              onScroll={handleScroll}
              onMouseDown={handleMouseDown}
              onMouseLeave={handleMouseLeave}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
            >
              {imageData.map((data, idx) => (
                <ImageSlide key={idx}>
                  <ImageWrapper>
                    <PreviewImg
                      src={data.imageUrl}
                      alt={`인증사진-${idx}`}
                      onClick={(e) => {
                        if (idx === currentIndex) handleImageClick(e);
                      }}
                      style={{
                        cursor: idx === currentIndex ? "crosshair" : "default",
                      }}
                    />
                    {idx === currentIndex &&
                      data.markers.map((marker, mIdx) => (
                        <MarkerSpot
                          key={mIdx}
                          $x={marker.percentX}
                          $y={marker.percentY}
                        >
                          <NumberBadge
                            value={mIdx + 1}
                            variant="question"
                            onClick={() => handleMarkerClick(mIdx)}
                          />
                        </MarkerSpot>
                      ))}
                  </ImageWrapper>
                </ImageSlide>
              ))}
            </CarouselContainer>
            <StyledIndicatorWrapper>
              <Indicator
                count={imageData.length}
                activeIndex={currentIndex}
                onChange={handleIndicatorChange}
              />
            </StyledIndicatorWrapper>
          </>
        )}
      </Content>

      <Footer>
        {showLimitWarning && (
          <WarningToast>
            <StyledDangerIcon />
            <span>사진은 한 번에 10장까지 추가할 수 있어요.</span>
          </WarningToast>
        )}

        {hasImages && (
          <DeleteButton onClick={handleDelete}>
            <StyledTrashIcon width={24} height={24} />
          </DeleteButton>
        )}

        <SaveButton
          $active={hasImages}
          onClick={handleSave}
          disabled={!hasImages}
        >
          저장하기
        </SaveButton>
      </Footer>

      <input
        type="file"
        multiple
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileSelect}
      />

      <QuestionForm
        isOpen={isPopupOpen}
        onSubmit={handleQuestionSubmit}
        onClose={() => {
          setIsPopupOpen(false);
          setPendingPosition(null);
          setEditingMarkerIndex(null);
        }}
        initialContent={
          editingMarkerIndex !== null
            ? imageData[currentIndex]?.markers[editingMarkerIndex]?.content
            : undefined
        }
        onDelete={editingMarkerIndex !== null ? handleMarkerDelete : undefined}
      />
    </Container>,
    document.body,
  );
};

export default PhotoUploadOverlay;
