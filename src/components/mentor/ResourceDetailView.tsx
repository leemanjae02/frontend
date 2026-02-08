import styled from "styled-components";
import { typography } from "../../styles/typography";
import { useMemo } from "react";
import { useParams, Navigate } from "react-router-dom";
import { mockMentorResourceDetails } from "../../mock/menteeDashboard.mock";

export type ResourceDetailVM = {
  resourceId?: number | string;
  subjectLabel: string;
  title: string;
  resourceText: string;
  resourceHref?: string;
};

interface Props {
  className?: string;

  data?: ResourceDetailVM;
}

export default function ResourceDetailView({ className, data }: Props) {
  const { resourceId } = useParams();

  const resolved = useMemo<ResourceDetailVM | null>(() => {
    if (data) return data; // props가 있으면 그대로 사용

    // props 없으면 라우팅 params 기반으로 찾기
    if (!resourceId) return null;
    return (mockMentorResourceDetails as any)[resourceId] ?? null;
  }, [data, resourceId]);

  // 데이터 없으면 목록으로 (원하면 다른 UI로 바꿔도 됨)
  if (!resolved) return <Navigate to=".." replace />;

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
        {resolved.resourceHref ? (
          <LinkValue
            href={resolved.resourceHref}
            target="_blank"
            rel="noreferrer"
          >
            {resolved.resourceText}
          </LinkValue>
        ) : (
          <Value>{resolved.resourceText}</Value>
        )}
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
