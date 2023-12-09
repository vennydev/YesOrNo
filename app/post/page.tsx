"use client"

import React, { useEffect, useState } from 'react'
import { ClearIcon, AddIcon } from '../../public/icons/index';
import PostCard from '../../components/PostCard';
import styled from 'styled-components';
import { DefaultProfile, DimmedProfile, PostBg1, PostBg2 } from '@/public/images';
import ImageUploader from '../../components/ImageUploader';
import imageCompression from 'browser-image-compression';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import firebasedb from '@/firebase/firebasedb';
import { addDoc, collection, getFirestore } from 'firebase/firestore';
import { doc, setDoc } from "firebase/firestore"; 
import { useSession } from 'next-auth/react';
import storage from '@/firebase/storage';
import { useRouter } from 'next/navigation';

const ONEDAY = 24*60*60*1000;

export default function PostPage() {
  const [text, setText] = useState("");
  const [imageUrl, setImageUrl] = useState<any>(PostBg1);
  const [file, setFile] = useState<any>(PostBg1);
  const [editing, setEditing] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const {data: session} = useSession();
  const router = useRouter();

  const handleEditing = () => {
    setEditing(true);
  };
  const handleText = (value: string) => {
    setText(value);
  };

  const handleImage = async (file: any) => {
    if(!file) {return};

  const imageFile = file[0];

  const options = {
    maxSizeMB: 2.0,
    maxWidthOrHeight: 500,
  };

  try{
    const compressedFile = await imageCompression(imageFile, options);
    const convert = new File([compressedFile], imageFile.name, {
      type: `${imageFile.type}`
    });
    setFile(convert);
    const reader = new FileReader();
    reader.readAsDataURL(convert);
    reader.onloadend = () => setImageUrl(reader.result);
  }catch(error) {
    console.log(error);
  }
};

  const handleIsChecked = (e: any) => {
    setIsChecked(e.target.checked);
  };


  const handleUpload = async () => {
    if(!text || !imageUrl) return;
    let docData;;

    const toDataURL = (url: string) => (
        fetch(url)
        .then(response => response.blob())
        .then(blob => new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
       }))
    );
     
    const dataURLtoFile = (dataurl :any, filename: any) => {
      const arr = dataurl.split(',');
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      let n = bstr.length, u8arr = new Uint8Array(n);
      while(n--){
      u8arr[n] = bstr.charCodeAt(n);
      }
    return new File([u8arr], filename, {type:mime});
    };  
    
    if(file.name === undefined){
      const url = imageUrl.src;
      const splitUrl = url.split("/");
      const length = splitUrl.length;
      const fileName = splitUrl[length-1];
      toDataURL(url).then(dataUrl => {
        const imageFile = dataURLtoFile(dataUrl, fileName);
        const postsRef = ref(storage, `posts/${fileName}`);
        uploadBytes(postsRef, imageFile).then((snapshot) => {
          docData = { 
            author: session?.user?.name,
            text:text,
            createdAt: new Date().getTime(),
            expiredAt: new Date().getTime()+ONEDAY,
            imageUrl: snapshot.ref.name,
            isOver: false, 
            isParticipantCountPublic: isChecked,
            participatedUser: [],
            yesUser: [],
            noUser: [],
          };
        uploadToFireStore(docData);
        router.push('/');
      });
     }).catch(error => console.log('기본 이미지 포함 데이터 객체 업로드 실패', error));
    } else {
      const postsRef = ref(storage, `posts/${file.name}`);
      uploadBytes(postsRef, file).then((snapshot) => {
        docData = { 
          author: session?.user?.name,
          text:text,
          createdAt: new Date().getTime(),
          expiredAt: new Date().getTime()+ONEDAY,
          imageUrl: snapshot.ref.name,
          isOver: false,
          isParticipantCountPublic: isChecked,
          participatedUser: [],
          yesUser: [],
          noUser: [],
        };
        uploadToFireStore(docData);
        router.push('/');
      }).catch(error => console.log('업로드된 이미지 포함 데이터 객체 업로드 실패',error));
    }
  };

  const uploadToFireStore = async (data: object) => {
    const db = getFirestore(firebasedb);
    const docRef = await addDoc(collection(db, 'posts'), data);
  };

return (
    <PostSection>
      <PostContainer>
        <ActionBtnWrapper>
          <ClearIcon/>
          <PageTitle>질문하기</PageTitle>
          <PostBtn onClick={handleUpload}>완료</PostBtn>
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

        <ImageUploader handleImage={handleImage}/>

        <ParticipantsWrapper>
          <input type="checkbox" name='isParticipantCountPublic' onClick={handleIsChecked}/>
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
