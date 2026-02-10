import { useState } from "react";
import styled from "styled-components";
import { typography } from "../../styles/typography";

import chevronDownSrc from "../../assets/images/icon/bottom.svg";
import chevronUpSrc from "../../assets/images/icon/top.svg";

export interface PhotoFeedbackItem {
  index: number;
  title: string | null;
  detail: string;
}

interface Props {
  photoNumber: number;
  items: PhotoFeedbackItem[];
  defaultOpen?: boolean;
  className?: string;
}

const PhotoFeedback = ({
  photoNumber,
  items,
  defaultOpen = false,
  className,
}: Props) => {
  const [open, setOpen] = useState(defaultOpen);
  const count = items.length;

  return (
    <Wrap className={className}>
      <Header onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        <HeaderTitle>
          {photoNumber}번 사진 피드백 ({count}개)
        </HeaderTitle>
        <Chevron src={open ? chevronUpSrc : chevronDownSrc} alt="" />
      </Header>

      {open ? (
        <Body>
          {count === 0 ? (
            <Empty>등록된 피드백이 없어요.</Empty>
          ) : (
            <List>
              {items.map((it) => (
                <Item key={`${photoNumber}-${it.index}`}>
                  <ItemTop>
                    <Badge>{it.index}</Badge>
                    <ItemTitle>{it.title}</ItemTitle>
                  </ItemTop>

                  <ItemDetail>{it.detail}</ItemDetail>
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

  margin-bottom: 50px;
`;

const Header = styled.div`
  width: 100%;
  padding: 14px 16px;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  cursor: pointer;
  text-align: left;
  box-sizing: border-box;

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px var(--color-primary-200);
  }
`;

const HeaderTitle = styled.div`
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
  padding: 10px 16px 16px;
  text-align: left;
`;

const Empty = styled.div`
  ${typography.t14r}
  color: var(--color-gray-500);
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Item = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ItemTop = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ItemTitle = styled.div`
  ${typography.t12r}
  color: var(--color-blue-500);
`;

const ItemDetail = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 25.2px;
  color: var(--color-black);
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
  background: var(--color-blue-500);
  ${typography.t14sb}
`;

export default PhotoFeedback;
