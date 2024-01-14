"use client"

import styled from "styled-components";
import Profile from '../../components/Profile';
import { DefaultProfile, Pencil } from "@/public/images";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import firestore from "@/firebase/firestore";
import MyPost from "@/components/MyPost";
import { RecoilEnv, useRecoilValue } from "recoil";
import { toastState } from "@/recoil/toast/atom";
import Toast from "@/components/Toast";
import Link from 'next/link';

RecoilEnv.RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED = false;

export default function Mypage() {
  const [isSelected, setIsSelected] = useState(0);
  const [myPostsArr, setMyPostsArr] = useState([]);
  const [votedPosts, setVotedPosts] = useState([]);
  const [name, setName] = useState('');

  const toast = useRecoilValue(toastState);
  
  
  const handleSelectedTab = (index: number) => {
    setIsSelected(index);
  };
  
  useEffect(() => {
    const user = localStorage.getItem("user");
    const username = typeof user === 'string' && JSON.parse(user).nickname;
    setName(username);
      async function getData() {
        const userid = localStorage.getItem("userID");
        const docRef = doc(firestore, "users", String(userid));
        const docSnap = await getDoc(docRef);
        if(docSnap.data() === undefined){
          return
        }else{
          setMyPostsArr(docSnap?.data()?.myPosts.reverse());
          setVotedPosts(docSnap?.data()?.votedPosts.reverse());
        }
      };
      getData();
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
        { isSelected === 0 ? (
          (myPostsArr.length > 0 && myPostsArr !== undefined) ? myPostsArr.map(id => {
            return (<MyPost key={id} id={id}/>)
          }) : <EmptySection>게시물이 없습니다.</EmptySection>
        ) : (
          (votedPosts.length > 0 && votedPosts !== undefined) ? votedPosts.map(id => {
            return (<MyPost key={id} id={id}/>)
          }) : <EmptySection>준비중입니다.</EmptySection>
        ) }
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
}

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
`
 