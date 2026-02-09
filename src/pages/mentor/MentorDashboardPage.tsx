import styled from "styled-components";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { typography } from "../../styles/typography";

import MenteeListTable, {
  type MentorMenteeRow,
} from "../../components/mentor/MenteeListTable";
import type { LabelStatus } from "../../components/SubmitLabel";
import MentorCheck, {
  type MentorCheckItem,
} from "../../components/mentor/MentorCheck";
import {
  getFeedbackRequiredTasks,
  getMentorDashboardMentees,
  getUnfinishedTasks,
  type FeedbackRequiredTasksResponse,
  type GetMentorDashboardMenteesResponse,
  type UnfinishedTasksResponse,
} from "../../api/mentorDashboard";

export const SUBJECT_LABEL_MAP: Record<string, string> = {
  KOREAN: "국어",
  MATH: "수학",
  ENGLISH: "영어",
};

function toMenteeRows(
  api: GetMentorDashboardMenteesResponse,
): MentorMenteeRow[] {
  return (api.mentees ?? []).map((m) => {
    const subjectsLabel = (m.subjects ?? [])
      .map((s) => SUBJECT_LABEL_MAP[String(s)] ?? String(s))
      .join(" / ");

    const status: LabelStatus = m.submitted ? "SUBMITTED" : "NOT_SUBMITTED";

    const recentStudyLabel = `${m.recentTaskDate}/${m.recentTaskName}`;

    return {
      menteeId: m.menteeId,
      name: m.menteeName,
      gradeLabel: m.grade,
      subjectsLabel,
      recentStudyLabel,
      status,
    };
  });
}

const MentorDashboardPage = () => {
  const navigate = useNavigate();
  const today = useMemo(() => new Date(), []);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [menteesApi, setMenteesApi] =
    useState<GetMentorDashboardMenteesResponse | null>(null);
  const [feedbackRequired, setFeedbackRequired] =
    useState<FeedbackRequiredTasksResponse | null>(null);
  const [unfinished, setUnfinished] = useState<UnfinishedTasksResponse | null>(
    null,
  );

  useEffect(() => {
    let ignore = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const [menteesRes, feedbackRes, unfinishedRes] = await Promise.all([
          getMentorDashboardMentees(today),
          getFeedbackRequiredTasks(today),
          getUnfinishedTasks(today),
        ]);

        if (ignore) return;

        setMenteesApi(menteesRes);
        setFeedbackRequired(feedbackRes);
        setUnfinished(unfinishedRes);
      } catch (e) {
        console.error(e);
        if (ignore) return;
        setError("대시보드 정보를 불러오지 못했습니다.");
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, [today]);

  const rows = useMemo(() => {
    if (!menteesApi) return [];
    return toMenteeRows(menteesApi);
  }, [menteesApi]);

  const summary = useMemo(() => {
    if (menteesApi) {
      return {
        total: menteesApi.totalMenteeCount,
        submitted: menteesApi.submittedMenteeCount,
        notSubmitted: menteesApi.notSubmittedMenteeCount,
      };
    }

    const total = rows.length;
    const submitted = rows.filter(
      (r) => r.status === ("SUBMITTED" as LabelStatus),
    ).length;
    const notSubmitted = rows.filter(
      (r) => r.status === ("NOT_SUBMITTED" as LabelStatus),
    ).length;
    return { total, submitted, notSubmitted };
  }, [menteesApi, rows]);

  const checkItems: MentorCheckItem[] = useMemo(() => {
    if (!feedbackRequired && !unfinished) return [];

    return [
      {
        key: "NO_FEEDBACK",
        title: "피드백 미작성",
        count: feedbackRequired?.taskCount ?? 0,
        menteeNames: feedbackRequired?.menteeNames ?? [],
      },
      {
        key: "NOT_DONE",
        title: "학습 미이행",
        count: unfinished?.taskCount ?? 0,
        menteeNames: unfinished?.menteeNames ?? [],
      },
    ];
  }, [feedbackRequired, unfinished]);

  return (
    <PageContainer>
      <Section>
        <SectionTitle>오늘 확인해야 할 항목</SectionTitle>
        <MentorCheck loading={loading} errorText={error} items={checkItems} />
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
          rows={rows}
          loading={loading}
          emptyText={error ? error : "멘티가 없습니다."}
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
