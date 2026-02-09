import styled from "styled-components";
import { typography } from "../../styles/typography";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { SUBJECT_LABEL_MAP } from "../../pages/mentor/MentorDashboardPage";
import { getResourceDetail, type ResourceItem } from "../../api/resource";
import { downloadFile } from "../../api/file";

export type ResourceDetailVM = {
  resourceId?: number | string;
  subjectLabel: string;
  title: string;

  resourceText: string;
  resourceHref?: string;
  resourceKind: "FILE" | "LINK" | "NONE";
  fileId?: number;
  fileName?: string;
};

interface Props {
  className?: string;

  data?: ResourceDetailVM;
}

export default function ResourceDetailView({ className, data }: Props) {
  const { resourceId } = useParams();

  console.log("[ResourceDetailView] mounted");
  console.log("[ResourceDetailView] param resourceId:", resourceId);

  const [apiData, setApiData] = useState<ResourceItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (data) return;

    if (!resourceId) return;

    const run = async () => {
      try {
        setLoading(true);
        setError(false);

        const res = await getResourceDetail(Number(resourceId));
        setApiData(res);
      } catch (e) {
        console.error(e);
        setApiData(null);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [data, resourceId]);

  const resolved = useMemo<ResourceDetailVM | null>(() => {
    if (data) return data;

    if (!apiData) return null;

    const firstWorksheet = apiData.worksheets?.[0];
    const firstLink = apiData.columnLinks?.[0];

    if (firstWorksheet) {
      return {
        resourceId: apiData.resourceId,
        subjectLabel: SUBJECT_LABEL_MAP[apiData.subject] ?? apiData.subject,
        title: apiData.resourceName,
        resourceKind: "FILE",
        resourceText: firstWorksheet.fileName,
        fileId: firstWorksheet.fileId,
        fileName: firstWorksheet.fileName,
      };
    }

    if (firstLink?.link) {
      return {
        resourceId: apiData.resourceId,
        subjectLabel: SUBJECT_LABEL_MAP[apiData.subject] ?? apiData.subject,
        title: apiData.resourceName,
        resourceKind: "LINK",
        resourceText: firstLink.link,
        resourceHref: firstLink.link,
      };
    }

    return {
      resourceId: apiData.resourceId,
      subjectLabel: SUBJECT_LABEL_MAP[apiData.subject] ?? apiData.subject,
      title: apiData.resourceName,
      resourceKind: "NONE",
      resourceText: "-",
    };
  }, [data, apiData]);

  if (!data && loading) {
    return (
      <Wrap className={className}>
        <StateText>불러오는 중...</StateText>
      </Wrap>
    );
  }

  if (!data && error) {
    return (
      <Wrap className={className}>
        <StateText>자료를 불러오지 못했습니다.</StateText>
      </Wrap>
    );
  }

  if (!resolved) {
    return (
      <Wrap className={className}>
        <StateText>자료가 없습니다.</StateText>
      </Wrap>
    );
  }

  return (
    <Wrap className={className}>
      <Block>
        <Label>과목</Label>
        <Value>{resolved.subjectLabel}</Value>
      </Block>

      <Block>
        <Label>자료 이름</Label>
        <Value>{resolved.title}</Value>
      </Block>

      <Block>
        <Label>학습 자료</Label>

        {resolved.resourceKind === "LINK" && resolved.resourceHref ? (
          <LinkValue
            href={resolved.resourceHref}
            target="_blank"
            rel="noreferrer"
          >
            {resolved.resourceText}
          </LinkValue>
        ) : resolved.resourceKind === "FILE" && resolved.fileId ? (
          <FileRow>
            <FileName>{resolved.resourceText}</FileName>
            <FileBtn
              type="button"
              onClick={() => {
                downloadFile(
                  resolved.fileId!,
                  resolved.fileName ?? "worksheet.pdf",
                );
              }}
            >
              다운로드
            </FileBtn>
          </FileRow>
        ) : (
          <Value>{resolved.resourceText}</Value>
        )}

        {!data && error && <ErrorText>자료를 불러오지 못했습니다.</ErrorText>}
      </Block>
    </Wrap>
  );
}

const Wrap = styled.section`
  width: 100%;
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Block = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Label = styled.div`
  ${typography.t16r}
  color: var(--color-gray-500);
  text-align: left;
`;

const Value = styled.div`
  ${typography.t18sb}
  color: var(--color-black);
  text-align: left;
`;

const LinkValue = styled.a`
  ${typography.t16sb}
  color: var(--color-blue-500);
  text-align: left;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const FileRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const FileName = styled.div`
  ${typography.t16sb}
  color: var(--color-black);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const FileBtn = styled.button`
  ${typography.t14sb}
  border: 1px solid var(--color-gray-200);
  background: var(--color-white);
  border-radius: 10px;
  padding: 8px 12px;
  cursor: pointer;

  &:hover {
    background: var(--color-gray-50);
  }
`;

const StateText = styled.div`
  padding: 28px 0;
  color: var(--color-gray-500);
  ${typography.t14r}
  text-align: center;
`;

const ErrorText = styled.div`
  margin-top: 8px;
  color: var(--color-red-500);
  ${typography.t14r}
`;
