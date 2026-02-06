import { Route, Routes, Navigate } from "react-router-dom";
import MainPage from "./pages/MainPage";
import LoginPage from "./pages/LoginPage";
import MentorDashboardPage from "./pages/mentor/MentorDashboardPage";
import PublicRoute from "./components/auth/PublicRoute";
import ProtectedRoute from "./components/auth/ProtectedRoute";

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
        path="/mentor/dashboard"
        element={
          <ProtectedRoute allowedRoles={["ROLE_MENTOR"]}>
            <MentorDashboardPage />
          </ProtectedRoute>
        }
      />

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

      {/* 4. 그 외 없는 페이지 처리 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
