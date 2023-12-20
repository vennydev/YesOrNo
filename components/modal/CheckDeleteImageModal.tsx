"use client"

import { isCheckDeletionModalVisible, selectedImgIndexState } from "@/recoil/post/atom";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";

interface ModalProps {
  text: string;
  selectBgImage: (e: any | null, image: any) => void;
  closeModal: () => void;
}

export default function CheckDeleteImageModal({ text, closeModal, selectBgImage }: ModalProps ) {
  const setIndex = useSetRecoilState(selectedImgIndexState);
  const setIsCheckDeletionModal = useSetRecoilState(isCheckDeletionModalVisible);
  
  const divideText = () => {
    return text.split("\n").map((string, index) => (
      <span key={index}>
        {string}
        <br/>
      </span>
  ))};

  const handleClick = () => {
    const imageinfo = localStorage.getItem('imageInfo');
    const parsedImageInfo = typeof imageinfo === 'string' && JSON.parse(imageinfo);
    const imageObj = parsedImageInfo.image;
    const imageIndex = parsedImageInfo.index;

    setIndex(imageIndex);
    selectBgImage(null, imageObj);
    setIsCheckDeletionModal(false);
  };

  return (
    <LoginModalContainer>
      <ModalWrapper>
        <ModalMsg>{divideText()}</ModalMsg>
          <BtnWrapper>
            <CanelBtn onClick={closeModal}>취소</CanelBtn>
            <DeleteBtn onClick={handleClick}>삭제</DeleteBtn>
          </BtnWrapper>
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

const BtnWrapper = styled.div`
  width: 100%; 
  height: 54px;
  display:flex;
  gap: 11px;
`;

const Button = styled.button`
  width: 50%;
  border-radius: 8px;
  border: ${(props) => `1px solid ${props.theme.color.mainBorderColor}`};
  font-family: MaruBuri;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: 16px;
  letter-spacing: -0.3px;
`;

const CanelBtn = styled(Button)`
`;

const DeleteBtn = styled(Button)`
  background-color: ${props => props.theme.color.pointColor};
  color: ${props => props.theme.color.whiteColor};
`;


const ModalMsg = styled.p`
  padding: 26px 0px;
  text-align: center;
  line-height: 28px;
`;
