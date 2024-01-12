"use client"

import { useEffect, useState } from "react";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import firestore from "@/firebase/firestore";
import { useSession } from "next-auth/react";
import { PostsProps } from "@/app/page";
import PostCard from "./PostCard";
import styled from "styled-components";

interface MyPostPropsType {
  id: string,
}

export default function MyPost({ id }: MyPostPropsType) {
  const [post, setPost] = useState<any>(null);
  useEffect(() => {
    async function getMyPost() {
      const docRef = doc(firestore, "posts", id);
      try{
        const q = await getDoc(docRef);
        setPost(q.data());
      } catch(error) {
        alert(error)
      }
    }
    getMyPost(); 
  }, []);

  return (
    <MyPostContainer>
      {post !== null &&
          <PostCard 
            text={post.text} 
            yesCount={post.yesUser.length} 
            noCount={post.noUser.length} 
            author={post.author} 
            imageUrl={post.imageUrl} 
            expiredAt={post.expiredAt}
            votingBtn={true} 
            id={id} 
            isOver={post.isOver}
            isParticipantCountPublic={post.isParticipantCountPublic}
            />
      }
    </MyPostContainer>
  )
};

const MyPostContainer = styled.div`
`