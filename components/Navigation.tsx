'use client'

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styled from "styled-components";
import { addPostW, addPostB, myPageW, myPageB, homeW, homeB } from '../public/images/index';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation'
import LoginModal from './LoginModal';
import ModalPortal from './modal/ModalPortal';

const Navigation = () => {
  const [activeTab, setActiveTab] = useState("/");
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  const {data: session, status } = useSession();
  const pathname = usePathname();
  const isAuthed = status === "authenticated";
  const getUrl = (test: string): string => isAuthed ? `${test}` : '/'; ;

  const handleClick = (text: string) => {
      return isAuthed ? setActiveTab(text) : setIsModalVisible(true);
    };

  const closeModal = () => {
    setIsModalVisible(false)
  };
  useEffect(() => {
    setActiveTab(pathname)
  }, [pathname])

  return (
    <NaviContainer>
      <Link href='/'>
        <NaviLink >
          {activeTab === '/' 
            ? <Image src={homeB} alt='home-icon' width={24} height={24} ></Image> 
            : <Image src={homeW} alt='home-icon' width={24} height={24} ></Image> 
          }
          <NaviText>홈</NaviText>
        </NaviLink>
      </Link>
      <Link href={getUrl('/post')} onClick={(e) => handleClick("/post")}>
        <NaviLink>
          {activeTab === '/post' 
            ? <Image src={addPostB} alt='post-icon' width={24} height={24} ></Image> 
            : <Image src={addPostW} alt='post-icon' width={24} height={24} ></Image> 
          }
        <NaviText>질문하기</NaviText>
        </NaviLink>
      </Link>
      <Link href={getUrl('/mypage')} onClick={(e) => handleClick("/mypage")}>
        <NaviLink>
          {activeTab === '/mypage' 
            ? <Image src={myPageB} alt='mypage-icon' width={24} height={24} ></Image> 
            : <Image src={myPageW} alt='mypage-icon' width={24} height={24} ></Image> 
          }
          <NaviText>마이페이지</NaviText>
        </NaviLink>
      </Link>
      {isModalVisible && 
        <ModalPortal>
          <LoginModal closeModal={closeModal} setActiveTab={setActiveTab}/>
        </ModalPortal>
      }
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
  z-index: 1000;
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