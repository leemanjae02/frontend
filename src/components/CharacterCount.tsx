import styled from "styled-components";

interface CharacterCountProps {
  value: string | number;
  maxLength?: number;
  className?: string;
}

const CountText = styled.span`
  color: var(--color-gray-300);
  font-size: 12px;
  padding-right: 4px;
`;

const CharacterCount = ({
  value,
  maxLength,
  className,
}: CharacterCountProps) => {
  const length = String(value ?? "").length;

  return (
    <CountText className={className}>
      {length}
      {maxLength ? ` / ${maxLength}` : ""}
    </CountText>
  );
};

export default CharacterCount;
