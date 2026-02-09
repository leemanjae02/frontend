import styled from "styled-components";
import { typography } from "../../styles/typography";
import RedCountBadge from "../RedCountBadge";

type SummaryKey = "NO_FEEDBACK" | "NOT_DONE";

export interface MentorCheckItem {
  key: SummaryKey;
  title: string;
  count: number;
  menteeNames: string[];
}

interface Props {
  items?: MentorCheckItem[];
  className?: string;

  loading?: boolean;
  errorText?: string | null;
}

const USE_MOCK = import.meta.env.VITE_USE_MOCK_DASHBOARD === "true";

const MOCK_ITEMS: MentorCheckItem[] = [
  {
    key: "NO_FEEDBACK",
    title: "피드백 미작성",
    count: 12,
    menteeNames: ["주현지", "이서영", "이만재"],
  },
  {
    key: "NOT_DONE",
    title: "학습 미이행",
    count: 5,
    menteeNames: ["김준"],
  },
];

const MentorCheck = ({
  items,
  className,
  loading = false,
  errorText,
}: Props) => {
  const data = USE_MOCK ? (items ?? MOCK_ITEMS) : (items ?? []);

  if (loading) {
    return (
      <Wrap className={className}>
        <StateText>불러오는 중...</StateText>
      </Wrap>
    );
  }

  if (errorText) {
    return (
      <Wrap className={className}>
        <StateText>{errorText}</StateText>
      </Wrap>
    );
  }

  return (
    <Wrap className={className}>
      {data.length === 0 ? (
        <StateText>확인할 항목이 없습니다.</StateText>
      ) : (
        data.map((it) => (
          <Block key={it.key}>
            <Top>
              <Title>{it.title}</Title>
              <RedCountBadge count={it.count} />
            </Top>

            <Names>
              {it.menteeNames.length > 0 ? it.menteeNames.join(", ") : ""}
            </Names>
          </Block>
        ))
      )}
    </Wrap>
  );
};

const Wrap = styled.section`
  display: flex;
  flex-direction: column;
  gap: 18px;

  width: 100%;

  .countBadge {
    width: 64px;
    height: 40px;
  }
`;

const Block = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
  gap: 8px;
  margin-bottom: 8px;
`;

const Top = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

const Title = styled.div`
  ${typography.t16sb}
  color: var(--color-black);
`;

const Names = styled.div`
  ${typography.t14r}
  color: var(--color-gray-600);
`;

const StateText = styled.div`
  ${typography.t14r}
  color: var(--color-gray-500);
  padding: 12px 0;
  text-align: left;
`;

export default MentorCheck;
