// 사용자 역할
export type UserRole = "ROLE_MENTOR" | "ROLE_MENTEE";

// 로그인 요청 데이터
export interface LoginRequest {
  loginId: string;
  password: string;
}

// 로그인/리프레시 응답 데이터
export interface AuthResponse {
  accessToken: string;
  role: UserRole;
}

// 사용자 인증 상태
export interface AuthState {
  accessToken: string | null;
  role: UserRole | null;
  isAuthenticated: boolean;
}

export type MeResponse = {
  name: string;
  profileImage: string | null;
};
