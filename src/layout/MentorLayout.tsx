import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/mentor/Header";
import type { MeResponse } from "../@types/auth";
import { fetchMe } from "../api/auth";
import styled from "styled-components";

export default function MentorLayout() {
  const [me, setMe] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let ignore = false;

    (async () => {
      try {
        setLoading(true);
        const data = await fetchMe();
        if (ignore) return;
        setMe(data);
      } catch (e) {
        console.error(e);
        if (ignore) return;
        setMe(null);
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, []);

  const mentorName = me?.name ?? (loading ? "불러오는 중..." : "멘토");

  return (
    <>
      <Header mentorName={mentorName} />
      <Main>
        <Outlet />
      </Main>
    </>
  );
}

const Main = styled.main`
  padding-top: 64px;
`;
