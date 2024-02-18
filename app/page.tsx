'use client'

import React, { useEffect, useRef, useState } from 'react';
import styled from "styled-components";
import PostCard from '../components/PostCard';
import { useSession } from 'next-auth/react';
import Toast from '@/components/Toast';
import { toastState } from '@/recoil/toast/atom';
import { useRouter } from 'next/navigation';
import usePagination from '@/hooks/usePagination';
import CircularProgress from '@mui/joy/CircularProgress';
import { useRecoilValue } from 'recoil';
import { showCommentBoxState } from '@/recoil';
import CommentBox from '@/components/CommentBox';


export interface PostsProps {
    text: string,
    author: string,
    expiredAt: number,
    imageUrl: string, 
    isOver: boolean,
    id: string,
    isParticipantCountPublic: boolean,
    yesUser: string[],
    noUser: string[],
    isDeleted: boolean,
    participatedUser: string[],
}

export default function Home () {
  const [selectedTab, setSelectedTab] = useState(1);
  const toast = useRecoilValue(toastState);
  const {data: session } = useSession();
  const INITIAL_FETCH_COUNT = 5;
  const [target, setTarget] = useState<any>(null);
  const showCommentBox= useRecoilValue(showCommentBoxState);

  const handleClick = (index: number) => {
    setSelectedTab(index);
  };

  const {
    data,     
    closedPosts,
    loading,
    loadingMore,
    noMore,
  } = usePagination('posts', INITIAL_FETCH_COUNT, target);

  useEffect(() => {
    if(session){
      localStorage.setItem('userID', session?.user.id);
    }
  }, [session])
  return (
    <HomeSection>
      <HomeContainer>
        <TabContainer>
          <TabWrapper>
            <TabButton $isSelected={selectedTab === 1 ? "selected" : null} onClick={() => handleClick(1)}>진행중</TabButton>
            <TabButton $isSelected={selectedTab === 2 ? "selected" : null} onClick={() => handleClick(2)}>마감</TabButton>
          </TabWrapper>
        </TabContainer>
        <PostContainer>
          {selectedTab === 1 
            ? (
              <>
                {data.length > 0 && data.map((post: any, index: number) => {
                  return (
                      <PostCard 
                        id={post.id}
                        text={post.text}
                        author={post.author}
                        imageUrl={post.imageUrl} 
                        expiredAt={post.expiredAt}
                        votingBtn={true} 
                        yesCount={post.yesUser.length}
                        noCount={post.noUser.length} 
                        likes={post.likes}
                        isDeleted={post.isDeleted}
                        isParticipantCountPublic={post.isParticipantCountPublic}
                        key={index}
                        />
                        )})}
                {loadingMore && (<CircularWrapper><CircularProgress color="neutral" size="sm"/></CircularWrapper>)}
                {data.length >= INITIAL_FETCH_COUNT && <ObserverRef ref={setTarget}></ObserverRef>}
                {noMore && <NoMorePostNoti>더 이상 불러올 게시물이 없습니다.</NoMorePostNoti>}
              </>
            ) : (
              <>
          {closedPosts.length > 0  && closedPosts.map((post: PostsProps, index:number) => {
            return (
              <PostCard 
              id={post.id}
              text={post.text} 
              author={post.author} 
              imageUrl={post.imageUrl} 
              expiredAt={post.expiredAt}
              votingBtn={true} 
              isOver={post.isOver}
              yesCount={post.yesUser.length} 
              noCount={post.noUser.length}
              likes={post.likes}
              isDeleted={post.isDeleted}
              isParticipantCountPublic={post.isParticipantCountPublic}
              key={index}
              />
              )})}
            </>
          )
        }
          </PostContainer>
      </HomeContainer>
      {toast.isShown && <Toast position='bottom'/>}
    </HomeSection>
  )
};

const HomeSection = styled.div`
  display: flex;
  align-items: center;
  padding:0 20px;
`;

const HomeContainer = styled.div`
  width: 100%;
  margin-top:45px;
`;

const TabContainer = styled.div`
`;

const TabWrapper = styled.div`
  width: 124px;
  font-size: 20px;
  display: flex;
  gap:10px;
  position:static;
  left:0;
`;

const TabButton = styled.div<{$isSelected?: any}>`
  text-decoration: none;
  font-weight: 400;
  cursor: pointer;
  color:${(props) => props.$isSelected === "selected" ? "black" : props.theme.color.dimFontColor}
`;

const PostContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top:16px;
  gap: 16px;
  padding-bottom: 100px;
  position: relative;
`;

const NoMorePostNoti = styled.div`
  margin-top: 20px;
  margin-bottom: 40px;
`;

const ObserverRef = styled.div`
  position: absolute;
  bottom: 0;
  width:100px;
`;

const CircularWrapper = styled.div`
  margin-top: 20px;
`