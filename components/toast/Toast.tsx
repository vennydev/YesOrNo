"use client"

import { noToastMsg, yesToastMsg } from '@/constants';
import { toastState } from '@/recoil/toast/atom';
import { useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import styled from 'styled-components';

type ToastPropsTypes = {
  position: string,
}

export default function Toast({position}: ToastPropsTypes) {
  const [toastInfo, setToastInfo] = useRecoilState(toastState);
  const message = toastInfo.voteResult === 'YES' ? yesToastMsg : noToastMsg; 
  useEffect(() => {
    const timer = setTimeout(() => setToastInfo({...toastInfo, isShown: false}) , 2000);
    return () => {
      clearInterval(timer);
    }
  }, [toastInfo, setToastInfo])

  return (
    <ToastContainer $position={position}>
      <TextWrapper>
        <Text>{message}</Text>
      </TextWrapper>
    </ToastContainer>
  )
};

const ToastContainer = styled.div<{$position: string}>`
  position: fixed;
  bottom:100px;
  left:50%;
  transform: translateX(-50%);
  white-space: nowrap;
  display: flex;
  height: 42px;
  padding: 10px 16px 11px 16px;
  justify-content: center;
  align-items: center;
  gap: 4px;
  border-radius: 32px;
  border: 1px solid #000;
  background: rgba(38, 38, 38, 0.85);
`;

const TextWrapper = styled.div`
`;

const Text = styled.div`
color: ${props => props.theme.color.whiteColor};
text-align: center;
font-family: MaruBuri;
font-size: 14px;
font-style: normal;
font-weight: 400;
line-height: 30px;
letter-spacing: -0.3px;
`;