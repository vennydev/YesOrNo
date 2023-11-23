"use client"

import Link from "next/link";
import styled from "styled-components";

interface ModalProps {
  closeModal: () => void,
  setActiveTab: () => void,
}

export default function LoginModal({closeModal, setActiveTab}: any ) {
  return (
    <LoginModalContainer onClick={() => {closeModal(); setActiveTab("home")}}>
      <ModalWrapper onClick={(e) => e.stopPropagation()}>
        <ModalMsg>로그인을 해야<br />이용가능한 서비스 입니다.</ModalMsg>
        <Link href={'/login'} onClick={closeModal}>
          <NaviToLoginPageBtn>확인</NaviToLoginPageBtn>
        </Link>
      </ModalWrapper>
    </LoginModalContainer>
  )
};

const LoginModalContainer = styled.div`
  position: fixed;
	top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgb(102, 102, 102);
  display: flex;
  justify-content: center;
  align-items:center;
`;

const ModalWrapper = styled.div`
  padding: 0px 20px 20px 20px;
  width: 335px;
  height: 180px;
  border-radius: 20px;
  border: ${props => `1px solid ${props.theme.color.mainBorderColor}`};
  background-color: white;
  z-index: 100;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const NaviToLoginPageBtn = styled.span`
  display: flex;
  width: 295px;
  height: 54px;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  border: ${(props) => `1px solid ${props.theme.color.mainBorderColor}`};
  background-color: ${props => props.theme.color.pointColor};
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: 16px;
  letter-spacing: -0.3px;
  color: ${props => props.theme.color.whiteColor};
`;

const ModalMsg = styled.p`
  padding: 26px 0px;
  text-align: center;
  line-height: 28px;
`
