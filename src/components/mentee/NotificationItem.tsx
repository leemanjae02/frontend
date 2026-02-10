import styled from "styled-components";
import { typography } from "../../styles/typography";
import type { NotificationStatus, NotificationType } from "../../api/alarm";

export interface NotificationItemData {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  timeLabel: string;
  status: NotificationStatus;
}

interface Props {
  item: NotificationItemData;

  leftIconSrc?: string;
  onClick?: () => void;

  className?: string;
}

const NotificationItem = ({ item, leftIconSrc, onClick, className }: Props) => {
  const isRead = item.status === "READ";

  return (
    <Wrap
      type="button"
      className={className}
      $unread={!isRead}
      onClick={onClick}
    >
      <LeftIconArea>
        {leftIconSrc ? <LeftIcon src={leftIconSrc} alt="" /> : <IconStub />}
      </LeftIconArea>

      <Content>
        <TitleRow>
          <Title>{item.title}</Title>
        </TitleRow>

        <Message>{item.message}</Message>
        <Time>{item.timeLabel}</Time>
      </Content>

      {!isRead ? <UnreadDot /> : <DotSpacer />}
    </Wrap>
  );
};

const Wrap = styled.button<{ $unread: boolean }>`
  width: 100%;
  border: 0;
  cursor: pointer;
  text-align: left;

  display: grid;
  grid-template-columns: 28px 1fr 10px;
  column-gap: 12px;

  padding: 14px 16px;

  background: ${({ $unread }) => ($unread ? "#EAF6F0" : "var(--color-white)")};
  border-bottom: 1px solid var(--color-gray-100);

  &:active {
    transform: translateY(0.5px);
  }
`;

const LeftIconArea = styled.div`
  display: flex;
  align-items: flex-start;
  padding-top: 2px;
`;

const LeftIcon = styled.img`
  width: 22px;
  height: 22px;
  display: block;
`;

const IconStub = styled.div`
  width: 22px;
  height: 22px;
  border-radius: 6px;
  background: var(--color-gray-100);
`;

const Content = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Title = styled.div`
  ${typography.t16sb}
  color: var(--color-black);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Message = styled.div`
  ${typography.t14r}
  color: var(--color-gray-700);
  line-height: 1.35;
  word-break: keep-all;
`;

const Time = styled.div`
  ${typography.t12r}
  color: var(--color-gray-400);
`;

const UnreadDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: var(--color-primary-500);
  justify-self: end;
  align-self: start;
  margin-top: 6px;
`;

const DotSpacer = styled.div`
  width: 8px;
  height: 8px;
  justify-self: end;
  align-self: start;
  margin-top: 6px;
`;

export default NotificationItem;
