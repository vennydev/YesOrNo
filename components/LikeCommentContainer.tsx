'use client'

import styled from 'styled-components';
import Image from 'next/image'
import { Comment, Like, LikeEmpty } from '@/public/images';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { arrayUnion, collection, doc, getDoc, increment, query, setDoc, updateDoc } from 'firebase/firestore';
import firestore from '@/firebase/firestore';
import { getItem } from '@/utils/localStorage';
import CommentBox from './CommentBox';
import { useRecoilState } from 'recoil';
import { showCommentBoxState } from '@/recoil';

interface LikeCommentContainerPropsType {
  postID: string | undefined;
}

export default function LikeCommentContainer(props: LikeCommentContainerPropsType) {
  const [likesCount, setLikesCount] = useState(0);
  const [commentText, setCommentText] = useState("");
  const [showCommentBox, setShowCommentBox] = useRecoilState(showCommentBoxState);
  const [liked, setLiked] = useState(false);

  const { postID } = props;
  const userid = getItem("userID");

  const renderCommentBox = () => {
    console.log('render comment', );
    setShowCommentBox(!showCommentBox);
  }
  
  const likedStatus = useCallback(async() => {
    const likesRef = doc(firestore, "likes", String(userid));
    const likesSnap = await getDoc(likesRef);
    if(likesSnap.exists()){
      const likesArr = likesSnap.data().likes;
      likesArr.includes(postID) ? setLiked(true) : setLiked(false);
    }else{
      console.log('cannot find likes arr for this user')
    }
  }, [userid, postID]);
  
  const getLikesCount = useCallback(async() => {
    const postRef = doc(firestore, "posts", String(postID));
    const postSnap = await getDoc(postRef);
    const count = postSnap.exists() && postSnap.data().likes;
    setLikesCount(count);
  }, []);

  const handleLike = useCallback(async () => {
    const postRef = doc(firestore, "posts", String(postID));
    const likesRef = doc(firestore, "likes", String(userid));
    const likesSnap = await getDoc(likesRef);
    const likesArr = likesSnap?.data()?.likes;
    
    if(liked){
      setLiked(false);
      setLikesCount(likesCount - 1);
      await updateDoc(postRef, {
        likes: increment(-1)
      });
      const filteredLikesArr = likesArr.filter((id: string) => id !== postID);
      
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
        likes: arrayUnion(postID)
      });
    }}, [postID, userid, liked, likesCount])

    useEffect(() => {
      likedStatus();
    }, [])
    
    useEffect(() => {
      getLikesCount()
    }, [])

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
          <div>0</div>
        </IconsWrapper>
      </LikeCommentIcons>
      <CommentWrapper onClick={renderCommentBox}>
        <LatestComment>
          <Username>마일로앞발</Username>
          <span>야식은 못참지;;</span>
        </LatestComment>
        <CommentInput placeholder='댓글을 입력해주세요.'></CommentInput>
      </CommentWrapper>
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