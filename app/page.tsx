'use client'

import React, { useEffect, useRef, useState } from 'react';
import styled from "styled-components";
import Link from 'next/link';
import Post from '../components/Post';

type StringDatas = (string)[];
interface PostProps {
  string: string[]
}

type IsSelected = {
  isselected : string | null;
}

const arr: StringDatas = ['진행중', '진행중2', '진행중3'];
const arr2: StringDatas = ['마감', '마감2', '마감3'];

const Tab = () => {
  const [selectedTab, setSelectedTab] = useState(1);
  const firstBtnRef =useRef<any>(null);
  
  const handleClick = (index: number) => {
    setSelectedTab(index);
  };

  const getOpenPost = () => {
    console.log('get opened post successfully');
  };
  const getClosedPost = () => {
    console.log('get closed post successfully');
  };

  useEffect(() => {
    firstBtnRef.current?.focus();
  }, []);
  
  return (
    <HomeContainer>
      <TabContainer>
        <TabWrapper>
          <TabButton isselected={selectedTab === 1 ? "selected" : null} onClick={() => handleClick(1)}>진행 중</TabButton>
          <TabButton isselected={selectedTab === 2 ? "selected" : null} onClick={() => handleClick(2)}>마감</TabButton>
          {/* <button className={cn("tabButton", selectedTab === 2 ? "bold" : null)} onClick={() => handleClick(2)}>마감</button> */}
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

const PostContainer = styled.div`
  padding-bottom: 99px;
`;

const HomeContainer = styled.div`
  padding:0 20px;
`;

const TabContainer = styled.div`
  margin-top:42px;
`;

const TabWrapper = styled.div`
  width: 124px;
  font-size: 20px;
  display: flex;
  gap:10px;
  margin-top:42px;
`;

const TabButton = styled.div<IsSelected>`
  text-decoration: none;
  font-weight: 400;
  cursor: pointer;
  color:${(props) => props.isselected === "selected" ? "black" : props.theme.color.dimFontColor}
`;
  

export default Tab