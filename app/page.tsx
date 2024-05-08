'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styled from "styled-components";
import PostCard from '../components/PostCard';
import { getSession, useSession } from 'next-auth/react';
import Toast from '@/components/toast/Toast';
import { toastState } from '@/recoil/toast/atom';
import { useRouter } from 'next/navigation';
import usePagination from '@/hooks/usePagination';
import CircularProgress from '@mui/joy/CircularProgress';
import { useRecoilState, useRecoilValue } from 'recoil';
import { showCommentBoxState } from '@/recoil';
import CommentBox from '@/components/slideBox/SlideBox';
import ContentHeaderView from '../components/ContentHeaderView';
import { collection, doc, getDocs, orderBy, query, updateDoc, where } from 'firebase/firestore';
import firestore from '@/firebase/firestore';
import { filterTypeState, filteredClosedPostListState, filteredOpenPostListState, postClosedListState, postListState } from '@/recoil/home';
import { emptyData_comment } from '@/constants';

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
    likes?: number,
    isDeleted: boolean,
    participatedUser: string[],
}

export default function Home () {
  const [selectedTab, setSelectedTab] = useState(0);
  const toast = useRecoilValue(toastState);
  const {data: session } = useSession();
  const INITIAL_FETCH_COUNT = 5;
  const [target, setTarget] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useRecoilState(postListState);
  const [closedData, setClosedData] = useRecoilState(postClosedListState);
  const filteredOpenPosts = useRecoilValue(filteredOpenPostListState);
  const filteredClosePosts = useRecoilValue(filteredClosedPostListState);
  const [totalCount, setTotalCount] = useState(data.list.length);
  const router = useRouter();


  const handleClick = (index: number) => {
    setSelectedTab(index);
  };

  // 무한 스크롤링 참고 코드
  // const {
  //   data,     
  //   closedPosts,
  //   loading,
  //   loadingMore,
  //   noMore,
  // } = usePagination('posts', INITIAL_FETCH_COUNT, target);
  // console.log('loading:', loading);

  useEffect(() => {
    if(session){
      localStorage.setItem('userID', session?.user.id);
    }
  }, []);

  async function updateDocs(id: string){
    const postRef = doc(firestore, "posts", id);
    await updateDoc(postRef, {
      isOver: true
    });
  };

  const updateCloseData = useCallback(async () => {
      const postsRef = collection(firestore, "posts");
      let currentTime = new Date().getTime();
      const q = query(postsRef, 
        where('isOver', '==', false),
        where('isDeleted', '==', false),
        where("expiredAt", "<=", currentTime));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async(doc) => {
        await updateDocs(doc.id)
      });
  }, []);

  const getFirstData = useCallback(async () => {
    const postsRef = collection(firestore, "posts");
  
    const openPostsQuery = query(postsRef, 
      where('isDeleted', '==', false),
      where('isOver', '==', false),
      orderBy("timestamp", "desc"));

    const closedPostsQuery = query(postsRef, 
      where('isDeleted', '==', false),
      where('isOver', '==', true),
      orderBy("timestamp", "desc"));
  
    const openSnap = await getDocs(openPostsQuery);
    const closeSnap = await getDocs(closedPostsQuery);
  
    const openData: any = [];
    const closeData: any = [];
    openSnap.forEach(post => openData.push({...post.data(), id: post.id}));
    closeSnap.forEach(post => closeData.push({...post.data(), id: post.id}));
    setData({list: openData});
    setTotalCount(openData.length);
    setClosedData({list: closeData});
  }, []);

  const getData = useCallback(async () => {
    try{
      await updateCloseData();
      await getFirstData();
      setLoading(false);
    }catch(error){
      console.log(error)
    }
  }, []);

  const setUsername = async () => {
    const id = localStorage.getItem('userID');
    const q = query(collection(firestore, "users"), where("id", "==", id));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => localStorage.setItem('username', doc.data().nickname));
  };

  const checkSessionExist = async () => {
    const session = await getSession();
    !!session && setUsername();
  };

  useEffect(() => {
    if(selectedTab === 0){
      setTotalCount(data.list.length);
    }else if(selectedTab === 1){
      setTotalCount(closedData.list.length);
    }
  }, [selectedTab])

  useEffect(() => {
      setLoading(true);
      getData();
      checkSessionExist();
  }, []);

  console.log('data.list.length: ', data.list.length);
  return (
    <HomeSection>
      <HomeContainer>
        <TabContainer>
          <TabWrapper>
            <TabButton $isSelected={selectedTab === 0 ? "selected" : null} onClick={() => handleClick(0)}>진행중</TabButton>
            <TabButton $isSelected={selectedTab === 1 ? "selected" : null} onClick={() => handleClick(1)}>마감</TabButton>
          </TabWrapper>
        </TabContainer>
        <ContentHeaderView totalPostCount={totalCount} />
        <PostContainer>
          {/* {filteredPosts.map(a => <h1 key={a.id}>{a.text}</h1>)} */}
          {selectedTab === 0
            ? (
              <>
                {data.list.length > 0 ? filteredOpenPosts?.map((post: any) => {
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
                        key={post.id}
                        />
                    )
                        }) : (
                          <EmptyDataSign>
                            <EmptyDataComment>
                              {emptyData_comment}
                            </EmptyDataComment>
                            <GotoPostBtn onClick={() => router.push('/post')}>질문하러가기</GotoPostBtn>

                          </EmptyDataSign>)
                        }
                        {loading && (<CircularWrapper><CircularProgress color="neutral" size="sm"/></CircularWrapper>)}
                        {}
                {/* {loadingMore && (<CircularWrapper><CircularProgress color="neutral" size="sm"/></CircularWrapper>)} */}
                {/* {data.length >= INITIAL_FETCH_COUNT && <ObserverRef ref={setTarget}></ObserverRef>} */}
                {/* {noMore && <NoMorePostNoti>더 이상 불러올 게시물이 없습니다.</NoMorePostNoti>} */}
              </>
            ) : (
              <>
          {closedData.list.length > 0  && filteredClosePosts?.map((post: PostsProps, index:number) => {
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
              key={post.id}
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

const EmptyDataSign = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  gap: 20px;
`

const EmptyDataComment = styled.div`
color: #000;
text-align: center;
font-family: MaruBuri;
font-size: 16px;
font-style: normal;
font-weight: 600;
line-height: 28px;
white-space:pre-wrap
`

const GotoPostBtn = styled.button`
  display: flex;
  padding: 6px 12px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 8px;
  border: 1px solid #000;
  width:80px;
  box-sizing: content-box;
`