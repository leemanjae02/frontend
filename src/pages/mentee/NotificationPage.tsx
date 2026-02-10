import { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import TodoDetailHeader from "../../components/mentee/TodoDetailHeader";
import NotificationItem, {
  type NotificationItemData,
} from "../../components/mentee/NotificationItem";
import { typography } from "../../styles/typography";

import checkIconSrc from "../../assets/images/icon/check.svg";
import chatIconSrc from "../../assets/images/icon/chat.svg";
import {
  markNotificationAsRead,
  type NotificationType,
  type NotificationItem as ApiNotificationItem,
  getNotifications,
} from "../../api/alarm";

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/** "오늘 · 19:00" / "02.01 · 00:00" */
function formatTimeLabel(iso: string) {
  const d = new Date(iso);
  const now = new Date();

  const hh = pad2(d.getHours());
  const mm = pad2(d.getMinutes());

  if (isSameDay(d, now)) return `오늘 · ${hh}:${mm}`;

  const MM = pad2(d.getMonth() + 1);
  const DD = pad2(d.getDate());
  return `${MM}.${DD} · ${hh}:${mm}`;
}

function getIconByType(type: NotificationType) {
  if (type === "FEEDBACK") return chatIconSrc;
  return checkIconSrc; // REMINDER, LEARNING_REPORT
}

function mapApiToUi(item: ApiNotificationItem): NotificationItemData {
  return {
    id: item.notificationId,
    type: item.type,
    title: item.title,
    message: item.message,
    status: item.status,
    timeLabel: formatTimeLabel(item.createdAt),
  };
}

const NotificationPage = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [mutating, setMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [items, setItems] = useState<NotificationItemData[]>([]);

  const unreadCount = useMemo(
    () => items.filter((it) => it.status !== "READ").length,
    [items],
  );

  const refresh = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      const res = await getNotifications();
      setItems(res.map(mapApiToUi));
    } catch (e) {
      console.error("알림 목록 조회 실패", e);
      setError("알림을 불러오지 못했습니다.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleClickAllRead = async () => {
    const targets = items.filter((it) => it.status !== "READ");
    if (targets.length === 0) return;

    try {
      setMutating(true);

      // 낙관적 업데이트
      setItems((prev) => prev.map((it) => ({ ...it, status: "READ" })));

      await Promise.all(targets.map((t) => markNotificationAsRead(t.id)));
    } catch (e) {
      console.error("모두 읽음 처리 실패", e);
      await refresh();
    } finally {
      setMutating(false);
    }
  };

  const handleClickItem = async (id: number) => {
    const clicked = items.find((it) => it.id === id);
    if (!clicked) return;

    // READ가 아니면 READ 처리
    if (clicked.status !== "READ") {
      try {
        setMutating(true);
        setItems((prev) =>
          prev.map((it) => (it.id === id ? { ...it, status: "READ" } : it)),
        );
        await markNotificationAsRead(id);
      } catch (e) {
        console.error("알림 읽음 처리 실패", e);
        await refresh();
        return;
      } finally {
        setMutating(false);
      }
    }
  };

  return (
    <Screen>
      <TodoDetailHeader title="알림" onClickBack={() => navigate(-1)} />

      <TopBar>
        <UnreadText>읽지 않은 알림 {unreadCount}개</UnreadText>

        <AllReadButton
          type="button"
          onClick={handleClickAllRead}
          disabled={unreadCount === 0 || loading || mutating}
        >
          모두 읽음으로 표시
        </AllReadButton>
      </TopBar>

      {loading ? <StateText>불러오는 중...</StateText> : null}
      {error ? <StateText>{error}</StateText> : null}

      <List>
        {items.map((it) => (
          <NotificationItem
            key={it.id}
            item={it}
            leftIconSrc={getIconByType(it.type)}
            onClick={() => handleClickItem(it.id)}
          />
        ))}
      </List>
    </Screen>
  );
};

const Screen = styled.div`
  min-width: 375px;
  max-width: 430px;
  height: 100dvh;
  margin: 0 auto;
  background: var(--color-white);
  display: flex;
  flex-direction: column;
`;

const TopBar = styled.div`
  height: 44px;
  padding: 0 16px;
  border-bottom: 1px solid var(--color-gray-100);

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const UnreadText = styled.div`
  ${typography.t14r}
  color: var(--color-gray-600);
`;

const AllReadButton = styled.button`
  border: 0;
  background: transparent;
  cursor: pointer;

  ${typography.t16m}
  color: var(--color-primary-500);

  &:disabled {
    cursor: default;
    color: var(--color-gray-300);
  }
`;

const StateText = styled.div`
  padding: 10px 16px;
  ${typography.t14r}
  color: var(--color-gray-500);
`;

const List = styled.div`
  flex: 1;
  overflow-y: auto;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export default NotificationPage;
