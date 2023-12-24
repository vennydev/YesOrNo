"use client"

import styled from "styled-components";
import Profile from '../../components/Profile';
import { DefaultProfile, Pencil } from "@/public/images";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import firestore from "@/firebase/firestore";
import MyPost from "@/components/MyPost";
import { RecoilEnv } from "recoil";

// env에 넣을까 말까
RecoilEnv.RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED = false;

export default function Mypage() {
  const [isSelected, setIsSelected] = useState(0);
  const {data: session } = useSession();
  const username = session?.user?.name;
  const [myPostsArr, setMyPostsArr] = useState([]);
  const [votedPosts, setVotedPosts] = useState([]);

  
  async function getData() {
    const userid = localStorage.getItem("userID");
    const docRef = doc(firestore, "users", String(userid));
    const docSnap = await getDoc(docRef);
    setMyPostsArr(docSnap?.data()?.myPosts);
    setVotedPosts(docSnap?.data()?.votedPosts);
  };
  
  const handleSelectedTab = (index: number) => {
    setIsSelected(index);
  };
  
  useEffect(() => {
      getData();
  }, []);

  return (
    <MyPageSection>
      <UserInfoWrapper>
        <Profile image={DefaultProfile.src} alt={"default profile"} width={90} height={90} />
        <UserIDWrapper>
          <span>{username}</span>
          <div>
            <Image src={Pencil} alt="edit-button" width={14} height={14}></Image>
          </div>
        </UserIDWrapper>
      </UserInfoWrapper>
      <TabWrapper>
        <TabButton $focused={isSelected === 0} onClick={() => handleSelectedTab(0)}>내가 만든 투표</TabButton>
        <TabButton $focused={isSelected === 1} onClick={() => handleSelectedTab(1)}>참여한 투표</TabButton>
      </TabWrapper>
      <MyPostsContainer>
        { isSelected === 0 ? (
          myPostsArr.map((id) => {
            return (<MyPost key={id} id={id}/>)
          })
        ) : null}
        <SignOutBtnWrapper>
          <button onClick={() => signOut()}>로그아웃</button>
          {/* <Divider/> */}
          <button>탈퇴</button>
        </SignOutBtnWrapper>
      </MyPostsContainer>
    </MyPageSection>
  )
}

const MyPageSection = styled.div`
  margin-top: 75px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const UserInfoWrapper = styled.div`
  margin-bottom: 29px;
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

// const Divider = styled.div`
//   height: 100%;
//   width: 1px;
//   background: #8C8C8C;
// `;
 