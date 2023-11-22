"use client"

import React, { useState } from 'react';
import { Profile, DimmedProfile } from '../public/images';
import Image from 'next/image';
import styled from 'styled-components';
import ColorCircle from './ColorCircle';

const colorArr = ["red", "orange", "green"];

interface postPropsType {
  text:string;
  username:string;
  time:string;
  votingBtn: boolean;
}

const Post = ({text, username, time, votingBtn}:postPropsType) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  function applyDim(votingBtn: boolean) {
    return votingBtn ? null : "dim-font"
  };

  const handleMouseEnter = (index: number) => {
    setHoveredIndex(index);
  }

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };


  return (
      <PostContainer>
        {/* <div className={cn("post-wrapper", votingBtn ? null : "post-wrapper2" )}> */}
          <PostWrapper>
            <PostMetadata>
            <PostMetadataLeft>
              {votingBtn 
                ? (<Image src={Profile} alt='profile-example' width={40} height={40}/>)
                : (<Image src={DimmedProfile} alt='profile-example' width={40} height={40}/>) 
              }
            </PostMetadataLeft>
              <PostMetadataRight>
              <UserName>{username}</UserName>
              <DeadLine>{time}</DeadLine>
              {/* <div className={cn("user-name", applyDim(votingBtn))}>{username}</div>
              <div className={cn("deadLine", applyDim(votingBtn))}>{time}</div> */}
            </PostMetadataRight>  
            </PostMetadata>
            <PostQuestion>{text}</PostQuestion>
            <PostVoteWrapper>
                <VoteBtn>YES</VoteBtn>
                  <Divider/>
                <VoteBtn>NO</VoteBtn>
              </PostVoteWrapper>
          {/* {votingBtn 
            ? <div className={cn("post_question", applyDim(votingBtn))}>{text}</div> 
            : <div className={cn("post_question", "post_question-dim", "text-center", "dim-font")} dangerouslySetInnerHTML={{__html: text}}></div>
          } */}
          {/* {votingBtn 
            ?  (
              <div className={cn("post_vote-wrapper")}>
                <button className={cn("vote-btn")}>YES</button>
                  <div className={cn("divider")}></div>
                <button className={cn("vote-btn")}>NO</button>
              </div>
            )
            : (
              <ul className={cn("bg-selector-wrapper")}>
                  {colorArr.map((color, index) => {
                    return (
                      <ColorCircle color={color} index={index} hoveredIndex={hoveredIndex} handleMouseEnter={handleMouseEnter} handleMouseLeave={handleMouseLeave} key={index}/>
                    )
                  })}
              </ul>
            )
          } */}
        {/* </div> */}
        </PostWrapper>
      </PostContainer>
  )
}


const PostContainer = styled.div`
  width: 335px;
  height: 478px;
  border-radius: 20px;
  border: ${(props) => `1px solid ${props.theme.color.mainBorderColor}`};
  margin-top: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
`

const PostWrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items:center;
  justify-content: space-between;
`

const PostMetadata = styled.div`
    align-self: flex-start;
  display: flex;
  align-items: center;
  gap:6px;
`

const PostMetadataLeft = styled.div`
  display: flex;
  align-items: center;
`

const PostMetadataRight = styled.div`
  font-size: 11px;
`

const UserName = styled.div`
  margin-bottom: 3px;

`

const DeadLine = styled.div`

`

const PostQuestion = styled.div`

`

const PostVoteWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 66px;
  border-radius: 14px;
  border: ${(props) => `1px solid ${props.theme.color.mainBorderColor}`};
  position: relative;
`

const VoteBtn = styled.button`
  width: 50%;
  text-align: center;
`

const Divider = styled.div`
  height: 45px;
  width: 1px;
  background: #8C8C8C;
  position: absolute;
  left:50%;
  top:50%;
  transform: translateY(-50%);
`

export default Post