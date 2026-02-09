import styled from "styled-components";
import { Navigate, Outlet, useLocation, useParams } from "react-router-dom";

import MenteeInfo from "../../components/mentor/MenteeInfo";
import MenteeSideMenuBar from "../../components/mentor/SideBar";
import { useEffect } from "react";

const MenteeDetailPage = () => {
  const { menteeId } = useParams<{ menteeId: string }>();

  if (!menteeId) return <Navigate to="/mentor/dashboard" replace />;

  const location = useLocation();

  useEffect(() => {
    console.log("[LOCATION]", location.pathname);
  }, [location.pathname]);

  return (
    <Wrap>
      <RightTop style={{ minHeight: 25 }}>
        <RightTitle>멘티 관리</RightTitle>
      </RightTop>

      <Grid>
        <LeftPanel>
          <MenteeInfo />
          <MenteeSideMenuBar />
        </LeftPanel>

        {/* 서브라우트 (App.tsx 참고) */}
        <RightPanel>
          <RightBody>
            <Outlet />
          </RightBody>
        </RightPanel>
      </Grid>
    </Wrap>
  );
};

const Wrap = styled.div`
  width: 100%;
  height: 100%;
  background: var(--color-white);

  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 0;
`;

const RightTop = styled.div`
  flex: 0 0 auto;
  padding: 20px 100px;
  box-sizing: border-box;
  display: flex;
  justify-content: flex-start;
`;

const RightTitle = styled.h2`
  // margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: var(--color-black);
`;

const Grid = styled.div`
  flex: 1 1 auto;
  min-height: 0;

  width: 100%;
  display: grid;
  grid-template-columns: 250px 1fr;
  padding: 0 100px;
  box-sizing: border-box;
`;

const LeftPanel = styled.aside`
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  gap: 18px;

  background: var(--color-white);

  overflow: hidden;
`;

const RightPanel = styled.section`
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;

  box-sizing: border-box;

  background: var(--color-white);

  &::-webkit-scrollbar {
    display: none;
  }
`;

const RightBody = styled.div`
  padding: 0 24px 24px;
  box-sizing: border-box;
`;

export default MenteeDetailPage;
