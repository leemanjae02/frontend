import styled from "styled-components";
import { typography } from "../../styles/typography";
import { useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { getMentorMenteeInfo } from "../../api/mentorDashboard";
import type { SubjectKey } from "../SubjectAddButton";
import { SUBJECT_LABEL_MAP } from "../../pages/mentor/MentorDashboardPage";
import { getHighSchoolGradeLabel } from "../../utils/grade";

interface MenteeInfoData {
  name: string;
  gradeLabel: string;
  subjectsLabel: string;
}

interface Props {
  className?: string;
}

export default function MenteeInfo({ className }: Props) {
  const { menteeId } = useParams<{ menteeId: string }>();

  const [loading, setLoading] = useState(false);
  const [vm, setVm] = useState<MenteeInfoData>({
    name: "-",
    gradeLabel: "-",
    subjectsLabel: "-",
  });

  useEffect(() => {
    if (!menteeId) return;

    const run = async () => {
      try {
        setLoading(true);

        const res = await getMentorMenteeInfo(Number(menteeId));

        const subjectsText =
          res.subjects && res.subjects.length > 0
            ? res.subjects
                .map((s: SubjectKey) => SUBJECT_LABEL_MAP[s] ?? String(s))
                .join(" / ")
            : "-";

        setVm({
          name: res.menteeName ?? "-",
          gradeLabel: res.grade ?? "-",
          subjectsLabel: subjectsText,
        });
      } catch (e) {
        console.error(e);
        setVm({
          name: "-",
          gradeLabel: "-",
          subjectsLabel: "-",
        });
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [menteeId]);

  const subtitle = useMemo(() => {
    return loading ? "불러오는 중..." : vm.subjectsLabel;
  }, [loading, vm.subjectsLabel]);

  return (
    <Card className={className}>
      <Name>{loading ? "불러오는 중..." : vm.name}</Name>
      <Divider />

      <Field>
        <Label>학년</Label>
        <Value>
          {loading ? "불러오는 중..." : getHighSchoolGradeLabel(vm.gradeLabel)}
        </Value>
      </Field>

      <Field>
        <Label>관리 과목</Label>
        <Value>{subtitle}</Value>
      </Field>
    </Card>
  );
}

const Card = styled.div`
  width: 100%;
  border-radius: 12px;
  padding: 18px 18px 16px;
  box-sizing: border-box;
  text-align: left;

  background: linear-gradient(332deg, #2aa971 0%, #7ee298 100%);
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
