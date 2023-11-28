"use client"

import React, { useRef, useState } from 'react';
import { DefaultProfile, DimmedProfile, PostBg1, PostBg2 } from '../public/images';
import Image from 'next/image';
import styled from 'styled-components';
import ColorCircle from './ColorCircle';

const imageArr = [PostBg1, PostBg2];

interface postPropsType {
  text:string;
  username:string;
  imageUrl?: any;
  time:string;
  votingBtn: boolean;
  editing?: boolean;
  selectedImage?: any; 
  setImageUrl?: React.Dispatch<React.SetStateAction<any>>;
  handleEditing?: () => void;
  handleText?: (value: string) => void;
}

export default function PostCard ({
  text, 
  username, 
  imageUrl, 
  time, 
  votingBtn, 
  editing, 
  selectedImage, 
  setImageUrl, 
  handleEditing, 
  handleText
  }:postPropsType) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  
  const handleMouseEnter = (index: number) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  const selectBgImage = (e: any, img: any) => {
    e.stopPropagation();
    setImageUrl?.(img);
  };

  const divideText = () => {
    const topText = text.substring(0,10)
    const bottomText = text.substring(10);
    return (
      <DividedText onClick={handleEditing}>
        {editing ? (
            <PostQuestionInput autoFocus name="textarea" onChange={(e) => handleText?.(e.target.value)}/>
        ) : (
          <>
            <div>{topText}</div>
            <div>{bottomText}</div>
          </>
        )}
      </DividedText>
    )
  };

  const shouldDisplayImage = () => {
    if(imageUrl !== ""){
      return (
        <StyledDefaultImage src={imageUrl}  alt={imageUrl} width={0} height={0}/>
      )
    } else if (selectedImage !== "") {
      return (
        <StyledImage src={selectedImage} alt="DrawingOnPost" width={0} height={0}/>
      )
    }
  };

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
            <>
            </>
            {shouldDisplayImage()}
          {votingBtn ? <PostQuestion>{text}</PostQuestion> : divideText()              
          }
          {votingBtn 
            ?  (
              <PostVoteWrapper>
                  <VoteBtn>YES</VoteBtn>
                    <Divider/>
                  <VoteBtn>NO</VoteBtn>
                </PostVoteWrapper>
            )
            : (
              <>
                <BgSelectorWrapper>
                  {imageArr.map((image, index) => {
                    return (
                      <ColorCircle 
                        image={image} 
                        index={index} 
                        hoveredIndex={hoveredIndex} 
                        handleMouseEnter={handleMouseEnter} 
                        handleMouseLeave={handleMouseLeave} 
                        selectBgImage={selectBgImage} 
                        key={index}/>
                    )
                  })}
                </BgSelectorWrapper>
              </>
            )
          }
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

const PostQuestion = styled.div`
  
`;

const PostQuestionInput = styled.textarea`
  height: 100%;
  width:295px;
  padding:10px 40px;
  resize: none;
  text-align: center;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 28px; 
  border: none;
  overflow: hidden;

  &:focus {
  outline: none;
  }
`;

const PostVoteWrapper = styled.div`
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

const StyledImage = styled(Image)`
  width: 100%;
  height: 313px;
  position: absolute;
  left:0;
  top:0;
  z-index: -1000;
`;

const StyledDefaultImage = styled(Image)`
  width: 100%;
  height: 100%;
  position: absolute;
  left:0;
  top:0;
  z-index: -1000;
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
  color: ${props => `${props.theme.color.disabledfontColor}}`};
`;