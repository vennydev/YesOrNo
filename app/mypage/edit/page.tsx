"use client"

import styled from "styled-components";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useState } from "react";
import { useRouter, useSearchParams } from 'next/navigation'
import { collection, doc, getDoc, getDocs, query, updateDoc, where, writeBatch } from "firebase/firestore";
import firestore from "@/firebase/firestore";
import Image from "next/image";
import { TextRemover } from "@/public/images";

export default function EditUserName() {
  const searchParams = useSearchParams();
  const nameParam = searchParams.get('username');
  const [username, setUsername] = useState(nameParam);
  const router = useRouter();

  const handleNameChange = ({target : { value }}: any) => {
    setUsername(value);
  };

  const handleSubmit = async () => {
    const userid = localStorage.getItem("userID");
    const q = query(collection(firestore, "users"), where("nickname", "==", username));
    const querySnapshot = await getDocs(q);
    let isValidated = true;
      if(isValidated){
        try {
          const userRef = doc(firestore, "users", String(userid));
          const docSnap = await getDoc(userRef);
          
          await updateDoc(userRef, {
            nickname: username
          });

          if(docSnap.data() === undefined){
            return
          }else{
            docSnap?.data()?.myPosts.forEach(async (postId: string) => {
              const docRef = doc(firestore, "posts", postId);
              await updateDoc(docRef, {
                author: username
              })
            })
          }
    
          localStorage.setItem("user", JSON.stringify({id: userid, nickname: username}));
          router.push('/mypage');
        } catch (error) {
          console.log('error: ', error);
          
        }
      }
  }

  return (
    <MyPageSection>
      <MyPageWrapper>
        <Header>
          <GoBack onClick={() => router.back()}>
            <ArrowBackIosNewIcon />
          </GoBack>
          <EditPageTitle>프로필 이름 변경</EditPageTitle>
        </Header>
        {/* <EditInput 
          purpose='edit' 
          text='프로필 이름을 변경해주세요' 
          username={username}
          handleSubmit={handleSubmit} 
          handleNameChange={handleNameChange} 
          removeName={removeName}
        /> */}
        <InputContainer>
          <NameLabel htmlFor="username">프로필 이름</NameLabel>  
          <InputWrapper>
            <NameInput type="text" id='username' value={username || ''} onChange={(e) => handleNameChange(e)} placeholder={'프로필 이름을 변경해주세요'}/>
              <DeleteText onClick={() => setUsername('')}>
                <Image src={TextRemover} alt="delete-text" width={24} height={24}/>
              </DeleteText>
          </InputWrapper>
        </InputContainer>
        <SubmitBtn $username={username} onClick={() => handleSubmit()}>완료</SubmitBtn>
      </MyPageWrapper>
    </MyPageSection>
  )
}

const MyPageSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 45px 20px 54px 20px;
  height: 100vh;
  width: 100%;
`;

const MyPageWrapper = styled.div`
  width: 335px;
  height: 100%;
  position: relative;
`;

const Header = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 11px 10px;
  margin-bottom: 20px;
`;

const GoBack = styled.div`
  position: absolute;
  top: 50%;
  left: 10px;
  transform: translateY(-50%);
  cursor: pointer;
`;

const EditPageTitle = styled.div`
  line-height:28px;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 28px;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const NameLabel = styled.label`
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: 16px; /* 114.286% */
  letter-spacing: -0.3px;
  color: #8C8C8C;
`;

const InputWrapper = styled.div`
  border: ${props => `1px solid ${props.theme.color.mainBorderColor}`};
  border-radius: 8px;
  position: relative;
`;

const NameInput = styled.input`
  all: unset;
  width:100%;
  padding: 16px 20px;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 28px;
  outline: none;

  &::placeholder {
    color: ${props => props.theme.color.dimBrightFontCOlor};
  }
`;

const DeleteText = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  top:50%;
  transform: translateY(-50%);
  right:20px;
  cursor: pointer;
`;

const SubmitBtn = styled.button<{$username: string | null}>`
  display:flex;
  border-radius: 8px;
  border: ${props => props.$username !== '' ? `1px solid ${props.theme.color.mainBorderColor}` : '#F2F2F2'};
  background: ${props => props.$username !== '' ? props.theme.color.yesBarColor : '#F2F2F2'};
  color: ${props => props.$username !== '' ? 'inherit' : props.theme.color.dimBrightFontCOlor};
  width: 335px;
  height: 54px;
  padding: 10px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  font-weight: 600;
  line-height: 16px; 
  position: absolute;
  bottom: 10px;
`