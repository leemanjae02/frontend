import styled from "styled-components";
import type { MentorResourceRow } from "../ResourceListTable";
import { mockMentorResources } from "../../../mock/menteeDashboard.mock";
import Button from "../../Button";
import ResourceListTable from "../ResourceListTable";
import { typography } from "../../../styles/typography";
import { useNavigate, useParams } from "react-router-dom";

interface Props {
  className?: string;
  // 추후 API 연결 대비
  rows?: MentorResourceRow[];
  onEdit?: (row: MentorResourceRow) => void;
  onDelete?: (row: MentorResourceRow) => void;
}

const ResourceSection = ({ className, rows, onEdit, onDelete }: Props) => {
  const navigate = useNavigate();
  const { menteeId } = useParams();

  const data = rows ?? mockMentorResources;

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
        onEdit={(row) => {
          onEdit?.(row);
          alert(`수정: ${row.title}`);
        }}
        onDelete={(row) => {
          onDelete?.(row);
          if (confirm(`"${row.title}" 자료를 삭제할까요?`)) {
            alert("삭제 API 연결 예정");
          }
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
