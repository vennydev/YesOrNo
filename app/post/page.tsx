"use client"

import React from 'react'
import { ClearIcon, AddIcon } from '../../public/icons/index';
import Post from '../../components/Post';
import styled from 'styled-components';


const page = () => {
  const lineBreaker = `YES OR NO로 대답 할 수 있는 질문을 작성해주세요`;
  return (
    <>
    <PostSection>
      <ActionBtnWrapper>
        <ClearIcon/>
        <PageTitle>질문하기</PageTitle>
        <PostBtn>완료</PostBtn>
      </ActionBtnWrapper>

      <div>
        <Post text={lineBreaker} username='마일로앞발' time='23년 11월 9일 투표 완료' votingBtn={false}/>
      </div>

      <ImageUploadBtn>
          <AddIcon/>
        <p>사진 추가</p>
      </ImageUploadBtn>

      <ParticipantsWrapper>
        <input type="checkbox" />
        <ParticipantsText>참여자 수 공개</ParticipantsText>
      </ParticipantsWrapper>
    </PostSection>
    </>
  )
}

export default page

const PostSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top:75px;
  padding:0 20px;
`;

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

const ImageUploadBtn = styled.button`
  display: flex;
  width: 100%;
  height: 52px;
  justify-content: center;
  align-items: center;
  gap:8px;
  border-radius: 24px;
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

