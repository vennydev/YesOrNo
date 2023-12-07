"use client"

import React, { useEffect, useRef, useState } from 'react';
import { DefaultProfile, DimmedProfile, PostBg1, PostBg2 } from '../public/images';
import Image from 'next/image';
import styled from 'styled-components';
import ColorCircle from './ColorCircle';
import PostImageforHome from './PostImageforHome';
import VotingBtn from './VotingBtn';
import { doc, increment, setDoc, updateDoc } from 'firebase/firestore';
import firestore from '@/firebase/firestore';

const imageArr = [PostBg1, PostBg2];

interface PostCardPropsType {
  text:string;
  username:string;
  imageUrl?: any;
  id?: string;
  time:string;
  votingBtn: boolean;
  editing?: boolean;
  setImageUrl?: React.Dispatch<React.SetStateAction<any>>;
  setFile?: (value: any) => void;
  handleEditing?: () => void;
  handleText?: (value: string) => void;
}

export default function PostCard ({
  text, 
  username, 
  imageUrl, 
  id,
  time, 
  votingBtn, 
  editing, 
  setImageUrl, 
  setFile,
  handleEditing, 
  handleText
  }:PostCardPropsType) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedBg, setSelecteBg] = useState('');
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const handleMouseEnter = (index: number) => {
    setHoveredIndex(index);
  };
  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };
  
  const selectBgImage = async (e: any, img: any) => {
    e.stopPropagation();
    setImageUrl?.(img);
    setFile?.(img);
  };
  
  const divideText = () => {
    const topText = text.substring(0,10)
    const bottomText = text.substring(10);
    return (
      <DividedText onClick={handleEditing} $image={imageUrl.src}>
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

  const postImageforPost = () => {
    if(imageUrl === undefined) return;
    if(imageUrl.src){
      return (
        <StyledDefaultImage src={imageUrl}  alt="default-image" width={0} height={0}/>
      )
    } else {
      return (
        <StyledImage src={imageUrl} alt="uploaded-image" width={0} height={0}/>
      )
    }
  };

  const postImageforHome = () => {
    return ( <PostImageforHome imageUrl={imageUrl}/> )
  };

  const handleVotesCount = async (e: any) => {
    console.log('id: ', id);
    const selectedOption = e.target.value;
    if(selectedOption === 'yes'){
      await updateDoc(doc(firestore, 'posts', String(id)), {
        yesCount: increment(1)
      })
    } else if (selectedOption === 'no'){
      await updateDoc(doc(firestore, 'posts', String(id)), {
        noCount: increment(1)
      })
    }
  }

  return (
      <PostContainer>
        <PostWrapper $votingBtn={votingBtn}>
            <PostMetadata>
            <PostMetadataLeft>
              {votingBtn 
                ? (<Image src={DefaultProfile} alt='profile-example' width={40} height={40} priority />)
                : (<Image src={DimmedProfile} alt='profile-example' width={40} height={40} priority />) 
              }
            </PostMetadataLeft>
              <PostMetadataRight>
              <UserName $votingBtn={votingBtn}>{username}</UserName>
              <DeadLine $votingBtn={votingBtn}>{time}</DeadLine>
            </PostMetadataRight>  
            </PostMetadata>
            <>
            {votingBtn 
            ? postImageforHome()
             : postImageforPost()
             }
            </>
          {votingBtn ? <PostQuestion>{text}</PostQuestion> : divideText()              
          }
          {votingBtn 
              ?  (<VotingBtn handleVotesCount={handleVotesCount}/>)
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
                        setSelecteBg={setSelecteBg}
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
  overflow: hidden
`;

const PostWrapper = styled.div<{$votingBtn? : boolean;}>`
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

const StyledDefaultImage = styled(Image)`
  width: 100%;
  height: 100%;
  position: absolute;
  left:0;
  top:0;
  z-index: -1000;
`;

const StyledImage = styled(Image)`
  width: 100%;
  height: 184px;
  z-index: -1000;
  border-radius: 14px;
  border: 1px solid #000;
  margin-top: 20px;
  object-fit: contain;
  background-color: black;
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

const DividedText = styled.div<{$image? : string}>`
  text-align: center;
  margin-top: ${props => props.$image ? "104px" : "14px"};
  font-size: 16px;
  line-height: 28px; 
  color: ${props => `${props.theme.color.disabledfontColor}}`};
`;