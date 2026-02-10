import styled from "styled-components";
import Profile from "./Profile";
import { typography } from "../../styles/typography";
import LOGO from "../../assets/images/logo_pc.svg?react";
import { useNavigate } from "react-router-dom";

interface Props {
  mentorName: string;
}

const Header = ({ mentorName }: Props) => {
  const navigate = useNavigate();

  return (
    <Wrap>
      <Inner>
        <LogoBox onClick={() => navigate("/mentor/dashboard")}>
          <LOGO />
        </LogoBox>

        <Profile name={mentorName} />
      </Inner>
    </Wrap>
  );
};

const Wrap = styled.header`
  position: fixed;
  top: 0;
  left: 0;

  width: 100%;
  height: 64px;
  background: var(--color-white);
  border-bottom: 1px solid var(--color-gray-100);
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);

  display: flex;
  align-items: center;

  z-index: 1000;
`;

const Inner = styled.div`
  width: 100%;
  margin: 0 auto;
  padding: 0 100px;

  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const LogoBox = styled.div`
  width: 72px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  ${typography.t16m}

  cursor: pointer;
`;

export default Header;
