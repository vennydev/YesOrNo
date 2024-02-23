"use client"

import { toastVisibleState } from '@/recoil';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';

export default function Toast2({ children }: any) {
  const [toast, setToast] = useRecoilState(toastVisibleState);

  useEffect(() => {
    const timer = setTimeout(() => setToast({...toast, isShown: false}) , 2000);

    return () => {
      clearInterval(timer);
    }
  }, [toast, setToast])

  return (
    <ToastContainer>
      <TextWrapper>
        {children}
      </TextWrapper>
    </ToastContainer>
  )
};

const ToastContainer = styled.div`
  position: fixed;
  z-index: 100000;
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
