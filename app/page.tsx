'use client'

import React, { useEffect, useRef, useState } from 'react';
import styled from "styled-components";
import PostCard from '../components/PostCard';
import firebasedb from '@/firebase/firebasedb';
import { getFirestore, collection, getDocs, orderBy, query, updateDoc, doc, where } from "firebase/firestore";
import { useRecoilValue } from 'recoil';
import { useSession } from 'next-auth/react';
import Toast from '@/components/Toast';
import { toastState } from '@/recoil/toast/atom';
import firestore from '@/firebase/firestore';
import { useRouter } from 'next/navigation';
import usePagination from '@/hooks/usePagination';
import Circular from '@/components/loading/Circular';


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
    participatedUser: string[],
}

export default function Home () {
  const [selectedTab, setSelectedTab] = useState(1);
  const [openPosts, setOpenPosts] = useState<any>([]);
  // const [closePosts, setClosePosts] = useState<any>([]);
  const [newUser, setNewUser] = useState(false);
  const toast = useRecoilValue(toastState);
  const {data: session } = useSession();
  const INITIAL_FETCH_COUNT = 5;
  const [target, setTarget] = useState<any>(null);

  const handleClick = (index: number) => {
    setSelectedTab(index);
  };

  // 전체 게시물 받아오기
  // 시간 비교하여 isOVer updated 후 유효한 게시물, 무효한 게시물 구분
  
  // isOver 이 true 인 게시물의 시간을 비교한다
  // 시간이 지났으면 isOver = false;
  // 안 지났으면 그대로 isOver = true;

  const {
    data,     
    closedPosts,
    loading,
    loadingMore,
    noMore,
  } = usePagination('posts', INITIAL_FETCH_COUNT, target);
  // async function getData() {
  //   const db = getFirestore(firebasedb);
  //   const postsRef = collection(db, "posts");
  //   await getDocs(query(postsRef, orderBy("timestamp", "desc")))
  //   .then((value) => {
  //     const openArr: any = [];
  //     const closeArr: any = [];
      
  //     async function update(id: string){
  //       const postRef = doc(db, "posts", id);
  //       await updateDoc(postRef, {
  //         isOver: true
  //       });
  //     }

  //     value.forEach((doc) => {
  //       let currentTime = new Date().getTime();
  //       if (doc.data().expiredAt > currentTime){
  //         openArr.push({...doc.data(), id: doc.id, isOver: false});
  //       } else if (doc.data().expiredAt < currentTime) {
  //         update(doc.id);
  //         closeArr.push({...doc.data(), id: doc.id, isOver: true});
  //       }
  //       setOpenPosts(openArr);
  //       setClosePosts(closeArr);
  //     })

  //   });
  // };

  // useEffect(() => {
    
  // }, [data])

  useEffect(() => {
    // getData();
  }, []);
  
  useEffect(() => {
    if(session){
      localStorage.setItem('userID', session?.user.id);
    }
  }, [session])

  // const checkExistedUserOrNot = async () => {
  //   const userid = localStorage.getItem('userID');
  //   console.log('userid: ', userid);
  //   if(userid === null) return;
  //   console.log('userid: ', userid);
  //   const q = query(collection(firestore, 'users'), where("id", "==", userid));
  //   const querySnapshot = await getDocs(q);

  //   // console.log('q: ', q);
  //   const queryArr = querySnapshot.docs.map(doc => {
  //     return doc.id
  //   });
  //   console.log('queryArr: ', queryArr);
  //   if(queryArr.length > 0){
  //     console.log('가입된 유저', );
  //     return 
  //   }else{
  //     console.log('신규 유저', );
  //     router.push('/login/createname');
  //   }
  // } 

  // useEffect(() => {
  //   checkExistedUserOrNot();
  // }, [])

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
                        isParticipantCountPublic={post.isParticipantCountPublic}
                        key={index}
                        />
                        )})}
                    {data.length >= INITIAL_FETCH_COUNT && <div ref={setTarget}></div>}
                    {loading && <Circular/>}
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
      {loadingMore && <h1>로딩중...</h1>}
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
  padding-bottom: 200px;
`;

const NoMorePostNoti = styled.div`
  margin-top: 20px;
  margin-bottom: 40px;
`;
