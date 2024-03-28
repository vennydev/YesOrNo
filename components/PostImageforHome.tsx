"use client"

import styled from 'styled-components';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
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

  const setImage = () => {
    if(imgurl.includes('bg1')){
      return (
        <StyledDefaultImageBg1 priority src={imgurl}  alt="default-image" width={500} height={500} /> 
      )
    }else if(imgurl.includes('bg2')){
      return (
        <StyledDefaultImageBg2 priority src={imgurl}  alt="default-image" width={500} height={500} /> 
      )
    }else if(imgurl !== ""){
      return (
        <ImageBG>
          <StyledImage src={imgurl} onError={handleOnError}  alt="uploaded-image" width={500} height={500}/>
        </ImageBG>
      )
    }
  };

  const getDownloadUrlfromImageName = useCallback(async() => {
    if(imageUrl !== undefined){
        const reference = ref(storage, `posts/${imageUrl}`);
        await getDownloadURL(reference).then((url) => {
          setImgurl(url)
        })
        .catch(error => alert(error));
      }
  }, [imageUrl]);

  useEffect(() => {
    getDownloadUrlfromImageName();
  }, [])

  return (
    setImage()
  )
};

const ImageBG = styled.div`
width: 100%;
height: 184px;
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

const StyledDefaultImageBg2 = styled(Image)`
  width: 100%;
  height: 100%;
  position: absolute;
  left:0;
  top:0;
  z-index: -1000;
`;

const StyledDefaultImageBg1 = styled(Image)`
  width: 100%;
  height: 223px;
  position: absolute;
  left:0;
  bottom:0;
  z-index: -1000;
`;