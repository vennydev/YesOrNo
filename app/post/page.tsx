"use client" 

import React, { useEffect, useState } from 'react';
import { ClearIcon } from '../../public/icons/index';
import PostCard from '../../components/PostCard';
import styled from 'styled-components';
import { CheckBox, PostBg1 } from '@/public/images';
import ImageUploader from '../../components/ImageUploader';
import imageCompression from 'browser-image-compression';
import { ref, uploadBytes } from 'firebase/storage';
import firebasedb from '@/firebase/firebasedb';
import { addDoc, arrayUnion, collection, doc, getDocs, getFirestore, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import { useSession } from 'next-auth/react';
import storage from '@/firebase/storage';
import { useRouter } from 'next/navigation';
import { useRecoilState, useResetRecoilState, useSetRecoilState } from 'recoil';
import { selectedImgIndexState } from '@/recoil/post/atom';
import firestore from '@/firebase/firestore';
import Image from 'next/image';
import { myPostsArrayState } from '@/recoil/mypage/atom';
import { usernameState } from '@/recoil';
import { getItem } from '@/utils/localStorage';

const ONEDAY = 24*60*60*1000;

export default function PostPage() {
  const [text, setText] = useState("YES OR NO로 대답 할 수 있는 질문을 작성해주세요");
  const [imageUrl, setImageUrl] = useState<any>(PostBg1);
  const [file, setFile] = useState<any>(PostBg1);
  const [editing, setEditing] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const {data: session} = useSession();
  const router = useRouter();
  const setIndex = useResetRecoilState(selectedImgIndexState);
  const [myPostsArr, setMyPostsArr] = useRecoilState(myPostsArrayState);
  const [nickname, setNickname] = useState('');
  const handleEditing = () => {
    setEditing(true);
  };

  const handleText = (value: string) => {
    setText(value);
  };
  
  useEffect(() => {
    if(text.length > 68){
      alert("68글자 이상 입력 불가");
      text.substring(0, text.length);
      return
    }
  }, [text])

  const handleImage = async (e: any) => {
  const file = e.target.files;
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
    reader.onloadend = () => {
      setImageUrl(reader.result);
      e.target.value = '';
    }
  }catch(error) {
    alert(error);
  }
  };

  const handleIsChecked = ({target : {checked}}: any) => {
    setIsChecked(!isChecked);
  };

  const handleUpload = async () => {
    if(!text || !imageUrl) return;
    let docData;

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
        uploadBytes(postsRef, imageFile).then((snapshot) => 
        {
          docData = { 
            author: nickname,
            text:text,
            createdAt: Date.now(),
            expiredAt: Date.now()+ONEDAY,
            imageUrl: snapshot.ref.name,
            isOver: false, 
            isParticipantCountPublic: isChecked,
            participatedUser: [],
            yesUser: [],
            noUser: [],
            likes: 0,
            isDeleted: false,
            timestamp: serverTimestamp(),
          };
        uploadToFireStore(docData);
        setIndex();
        router.push('/');
      })
     }).catch(error => alert(error));
    } else {
      const postsRef = ref(storage, `posts/${file.name}`);
      uploadBytes(postsRef, file).then((snapshot) => {
        docData = { 
          author: nickname,
          text:text,
          createdAt: Date.now(),
          expiredAt: Date.now()+ONEDAY,
          imageUrl: snapshot.ref.name,
          isOver: false,
          isParticipantCountPublic: isChecked,
          participatedUser: [],
          yesUser: [],
          noUser: [],
          likes: 0,
          isDeleted: false,
          timestamp: serverTimestamp(),
        };
        uploadToFireStore(docData);
        setIndex();
        router.push('/');
      }).catch(error => alert(error));
    }
  };

  const uploadToFireStore = async (data: object) => {
    const db = getFirestore(firebasedb);
    const postRef = await addDoc(collection(db, 'posts'), data);
    const usersRef = doc(firestore, 'users', session?.user.id);
    setMyPostsArr([data, ...myPostsArr]);

    await setDoc(doc(db, "comments", postRef.id), {comments: []});
    await setDoc(doc(db, "likes", postRef.id), {likes: []});
    
    await updateDoc(usersRef, {
      myPosts: arrayUnion(postRef.id)
    });

    await updateDoc(postRef, {
      id: postRef.id
    });
  };

  useEffect(() => {
    const username = localStorage.getItem('username');
    typeof username === 'string' && setNickname(localStorage.getItem('username')!);
  }, []);

return (
    <PostSection>
      <PostContainer>
        <ActionBtnWrapper>
          <ClearIcon onClick={() => router.push("/")}/>
          <PageTitle>질문하기</PageTitle>
          <PostBtn onClick={handleUpload} $text={text}>등록</PostBtn>
        </ActionBtnWrapper>

        <div>
          <PostCard 
            text={text}
            author={nickname}
            imageUrl={imageUrl}
            time='23년 11월 9일 투표 완료' 
            file={file}
            votingBtn={false}
            editing={editing}
            setImageUrl={setImageUrl}
            setFile={setFile}
            handleEditing={handleEditing}
            handleText={handleText}
            />
        </div>

        <ImageUploader handleImage={handleImage}/>

        <ParticipantsWrapper>
          {isChecked ? (
            <Image src={CheckBox} width={16} height={16} alt='check-box' onClick={handleIsChecked}></Image>
          ) : (
            <ParticipantsLabel htmlFor="isParticipantCountPublic"/>
          )}
          <ParticipantsInput type="checkbox" id='isParticipantCountPublic' onClick={handleIsChecked}/>
          <ParticipantsText>참여자 수 공개</ParticipantsText>
        </ParticipantsWrapper>
      </PostContainer>
    </PostSection>
  )
}

const ParticipantsLabel = styled.label`
  width: 16px;
  height: 16px;
  border-radius: 4px;
  border: 1px solid #8C8C8C;
`;

const ParticipantsInput = styled.input`
  display: none;
`;

const PostSection = styled.form`
  display: flex;
  justify-content: center;
  padding-top:21px;
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
  margin-bottom: 21px;
`;

const PageTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
`;

const PostBtn = styled.div<{$text: string}>`
  color: ${props => props.$text !== "" ? 'black' : `${props.theme.color.dimFontColor}`};
  letter-spacing: -0.3px;
  font-size: 16px;
  font-weight: 600;

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
