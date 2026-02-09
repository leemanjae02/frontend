import styled from "styled-components";
import { typography } from "../../styles/typography";
import Button from "../Button";

export interface MentorResourceRow {
  resourceId: number | string;
  title: string;
  createdAtLabel: string;
  subjectLabel: string;
}

interface Props {
  rows: MentorResourceRow[];
  className?: string;

  loading?: boolean;
  emptyText?: string;
  onRowClick?: (row: MentorResourceRow) => void;

  onEdit?: (row: MentorResourceRow) => void;
  onDelete?: (row: MentorResourceRow) => void;
}

const ResourceListTable = ({
  rows,
  className,
  loading = false,
  emptyText = "자료가 없습니다.",
  onRowClick,
  onEdit,
  onDelete,
}: Props) => {
  return (
    <Outer className={className}>
      <Table>
        <thead>
          <TrHead>
            <Th>자료명</Th>
            <Th $w={180} $align="center">
              등록일
            </Th>
            <Th $w={160} $align="center">
              과목
            </Th>
            <Th $w={160} $align="center">
              관리
            </Th>
          </TrHead>
        </thead>

        <tbody>
          {loading ? (
            <TrBody>
              <Td colSpan={4}>
                <StateText>불러오는 중...</StateText>
              </Td>
            </TrBody>
          ) : rows.length === 0 ? (
            <TrBody>
              <Td colSpan={4}>
                <StateText>{emptyText}</StateText>
              </Td>
            </TrBody>
          ) : (
            rows.map((row) => (
              <TrBody
                key={row.resourceId}
                $clickable={!!onRowClick}
                onClick={() => {
                  console.log("[ResourceListTable] row clicked:", row);
                  onRowClick?.(row);
                }}
              >
                <Td $align="left">{row.title}</Td>
                <Td $align="center">{row.createdAtLabel}</Td>
                <Td $align="center">{row.subjectLabel}</Td>
                <Td $align="center">
                  <Actions>
                    <ActionBtnWrap>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit?.(row);
                        }}
                        disabled={!onEdit}
                        title="수정"
                        style={{
                          width: "49px",
                          height: "33px",
                          fontSize: "14px",
                          fontWeight: 600,
                          lineHeight: "21px",
                        }}
                      />
                    </ActionBtnWrap>

                    <Button
                      variant="secondary"
                      disabled={!onDelete}
                      title="삭제"
                      style={{
                        width: "49px",
                        height: "33px",
                        fontSize: "14px",
                        fontWeight: 600,
                        lineHeight: "21px",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete?.(row);
                      }}
                    />
                  </Actions>
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

const Th = styled.th<{ $w?: number; $align?: "left" | "right" | "center" }>`
  padding: 12px 18px;
  text-align: ${({ $align }) => $align ?? "center"};
  color: var(--color-gray-500);
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

const Td = styled.td<{ $align?: "left" | "right" | "center" }>`
  padding: 18px 18px;
  text-align: ${({ $align }) => $align ?? "left"};
  color: var(--color-black);
  ${typography.t16m}

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  vertical-align: middle;
`;

const Actions = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

const ActionBtnWrap = styled.div`
  display: inline-flex;
  align-items: center;
`;

const StateText = styled.div`
  padding: 28px 0;
  color: var(--color-gray-500);
  ${typography.t14r}
  text-align: center;
`;

export default ResourceListTable;
