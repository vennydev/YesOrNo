"use client"

import React, { useState } from 'react'
import styles from './colorCircle.module.css';
import styled from 'styled-components';
import Image from 'next/image';
import { Check } from '../public/images';

type ColorProps = {
  color:string;
  index:number;
  hoveredIndex:number | null;
  handleMouseEnter: (index: number) => void;
  handleMouseLeave: () => void;
}

const ColorCircle = ({color, index, hoveredIndex, handleMouseEnter, handleMouseLeave}: ColorProps) => {
  const [isHovering, setIsHovering] = useState(false);
  
  return (
    <Button onMouseOver={() => handleMouseEnter(index)} onMouseLeave={handleMouseLeave} $color={color}>
      {hoveredIndex === index ? (
        <Image src={Check} alt='check' width={18}/>
      ) : null}
    </Button>
  )
}

export default ColorCircle

const Button = styled.button<{ $color?: string; }>`
  width: 34px;
  height: 34px;
  border: 1px solid var(--main-border-color);
  border-radius:  50%;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${props => props.$color ? props.$color : null};

  &:hover{
    background-color: black;
  }
`