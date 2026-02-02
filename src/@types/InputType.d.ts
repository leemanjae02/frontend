import { InputHTMLAttributes, ReactNode } from "react";

// 상태값은 Union Type으로 정의
export type InputStatus = "default" | "error";

// Interface로 정의
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  id?: string; //인풋 아이디
  label?: string; //라벨 텍스트
  status?: InputStatus; //컴포넌트의 시각적 상태
  helperText?: string; //하단 도움말 텍스트
  leftIcon?: ReactNode; //좌측 아이콘
  rightIcon?: ReactNode; //우측 아이콘
  showCount?: boolean; //글자수 카운트 UI 표시 여부
  value?: string | number; //입력 값
  disabled?: boolean; //비활성화 여부
}
