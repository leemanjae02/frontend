import styled from "styled-components";
import { typography } from "../styles/typography";

interface Props {
  count: number;
}

export default function RedCountBadge({ count }: Props) {
  return <Badge>{count}건</Badge>;
}

const Badge = styled.span`
  width: 43px;
  height: 29px;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  padding: 1px 0;
  border-radius: 4px;

  background: color-mix(in srgb, var(--color-error) 10%, transparent);
  color: var(--color-error);

  ${typography.t14sb}
`;
