import styled, { css } from "styled-components";
import { typography } from "../styles/typography";

export type NumberBadgeVariant = "question" | "feedback" | "important";

interface Props {
  value: number;
  variant: NumberBadgeVariant;
  className?: string;
  onClick?: () => void; // 추후 클릭될 수도 있을 가능성을 위해 추가
}

const CONFIG: Record<
  NumberBadgeVariant,
  { bg: string; ring: string; text: string }
> = {
  // 멘티 질문
  question: {
    bg: "color-mix(in srgb, var(--color-primary-500) 60%, transparent)",
    ring: "var(--color-primary-500)",
    text: "var(--color-primary-700)",
  },

  // 멘토 피드백
  feedback: {
    bg: "color-mix(in srgb, var(--color-blue-500) 30%, transparent)",
    ring: "var(--color-blue-500)",
    text: "var(--color-blue-500)",
  },

  // 중요 피드백
  important: {
    bg: "var(--color-blue-500)",
    ring: "color-mix(in srgb, var(--color-black) 30%, transparent)",
    text: "var(--color-white)",
  },
};

export default function NumberBadge({
  value,
  variant,
  className,
  onClick,
}: Props) {
  const cfg = CONFIG[variant];

  // onClick 있으면 button, 없으면 그냥
  return (
    <Badge
      as={onClick ? "button" : "span"}
      className={className}
      onClick={onClick}
      $bg={cfg.bg}
      $ring={cfg.ring}
      $text={cfg.text}
      $clickable={!!onClick}
    >
      {value}
    </Badge>
  );
}

const Badge = styled.span<{
  $bg: string;
  $ring: string;
  $text: string;
  $clickable: boolean;
}>`
  width: 32px;
  height: 32px;
  border-radius: 40px;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  background: ${({ $bg }) => $bg};
  border: 2.5px solid ${({ $ring }) => $ring};
  color: var(--color-white);

  ${typography.t14sb}

  padding: 0;
  user-select: none;

  // 클릭 시의 별다른 효과는 아직 안넣음
  ${({ $clickable }) =>
    $clickable
      ? css`
          cursor: pointer;
        `
      : css`
          cursor: default;
        `}
`;
