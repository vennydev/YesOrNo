'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styled from "styled-components";
import { addPostW, addPostB, myPageW, myPageB, homeW, homeB } from '../public/images/index';

const Navigation = () => {
  const [activeTab, setActiveTab] = useState("home");

  const handleClick = (text: string) => {
      setActiveTab(text);
    }

  return (
    <NaviContainer>
      <Link href='/' onClick={() => handleClick("home")}>
        <NaviLink>
          {activeTab === 'home' 
            ? <Image src={homeB} alt={'home'} width={24} height={24} ></Image> 
            : <Image src={homeW} alt={'home'} width={24} height={24} ></Image> 
          }
          <NaviText>홈</NaviText>
        </NaviLink>
      </Link>
      <Link href='/post' onClick={() => handleClick("post")}>
        <NaviLink>
          {activeTab === 'post' 
            ? <Image src={addPostB} alt={'post'} width={24} height={24} ></Image> 
            : <Image src={addPostW} alt={'post'} width={24} height={24} ></Image> 
          }
        <NaviText>질문하기</NaviText>
        </NaviLink>
      </Link>
      <Link href='/' onClick={() => handleClick("mypage")}>
        <NaviLink>
          {activeTab === 'mypage' 
            ? <Image src={myPageB} alt={'mypage'} width={24} height={24} ></Image> 
            : <Image src={myPageW} alt={'mypage'} width={24} height={24} ></Image> 
          }
          <NaviText>마이페이지</NaviText>
        </NaviLink>
      </Link>
    </NaviContainer>
  )
}

const NaviContainer = styled.div`
  height: 83px;
  width: 100%;
  position: fixed;
  bottom: 0;
  padding:0 38.5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0px -0.33px 0px 0px #000;
  background-color: white;
`;

const NaviLink = styled.div`
  text-decoration: none;
  color:inherit;
  display: flex;
  width: 54px;
  height: 43px;
  flex-direction: column;
  align-items: center;
  gap:4px;
`;


const NaviText = styled.span`
  font-size: 11px;
`;

export default Navigation