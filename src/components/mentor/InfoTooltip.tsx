import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

interface Props {
  message: string;
  icon: React.ReactNode;
  align?: "left" | "right" | "center";
  defaultOpen?: boolean;
  className?: string;
}

const InfoTooltip = ({
  message,
  icon,
  align = "center",
  defaultOpen = false,
  className,
}: Props) => {
  const [open, setOpen] = useState(defaultOpen);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    const onMouseDown = (e: MouseEvent) => {
      const el = wrapRef.current;
      if (!el) return;
      if (e.target instanceof Node && !el.contains(e.target)) setOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("mousedown", onMouseDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("mousedown", onMouseDown);
    };
  }, [open]);

  return (
    <Wrap ref={wrapRef} className={className}>
      <Trigger
        type="button"
        aria-label="정보 보기"
        aria-expanded={open}
        onClick={(e) => {
          e.preventDefault();
          setOpen((v) => !v);
        }}
      >
        {icon}
      </Trigger>

      {open && (
        <Bubble $align={align} role="tooltip">
          {message}
        </Bubble>
      )}
    </Wrap>
  );
};

const Wrap = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
`;

const Trigger = styled.button`
  border: 0;
  background: transparent;
  padding: 0;
  cursor: pointer;
  display: grid;
  place-items: center;

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px var(--color-primary-200);
    border-radius: 8px;
  }
`;

const Bubble = styled.div<{ $align: "left" | "right" | "center" }>`
  position: absolute;
  bottom: calc(100% + 10px);
  z-index: 50;

  ${({ $align }) =>
    $align === "left"
      ? "left: 0;"
      : $align === "right"
        ? "right: 0;"
        : "left: 50%; transform: translateX(-50%);"}

  background: var(--color-primary-500);
  color: var(--color-white);
  border-radius: 10px;
  padding: 10px 12px;

  font-size: 13px;
  font-weight: 600;
  line-height: 1.25;
  white-space: nowrap;

  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.18);

  &::after {
    content: "";
    position: absolute;
    top: 100%;
    width: 0;
    height: 0;

    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-top: 10px solid var(--color-primary-500);

    ${({ $align }) =>
      $align === "left"
        ? "left: 12px;"
        : $align === "right"
          ? "right: 12px;"
          : "left: 50%; transform: translateX(-50%);"}
  }
`;

export default InfoTooltip;
