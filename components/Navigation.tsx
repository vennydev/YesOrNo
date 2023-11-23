'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styled from "styled-components";
import { addPostW, addPostB, myPageW, myPageB, homeW, homeB } from '../public/images/index';
import { useSession } from 'next-auth/react';
import LoginModal from './LoginModal';

const Navigation = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  const {data: session, status } = useSession();
  
  const handleClick = (e: any, text: string) => {
      setActiveTab(text);
      console.log('status', status, session);
      if (status !== "authenticated") {
          if(text === "post" || text === "mypage"){
          setIsModalVisible(true);
          e.preventDefault();
          }
        }
    };

    const closeModal = () => {
      setIsModalVisible(false)
    };
    
  return (
    <NaviContainer>
      <Link href='/' onClick={(e) => handleClick(e, "home")}>
        <NaviLink>
          {activeTab === 'home' 
            ? <Image src={homeB} alt={'home'} width={24} height={24} ></Image> 
            : <Image src={homeW} alt={'home'} width={24} height={24} ></Image> 
          }
          <NaviText>홈</NaviText>
        </NaviLink>
      </Link>
      <Link href='/post' onClick={(e) => handleClick(e, "post")}>
        <NaviLink>
          {activeTab === 'post' 
            ? <Image src={addPostB} alt={'post'} width={24} height={24} ></Image> 
            : <Image src={addPostW} alt={'post'} width={24} height={24} ></Image> 
          }
        <NaviText>질문하기</NaviText>
        </NaviLink>
      </Link>
      <Link href='/mypage' onClick={(e) => handleClick(e, "mypage")}>
        <NaviLink>
          {activeTab === 'mypage' 
            ? <Image src={myPageB} alt={'mypage'} width={24} height={24} ></Image> 
            : <Image src={myPageW} alt={'mypage'} width={24} height={24} ></Image> 
          }
          <NaviText>마이페이지</NaviText>
        </NaviLink>
      </Link>
      {isModalVisible && <LoginModal closeModal={closeModal} setActiveTab={setActiveTab}/>}
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