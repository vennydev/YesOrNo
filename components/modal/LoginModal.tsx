"use client"

import Link from "next/link";
import styled from "styled-components";

interface ModalProps {
  closeModal: () => void,
  setActiveTab?: (url: string) => void,
  text: string,
  to: string,
}

export default function LoginModal({closeModal, setActiveTab, text, to}: ModalProps ) {
  const divideText = () => {
    return text.split("\n").map((string, index) => (
      <span key={index}>
        {string}
        <br/>
      </span>
  ))};

  return (
    <LoginModalContainer onClick={() => {
      closeModal(); 
      setActiveTab !== undefined && setActiveTab("/")
      }}>
      <ModalWrapper>
        <ModalMsg>{divideText()}</ModalMsg>
              {typeof to === 'string' && (
                <>
                  <Link href={to} onClick={closeModal}>
                    <NaviToLoginPageBtn>확인</NaviToLoginPageBtn>
                  </Link>
                </>
              )}
      </ModalWrapper>
      <TransparentBg/>
    </LoginModalContainer>
  )
};

const LoginModalContainer = styled.div`
  position: absolute;
  top:0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items:center;
  z-index: 1000;
`;

const TransparentBg = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color:black;
  z-index: 99;
  opacity: 0.6;
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
`;

const CanelBtn = styled.button`

`;