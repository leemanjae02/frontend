import { useEffect, useState } from "react";
import styled from "styled-components";
import { typography } from "../../styles/typography";
import Input from "../Input";
import Button from "../Button";
import { createPortal } from "react-dom";

interface TaskCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (time: number) => void;
  title: string;
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;

  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);

  display: flex;
  align-items: center;
  justify-content: center;

  z-index: 1000;
`;

const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  background-color: var(--color-white);
  border-radius: 12px;
  padding: 16px;
  width: 343px;
  max-height: 201px;
  box-sizing: border-box;
`;

const Title = styled.p`
  ${typography.t16sb}
  color: var(--color-black);
  margin: 0;
  text-align: left;
`;

const SubText = styled.p`
  ${typography.t12r}
  color: var(--color-gray-500);
  margin: 0;
  text-align: left;
`;

const HeaderGroup = styled.div``;

const InputContainer = styled.div``;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
`;

const ButtonItem = styled.div`
  flex: 1;
`;

const TaskCompletionModal = ({
  isOpen,
  onClose,
  onSave,
  title,
}: TaskCompletionModalProps) => {
  const [duration, setDuration] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    setDuration("");
  }, [isOpen]);

  const safeClose = () => {
    setDuration("");
    onClose();
  };

  const handleOverlayClick = () => {
    safeClose();
  };
  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleSave = () => {
    const time = parseInt(duration, 10);
    if (Number.isFinite(time) && time > 0) {
      onSave(time);
      safeClose();
    }
  };

  const handleCancel = () => {
    safeClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d+$/.test(value)) {
      setDuration(value);
    }
  };

  const isSaveDisabled = !duration || parseInt(duration, 10) <= 0;

  if (!isOpen) return null;

  return createPortal(
    <Overlay onClick={handleOverlayClick}>
      <ModalContainer onClick={handleModalClick}>
        <HeaderGroup>
          <Title>{title}</Title>
          <SubText>수행하는 데 걸린 시간을 입력해주세요. (분)</SubText>
        </HeaderGroup>

        <InputContainer>
          <Input
            type="text"
            inputMode="numeric"
            placeholder="시간 입력"
            value={duration}
            onChange={handleInputChange}
          />
        </InputContainer>

        <ButtonGroup>
          <ButtonItem>
            <Button variant="secondary" onClick={handleCancel}>
              취소
            </Button>
          </ButtonItem>
          <ButtonItem>
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={isSaveDisabled}
            >
              저장
            </Button>
          </ButtonItem>
        </ButtonGroup>
      </ModalContainer>
    </Overlay>,
    document.body,
  );
};

export default TaskCompletionModal;
