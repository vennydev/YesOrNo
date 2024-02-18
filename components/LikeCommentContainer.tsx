'use client'

import styled from 'styled-components';
import Image from 'next/image'
import { Comment, Like, LikeEmpty } from '@/public/images';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { arrayUnion, collection, doc, getDoc, increment, query, setDoc, updateDoc } from 'firebase/firestore';
import firestore from '@/firebase/firestore';
import { getItem } from '@/utils/localStorage';
import { useRecoilState, useRecoilValue } from 'recoil';
import { commentsArray, showCommentBoxState } from '@/recoil';
import CommentBox from './CommentBox';

interface LikeCommentContainerPropsType {
  postID: string;
  likes: number;
}

export interface commentsType {
  author: string,
  userid: string,
  text: string,
  createdAt: number,
  commentid: string,
}

export default function LikeCommentContainer(props: LikeCommentContainerPropsType) {
  const { postID } = props;
  const [comments, setComments] = useState<commentsType[]>([]);
  const [likesCount, setLikesCount] = useState(0);
  const [showCommentBox, setShowCommentBox] = useState({
    postId: "",
    isShown: false,
  });
  const [liked, setLiked] = useState(false);
  
  const userid = getItem("userID");

  const renderCommentBox = () => {
    setShowCommentBox({
      postId: postID,
      isShown: true
    });
  };
  
  const likedStatus = useCallback(async() => {
    const likesRef = doc(firestore, "likes", String(postID));
    const likesSnap = await getDoc(likesRef);
    if(likesSnap.exists()){
      const likesArr = likesSnap.data().likes;
      likesArr.includes(userid) ? setLiked(true) : setLiked(false);
    }else{
      console.log('cannot find likes arr for this user')
    }
  }, [postID, userid]);
  
  const getLikesCount = useCallback(async() => {
    const postRef = doc(firestore, "posts", String(postID));
    const postSnap = await getDoc(postRef);
    const count = postSnap.exists() && postSnap.data().likes;
    setLikesCount(count);
  }, []);

  const handleLike = useCallback(async () => {
    const postRef = doc(firestore, "posts", String(postID));
    const likesRef = doc(firestore, "likes", String(postID));
    const likesSnap = await getDoc(likesRef);
    const likesArr = likesSnap?.data()?.likes;
    
    if(liked){
      setLiked(false);
      setLikesCount(likesCount - 1);
      
      await updateDoc(postRef, {
        likes: increment(-1)
      });
      const filteredLikesArr = likesArr.filter((id: string) => id !== userid);
      
      await updateDoc(likesRef, {
        likes: filteredLikesArr
      });

    }else{
      setLiked(true);
      setLikesCount(likesCount + 1);

      await updateDoc(postRef, {
        likes: increment(1)
      });
              
      await updateDoc(likesRef, {
        likes: arrayUnion(userid)
      });
    }}, [userid, postID, liked, likesCount])

    useEffect(() => {
      likedStatus();
    }, []);
    
    useEffect(() => {
      getLikesCount();
    }, []);

    const getComments = async () => {
      const docRef = doc(firestore, "comments", String(postID));
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setComments(docSnap.data().comments);
      }else{
        console.log("no comments")
      } 
    };

    useEffect(() => {
      getComments();
    }, []);

  return (
    <StyledLikeCommentContainer>
      <LikeCommentIcons>
        <IconsWrapper>
          <Icon onClick={handleLike}>
            <Image src={liked ? Like : LikeEmpty} width={24} height={24} alt='like'></Image>
          </Icon>
          <div>{likesCount}</div>
        </IconsWrapper>
        <IconsWrapper>
          <Icon onClick={renderCommentBox}>
            <Image src={Comment} width={24} height={24} alt='comment-bubble'></Image>
          </Icon>
          <div>{comments.length}</div>
        </IconsWrapper>
      </LikeCommentIcons>
      <CommentWrapper onClick={renderCommentBox}>
        <LatestComment>
          <Username>마일로앞발</Username>
          <span>야식은 못참지;;</span>
        </LatestComment>
        <CommentInput placeholder='댓글을 입력해주세요.'></CommentInput>
      </CommentWrapper>
      {showCommentBox.isShown && <CommentBox comments={comments} setComments={setComments} postID={postID} setShowCommentBox={setShowCommentBox}/>}
    </StyledLikeCommentContainer>
  )
};

const StyledLikeCommentContainer = styled.div`
  border-top: ${(props) => `0.5px solid ${props.theme.color.dimBorderColor}`};
  width: 100%;
  display:flex;
  flex-direction: column;
  gap: 8px;
  padding-top:16px;
  margin-top:16px;
`;

const LikeCommentIcons = styled.div`
  display: flex;
  align-items: center;
  gap:14px;
`;

const IconsWrapper = styled.div`
  display: flex;
  gap:4px;
  align-items: center;
  font-size:14px;
`;

const Icon = styled.div`
  cursor: pointer;
`

const CommentWrapper = styled.div`
`;

const LatestComment = styled.div`
  display:flex;
  justify-content: flex-start;
  gap:6px;
  margin-bottom: 6px;
`;

const Username = styled.span`
  font-weight: 600;
`;

const CommentInput = styled.input`
  all:unset;

  &::placeholder {
    font-size: 12px;
    color: #8C8C8C;
  }
`;