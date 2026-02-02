import { TextareaHTMLAttributes } from "react";

export type InputStatus = "default" | "error";

export interface TextAreaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string; //라벨 텍스트
  status?: InputStatus; //컴포넌트의 시각적 상태
  helperText?: string; //하단 도움말 텍스트
  showCount?: boolean; //글자수 카운트 UI 표시 여부
  value?: string | number; //입력 값
  disabled?: boolean; //비활성화 여부
}
