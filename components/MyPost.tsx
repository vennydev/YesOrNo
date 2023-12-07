"use client"

import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import firestore from "@/firebase/firestore";
import { useSession } from "next-auth/react";
import { PostsProps } from "@/app/page";
import PostCard from "./PostCard";
import styled from "styled-components";


export default function MyPost() {
  const [mypost, setMyPost] = useState<any>([]);
  const { data: session } = useSession();

  useEffect(() => {
    async function getMyPost() {
      const q = query(collection(firestore, 'posts'), where("author", "==", session?.user?.name))
      const querySnapshot = await getDocs(q);
      const data= querySnapshot.docs.map((doc) => {
        return doc.data();
      });
      setMyPost(data);
    }
  getMyPost()
  }, [session?.user?.name]);

  return (
    <MyPostContainer>
      {mypost.length !== 0 && mypost.map((post: PostsProps, index: number) => {
        return (
            <PostCard text={post.text} username={post.author} imageUrl={post.imageUrl} time="종료 시간 : 12:40:00" votingBtn={true} id={post.id} key={index}/>
        )
      })}
    </MyPostContainer>
  )
};

const MyPostContainer = styled.div`
`