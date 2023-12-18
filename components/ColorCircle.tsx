"use client"

import React from 'react'
import styled from 'styled-components';
import Image from 'next/image';
import { Check } from '../public/images';

type ColorProps = {
  image:{};
  index:number;     
  selectedImg: number | null;
  selectBgImage: (e: any, img: any) => void;
  setSelectedImg: (index: number | null) => void;
}

export default function ColorCircle ({image, index, selectBgImage, setSelectedImg, selectedImg}: ColorProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    selectBgImage(e, image);
  };

  return (
    <Button 
      onClick={(e) => {
        handleClick(e);
        setSelectedImg(index)
      }}
      $selectedImg={selectedImg}
      $index={index}
      > 
      {selectedImg === index &&
        <Image src={Check} alt='check' width={18}/>}
    </Button>
  )
};

const Button = styled.button<{$selectedImg: number | null, $index: number}>`
  width: 34px;
  height: 34px;
  border: ${(props) => `1px solid ${props.theme.color.mainBorderColor}`};
  border-radius:  50%;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${props => props.$selectedImg === props.$index ? 'black' : 'white'};
`;