import styled from "styled-components";
import type { MentorResourceRow } from "../ResourceListTable";
import Button from "../../Button";
import ResourceListTable from "../ResourceListTable";
import { typography } from "../../../styles/typography";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { deleteResource, getResources } from "../../../api/resource";
import { SUBJECT_LABEL_MAP } from "../../../pages/mentor/MentorDashboardPage";

interface Props {
  className?: string;
  rows?: MentorResourceRow[];
  onEdit?: (row: MentorResourceRow) => void;
  onDelete?: (row: MentorResourceRow) => void;
}

const ResourceSection = ({ className, rows, onDelete }: Props) => {
  const navigate = useNavigate();
  const { menteeId } = useParams();

  const [apiRows, setApiRows] = useState<MentorResourceRow[]>([]);
  const [loading, setLoading] = useState(false);

  const data = useMemo(() => (rows ? rows : apiRows), [rows, apiRows]);

  const refetch = async () => {
    if (rows) return;
    if (!menteeId) return;

    try {
      setLoading(true);
      const res = await getResources(Number(menteeId));

      const mapped: MentorResourceRow[] = res.map((r) => ({
        resourceId: r.resourceId,
        title: r.resourceName,
        createdAtLabel: r.registeredDate,
        subjectLabel: SUBJECT_LABEL_MAP[r.subject] ?? r.subject,
      }));

      setApiRows(mapped);
    } catch (e) {
      console.error(e);
      setApiRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, [menteeId, rows]);

  const goDetail = (row: MentorResourceRow) => {
    navigate(`/mentor/mentees/${menteeId}/resources/${row.resourceId}`);
  };

  return (
    <Wrap className={className}>
      <Top>
        <Title>자료 관리</Title>

        <AddBtnWrap>
          <Button
            onClick={() => {
              navigate(`/mentor/mentees/${menteeId}/resources/new`);
            }}
            title="추가하기"
            style={{ width: "200px", height: "48px" }}
          />
        </AddBtnWrap>
      </Top>

      <ResourceListTable
        rows={data}
        loading={loading}
        onRowClick={goDetail}
        onDelete={async (row) => {
          onDelete?.(row);

          const ok = confirm(`"${row.title}" 자료를 삭제할까요?`);
          if (!ok) return;

          try {
            await deleteResource(Number(row.resourceId));
            alert("삭제되었습니다.");
            await refetch();
          } catch (e) {
            console.error(e);
            alert("삭제에 실패했습니다.");
          }
        }}
        onEdit={(row) => {
          navigate(
            `/mentor/mentees/${menteeId}/resources/${row.resourceId}/edit`,
          );
        }}
      />
    </Wrap>
  );
};

const Wrap = styled.section`
  width: 100%;
  margin-bottom: 50px;
`;

const Top = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 14px;
`;

const Title = styled.h2`
  ${typography.t24sb}
  color: var(--color-black);
`;

const AddBtnWrap = styled.div`
  display: inline-flex;
  align-items: center;
`;

export default ResourceSection;
