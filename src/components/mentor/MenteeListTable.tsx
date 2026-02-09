import styled from "styled-components";
import { typography } from "../../styles/typography";
import SubmitLabel, { type LabelStatus } from "../SubmitLabel";
import { getHighSchoolGradeLabel } from "../../utils/grade";

export interface MentorMenteeRow {
  menteeId: number | string;
  name: string;
  gradeLabel: string;
  subjectsLabel: string;
  recentStudyLabel: string;
  status: LabelStatus;
}

interface Props {
  rows: MentorMenteeRow[];
  className?: string;
  onRowClick?: (row: MentorMenteeRow) => void;
  loading?: boolean;
  emptyText?: string;
}

const MenteeListTable = ({
  rows,
  className,
  onRowClick,
  loading = false,
  emptyText = "멘티가 없습니다.",
}: Props) => {
  return (
    <Outer className={className}>
      <Table>
        <thead>
          <TrHead>
            <Th $w={20}>멘티명</Th>
            <Th $w={10}>학년</Th>
            <Th $w={40}>과목</Th>
            <Th $w={100}>최근 학습 기록</Th>
            <Th $w={20}>상태</Th>
          </TrHead>
        </thead>

        <tbody>
          {loading ? (
            <TrBody>
              <Td colSpan={5} $align="center">
                <StateText>불러오는 중...</StateText>
              </Td>
            </TrBody>
          ) : rows.length === 0 ? (
            <TrBody>
              <Td colSpan={5} $align="center">
                <StateText>{emptyText}</StateText>
              </Td>
            </TrBody>
          ) : (
            rows.map((row) => (
              <TrBody
                key={row.menteeId}
                $clickable={!!onRowClick}
                onClick={() => onRowClick?.(row)}
              >
                <Td>{row.name}</Td>
                <Td>{getHighSchoolGradeLabel(row.gradeLabel)}</Td>
                <Td>{row.subjectsLabel}</Td>
                <Td $align="left">{row.recentStudyLabel}</Td>
                <Td>
                  <SubmitLabel status={row.status} />
                </Td>
              </TrBody>
            ))
          )}
        </tbody>
      </Table>
    </Outer>
  );
};

const Outer = styled.div`
  width: 100%;
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
`;

const TrHead = styled.tr`
  background: var(--color-gray-100);
`;

const Th = styled.th<{ $w?: number; $align?: "left" | "center" | "right" }>`
  padding: 12px 18px;
  text-align: ${({ $align }) => $align ?? "center"};
  color: var(--color-gray-600);
  ${typography.t14sb}

  ${({ $w }) => ($w ? `width: ${$w}px;` : "")}

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TrBody = styled.tr<{ $clickable?: boolean }>`
  border-bottom: 1px solid var(--color-gray-100);

  ${({ $clickable }) =>
    $clickable &&
    `
      cursor: pointer;

      &:hover {
        background: var(--color-gray-50);
      }
    `}
`;

const Td = styled.td<{ $align?: "left" | "center" | "right" }>`
  padding: 18px 18px;
  text-align: ${({ $align }) => $align ?? "center"};
  color: var(--color-black);
  ${typography.t16m}

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: middle;
`;

const StateText = styled.div`
  padding: 28px 0;
  color: var(--color-gray-500);
  ${typography.t14r}
  text-align: center;
`;

export default MenteeListTable;
