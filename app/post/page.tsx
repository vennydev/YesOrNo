"use client"

import React, { useEffect, useRef, useState } from 'react'
import { ClearIcon, AddIcon } from '../../public/icons/index';
import PostCard from '../../components/PostCard';
import styled from 'styled-components';
import { DefaultProfile, DimmedProfile, PostBg1, PostBg2 } from '@/public/images';

export default function PostPage() {
  const [text, setText] = useState("");
  const [imageUrl, setImageUrl] = useState<any>(PostBg1);
  const [editing, setEditing] = useState(false);

  const fileInput = useRef<HTMLInputElement>(null);

  const handleEditing = () => {
    setEditing(true);
  };

  const handleText = (value: string) => {
    setText(value);
  };

  const handleImage = (e: any) => {};

  return (
    <PostSection>
      <PostContainer>
        <ActionBtnWrapper>
          <ClearIcon/>
          <PageTitle>질문하기</PageTitle>
          <PostBtn>완료</PostBtn>
        </ActionBtnWrapper>

        <div>
          <PostCard 
            text='YES OR NO로 대답 할 수 있는 질문을 작성해주세요' 
            username='마일로앞발' 
            imageUrl={imageUrl}
            time='23년 11월 9일 투표 완료' 
            votingBtn={false}
            editing={editing}
            setImageUrl={setImageUrl}
            handleEditing={handleEditing}
            handleText={handleText}
            />
        </div>

        <ImageUploadBtn htmlFor="input-file">
            <AddIcon/>
          <p>사진 추가</p>
        </ImageUploadBtn>
          <input 
            type="file" 
            id="input-file" 
            name='image_URL' 
            accept='image/*' 
            ref={fileInput} 
            onChange={(e: React.ChangeEvent<{ files: FileList | null }>) => handleImage(e)} 
            style={{display: "none"}} />

        <ParticipantsWrapper>
          <input type="checkbox" />
          <ParticipantsText>참여자 수 공개</ParticipantsText>
        </ParticipantsWrapper>
      </PostContainer>
    </PostSection>
  )
}


const PostSection = styled.form`
  display: flex;
  justify-content: center;
  margin-top:65px;
  padding:0 20px;
`;

const PostContainer = styled.div`
display: flex;
flex-direction: column;
`

const ActionBtnWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
`;

const PageTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  line-height: 28px;
`;;

const PostBtn = styled.div`
  color: var(--disabled-font-color);
  line-height: 30px;
  letter-spacing: -0.3px;
  font-size: 18px;
  `;

const ImageUploadBtn = styled.label`
  display: flex;
  width: 335px;
  height: 52px;
  justify-content: center;
  align-items: center;
  gap:8px;
  border-radius: 12px;
  border: ${(props) => `1px solid ${props.theme.color.mainBorderColor}`};
  margin-top:12px;
  font-size: 14px;
  font-weight: 400;
  line-height: 30px;
  letter-spacing: -0.3px;
  cursor: pointer;
`;

const ParticipantsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap:3px;
  align-self: flex-end;
  margin-top:13.5px;
`;

const ParticipantsText = styled.p`
  font-size: 11px;
font-style: normal;
font-weight: 400;
line-height: normal;
`;