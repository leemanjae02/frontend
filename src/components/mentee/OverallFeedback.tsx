import { useState } from "react";
import styled from "styled-components";
import { typography } from "../../styles/typography";

import commentIconSrc from "../../assets/images/icon/chat_blue.svg";
import chevronDownSrc from "../../assets/images/icon/bottom.svg";
import chevronUpSrc from "../../assets/images/icon/top.svg";

interface Props {
  mentorName: string;
  details?: string;
  defaultOpen?: boolean;
  className?: string;
}

const OverallFeedback = ({
  mentorName,
  defaultOpen = false,
  className,
}: Props) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Wrap className={className}>
      <Header onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        <IconWrap>
          <Icon src={commentIconSrc} alt="" />
        </IconWrap>

        <Content>
          <TopRow>
            <Title>{mentorName} 멘토의 피드백</Title>
            <Chevron src={open ? chevronUpSrc : chevronDownSrc} alt="" />
          </TopRow>

          <Summary>할 일에 대한 멘토의 총평이에요.</Summary>
        </Content>
      </Header>

      {open ? <BodyTitle>피드백 내용 사항</BodyTitle> : null}
    </Wrap>
  );
};

const Wrap = styled.section`
  width: 100%;
  border-bottom: 1px rgba(231, 231, 231, 0.5) solid;
`;

const Header = styled.div`
  width: 100%;
  padding: 14px 16px;

  display: flex;
  align-items: flex-start;
  gap: 12px;

  cursor: pointer;
  text-align: left;

  box-sizing: border-box;
  }
`;

const IconWrap = styled.div`
  width: 28px;
  flex: 0 0 auto;

  display: flex;
  justify-content: center;

  margin-top: 2px;
`;

const Icon = styled.img`
  width: 22px;
  height: 22px;
  display: block;
`;

const Content = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

const TopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.div`
  ${typography.t16sb}
  color: var(--color-blue-500);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Chevron = styled.img`
  width: 20px;
  height: 20px;
  flex: 0 0 auto;
  display: block;
`;

const Summary = styled.div`
  ${typography.t12r}
  color: var(--color-gray-500);
`;

const BodyTitle = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 25.2px;
  color: var(--color-gray-600);
  padding: 0 0 12px 19px;
  text-align: left;
`;

export default OverallFeedback;
