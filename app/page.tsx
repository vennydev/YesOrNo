'use client'

import React, { useState } from 'react';
import styled from "styled-components";
import Post from '../components/Post';
import { getCsrfToken, signOut, useSession } from 'next-auth/react';

type StringDatas = (string)[];
interface PostProps {
  string: string[]
}

type IsSelected = {
  isSelected : string | null;
}

const arr: StringDatas = ['진행중', '진행중2', '진행중3'];
const arr2: StringDatas = ['마감', '마감2', '마감3'];



const Tab = () => {
  const [selectedTab, setSelectedTab] = useState(1);
  const {data} = useSession();
  console.log('session:',data);
  async function myFunction() {
    const csrfToken = await getCsrfToken();
    console.log('token:', csrfToken);
  }
  
  myFunction();
  
  const handleClick = (index: number) => {
    setSelectedTab(index);
  };

  const getOpenPost = () => {
    console.log('get opened post successfully');
  };
  const getClosedPost = () => {
    console.log('get closed post successfully');
  };
  
  return (
    <HomeContainer>
      <TabContainer>
        <TabWrapper>
          <TabButton $isSelected={selectedTab === 1 ? "selected" : null} onClick={() => handleClick(1)}>진행 중</TabButton>
          <TabButton $isSelected={selectedTab === 2 ? "selected" : null} onClick={() => handleClick(2)}>마감</TabButton>
        </TabWrapper>
      </TabContainer>
      <PostContainer>
        {selectedTab === 1 
        ?  
        <>
          {arr.map((a, index) => {
            return (
              <Post text={a} username="마일로앞발" time="종료 시간 : 12:40:00" votingBtn={true} key={index}/>
              )})} 
        </>
        : 
        <>
          {arr2.map((a, index) => {
            return (
              <Post text={a} username="마일로앞발" time="종료 시간 : 12:40:00" votingBtn={true} key={index}/>
              )})}
        </>
        }
        </PostContainer>
    </HomeContainer>

  )
}

const HomeContainer = styled.div`
  padding:0 20px;
`;

const TabContainer = styled.div`
  margin-top:96px;
`;

const TabWrapper = styled.div`
  width: 124px;
  font-size: 20px;
  display: flex;
  gap:10px;
  margin-top:42px;
`;

const TabButton = styled.div<{$isSelected?: any}>`
  text-decoration: none;
  font-weight: 400;
  cursor: pointer;
  color:${(props) => props.$isSelected === "selected" ? "black" : props.theme.color.dimFontColor}
`;

const PostContainer = styled.div`
  padding-bottom: 99px;
`;
  

export default Tab