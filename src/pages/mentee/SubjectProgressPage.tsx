import { useMemo, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import type { SubjectKey } from "../../components/SubjectAddButton";
import { getTasksByDate, type DailyTask } from "../../api/task";
import TodoDetailHeader from "../../components/mentee/TodoDetailHeader";
import ToggleSwitch from "../../components/ToggleSwitch";
import TodoCard from "../../components/mentee/TodoCard";
import {
  getSubjectLearningStatus,
  type SubjectTaskItem,
} from "../../api/myPage";
import { dateUtils } from "../../utils/dateUtils";
import { typography } from "../../styles/typography";

const SUBJECT_LABEL: Record<SubjectKey, string> = {
  KOREAN: "국어",
  ENGLISH: "영어",
  MATH: "수학",
  RESOURCE: "자료",
};

function isSubjectKey(v: string): v is SubjectKey {
  return v === "KOREAN" || v === "ENGLISH" || v === "MATH" || v === "RESOURCE";
}

const SubjectProgressPage = () => {
  const navigate = useNavigate();
  const params = useParams();

  const subject = useMemo<SubjectKey>(() => {
    const raw = params.subject ?? "KOREAN";
    return isSubjectKey(raw) ? raw : "KOREAN";
  }, [params.subject]);

  const title = `${SUBJECT_LABEL[subject]} 학습 현황`;

  const [isToggle, setIsToggle] = useState(false);
  const [loading, setLoading] = useState(false);

  const [todayTasks, setTodayTasks] = useState<DailyTask[]>([]);

  const [historyTasks, setHistoryTasks] = useState<SubjectTaskItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    let ignore = false;

    (async () => {
      try {
        setLoading(true);
        const res = await getTasksByDate(new Date(), false);
        if (ignore) return;

        const filtered = res.tasks.filter((t) => {
          if (subject === "RESOURCE") {
            return t.isResource;
          }
          return t.taskSubject === subject && !t.isResource;
        });
        setTodayTasks(filtered);
      } catch (e) {
        console.error(e);
        if (!ignore) setTodayTasks([]);
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, [subject]);

  useEffect(() => {
    let ignore = false;

    (async () => {
      try {
        setHistoryLoading(true);
        const date = dateUtils.formatToAPIDate(new Date()); // today 기준
        const res = await getSubjectLearningStatus(subject, date);
        if (ignore) return;

        setHistoryTasks(res.historyTasks ?? []);
      } catch (e) {
        console.error("히스토리 로딩 실패", e);
        if (!ignore) setHistoryTasks([]);
      } finally {
        if (!ignore) setHistoryLoading(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, [subject]);

  const visibleTodayTasks = isToggle
    ? todayTasks
    : todayTasks.filter((t) => !t.completed);

  const visibleHistoryTasks = isToggle
    ? historyTasks
    : historyTasks.filter((t) => !t.completed);

  return (
    <Screen>
      <TodoDetailHeader title={title} onClickBack={() => navigate(-1)} />

      <Body>
        <TopRow>
          <SectionTitle>오늘의 할 일</SectionTitle>
          <ToggleArea>
            <ToggleLabel>완료한 할 일 보기</ToggleLabel>
            <ToggleSwitch on={isToggle} onChange={setIsToggle} />
          </ToggleArea>
        </TopRow>

        {loading ? <StateText>불러오는 중...</StateText> : null}

        <CardList>
          {visibleTodayTasks.map((task) => (
            <TodoCard
              key={task.taskId}
              title={task.taskName}
              subject={subject}
              done={task.completed}
              fromMentor={task.createdBy === "ROLE_MENTOR"}
            />
          ))}
        </CardList>

        <Divider />

        <SectionTitle>히스토리</SectionTitle>
        {historyLoading ? <StateText>불러오는 중...</StateText> : null}

        {visibleHistoryTasks.length === 0 && !historyLoading ? (
          <StateText>히스토리가 없습니다.</StateText>
        ) : (
          <CardList>
            {visibleHistoryTasks.map((task) => (
              <TodoCard
                key={`history-${task.taskId}`}
                title={task.taskName}
                subject={subject}
                done={task.completed}
                fromMentor={task.createdBy === "ROLE_MENTOR"}
              />
            ))}
          </CardList>
        )}
      </Body>
    </Screen>
  );
};

/* styles */
const Screen = styled.div`
  min-width: 375px;
  max-width: 430px;
  height: 100dvh;
  margin: 0 auto;
  background: var(--color-white);
  display: flex;
  flex-direction: column;
`;

const Body = styled.main`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  box-sizing: border-box;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const TopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const ToggleArea = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
`;

const ToggleLabel = styled.div`
  ${typography.t12r}
`;

const SectionTitle = styled.h3`
  margin: 0;
  ${typography.t16sb}
  text-align: left;
`;

const CardList = styled.div`
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Divider = styled.div`
  height: 12px;
`;

const StateText = styled.div`
  padding: 20px 0;
  font-size: 14px;
  color: var(--color-gray-500);
`;

export default SubjectProgressPage;
