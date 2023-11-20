"use client"

import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import { MainLogoTitle, MainLogoHand } from '@/public/images';
import Link from 'next/link';
import styled from "styled-components";


export default function Login() {
  return (
      <LoginContainer>
        <LogoWrapper>
          <Logo>
            <Image src={MainLogoHand} alt='mainlogo-hande' width={105} height={105}/>
            <Image src={MainLogoTitle} alt='mainlogo-title' width={142.57} height={39.647}/>
          </Logo>
        </LogoWrapper>
    
        <LoginBtnWrapper>
          <LoginBtn>카카오톡으로 로그인</LoginBtn>
          <Link href={'/'}>
            <PublicBtn>로그인없이 둘러볼게요.</PublicBtn>
          </Link>
        </LoginBtnWrapper>
    
      </LoginContainer>
  )
};

const LoginContainer = styled.div`
  @media ${({ theme }) => theme.device.mobile} {
  }

  position: relative;
  /* height: calc(100vh - 137px); */
  height: 100%;
  padding:0 20px;
  display: flex;
  flex-direction: column;
`;

const LogoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  `;


const Logo = styled.div`
  margin-top: 305.36px;
  display: flex;
  flex-direction: column;
  justify-items: center;
  align-items: center;
  gap:20px;
  `;

const LoginBtnWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap:16px;
  width: 100%;
  max-width: 335px;
  position: absolute;
  bottom: 54px;
  `;

const LoginBtn = styled.div`
  font-size: 16px;
  height: 60px;
  width: 100%;
  max-width: 335px;
  border-radius: 8px;
  border: ${(props) => `1px solid ${props.theme.color.mainBorderColor}`};
  background-color: #FBEB4E;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-weight: 600;
  letter-spacing: -0.3px;
  line-height: 16px;
  `;

const PublicBtn = styled.p`
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: 16px; /* 114.286% */
  letter-spacing: -0.3px;
`