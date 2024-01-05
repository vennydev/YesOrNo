"use client"

import CircularProgress from '@mui/material/CircularProgress';
import styled from 'styled-components';
import LinearProgress from '@mui/material/LinearProgress';
export default function Loading() {
  
  return (
    <SpinnerContainer>
      <CircularProgress color="inherit"/>
    </SpinnerContainer>
  )
};

const SpinnerContainer = styled.div`
  position: absolute;
  top:0;
  left:0;
  width: 100%;
  height: 100%;
  display:flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const LoadingText = styled.div`
  margin-top:14px;
  font-size: 16px;
  font-weight: 600;
  line-height: 28px;
`