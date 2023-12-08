"use client"

import styled from 'styled-components';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { getDownloadURL, ref } from 'firebase/storage';
import storage from '@/firebase/storage';

type ImageUrlProp = {
  imageUrl: string;
}

export default function PostImageforHome({imageUrl}: ImageUrlProp) {
  const [imgurl, setImgurl] = useState("");
  const handleOnError = () => {
    return <h1>Image error</h1>
  };
  useEffect(() => {
    const getDownloadUrlfromImageName = async () => {
      if(imageUrl !== undefined){
          const reference = ref(storage, `posts/${imageUrl}`);
          await getDownloadURL(reference).then((url) => {
            setImgurl(url)
          })
          .catch((error) => {
            console.log(error);
          });
        }};
        
        getDownloadUrlfromImageName();
  }, [imageUrl])

  return (
    <>
      {imgurl !== "" ? (
        imgurl.includes("post-bg")
          ? (
            <StyledDefaultImage priority src={imgurl}  alt="default-image" width={500} height={500} /> 
          ) : (
            <ImageBG>
              <StyledImage src={imgurl} onError={handleOnError}  alt="uploaded-image" width={500} height={500}/>
            </ImageBG>
          )
      )
      : null
    }
    </>
  )
};

const ImageBG = styled.div`
width: 100%;
height: 184px;
background-color: black;
z-index: -1000;
border-radius: 14px;
border: 1px solid #000;
margin-top: 20px;
`;

const StyledImage = styled(Image)`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const StyledDefaultImage = styled(Image)`
  width: 100%;
  height: 100%;
  position: absolute;
  left:0;
  top:0;
  z-index: -1000;
`;
