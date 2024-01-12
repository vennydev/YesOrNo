"use client"

import { LoadingIcon } from '@/public/images';
import Image from 'next/image';
import styled from "styled-components";
import CircularProgress from '@mui/joy/CircularProgress';

export default function Loading() {
  return (
    <LoadingContainer>
      <Image alt='loading-image' src={LoadingIcon} width={100} height={100}></Image>
      <CircularProgress color="neutral" size="sm"/>
    </LoadingContainer>
  )
};

const LoadingContainer = styled.div`
  width:100%;
  height:100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap:15px;
`;