"use client"

import React from 'react'
import styled from 'styled-components';
import Image from 'next/image';
import { Check } from '../public/images';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { selectedImgIndexState } from '@/recoil/post/atom';
import { isCheckDeletionModalVisible } from '../recoil/post/atom';

type ColorProps = {
  image:{};
  index:number;
  selectBgImage: (e: any, img: any) => void;
}

export default function ColorCircle ({image, index, selectBgImage}: ColorProps) {
  const [selectedImgIndex, setSelectedImgIndex] = useRecoilState(selectedImgIndexState);
  const setModal = useSetRecoilState(isCheckDeletionModalVisible);

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

  return (
    <>
      <Button 
        onClick={(e) => {
          handleClick(e);
        }}
        $index={index}
        $selectedImgIndex={selectedImgIndex}
        > 
        {selectedImgIndex === index && <Image src={Check} alt='check' width={18}/>}
      </Button>
    </>
  )
};

const Button = styled.button<{$selectedImgIndex: number | null, $index: number}>`
  width: 34px;
  height: 34px;
  border: ${(props) => `1px solid ${props.theme.color.mainBorderColor}`};
  border-radius:  50%;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${props => props.$selectedImgIndex === props.$index ? 'black' : 'white'};
`;