"use client"

import React, { useState } from 'react';
import { DefaultProfile, DimmedProfile, DrawingOnPost } from '../public/images';
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

  const divideText = () => {
    const topText = text.substring(0,10)
    const bottomText = text.substring(10);
    return (
      <DividedText>
        <div>{topText}</div>
        <div>{bottomText}</div>
      </DividedText>
    )
  }

  return (
      <PostContainer>
          <PostWrapper $votingBtn={votingBtn}>
            <PostMetadata>
            <PostMetadataLeft>
              {votingBtn 
                ? (<Image src={DefaultProfile} alt='profile-example' width={40} height={40}/>)
                : (<Image src={DimmedProfile} alt='profile-example' width={40} height={40}/>) 
              }
            </PostMetadataLeft>
              <PostMetadataRight>
              <UserName $votingBtn={votingBtn}>{username}</UserName>
              <DeadLine $votingBtn={votingBtn}>{time}</DeadLine>
            </PostMetadataRight>  
            </PostMetadata>
            <PostQuestion $votingBtn={votingBtn}>{votingBtn ? text : divideText()}</PostQuestion>
          {votingBtn 
            ?  (
                <PostVoteWrapper $votingBtn={votingBtn}>
                  <VoteBtn>YES</VoteBtn>
                    <Divider/>
                  <VoteBtn>NO</VoteBtn>
                </PostVoteWrapper>
            )
            : (
              <BgSelectorWrapper>
                  {colorArr.map((color, index) => {
                    return (
                      <ColorCircle color={color} index={index} hoveredIndex={hoveredIndex} handleMouseEnter={handleMouseEnter} handleMouseLeave={handleMouseLeave} key={index}/>
                    )
                  })}
              </BgSelectorWrapper>
            )
          }
        </PostWrapper>
        <Image src={DrawingOnPost} alt="DrawingOnPost" width={0} height={0} style={{ width: '100%', height: 'auto', position: 'absolute', bottom: '0', left: '0'}}></Image>
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
`;

const PostWrapper = styled.div<{$votingBtn? : boolean}>`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items:center;
  justify-content: ${props => props.$votingBtn ? "space-between" : "flex-start"} ;
`; 

const PostMetadata = styled.div`
    align-self: flex-start;
  display: flex;
  align-items: center;
  gap:6px;
`;

const PostMetadataLeft = styled.div`
  display: flex;
  align-items: center;
`;

const PostMetadataRight = styled.div`
  font-size: 11px;
`;

const UserName = styled.div<{$votingBtn? : boolean}>`
  margin-bottom: 3px;
  color: ${props => props.$votingBtn ? "inherit" : `${props.theme.color.disabledfontColor}}`};
`;

const DeadLine = styled.div<{$votingBtn? : boolean}>`
  color: ${props => props.$votingBtn ? "inherit" : `${props.theme.color.disabledfontColor}}`};
`;

const PostQuestion = styled.div<{$votingBtn? : boolean}>`
  color: ${props => props.$votingBtn ? "inherit" : `${props.theme.color.disabledfontColor}}`};
  /* text-align:  ${props => props.$votingBtn ? null : "center"}; */
  /* margin-top:  ${props => props.$votingBtn ? null : "104px"}; */
`;

const PostVoteWrapper = styled.div<{$votingBtn? : boolean}>`
  display: flex;
  width: 100%;
  height: 66px;
  border-radius: 14px;
  border: ${(props) => `1px solid ${props.theme.color.mainBorderColor}`};
  position: relative;
`;

const VoteBtn = styled.button`
  width: 50%;
  text-align: center;
`;

const Divider = styled.div`
  height: 45px;
  width: 1px;
  background: #8C8C8C;
  position: absolute;
  left:50%;
  top:50%;
  transform: translateY(-50%);
`;

const BgSelectorWrapper = styled.ul`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 14px;
  border-top: ${(props) => `2px solid ${props.theme.color.mainFontColor}`};
  position: absolute;
  bottom:0;
  padding:16px;
  margin:0;
  width: 100%;
`;

const DividedText = styled.div`
  text-align: center;
  margin-top: 104px;
  font-size: 16px;
  line-height: 28px; 
`;

export default Post