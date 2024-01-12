'use client'

import React, { useEffect, useState } from 'react';
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
  const [closePosts, setClosePosts] = useState<any>([]);
  const [newUser, setNewUser] = useState(false);
  const toast = useRecoilValue(toastState);
  const {data: session } = useSession();
  const router = useRouter();

  const handleClick = (index: number) => {
    setSelectedTab(index);
  };

  async function getData() {
    const db = getFirestore(firebasedb);
    const postsRef = collection(db, "posts");
    await getDocs(query(postsRef, orderBy("timestamp", "desc")))
    .then((value) => {
      const openArr: any = [];
      const closeArr: any = [];
      
      async function update(id: string){
        const postRef = doc(db, "posts", id);
        await updateDoc(postRef, {
          isOver: true
        });
      }
      value.forEach((doc) => {
        let currentTime = new Date().getTime();
        if (doc.data().expiredAt > currentTime){
          openArr.push({...doc.data(), id: doc.id, isOver: false});
        } else if (doc.data().expiredAt < currentTime) {
          update(doc.id);
          closeArr.push({...doc.data(), id: doc.id, isOver: true});
        }
        setOpenPosts(openArr);
        setClosePosts(closeArr);
      })
    });
  };
  useEffect(() => {
    getData();
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
            {openPosts.length > 0 && openPosts.map((post: PostsProps, index: number) => {
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
              </>) 
            : (
            <>
          {closePosts.length > 0  && closePosts.map((post: PostsProps, index:number) => {
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
  padding-bottom: 99px;
`;

const PostCardWrapper = styled.div`
  width: 335px;
  height: 478px;
  border-radius: 20px;
  border: ${(props) => `1px solid ${props.theme.color.mainBorderColor}`};
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  overflow: hidden
`;