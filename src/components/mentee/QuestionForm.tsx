import { useState } from "react";
import styled from "styled-components";
import { typography } from "../../styles/typography";
import Textarea from "../Textarea";
import Button from "../Button";
import BottomSheet from "./BottomSheet";

interface QuestionFormProps {
  isOpen: boolean;
  initialContent?: string;
  onSubmit: (content: string) => void;
  onDelete?: () => void;
  onClose: () => void;
}

interface QuestionFormContentProps {
  initialContent?: string;
  onSubmit: (content: string) => void;
  onDelete?: () => void;
}

const Title = styled.h2`
  ${typography.t18sb}
  color: var(--color-black);
  margin: 0 0 16px 0;
  text-align: left;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 16px;
`;

const DeleteButton = styled(Button)`
  flex: 3;
`;

const SubmitButton = styled(Button)<{ $isEditMode: boolean }>`
  flex: ${({ $isEditMode }) => ($isEditMode ? 7 : 1)};
`;

const QuestionFormContent = ({
  initialContent,
  onSubmit,
  onDelete,
}: QuestionFormContentProps) => {
  const [content, setContent] = useState(initialContent ?? "");
  const isEditMode = initialContent !== undefined;

  const handleSubmit = () => {
    if (content.trim()) {
      onSubmit(content);
    }
  };

  const handleDelete = () => {
    onDelete?.();
  };

  return (
    <>
      <Title>질문 남기기</Title>
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="멘토에게 질문을 남겨주세요"
        maxLength={500}
        showCount
        countPosition="bottom"
      />
      <ButtonGroup>
        {isEditMode && (
          <DeleteButton variant="secondary" onClick={handleDelete}>
            삭제
          </DeleteButton>
        )}
        <SubmitButton
          variant="primary"
          $isEditMode={isEditMode}
          onClick={handleSubmit}
          disabled={!content.trim()}
        >
          등록
        </SubmitButton>
      </ButtonGroup>
    </>
  );
};

const QuestionForm = ({
  isOpen,
  initialContent,
  onSubmit,
  onDelete,
  onClose,
}: QuestionFormProps) => {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      {isOpen && (
        <QuestionFormContent
          initialContent={initialContent}
          onSubmit={onSubmit}
          onDelete={onDelete}
        />
      )}
    </BottomSheet>
  );
};

export default QuestionForm;
