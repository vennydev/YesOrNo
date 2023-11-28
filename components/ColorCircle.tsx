"use client"

import React, { useState } from 'react'
import styled from 'styled-components';
import Image from 'next/image';
import { Check } from '../public/images';

type ColorProps = {
  image:{};
  index:number;
  hoveredIndex:number | null;
  handleMouseEnter: (index: number) => void;
  handleMouseLeave: () => void;
  selectBgImage: (e: any, img: any) => void;
}

export default function ColorCircle ({image, index, hoveredIndex, handleMouseEnter, handleMouseLeave, selectBgImage}: ColorProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    selectBgImage(e, image);
  };

  return (
    <Button 
      onMouseOver={() => handleMouseEnter(index)} 
      onMouseLeave={handleMouseLeave} 
      onClick={(e) => {
        handleClick(e);
      }}
    > 
      {hoveredIndex === index &&
        <Image src={Check} alt='check' width={18}/>}
    </Button>
  )
};

const Button = styled.button`
  width: 34px;
  height: 34px;
  border: ${(props) => `1px solid ${props.theme.color.mainBorderColor}`};
  border-radius:  50%;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  
  &:hover{
    background-color: black;
  }
`