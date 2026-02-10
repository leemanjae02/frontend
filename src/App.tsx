import { Route, Routes, Navigate } from "react-router-dom";
import MainPage from "./pages/MainPage";
import LoginPage from "./pages/LoginPage";
import MentorDashboardPage from "./pages/mentor/MentorDashboardPage";
import PublicRoute from "./components/auth/PublicRoute";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import MentorLayout from "./layout/MentorLayout";
import MenteeDetailPage from "./pages/mentor/MenteeDetailPage";
import TodoCreateSection from "./components/mentor/sections/TodoCreateSection";
import ResourceSection from "./components/mentor/sections/ResourceSection";
import ResourceCreateForm from "./components/mentor/ResourceCreateForm";
import ResourceDetailView from "./components/mentor/ResourceDetailView";
import WeeklyPlanPage from "./pages/mentor/WeeklyPlanPage";
import FeedbackDetailPage from "./pages/mentor/FeedbackDetailPage";
import MyPage from "./pages/mentee/MyPage";
import SubjectProgressPage from "./pages/mentee/SubjectProgressPage";
import NotificationPage from "./pages/mentee/NotificationPage";

function App() {
  return (
    <Routes>
      {/* 1. 로그인 페이지 (로그인 상태면 메인으로 리다이렉트) */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />

      {/* 2. 멘토 대시보드 (멘토만 접근 가능) */}
      <Route
        path="/mentor"
        element={
          <ProtectedRoute allowedRoles={["ROLE_MENTOR"]}>
            <MentorLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<MentorDashboardPage />} />

        {/* 멘티 상세 (사이드바 포함) */}
        <Route path="mentees/:menteeId" element={<MenteeDetailPage />}>
          {/* 기본 진입 시: 할일 등록으로 보내기 */}
          <Route index element={<Navigate to="todo" replace />} />

          <Route path="todo" element={<TodoCreateSection />} />
          <Route path="todo/:taskId/edit" element={<TodoCreateSection />} />
          <Route path="resources" element={<ResourceSection />} />
          <Route path="resources/new" element={<ResourceCreateForm />} />
          <Route
            path="resources/:resourceId/edit"
            element={<ResourceCreateForm />}
          />
          <Route
            path="resources/:resourceId"
            element={<ResourceDetailView />}
          />
          <Route path="plan" element={<WeeklyPlanPage />} />
        </Route>

        {/* 피드백 상세 (사이드바 제외) */}
        <Route
          path="mentees/:menteeId/plan/:taskId/feedback"
          element={<FeedbackDetailPage />}
        />
      </Route>

      {/* 3. 루트 경로 (멘티 메인) */}
      {/* 로그인 안 했으면 -> /login으로 리다이렉트 */}
      {/* 멘토면 -> /mentor/dashboard로 리다이렉트 */}
      {/* 멘티면 -> MainPage 보여줌 */}
      <Route
        path="/"
        element={
          <ProtectedRoute allowedRoles={["ROLE_MENTEE"]}>
            <MainPage />
          </ProtectedRoute>
        }
      />
      <Route path="/mypage" element={<MyPage />} />
      <Route path="/mypage/:subject" element={<SubjectProgressPage />} />
      <Route path="/alarm" element={<NotificationPage />} />
      {/* 4. 그 외 없는 페이지 처리 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
