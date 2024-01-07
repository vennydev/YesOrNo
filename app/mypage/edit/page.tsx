"use client"

import styled from "styled-components";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from 'next/navigation'

export default function EditUserName() {
  const searchParams = useSearchParams();
  const [username, setUsername] = useState('');
  const router = useRouter()
  
  useEffect(() => {
    const nameParam = searchParams.get('username');
    if(typeof nameParam === 'string') setUsername(nameParam);
  }, [])

  return (
    <MyPageSection>
      <MyPageWrapper>
        <Header>
          <GoBack onClick={() => router.back()}>
            <ArrowBackIosNewIcon />
          </GoBack>
          <EditPageTitle>프로필 이름 변경</EditPageTitle>
        </Header>
        <InputWrapper>
          <NameLabel htmlFor="username">프로필 이름</NameLabel>
          <NameInput type="text" id='username' value={username} onChange={(e) => setUsername(e.target.value)}/>
        </InputWrapper>
      </MyPageWrapper>
    </MyPageSection>
  )
}

const MyPageSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 65px 20px 99px 20px;
  height: 100%;
`;

const MyPageWrapper = styled.div`
  width: 335px;
  background-color: olivedrab;
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
  top:11px;
  left:10px;
  cursor: pointer;
`;

const EditPageTitle = styled.div`
  line-height:28px;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 28px;
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const NameLabel = styled.label`
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: 16px; /* 114.286% */
  letter-spacing: -0.3px;
  color: #8C8C8C;
`;

const NameInput = styled.input`
`;

// const GoBack = styled.div`
// `;

