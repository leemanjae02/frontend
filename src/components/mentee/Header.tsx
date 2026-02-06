import styled from "styled-components";
import { typography } from "../../styles/typography";
import Alarm from "../Alarm";

interface Props {
  hasUnread?: boolean;
  onClickLogo?: () => void;
  onClickBell?: () => void;
  className?: string;
}

const MenteeHeader = ({
  hasUnread = false,
  onClickLogo,
  onClickBell,
  className,
}: Props) => {
  return (
    <Wrap className={className}>
      <Inner>
        <LogoButton type="button" onClick={onClickLogo}>
          <LogoMock>로고</LogoMock>
          {/* <Logo src={logoSrc} alt="로고" /> */}
        </LogoButton>

        <Right>
          <Alarm hasUnread={hasUnread} onClick={onClickBell} />
        </Right>
      </Inner>
    </Wrap>
  );
};

const Wrap = styled.header`
  width: 100%;
  height: 48px;
  background: var(--color-white);
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);

`;

const Inner = styled.div`
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
`;

const LogoButton = styled.button`
  border: 0;
  background: transparent;
  padding: 0;

  display: inline-flex;
  align-items: center;

  cursor: pointer;

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px var(--color-primary-200);
    border-radius: 6px;
  }
`;

const LogoMock = styled.div`
  width: 45px;
  height: 24px;

  background: var(--color-primary-500);
  color: var(--color-black);

  display: flex;
  align-items: center;
  justify-content: center;

  ${typography.t14sb}
`;

const Right = styled.div`
  display: inline-flex;
  align-items: center;
`;

export default MenteeHeader;
