"use client"

import React, { useEffect, useRef, useState } from 'react';
import { DefaultProfile, DimmedProfile, PostBg1, PostBg2 } from '../public/images';
import Image from 'next/image';
import styled from 'styled-components';
import ColorCircle from './ColorCircle';
import PostImageforHome from './PostImageforHome';
import VotingBtn from './VotingBtn';
import { arrayRemove, arrayUnion, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import firestore from '@/firebase/firestore';
import { useSession } from 'next-auth/react';
import useInterval from '@/util/useInterval';

const VOTE_STATUS = ["no response", "yes", "no"];
const imageArr = [PostBg1, PostBg2];

interface TotalCountType {
  yesTotal: number | undefined,
  noTotal: number | undefined,
}

interface RemainingTimeType {
  hour: number;
  minutes: number;
  seconds: number;
}

interface PostCardPropsType {
  id?: string; 
  text:string;
  username:string;
  imageUrl?: any;
  expiredAt: number | undefined;
  votingBtn: boolean;
  editing?: boolean;
  yesCount?: number | undefined; 
  noCount?: number | undefined;
  isParticipantCountPublic?: boolean;
  setImageUrl?: React.Dispatch<React.SetStateAction<any>>;
  setFile?: (value: any) => void;
  handleEditing?: () => void;
  handleText?: (value: string) => void;
}

export default function PostCard ({
  id,
  text, 
  username, 
  imageUrl, 
  expiredAt, 
  votingBtn, 
  editing, 
  yesCount,
  noCount,
  isParticipantCountPublic,
  setImageUrl, 
  setFile,
  handleEditing, 
  handleText
  }:PostCardPropsType) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [totalCount, setTotalCount] = useState<TotalCountType>({
    yesTotal: yesCount,
    noTotal: noCount,
  });
  const [voteStatus, setVoteStatus] = useState("");
  const [percentageOfYes, setPercentage] = useState(0);
  const [totalParticipantsCount, setTotalParticipantsCount] = useState(0);
  const [remainingTime, setRemainingTime] = useState<RemainingTimeType>();
  const [hours, setHours] = useState(0);
  const [min, setMin] = useState(0);
  const [sec, setSec] = useState(0);
  const {data: session} = useSession();
  const userid = session?.user.id;
  let intervalId: any;

  const getRemainingTime = (expiredTime: number) => {
    let currentTime = new Date().getTime();
    let diffMilleSec =  expiredTime - currentTime;
    let totalMin = Math.floor((diffMilleSec / (1000*60)));
    let hourRemaining = Math.floor(totalMin / 60);
    let minRemaining = Math.floor(totalMin%60);
    let secRemaining = Math.floor((diffMilleSec / 1000) % 60 );
    setHours(hourRemaining);
    setMin(minRemaining)
    setSec(secRemaining);
    // setRemainingTime({
    //   hour: hourRemaining,
    //   minutes: minRemaining,
    //   seconds: secRemaining,
    // });
  };

  // useInterval(() => {setSec(sec -1)}, 3000, hours, min);
  
  useEffect(() => {
    typeof expiredAt === 'number' && getRemainingTime(expiredAt);
  }, []);


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

  const calcPercentage = (yesCount: number | undefined, noCount: number | undefined): void => {
    if(typeof yesCount === 'number' && typeof noCount === 'number' ){
      const percentage = (yesCount / (yesCount + noCount))*100;
      setPercentage(percentage);
    }
  };

  const calcTotalParticipantsCount = (yesCount: number | undefined, noCount: number | undefined) => {
    if(typeof yesCount === 'number' && typeof noCount === 'number' ){
      setTotalParticipantsCount(yesCount + noCount)
    }
  }

  const handleVotesCount = async (e: any) => {
    const selectedOption = e.target.value;
    const postRef = doc(firestore, 'posts', String(id));
    if(voteStatus === "no response"){
      if(selectedOption === 'yes'){
        await updateDoc(postRef, {
          yesUser: arrayUnion(userid),
        });
        if(typeof totalCount.yesTotal === "number" && typeof totalCount.noTotal === "number"){
          setTotalCount({...totalCount, yesTotal: totalCount.yesTotal + 1})
        }
        setVoteStatus(VOTE_STATUS[1]);
      }else if (selectedOption === 'no'){
        await updateDoc(postRef, {
          noUser: arrayUnion(userid),
        });
        if(typeof totalCount.yesTotal === "number" && typeof totalCount.noTotal === "number"){
          setTotalCount({...totalCount, noTotal: totalCount.noTotal + 1})
        }
        setVoteStatus(VOTE_STATUS[2]);
      }
    }else if(voteStatus === "yes") {
      if(selectedOption === 'yes'){
        return alert("재투표 노노")
        }else if (selectedOption === 'no'){
          await updateDoc(postRef, {
            noUser: arrayUnion(userid),
            yesUser: arrayRemove(userid),
          });
        setVoteStatus(VOTE_STATUS[2]);
        if(typeof totalCount.yesTotal === "number" && typeof totalCount.noTotal === "number"){
          setTotalCount({yesTotal: totalCount.yesTotal - 1, noTotal: totalCount.noTotal + 1})
        }}
    }else if(voteStatus === "no"){
      if(selectedOption === 'no'){
        return alert("재투표 노노")
      }else if (selectedOption === 'yes'){
          await updateDoc(postRef, {
            yesUser: arrayUnion(userid),
            noUser: arrayRemove(userid),
          });
        setVoteStatus(VOTE_STATUS[1]);
        if(typeof totalCount.yesTotal === "number" && typeof totalCount.noTotal === "number"){
          setTotalCount({yesTotal: totalCount.yesTotal! + 1, noTotal: totalCount.noTotal! - 1})
        }}
    }
  };

  useEffect(() => {
    onSnapshot(doc(firestore, 'posts', String(id)), (doc) => {
      const yesArr = doc.data()?.yesUser.includes(userid);
      const noArr = doc.data()?.noUser.includes(userid);
      if(yesArr){
        setVoteStatus(VOTE_STATUS[1]);
      } else if(noArr){
        setVoteStatus(VOTE_STATUS[2]);
      } else {
        setVoteStatus(VOTE_STATUS[0]);
      }
    })
}, []);

  useEffect(() => {
    calcPercentage(totalCount.yesTotal, totalCount.noTotal);
    calcTotalParticipantsCount(totalCount.yesTotal, totalCount.noTotal)
  }, [totalCount.yesTotal, totalCount.noTotal]);

  const addZero = (time: number) => {
    if(time < 10){
      return `0${time}`
    }
    return time
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
              <DeadLine $votingBtn={votingBtn}>{addZero(hours)} : {addZero(min)} : {addZero(sec)}</DeadLine>
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
              ?  (
              <>
                <VotingBtn 
                  handleVotesCount={handleVotesCount} 
                  percentage={percentageOfYes} 
                  voteStatus={voteStatus}
                  totalParticipantsCount={totalParticipantsCount}
                  isParticipantCountPublic={isParticipantCountPublic}
                  />
              </> )
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

const PostQuestion = styled.div``;

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