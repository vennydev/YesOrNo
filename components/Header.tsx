"use client"

import React from 'react';
import Image from 'next/image';
import {cellular, wifi, battery} from '../public/images/index'; 
import styled from "styled-components";

const Header = () => {
  return (
      <HaederContainer>
        <CurrentTime>9:41</CurrentTime> 
        <IconsWrapper>
          <Image
            src={cellular}
            alt="cellular"
            width={19.2}
            height={12.23}
          />
              <Image
            src={wifi}
            alt="wifi"
            width={17.14}
            height={12.33}

          />
              <Image
            src={battery}
            alt="battery"
            style={{
              width: 27.33,
              height: 13
            }}
          />
        </IconsWrapper>
     </HaederContainer>
  )
}

const HaederContainer = styled.div`
  position: absolute;
  top:0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 44px;
  padding:0px 14px 0px  21px;
`;

const CurrentTime = styled.div`
  width:  54px;
  text-align: center;
  font-size: 15px;
`;

const IconsWrapper = styled.div`
  display: flex;
  gap:7px
`;
export default Header