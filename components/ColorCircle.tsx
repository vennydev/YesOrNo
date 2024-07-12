"use client"

import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import Image from 'next/image';
import { Check, iconDog, iconShining } from '../public/images';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { selectedImgIndexState } from '@/recoil/post/atom';
import { isCheckDeletionModalVisible } from '../recoil/post/atom';

type ColorProps = {
  image:any;
  index:number;
  selectBgImage: (e: any, img: any) => void;
}


export default function ColorCircle ({image, index, selectBgImage}: ColorProps) {
  const [selectedImgIndex, setSelectedImgIndex] = useRecoilState(selectedImgIndexState);
  const setModal = useSetRecoilState(isCheckDeletionModalVisible);
  const [mainImage, setMainImage] = useState('');
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    localStorage.setItem('imageInfo', JSON.stringify({index: index, image: image}));
    if(selectedImgIndex === null){
      setModal(true);
    }else{
      setSelectedImgIndex(index);
      selectBgImage(e, image);
    }
  };
  
  useEffect(() => {
    if(image === 'no image'){
      setMainImage('no image');
    }else if(image.src.includes("bg1")){
      setMainImage('dog');
      return
    }else if(image.src.includes("bg2")){
      setMainImage('shine');
      return
    }
  }, [])

  return (
    <>
      <Button  
        onClick={(e) => {
          handleClick(e);
        }}
        $index={index}
        $selectedImgIndex={selectedImgIndex}
        > 
        {selectedImgIndex === index ? (
          <ImageSelectorContainer $selectedImgIndex={selectedImgIndex} $index={index}>
            <Image src={Check} alt='check' width={18}/>
          </ImageSelectorContainer>
          ) : (mainImage === 'no image' ? <></> : <Image src={mainImage === 'dog' ? iconDog: iconShining} alt='mainlogo-title' width={34} height={34}/>)}
      </Button>
    </>
  )
};

const Button = styled.div<{$selectedImgIndex: number | null, $index: number}>`
  width: 34px;
  height: 34px;
  border: ${(props) => `1px solid ${props.theme.color.mainBorderColor}`};
  border-radius:  50%;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${props => props.$selectedImgIndex === props.$index ? 'black' : 'none'};
  z-index: 1000;
  `;

const ImageSelectorContainer = styled.div<{$selectedImgIndex: number | null, $index: number}>`
  display: flex;
  justify-content: center;
  align-items: center;

`