import styled from "styled-components";
import type { SubjectKey } from "../../components/SubjectAddButton";
import TodoDetailHeader from "../../components/mentee/TodoDetailHeader";
import SubjectProgressCard from "../../components/mentee/SubjectProgressCard";
import { typography } from "../../styles/typography";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { dateUtils } from "../../utils/dateUtils";
import { getLearningStatus } from "../../api/myPage";
import { calcProgressPercent } from "../../utils/learningStatusUtils";
import { fetchMe } from "../../api/auth";

const MyPage = () => {
  const navigate = useNavigate();

  const SUBJECTS = useMemo(
    () =>
      [
        { subjectLabel: "국어", subjectKey: "KOREAN" as const },
        { subjectLabel: "영어", subjectKey: "ENGLISH" as const },
        { subjectLabel: "수학", subjectKey: "MATH" as const },
      ] satisfies Array<{ subjectLabel: string; subjectKey: SubjectKey }>,
    [],
  );

  const [items, setItems] = useState<
    Array<{ subjectLabel: string; subjectKey: SubjectKey; percent: number }>
  >(() => SUBJECTS.map((s) => ({ ...s, percent: 0 })));

  const [loadingMe, setLoadingMe] = useState(true);
  const [loadingStatus, setLoadingStatus] = useState(true);

  const pageLoading = loadingMe || loadingStatus;

  const [menteeName, setMenteeName] = useState("");

  useEffect(() => {
    let ignore = false;

    (async () => {
      try {
        setLoadingMe(true);

        const me = await fetchMe();
        if (ignore) return;

        const name =
          (me as any).name ??
          (me as any).nickname ??
          (me as any).userName ??
          "";

        setMenteeName(name);
      } catch (e) {
        console.error("내 정보 조회 실패", e);
        if (!ignore) setMenteeName("");
      } finally {
        if (!ignore) setLoadingMe(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    let ignore = false;

    (async () => {
      try {
        setLoadingStatus(true);

        const today = dateUtils.formatToAPIDate(new Date()); // "YYYY-MM-DD"
        const res = await getLearningStatus(today);
        if (ignore) return;

        const percentMap: Record<string, number> = {};
        res.forEach((it) => {
          percentMap[it.subject] = calcProgressPercent(
            it.taskAmount,
            it.completedTaskAmount,
          );
        });

        setItems(
          SUBJECTS.map((s) => ({
            ...s,
            percent: percentMap[s.subjectKey] ?? 0,
          })),
        );
      } catch (e) {
        console.error("학습 현황 로딩 실패", e);
        if (!ignore) {
          setItems(SUBJECTS.map((s) => ({ ...s, percent: 0 })));
        }
      } finally {
        if (!ignore) setLoadingStatus(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, [SUBJECTS]);

  const handleClickBack = () => {
    navigate(-1);
  };

  const handleClickDetail = (subjectKey: SubjectKey) => {
    navigate(`/mypage/${subjectKey}`);
  };

  return (
    <Screen>
      <TodoDetailHeader
        title="마이페이지"
        onClickBack={handleClickBack}
        subject={undefined}
      />

      <Content $locked={pageLoading}>
        {pageLoading ? (
          <LoadingOverlay aria-label="마이페이지 로딩 중">
            <Spinner />
            <LoadingText>불러오는 중...</LoadingText>
          </LoadingOverlay>
        ) : null}

        <Greeting>
          <Hello>안녕하세요</Hello>
          <NameRow>
            <Name>{menteeName || ""}</Name>
            <Suffix>님</Suffix>
          </NameRow>
        </Greeting>

        <Message>오늘도 열심히 공부하고 계시네요!</Message>

        <Cards>
          {items.map((it) => (
            <SubjectProgressCard
              key={it.subjectKey}
              subjectLabel={it.subjectLabel}
              subjectKey={it.subjectKey}
              percent={it.percent}
              onClick={() => handleClickDetail(it.subjectKey)}
            />
          ))}
        </Cards>
      </Content>
    </Screen>
  );
};

const Screen = styled.div`
  min-width: 375px;
  max-width: 430px;
  height: 100dvh;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  background: var(--color-white);
`;

const Content = styled.main<{ $locked: boolean }>`
  flex: 1;
  padding: 18px 16px;
  position: relative;

  ${({ $locked }) => ($locked ? "pointer-events: none;" : "")}
`;

const LoadingOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.92);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 12px;
  z-index: 1000;

  pointer-events: auto;
`;

const Spinner = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 999px;
  border: 3px solid var(--color-gray-200);
  border-top-color: var(--color-primary-500);
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.div`
  font-size: 13px;
  color: var(--color-gray-600);
`;

const Greeting = styled.div`
  border-bottom: 1px var(--color-gray-100) solid;
  padding: 8px 0 14px;
  text-align: left;
  gap: 100px;
`;

const Hello = styled.p`
  margin: 0;
  ${typography.t16r}
`;

const NameRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 6px;
`;

const Name = styled.span`
  ${typography.t16sb}
`;

const Suffix = styled.span`
  ${typography.t16r}
`;

const Message = styled.p`
  margin: 16px 0;
  ${typography.t18sb}
  text-align: left;
`;

const Cards = styled.section`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export default MyPage;
