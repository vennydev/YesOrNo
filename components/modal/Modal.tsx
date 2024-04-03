"use client"

import firestore from "@/firebase/firestore";
import { myPostsArrayState, votedPostsArrayState } from "@/recoil/mypage/atom";
import { doc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { useRecoilState } from "recoil";
import styled from "styled-components";

interface ModalProps {
  text: string;
  close: () => void;
  performBtn: boolean;
  postId: string; 
}

export default function Modal(props: ModalProps ) {
  const { text, close, performBtn, postId } = props;
  
  const removePost = useCallback(async() => {
    try{
        const docRef = doc(firestore, "posts", postId);
        await updateDoc(docRef, {
          isDeleted: true,
        });
        location.reload();
      }catch(error){
        console.log('error: ', error)
      }
  } ,[postId])

  const divideText = () => {
    return text.split("\n").map((string, index) => (
      <span key={index}>
        {string}
        <br/>
      </span>
  ))};

  return (
    <ModalContainer onClick={close}>
      <ModalWrapper>
        <ModalMsg>{divideText()}</ModalMsg>
        <BtnWrapper>
          <CloseBtn onClick={close}>취소</CloseBtn>
          {performBtn && <NaviToLoginPageBtn onClick={removePost}>삭제</NaviToLoginPageBtn>}
        </BtnWrapper>
      </ModalWrapper>
      <TransparentBg/>
    </ModalContainer>
  )
};

const ModalContainer = styled.div`
  position: fixed;
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

const BtnWrapper = styled.div`
  display: flex;
  width: 100%;
  gap: 11px;
`

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

const NaviToLoginPageBtn = styled.button`
  display: flex;
  width:50%;
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

const CloseBtn = styled.button`
  border-radius: 8px;
  border: 1px solid #262626;
  width: 50%;
`;