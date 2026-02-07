import styled from "styled-components";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { typography } from "../../styles/typography";

import MenteeListTable from "../../components/mentor/MenteeListTable";
import { mockMentorMenteeRows } from "../../mock/menteeDashboard.mock";
import type { LabelStatus } from "../../components/SubmitLabel";
import MentorCheck from "../../components/mentor/MentorCheck";

const MentorDashboardPage = () => {
  const navigate = useNavigate();

  const summary = useMemo(() => {
    const total = mockMentorMenteeRows.length;

    const submitted = mockMentorMenteeRows.filter(
      (r) => r.status === ("SUBMITTED" as LabelStatus),
    ).length;

    const notSubmitted = mockMentorMenteeRows.filter(
      (r) => r.status === ("NOT_SUBMITTED" as LabelStatus),
    ).length;

    return { total, submitted, notSubmitted };
  }, []);

  return (
    <PageContainer>
      <Section>
        <SectionTitle>오늘 확인해야 할 항목</SectionTitle>
        <MentorCheck />
      </Section>

      <Section style={{ marginTop: 40 }}>
        <ListTop>
          <SectionTitle>멘티 관리 리스트</SectionTitle>

          <RightSummary>
            <SummaryItem>
              <GreenNumber>{summary.total}</GreenNumber>
              <span>명의 멘티</span>
            </SummaryItem>

            <Divider />

            <SummaryItem>
              <span>제출: </span>
              <span>{summary.submitted}명</span>
            </SummaryItem>

            <Divider />

            <SummaryItem>
              <span>미제출: </span>
              <span>{summary.notSubmitted}명</span>
            </SummaryItem>
          </RightSummary>
        </ListTop>

        <MenteeListTable
          rows={mockMentorMenteeRows}
          onRowClick={(row) => navigate(`/mentor/mentees/${row.menteeId}`)}
        />
      </Section>
    </PageContainer>
  );
};

const PageContainer = styled.div`
  width: 100%;
  padding: 24px 100px 0;
  box-sizing: border-box;
  background: var(--color-white);
  margin-bottom: 50px;
  }
`;

const Section = styled.section`
  width: 100%;
`;

const SectionTitle = styled.h2`
  ${typography.t24sb}
  text-align: left;
`;

const ListTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 5px;
`;

const RightSummary = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--color-gray-700);
  ${typography.t16m}
  line-height: 1;
  white-space: nowrap;
`;

const SummaryItem = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
`;

const GreenNumber = styled.span`
  display: inline-flex;
  align-items: center;
  line-height: 1;
  ${typography.t24sb}
  font-family: Pretendard;
  color: var(--color-primary-500);
`;

const Divider = styled.span`
  width: 1.5px;
  height: 15px;
  background: var(--color-gray-200);
`;

export default MentorDashboardPage;
