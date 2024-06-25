"use client"

import styled from 'styled-components';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { getDownloadURL, ref } from 'firebase/storage';
import storage from '@/firebase/storage';
import { createPortal } from 'react-dom';
import { iconX2 } from '../public/images';

type ImageUrlProp = {
  imageUrl: string;
}

export default function PostImageforHome({imageUrl}: ImageUrlProp) {
  const [imgurl, setImgurl] = useState("");
  const [ showEnlargedImage, setShowEnlargedImage] = useState(false);
  
  const handleOnError = () => {
    return <h1>Image error</h1>
  };

  const enlargeImage = () => {
    setShowEnlargedImage(!showEnlargedImage);
  };

  console.log('showEnlargedImage: ', showEnlargedImage);

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
        <ImageBG onClick={enlargeImage}>
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
    <>
      {setImage()}
      {showEnlargedImage && createPortal(
       <EnlageedImageScreen>
        <EnlargedImageContainer>
          <EnlargedImage alt="enlarged-image" src={imgurl} fill style={{objectFit: 'contain'}}/>
        </EnlargedImageContainer>
          <OpacityBg/>
          <CloseBtn onClick={enlargeImage}>
            <Image alt='x-icon' src={iconX2} width={13} height={13}></Image>
          </CloseBtn>
       </EnlageedImageScreen>,
      document.body
    )}
    </>
  )
};

const ImageBG = styled.div`
width: 100%;
height: 184px;
border-radius: 14px;
border: 1px solid #000;
margin-top: 20px;
cursor: pointer;
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

const CloseBtn = styled.div`
  position: absolute;
  right:25px;
  top:45px;
  z-index: 100000;
  cursor:pointer;
`;

const EnlageedImageScreen = styled.div`
  position:fixed;
  z-index: 1000;
  top:0;
  left:0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const EnlargedImageContainer = styled.div`
  width: 100%;
  height: 374px;
  background:black;
  z-index: 100000;
  position: relative;
`;

const EnlargedImage = styled(Image)`
  height:100%;
  width: 100%;
  z-index: -1000;
  position: absolute;
  left:0;
  top:0;
`;

const OpacityBg = styled.div`
    position: absolute;
    width: 100vw;
    height: 100vh;
    background-color: black;
    z-index: 1001;
    opacity: 0.8;
    cursor: pointer;
`
