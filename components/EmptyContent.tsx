'use client'

import styled from "styled-components";
import { useRouter } from 'next/navigation';

interface EmptyContentPropType {
  content: any, 
  url?: string,
  btnTitle?: string,
}

export default function EmptyContent({content, url, btnTitle}: EmptyContentPropType) {
  const router = useRouter();

  return (
    <EmptyDataSignWrapper>
      <EmptyDataSign>
        <EmptyDataComment>
          {content}
        </EmptyDataComment>
        {btnTitle && <GotoPostBtn onClick={() => router.push(`${url}`)}>{btnTitle}</GotoPostBtn>}
      </EmptyDataSign>
    </EmptyDataSignWrapper>
  )
};

const EmptyDataSignWrapper = styled.div`
  position: absolute;
  top: 37%;
  left: 50%;
  transform: translate(-50%, -37%);
`;

const EmptyDataSign = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  gap: 20px;
`;

const EmptyDataComment = styled.div`
color: #000;
text-align: center;
font-family: MaruBuri;
font-size: 15px;
font-style: normal;
font-weight: 400;
line-height: 24px;
white-space:pre-wrap;
`;

const GotoPostBtn = styled.button`
  display: flex;
  padding: 6px 12px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 8px;
  border: 1px solid #000;
  width:80px;
  box-sizing: content-box;
`;