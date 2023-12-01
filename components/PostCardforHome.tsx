"use client"

import styled from 'styled-components';
import Image from 'next/image';
import { useState } from 'react';

type ImageUrlProp = {
  imgurl: string;
}

export default function PostCardforHome({imgurl}: ImageUrlProp) {
  const handleOnError = () => {
    return <h1>Image error</h1>
  }
  return (
    <>
    { imgurl.includes("post-bg")
      ? (
        <StyledDefaultImage src={imgurl}  alt="default-image" width={500} height={500} /> 
      ) : (
        <ImageBG>
           <StyledImage src={imgurl} onError={handleOnError}  alt="uploaded-image" width={500} height={500}/>
        </ImageBG>
      )
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
