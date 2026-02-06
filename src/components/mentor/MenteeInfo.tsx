import styled from "styled-components";
import { typography } from "../../styles/typography";

export interface MenteeInfoData {
  menteeId?: number | string;
  name: string;
  gradeLabel: string;
  subjects: string[]; // 추후 타입 보고 수정
}

interface Props {
  data: MenteeInfoData;
  className?: string;
}

export default function MenteeInfo({ data, className }: Props) {
  const subjectText =
    data.subjects && data.subjects.length > 0 ? data.subjects.join(" / ") : "-";

  return (
    <Card className={className}>
      <Name>{data.name}</Name>
      <Divider />

      <Field>
        <Label>학년</Label>
        <Value>{data.gradeLabel}</Value>
      </Field>

      <Field>
        <Label>관리 과목</Label>
        <Value>{subjectText}</Value>
      </Field>
    </Card>
  );
}

const Card = styled.div`
  width: 100%;
  border-radius: 12px;
  padding: 18px 18px 16px;
  box-sizing: border-box;

  background: linear-gradient(180deg, #9fe5a3 0%, #63b07c 100%);
  color: var(--color-white);

  display: flex;
  flex-direction: column;
  gap: 14px;

  border: none;
`;

const Name = styled.div`
  ${typography.t18sb}
  line-height: 1.2;
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background: color-mix(in srgb, var(--color-white) 35%, transparent);
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.div`
  ${typography.t12r}
  opacity: 0.9;
`;

const Value = styled.div`
  ${typography.t16sb}
  line-height: 1.3;
`;
