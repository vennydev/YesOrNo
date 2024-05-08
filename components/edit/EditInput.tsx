"use client"

import styled from "styled-components";
import { TextRemover } from "@/public/images";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { doc, updateDoc } from "firebase/firestore";
import firestore from "@/firebase/firestore";
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react';
import useRandomNameGenerator from "@/hooks/useRandomNameGenerator";

interface EditInputPropsType {
  text: string;
  randomname: string;
}

export default function EditInput({text, randomname}: EditInputPropsType) {
  const searchParams = useSearchParams();
  const nameParam = searchParams.get('username');
  const [username, setUsername] = useState('');
  
  const router = useRouter();
  const pathname = usePathname();
  const session = useSession();
  const userid = session.data?.user.id;
  const currentPath = (pathname === '/login/createname') ? 'create-name' : 'edit-name';
  
  const handleNameChange = ({target : { value }}: any) => {
    setUsername(value);
  };
  const handleSubmit = async () => {
    const userRef = doc(firestore, "users", String(userid));
    try {
      await updateDoc(userRef, {
        nickname: username
      });
      if(typeof username === 'string' ){
        localStorage.setItem('user', JSON.stringify({id: userid, nickname: username}));
      }
      router.push('/');
    } catch (error) {
      alert(error)
    }
  };

  useEffect(() => {
      !!nameParam ? setUsername(nameParam): setUsername(randomname!);
  }, [])

  return (
    <ModifyWrapper>
      <InputContainer>
        <NameLabel htmlFor="username" $currentPath={currentPath}>{text}</NameLabel>  
        <InputWrapper>
          <NameInput type="text" id='username' value={username || ''} onChange={(e) => handleNameChange(e)} placeholder={'프로필 이름을 변경해주세요'}/>
            {currentPath === 'edit-name' ? (
            <DeleteText onClick={() => setUsername('')}>
              <Image src={TextRemover} alt="delete-text" width={24} height={24}/>
            </DeleteText>
            ) : null}
        </InputWrapper>
        <SubmitBtn $username={username} onClick={() => handleSubmit()}>완료</SubmitBtn>
      </InputContainer>
    </ModifyWrapper>
  )
};

const ModifyWrapper = styled.div`
  padding: 0 20px;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-top:70px;
`;

const NameLabel = styled.label<{$currentPath: string}>`
  ${({ $currentPath }) => $currentPath === 'create-name' 
    ? `
      font-size: 20px;
      font-style: normal;
      font-weight: 600;
      line-height: 32px;
      width: 128px;
      height:64px;
      ` 
    : `
      font-size: 14px;
      font-style: normal;
      font-weight: 600;
      line-height: 16px; /* 114.286% */
      letter-spacing: -0.3px;
      color: #8C8C8C;
    `}
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
  ${({ $username, theme }) => ($username === '' || $username === null) ? `
    border: #F2F2F2;
    color: ${theme.color.dimBrightFontCOlor};
    background: #F2F2F2;
    ` : `
    border: 1px solid ${theme.color.mainBorderColor};
    color: inherit;
    background: ${theme.color.yesBarColor};
    ` };
  display:flex;
  border-radius: 8px;
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
  bottom: 54px;
  left: 50%;
  transform: translateX(-50%);
`