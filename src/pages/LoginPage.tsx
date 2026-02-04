import { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import { login } from "../api/auth";
import { useAuthStore } from "../stores/authStore";
import { typography } from "../styles/typography";
import type { InputStatus } from "../@types/InputStatus";

type ErrorType = "none" | "login_failed";

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--color-white);
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 0 20px;
  max-width: 375px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
`;

const LogoSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 120px;
  padding-bottom: 60px;
`;

const Logo = styled.h1`
  ${typography.t30sb}
  color: var(--color-primary-500);
  margin: 0;
`;

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const InputWrapper = styled.div`
  width: 100%;
`;

const ButtonSection = styled.div`
  margin-top: 32px;
`;

const LoginPage = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorType, setErrorType] = useState<ErrorType>("none");

  // 버튼 활성화 여부
  const isButtonEnabled = loginId.trim() !== "" && password.trim() !== "";

  // Input 상태 결정
  const getIdInputStatus = (): InputStatus => {
    if (errorType === "login_failed") {
      return "error";
    }
    return "default";
  };

  const getPasswordInputStatus = (): InputStatus => {
    if (errorType === "login_failed") {
      return "error";
    }
    return "default";
  };

  const handleLogin = async () => {
    setIsLoading(true);
    setErrorType("none");

    try {
      const response = await login({ loginId, password });
      setAuth(response.accessToken, response.role);

      // Role에 따른 라우팅
      if (response.role === "ROLE_MENTOR") {
        navigate("/mentor/dashboard");
      } else {
        navigate("/");
      }
    } catch {
      setErrorType("login_failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginId(e.target.value);
    if (errorType !== "none") {
      setErrorType("none");
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (errorType !== "none") {
      setErrorType("none");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && isButtonEnabled) {
      handleLogin();
    }
  };

  return (
    <PageContainer>
      <ContentWrapper>
        <LogoSection>
          <Logo>BllsOneShot</Logo>
        </LogoSection>

        <FormSection>
          <InputWrapper>
            <Input
              placeholder="아이디"
              value={loginId}
              onChange={handleIdChange}
              onKeyDown={handleKeyDown}
              status={getIdInputStatus()}
              disabled={isLoading}
            />
          </InputWrapper>

          <InputWrapper>
            <Input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={handlePasswordChange}
              onKeyDown={handleKeyDown}
              status={getPasswordInputStatus()}
              helperText={
                errorType === "login_failed"
                  ? "아이디 혹은 비밀번호를 확인해주세요."
                  : ""
              }
              disabled={isLoading}
            />
          </InputWrapper>
        </FormSection>

        <ButtonSection>
          <Button
            variant="primary"
            onClick={handleLogin}
            disabled={!isButtonEnabled || isLoading}
          >
            {isLoading ? "로그인 중..." : "로그인"}
          </Button>
        </ButtonSection>
      </ContentWrapper>
    </PageContainer>
  );
};

export default LoginPage;
