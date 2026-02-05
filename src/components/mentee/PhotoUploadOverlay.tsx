import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import { typography } from "../../styles/typography";

import CameraIcon from "../../assets/images/icon/camera.svg?react";
import TrashIcon from "../../assets/images/icon/delete-1.svg?react";
import ButtonSmall from "../ButtonSmall";

import TodoDetailHeader from "./TodoDetailHeader";
import type { SubjectKey } from "../SubjectSelectButton";

interface PhotoUploadOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  initialImages: string[];
  onSave: (finalImages: string[]) => void;
  subject: string;
  title: string;
}

const Container = styled.div<{ $isOpen: boolean }>`
  position: absolute;
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
`;

const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: white;
  /* 필요하다면 여기에 z-index나 그림자 등을 추가하여 컨텐츠 위로 뜨는 느낌을 줄 수 있습니다. */
`;

// 2. 메인 컨텐츠 영역
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
  padding: 16px;
  /* TodoDetailHeader 아래에 위치하므로 배경색 명시 */
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
`;

const CarouselContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  padding-bottom: 40px;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const ImageSlide = styled.div`
  flex: 0 0 100%;
  width: 100%;
  height: 80%;
  display: flex;
  justify-content: center;
  align-items: center;
  scroll-snap-align: center;
  padding: 0 20px;
  box-sizing: border-box;
`;

const PreviewImg = styled.img`
  max-width: 100%;
  max-height: 100%;
  border-radius: 12px;
  object-fit: contain;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
`;

const Indicators = styled.div`
  position: absolute;
  bottom: 24px;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 8px;
`;

const Dot = styled.div<{ $active: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${({ $active }) => ($active ? "#00C471" : "#E0E0E0")};
  transition: all 0.2s;
`;

// 3. 하단 푸터 영역
const Footer = styled.div`
  padding: 16px 24px;
  padding-bottom: calc(16px + env(safe-area-inset-bottom));
  background-color: white;
  display: flex;
  gap: 12px;
`;

const DeleteButton = styled.button`
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: white;
  cursor: pointer;
`;

const SaveButton = styled.button<{ $active: boolean }>`
  flex: 1;
  height: 52px;
  border-radius: 8px;
  background-color: ${({ $active }) => ($active ? "#00C471" : "#E0E0E0")};
  color: white;
  ${typography.t16sb}
  border: none;
  cursor: ${({ $active }) => ($active ? "pointer" : "default")};
`;

const PhotoUploadOverlay: React.FC<PhotoUploadOverlayProps> = ({
  isOpen,
  onClose,
  initialImages,
  onSave,
  subject,
  title,
}) => {
  const [images, setImages] = useState<string[]>(initialImages);
  const [currentIndex, setCurrentIndex] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  const MAX_IMAGES = 10;
  const hasImages = images.length > 0;

  useEffect(() => {
    if (isOpen) {
      setImages(initialImages);
      setCurrentIndex(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      const remainingSlots = MAX_IMAGES - images.length;

      if (newFiles.length > remainingSlots) {
        // TODO: 최대 업로드 개수 초과 알림
        return;
      }

      const newUrls = newFiles.map((file) => URL.createObjectURL(file));
      setImages((prev) => [...prev, ...newUrls]);

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

  const handleScroll = () => {
    if (carouselRef.current) {
      const scrollLeft = carouselRef.current.scrollLeft;
      const width = carouselRef.current.offsetWidth;
      const newIndex = Math.round(scrollLeft / width);
      setCurrentIndex(newIndex);
    }
  };

  const handleDelete = () => {
    if (!hasImages) return;
    const nextImages = images.filter((_, idx) => idx !== currentIndex);
    setImages(nextImages);
    if (currentIndex >= nextImages.length) {
      setCurrentIndex(Math.max(0, nextImages.length - 1));
    }
  };

  const handleSave = () => {
    if (!hasImages) return;
    onSave(images);
    onClose();
  };
  console.log(subject);

  return (
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
              ({images.length}/{MAX_IMAGES})
            </span>
          </CounterText>
          <ButtonSmall
            onClick={() => fileInputRef.current?.click()}
            disabled={images.length >= MAX_IMAGES}
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
            <CarouselContainer ref={carouselRef} onScroll={handleScroll}>
              {images.map((src, idx) => (
                <ImageSlide key={idx}>
                  <PreviewImg src={src} alt={`인증사진-${idx}`} />
                </ImageSlide>
              ))}
            </CarouselContainer>
            <Indicators>
              {images.map((_, idx) => (
                <Dot key={idx} $active={idx === currentIndex} />
              ))}
            </Indicators>
          </>
        )}
      </Content>

      <Footer>
        {hasImages && (
          <DeleteButton onClick={handleDelete}>
            <TrashIcon width={24} height={24} />
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
    </Container>
  );
};

export default PhotoUploadOverlay;
