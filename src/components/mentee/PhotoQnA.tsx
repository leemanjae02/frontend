import { useState } from "react";
import styled from "styled-components";
import { typography } from "../../styles/typography";

import chevronDownSrc from "../../assets/images/icon/bottom.svg";
import chevronUpSrc from "../../assets/images/icon/top.svg";

export interface PhotoQnAItem {
  index: number;
  question: string;
  answer?: string;
}

interface Props {
  title?: string;
  items: PhotoQnAItem[];
  defaultOpen?: boolean;
  className?: string;
}

const PhotoQnA = ({
  title = "나의 질문",
  items,
  defaultOpen = false,
  className,
}: Props) => {
  const [open, setOpen] = useState(defaultOpen);
  const count = items.length;

  return (
    <Wrap className={className}>
      <Header onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        <HeaderTitle>{title}</HeaderTitle>

        <Chevron src={open ? chevronUpSrc : chevronDownSrc} alt="" />
      </Header>

      {open ? (
        <Body>
          {count === 0 ? (
            <Empty>등록된 질문이 없어요.</Empty>
          ) : (
            <List>
              {items.map((it, idx) => (
                <Item key={`${it.index}-${idx}`}>
                  <ItemTop>
                    <Badge>{it.index}</Badge>
                  </ItemTop>

                  <QuestionText>{it.question}</QuestionText>

                  <AnswerBlock>
                    <Branch>ㄴ</Branch>
                    <AnswerText>
                      {it.answer?.trim()
                        ? it.answer
                        : "아직 멘토 답변이 없어요."}
                    </AnswerText>
                  </AnswerBlock>
                </Item>
              ))}
            </List>
          )}
        </Body>
      ) : null}
    </Wrap>
  );
};

const Wrap = styled.section`
  width: 100%;
  border-bottom: 1px solid var(--color-gray-100);
`;

const Header = styled.div`
  width: 100%;
  padding: 14px 16px;


  display: flex;
  align-items: center;
  justify-content: space-between;

  cursor: pointer;
  text-align: left;
  box-sizing: border-box;

  }
`;

const HeaderTitle = styled.div`
  display: inline-flex;
  align-items: baseline;
  gap: 6px;

  ${typography.t16sb}
  color: var(--color-black);
`;

const Chevron = styled.img`
  width: 20px;
  height: 20px;
  display: block;
  flex: 0 0 auto;
`;

const Body = styled.div`
  padding: 10px 16px 14px;
  text-align: left;
`;

const Empty = styled.div`
  ${typography.t12r}
  color: var(--color-gray-500);
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
`;

const Item = styled.div`
  padding: 14px 0;
  border-top: 1px solid var(--color-gray-100);

  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ItemTop = styled.div`
  display: flex;
  align-items: center;
`;

const Badge = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 999px;

  background: var(--color-primary-500);
  color: var(--color-white);

  display: inline-flex;
  align-items: center;
  justify-content: center;

  ${typography.t12r}
  font-weight: 700;
  flex: 0 0 auto;
`;

const QuestionText = styled.div`
  ${typography.t12r}
  color: var(--color-black);
  white-space: pre-wrap;
`;

const AnswerBlock = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 4px;
`;

const Branch = styled.span`
  ${typography.t12r}
  color: var(--color-gray-400);
  flex: 0 0 auto;
  padding-left: 15px;
`;

const AnswerText = styled.div`
  ${typography.t12r}
  color: var(--color-gray-700);
  white-space: pre-wrap;
`;

export default PhotoQnA;
