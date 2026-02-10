import { useState } from "react";
import styled from "styled-components";
import { typography } from "../../styles/typography";
// import NumberBadge from "../NumberBadge";

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
  // border-bottom: 1px rgba(231, 231, 231, 0.5) solid;
  border-bottom: 1px var(--color-gray-100) solid;
  // margin-bottom: 70px;
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
  padding: 0 16px 10px;
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
  // border-bottom: 1px rgba(231, 231, 231, 0.5) solid;

  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ItemTop = styled.div`
  display: flex;
  align-items: center;
`;

const QuestionText = styled.div`
  ${typography.t14r}
  color: var(--color-black);
  white-space: pre-wrap;
`;

const AnswerBlock = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 4px;
`;

const Branch = styled.span`
  ${typography.t14r}
  color: var(--color-gray-400);
  flex: 0 0 auto;
  padding-left: 15px;
`;

const AnswerText = styled.div`
  ${typography.t14r}
  color: var(--color-gray-700);
  white-space: pre-wrap;
`;

const Badge = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--color-white);
  background: var(--color-primary-500);
  ${typography.t14sb}
`;

export default PhotoQnA;
