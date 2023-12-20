"use client"

import CheckDeleteImageModal from "./modal/CheckDeleteImageModal";
import LoginModal from "./modal/LoginModal";

interface ModalProps {
  type: string,
  closeModal: () => void;
  handleImage?: () => void;
  selectBgImage?: (e: any, image: any) => void;
  setActiveTab?: (url: string) => void,
}

export default function Modal({ type, closeModal, setActiveTab, selectBgImage }: ModalProps ) {

  switch(type) {
    case 'login': 
      return (
      <LoginModal 
        closeModal={closeModal} 
        to='/login' 
        text={"로그인을 해야 \n 이용가능한 서비스 입니다."} 
        setActiveTab={setActiveTab}/> 
      )
    case 'deleteDefaultImage':
      return (
        <>
          {selectBgImage &&
            <CheckDeleteImageModal 
              closeModal={closeModal} 
              text={"배경을 선택하면 \n 사진이 삭제됩니다."} 
              selectBgImage={selectBgImage}/>
          }
        </>
      )
  };
};