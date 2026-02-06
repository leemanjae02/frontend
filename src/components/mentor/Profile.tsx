import styled from "styled-components";
import { typography } from "../../styles/typography";

import UserIcon from "../../assets/images/icon/person.svg?react";

interface Props {
  name: string;
  //   onClick?: () => void; // 혹시 버튼일 경우
}

const Profile = ({ name }: Props) => {
  return (
    <Wrap>
      <IconWrap>
        <UserIcon />
      </IconWrap>
      <Label>{name} 멘토</Label>
    </Wrap>
  );
};

const Wrap = styled.div`
  width: 134px;
  height: 40px;
  padding: 2px 14px;
  border-radius: 8px;

  display: inline-flex;
  align-items: center;
  gap: 10px;

  background: color-mix(in srgb, var(--color-blue-500) 10%, transparent);
  //   cursor: pointer;
`;

const IconWrap = styled.span`
  width: 40px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  svg path {
    stroke: var(--color-blue-500);
  }
`;

const Label = styled.span`
  ${typography.t16m}
  color: var(--color-blue-500);
  white-space: nowrap;
`;

export default Profile;
