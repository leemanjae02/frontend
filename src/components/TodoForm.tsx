import { useState, useEffect } from "react";
import styled from "styled-components";
import Input from "./Input";
import Button from "./Button";
import { typography } from "../styles/typography";
import { fetchTaskDetail } from "../api/task";

export type TodoFormMode = "create" | "edit";

export interface TodoFormProps {
  mode: TodoFormMode;
  taskId?: number | null;
  onSubmit?: (data: { name: string; time: string }) => Promise<void> | void;
}

const Title = styled.h2`
  ${typography.t18sb}
  color: var(--color-gray-900);
  margin: 0 0 24px 0;
  text-align: left;
`;

const FormContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex: 1;
`;

const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const TodoForm = ({
  mode,
  taskId,
  onSubmit,
}: TodoFormProps) => {
  const [name, setName] = useState("");
  const [time, setTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (mode === "create") {
      setName("");
      setTime("");
    } else if (mode === "edit" && taskId) {
      let isMounted = true;
      const loadDetail = async () => {
        try {
          const data = await fetchTaskDetail(taskId);
          if (isMounted) {
            setName(data.title);
            setTime(String(data.targetTime));
          }
        } catch (error) {
          console.error("할 일 상세 정보 로딩 실패:", error);
        }
      };
      loadDetail();
      return () => {
        isMounted = false;
      };
    }
  }, [mode, taskId]);

  const MAX_NAME_LENGTH = 50;
  const titleText = mode === "create" ? "할 일 등록하기" : "할 일 수정하기";
  const submitButtonText = mode === "create" ? "등록하기" : "수정하기";

  const handleSubmit = async () => {
    if (!name || !time || isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      await onSubmit?.({ name, time });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isButtonDisabled = !name || !time || isSubmitting;

  return (
    <>
      <Title>{titleText}</Title>

      <FormContent>
        <FieldWrapper>
          <Input
            label="할 일 이름"
            placeholder="예: 영어 단어 암기"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={MAX_NAME_LENGTH}
            showCount={true}
            countPosition="top"
            disabled={isSubmitting}
          />
        </FieldWrapper>

        <FieldWrapper>
          <Input
            label="목표 시간 (분)"
            type="number"
            placeholder="30"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            disabled={isSubmitting}
          />
        </FieldWrapper>

        <Button
          type="button"
          onClick={handleSubmit}
          disabled={isButtonDisabled}
          variant="primary"
        >
          {submitButtonText}
        </Button>
      </FormContent>
    </>
  );
};

export default TodoForm;
