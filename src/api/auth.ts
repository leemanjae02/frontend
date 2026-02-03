import axiosInstance from "./axiosInstance";
import type { LoginRequest, AuthResponse } from "../@types/auth";

// 로그인 API
export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await axiosInstance.post<AuthResponse>("/auth/login", data);
  return response.data;
};

// 토큰 갱신 API (refreshToken은 쿠키에서 자동 전송)
export const refresh = async (): Promise<AuthResponse> => {
  const response = await axiosInstance.post<AuthResponse>("/auth/refresh");
  return response.data;
};

// 로그아웃 API
// export const logout = async (): Promise<void> => {
//   await axiosInstance.post("/auth/logout");
// };
