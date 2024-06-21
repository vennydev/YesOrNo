"use client"

import React, { useEffect, useState } from 'react';
import { DefaultProfile, DimmedProfile, PostBg1, PostBg2 } from '../public/images';
import Image from 'next/image';
import styled from 'styled-components';
import ColorCircle from './ColorCircle';
import PostImageforHome from './PostImageforHome';
import VotingButton from './VotingBtn';
import { arrayRemove, arrayUnion, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import firestore from '@/firebase/firestore';
import { useSession } from 'next-auth/react';
import ModalPortal from './modal/ModalPortal';
import Modal from './Modal';
import { useRecoilState, useRecoilValue } from 'recoil';
import { isCheckDeletionModalVisible } from '@/recoil/post/atom';
import { toastState } from '@/recoil/toast/atom';
import LikeCommentContainer from './LikeCommentContainer';
import firebase from 'firebase/compat/app';

const VOTE_STATUS = ["no response", "yes", "no"];
const imageArr = ['no image', PostBg1, PostBg2];

type MetaType = {
  votingBtn?: boolean,
  isOver?: boolean,
}

interface TotalCountType {
  yesTotal: number | undefined,
  noTotal: number | undefined,
}

interface PostCardPropsType {
  id?: string; 
  text:string;
  author:string | null;
  imageUrl?: any;
  expiredAt?: number;
  createdAt?: number;
  votingBtn: boolean;
  editing?: boolean;
  yesCount?: number | undefined; 
  noCount?: number | undefined;
  likes?: number;
  isParticipantCountPublic?: boolean;
  setImageUrl?: React.Dispatch<React.SetStateAction<any>>;
  setFile?: (value: any) => void;
  handleEditing?: () => void;
  handleText?: (value: string) => void;
  time?: string;
  isOver?: boolean;
  file?: any;
  isDeleted?: boolean;
}

export default function PostCard ({
  id,
  text, 
  author, 
  imageUrl, 
  expiredAt, 
  createdAt,
  votingBtn, 
  editing, 
  yesCount,
  noCount,
  likes,
  isOver,
  file,
  isDeleted,
  isParticipantCountPublic,
  setImageUrl, 
  setFile,
  handleEditing, 
  handleText,
  }:PostCardPropsType) {
  const [totalCount, setTotalCount] = useState<TotalCountType>({
    yesTotal: yesCount,
    noTotal: noCount,
  });
  const [voteStatus, setVoteStatus] = useState("");
  const [percentageOfYes, setPercentage] = useState(0);
  const [totalParticipantsCount, setTotalParticipantsCount] = useState(0);
  const [hours, setHours] = useState(0);
  const [min, setMin] = useState(0);
  const {data: session} = useSession();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCheckDeletionModal, setIsCheckDeletionModal] = useRecoilState(isCheckDeletionModalVisible);
  const [toastInfo, setToastInfo] = useRecoilState(toastState);
  const [endTime, setEndTime] = useState('');
  const [onEffect, setOnEffect] = useState(false);
  const [createdDate, setCreatedDate] = useState('');

  const userid = session?.user.id;
  const closeLoginModal = () => {
    setIsModalVisible(false);
  };

  const closeDeleteModal = () => {
    setIsCheckDeletionModal(false);
  };

  const getCreatedDate = () => {
    const currentTime = new Date();
    const currentMonth = currentTime.getMonth() + 1;
    const currentDate = currentTime.getDate();
    const createdMonth = typeof createdAt === 'number' && new Date(createdAt).getMonth() + 1;
    const createdDate = typeof createdAt === 'number' &&  new Date(createdAt).getDate();
    if(currentMonth === createdMonth && currentDate === createdDate){
      setCreatedDate('오늘');
    }else{
      setCreatedDate('어제');
    }
  };

  const getRemainingTime = (expiredTime: number) => {
    let currentTime = new Date().getTime();
    let diffMilleSec =  expiredTime - currentTime;
    let totalMin = Math.floor((diffMilleSec / (1000*60)));
    let hourRemaining = Math.floor(totalMin / 60);
    let minRemaining = Math.floor(totalMin % 60);
    setHours(hourRemaining);
    setMin(minRemaining)
  };

  const selectBgImage = (e: any, img: any) => {
    // e && e.stopPropagation();
    // setImageUrl?.(img);
    // setFile?.(img);
  };

  const divideText = () => {
    const topText = text.substring(0,10)
    const bottomText = text.substring(10);
    return (
      <DividedText onClick={handleEditing} $image={imageUrl.src}>
        {editing ? (
            <PostQuestionInput autoFocus name="textarea" maxLength={68} onChange={(e) => handleText?.(e.target.value)}/>
        ) : (
          <>
            <div>{topText}</div>
            <div>{bottomText}</div>
          </>
        )}
      </DividedText>
    )
  };

  const postDefaultImageforPost = () => {
    if(imageUrl === undefined) return;
    if(imageUrl.src){
      if(imageUrl.src.includes("bg1")){
        return (
          <StyledDefaultImageBg1 src={imageUrl}  alt="default-image" width={0} height={0}/>
        )
      }else if(imageUrl.src.includes("bg2")){
        return (
          <StyledDefaultImageBg2 src={imageUrl}  alt="default-image" width={0} height={0}/>
        )    
      }
    }
  };
  
  const postUploadedImageforPost = () => {
    if(imageUrl === undefined) return;
    if(!imageUrl.src){
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
  };

  const handleVotesCount = async (e: any) => {
    if(!userid){
      setIsModalVisible(true); 
      return
    };

    if(isOver){
      alert('이미 마감된 투표입니다.'); 
      return
    };

    const selectedOption = e.currentTarget.value;
    const postRef = doc(firestore, 'posts', String(id)); 
    const userRef = doc(firestore, 'users', userid);

    await updateDoc(userRef, {
      votedPosts: arrayUnion(id),
    });
    
    if(voteStatus === "no response"){
      if(selectedOption === 'yes'){
         await updateDoc(postRef, {
          yesUser: arrayUnion(userid),
        });
        if(typeof totalCount.yesTotal === "number" && typeof totalCount.noTotal === "number"){
          setTotalCount({...totalCount, yesTotal: totalCount.yesTotal + 1})
        }
        setVoteStatus(VOTE_STATUS[1]);
        setOnEffect(true);
      }else if (selectedOption === 'no'){
        await updateDoc(postRef, {
          noUser: arrayUnion(userid),
        });
        if(typeof totalCount.yesTotal === "number" && typeof totalCount.noTotal === "number"){
          setTotalCount({...totalCount, noTotal: totalCount.noTotal + 1})
        }
        setVoteStatus(VOTE_STATUS[2]);
        setOnEffect(true);
      }
      if(typeof id === 'string') {
        setToastInfo({
          isShown: true,
          id: id,
          voteResult: selectedOption === 'yes' ? 'YES' : 'NO',
        })
      };
    }else if(voteStatus === "yes") {
      if(selectedOption === 'yes'){
        return alert('이미 선택되어있어요!\n반대편을 누르면 투표선택을 바꿀 수 있어요.')
        }else if (selectedOption === 'no'){
          await updateDoc(postRef, {
            noUser: arrayUnion(userid),
            yesUser: arrayRemove(userid),
          });
        setVoteStatus(VOTE_STATUS[2]);
        setOnEffect(true);
        if(typeof id === 'string') {
          setToastInfo({
            isShown: true,
            id: id,
            voteResult: 'NO',
          })
        };
        if(typeof totalCount.yesTotal === "number" && typeof totalCount.noTotal === "number"){
          setTotalCount({yesTotal: totalCount.yesTotal - 1, noTotal: totalCount.noTotal + 1})
        }}
    }else if(voteStatus === "no"){
      if(selectedOption === 'no'){
        return alert('이미 선택되어있어요!\n반대편을 누르면 투표선택을 바꿀 수 있어요.')
      }else if (selectedOption === 'yes'){
          await updateDoc(postRef, {
            yesUser: arrayUnion(userid),
            noUser: arrayRemove(userid),
          });
        setOnEffect(true);
        if(typeof id === 'string') {
          setToastInfo({
            isShown: true,
            id: id,
            voteResult: 'YES',
          })
        };
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
}, [id, userid]);

  useEffect(() => {
    calcPercentage(totalCount.yesTotal, totalCount.noTotal);
    calcTotalParticipantsCount(totalCount.yesTotal, totalCount.noTotal)
  }, [totalCount.yesTotal, totalCount.noTotal]);

  const addZero = (time: number) => {
    return time.toString().padStart(2, '0');
  };

  useEffect(() => {
    getCreatedDate();
    typeof expiredAt === 'number' && getRemainingTime(expiredAt);
  }, [expiredAt]);

  useEffect(() => {
    if(typeof expiredAt === 'number') {
        const endTime = new Date(expiredAt);
        const year = endTime.getFullYear();
        const month = endTime.getMonth() + 1;
        const day = endTime.getDate();
        const newYear = String(year).substring(2);
        setEndTime(`${newYear}년 ${month}월 ${day}일`)
      };
  }, [expiredAt]);
  return (
      <PostContainer $votingBtn={votingBtn}>
        {!votingBtn && postDefaultImageforPost()}
          <PostWrapper>
            <PostTop $votingBtn={votingBtn}>
              <PostMetadata>
                <PostMetadataLeft>
                  {votingBtn 
                    ? (isOver ? 
                      <Image src={DimmedProfile} alt='profile-example' width={40} height={40} priority /> : 
                      <Image src={DefaultProfile} alt='profile-example' width={40} height={40} priority />)
                    : <Image src={DimmedProfile} alt='profile-example' width={40} height={40} priority />
                  }
                </PostMetadataLeft>
                <PostMetadataRight>
                  <UserName votingBtn={votingBtn} isOver={isOver}>{author}</UserName>
                  <DeadLine votingBtn={votingBtn} isOver={isOver}>
                    {isOver ? (
                        <>
                          {endTime} 투표 완료
                        </>
                      ) : (
                        <>
                          {createdDate} 
                            <Dot/>
                          {addZero(hours)}시간 {addZero(min)}분 남음
                        </>
                      )}
                    </DeadLine>
                </PostMetadataRight>  
              </PostMetadata>
              {!votingBtn && postUploadedImageforPost()}
              {votingBtn && postImageforHome()}
              {votingBtn
              ? ( <PostQuestion>
                  <Text>
                    {text}
                  </Text>
                </PostQuestion> )
                : divideText()}
              {votingBtn && (
                <VotingButton 
                  handleVotesCount={handleVotesCount} 
                  percentage={percentageOfYes} 
                  voteStatus={voteStatus}
                  totalParticipantsCount={totalParticipantsCount}
                  isParticipantCountPublic={isParticipantCountPublic}
                  isOver={isOver}
                  setOnEffect={setOnEffect}
                  onEffect={onEffect}
                />)}
            </PostTop>
            {votingBtn && <LikeCommentContainer postID={id}/>} 
          </PostWrapper>
          {!votingBtn && (
                <BgSelectorWrapper>
                  {imageArr.map((image, index) => {
                    return (
                      <ColorCircle 
                      image={image} 
                      index={index} 
                      selectBgImage={selectBgImage} 
                      key={index}/>
                      )
                    })}
                </BgSelectorWrapper>
          )}
        {isModalVisible && 
          <ModalPortal>
            <Modal type="login" closeModal={closeLoginModal}/>
          </ModalPortal>
        }
        {isCheckDeletionModal && 
          <ModalPortal>
            <Modal type="deleteDefaultImage" closeModal={closeDeleteModal} selectBgImage={selectBgImage}/>
          </ModalPortal>
        }
      </PostContainer>
  )
};

const PostContainer = styled.div<{$votingBtn : boolean}>`
  width: 335px;
  height: ${props => props.$votingBtn ? "584px" : "478px"};
  border-radius: 20px;
  border: 0.8px solid #8C8C8C;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  overflow: hidden
`;

const PostWrapper = styled.div`
  height: 100%;
  width: 100%;
  `; 
  
  const PostTop = styled.div<{$votingBtn? : boolean}>`
  display: flex;
  flex-direction: column;
  align-items:center;
  width:100%;
  height: ${props => props.$votingBtn ? "80%" : "100%"};
  justify-content: ${props => props.$votingBtn ? "space-between" : "flex-start"};
  position: relative;
`

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

const UserName = styled.div<MetaType>`
  margin-bottom: 3px;
  color: ${props => props.votingBtn ? (props.isOver ? '#BFBFBF': 'inherit')  : `${props.theme.color.dimFontColor}`};
`;

const DeadLine = styled.div<MetaType>`
  color: ${props => props.votingBtn ? (props.isOver ? '#BFBFBF': '#8C8C8C')  : `${props.theme.color.dimFontColor}`};
  display:flex;
  align-items: center;
`;

const PostQuestion = styled.div`
  width: 100%;
  height:81px;
  text-align: center;
  padding: 0 30px;
  overflow:hidden;
`;

const PostQuestionInput = styled.textarea`
  height: 100%;
  width:295px;
  padding:0px 29px;
  resize: none;
  text-align: center;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: 24px; 
  border: none;
  overflow: hidden;
  font-family: 'MaruBuri';
  &:focus {
  outline: none;
  }
`;

const StyledDefaultImageBg1 = styled(Image)`
  width: 100%;
  height: 223px;
  z-index: -1000;
  position: absolute;
  left:0;
  bottom:0;
`;

const StyledDefaultImageBg2 = styled(Image)`
  width: 100%;
  height: 100%;
  z-index: -1000;
  position: absolute;
  left:0;
  bottom:0;
`

const StyledImage = styled(Image)`
  width: 100%;
  height: 184px;
  z-index: -1000;
  border-radius: 14px;
  border: 1px solid #000;
  margin-top: 16px;
  object-fit: contain;
`;

const BgSelectorWrapper = styled.ul`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 14px;
  border-top: ${(props) => `1px solid ${props.theme.color.mainFontColor}`};
  position: absolute;
  bottom:0;
  left:0;
  padding:16px;
  margin:0;
  width: 100%;
`;

const Text = styled.div`
  font-size: 16px;
  font-weight: 600;
  line-height: 22px;
  word-wrap: break-word;
`;

const DividedText = styled.div<{$image? : string}>`
  text-align: center;
  margin-top: ${props => props.$image ? "104px" : "14px"};
  line-height: 28px;
  width:100%;
  height: 91px;
  color: ${props => `${props.theme.color.dimFontColor}}`};
`;

const Dot = styled.div`
  width: 2px;
  height: 2px;
  background-color: #8C8C8C;
  border-radius: 50%;
  margin: 0 6px;
`