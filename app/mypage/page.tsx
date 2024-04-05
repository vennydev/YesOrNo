"use client"

import styled from "styled-components";
import Profile from '../../components/Profile';
import { DefaultProfile, Pencil } from "@/public/images";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import firestore from "@/firebase/firestore";
import { RecoilEnv, useRecoilState, useRecoilValue } from "recoil";
import { toastState } from "@/recoil/toast/atom";
import Toast from "@/components/toast/Toast";
import Link from 'next/link';
import CircularProgress from '@mui/joy/CircularProgress';
import MyPost from "@/components/MyPost";
import { myPostsArrayState, votedPostsArrayState } from "@/recoil/mypage/atom";
import PostCard from "@/components/PostCard";
import { getItem } from "@/utils/localStorage";

RecoilEnv.RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED = false;

export default function Mypage() {
  const [isSelected, setIsSelected] = useState(0);
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false); 
  const [myPostsArr, setMyPostsArr] = useRecoilState(myPostsArrayState);
  const [votedPosts, setVotedPosts] = useRecoilState(votedPostsArrayState);
  const toast = useRecoilValue(toastState);

  const a = useCallback(async () => {
    setIsLoading(true);
    try{
      const userid = localStorage.getItem("userID");
      const docRef = doc(firestore, "users", String(userid));
      const docSnap = await getDoc(docRef);
      Promise.all(
          docSnap?.data()?.votedPosts.map(async (id: string) => {
            const postRef = doc(firestore, "posts", id);
            const docSnap = await getDoc(postRef);
              if(!docSnap?.data()?.isDeleted){
                return docSnap?.data()
              }else{
                return null
              }
          })
        ).then(arr => {
          const filterdVotedPosts = arr.filter(value => {return typeof value !== null && value});
          setVotedPosts(filterdVotedPosts.reverse());
          setIsLoading(false)
        });
    }catch(error){
      console.log('error: ', error)
    }
  }, [setVotedPosts]);


  const getData = useCallback(async () => {
    setIsLoading(true)
    try{
      const userid = localStorage.getItem("userID");
      const docRef = doc(firestore, "users", String(userid));
      const docSnap = await getDoc(docRef);

       Promise.all(
        docSnap?.data()?.myPosts.map(async (id: string) => {
          const postRef = doc(firestore, "posts", id);
          const docSnap = await getDoc(postRef);
          if(!docSnap?.data()?.isDeleted){
            return docSnap?.data()
          }else {
            return null
          }
        })
      ).then(arr => {
        const filteredValue = arr.filter(value => { return typeof value !== null && value } );
        setMyPostsArr(filteredValue.reverse());
        setIsLoading(false)
      });
    }catch{
      console.log('data fetching error in mypage')
    }
  }, [setMyPostsArr, setIsLoading]);

  const handleSelectedTab = (index: number) => {
    setIsSelected(index);
    if(index === 1)a();
  };

  useEffect(() => {
    getData();
  }, []);

  const getUsername = async () => {
    const q = query(collection(firestore, "users"), where("id", "==", String(getItem('userID'))));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => setName(doc.data().nickname));
  };

  useEffect(() => {
    getUsername();
  }, []);

  return (
    <MyPageSection>
      <UserInfoWrapper>
        <Profile image={DefaultProfile.src} alt={"default profile"} width={90} height={90} />
        <UserIDWrapper>
          <span>{name}</span>
          <StyledLinkToEdit 
            href={{
              pathname: '/mypage/edit',
              query: {
                username: name
              }}}
              >
            <Image src={Pencil} alt="edit-button" width={14} height={14}></Image>
          </StyledLinkToEdit>
        </UserIDWrapper>
      </UserInfoWrapper>
      <TabWrapper>
        <TabButton $focused={isSelected === 0} onClick={() => handleSelectedTab(0)}>내가 만든 투표</TabButton>
        <TabButton $focused={isSelected === 1} onClick={() => handleSelectedTab(1)}>참여한 투표</TabButton>
      </TabWrapper>
      <MyPostsContainer>
        <MyPostWrapper>
            { isSelected === 0 ? (
              <>
                {isLoading 
                ? <LoadingWrapper><div><CircularProgress color="neutral"/> </div></LoadingWrapper> 
                : (
                  myPostsArr.length > 0 
                  ? myPostsArr.map((post, index) => {
                    return (
                      <MyPost key={index} post={post} myPost/>
                    )
                  })
                  : <EmptySection><EmptyText>내가 만든 투표가 없습니다. [질문하기]에서 투표게시글을 만들어보세요.</EmptyText></EmptySection>
                  )
                }
              </>
            )
            : (
              <>
                {isLoading 
                ? <LoadingWrapper><div><CircularProgress color="neutral"/></div></LoadingWrapper>
                : (
                votedPosts.length > 0 
                  ? votedPosts.map((post, index) => {
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
                    )
                  })
                  : <EmptySection><EmptyText>참여한 투표가 없습니다. [홈]에서 다른 사람의 게시물에 투표를 해보세요.</EmptyText></EmptySection>
                  )
                }
              </>
            )
          }
        </MyPostWrapper>
          <SignOutBtnWrapper>
            <button onClick={() => {
              signOut({ callbackUrl: '/' });
              localStorage.removeItem("userID");
              }}>로그아웃</button>
            {/* <Divider/> */}
            <button onClick={()=> {
              alert("곧 됩니다..!")
            }}>탈퇴</button>
          </SignOutBtnWrapper>
      </MyPostsContainer>
      {toast.isShown && <Toast position='bottom'/>}
    </MyPageSection>
  )
};


const MyPageSection = styled.div`
  padding-top: 75px;
  height:100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const UserInfoWrapper = styled.div`
  margin-bottom: 29px;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const UserIDWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap:3px;
  margin-top:9px;
`;

const TabWrapper = styled.div`
  display: flex;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 28px;
  width: 100%;
`;

const TabButton = styled.button<{$focused: boolean}>`
  width: 50%;
  text-align: center;
  padding-bottom: 10px;
  border-bottom: ${props => props.$focused === true ?  `1px solid ${props.theme.color.mainBorderColor}` : `1px solid ${props.theme.color.dimBorderColor}`};
  cursor: pointer;
`;


const MyPostsContainer = styled.div`
  padding: 25px 20px;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const MyPostWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

const LoadingWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const SignOutBtnWrapper = styled.div`
  font-size: 11px;
  color: ${props => props.theme.color.main};
  height: 80px;
  margin-bottom:58px;
  display:flex;
  align-items: center;
  justify-content: center;
`;

const StyledLinkToEdit = styled(Link)`
  padding: 0 4px;
`;

const EmptySection = styled.div`
      height: 100%;
    display: flex;
    align-items: center;
`;

const EmptyText = styled.span`
  
`