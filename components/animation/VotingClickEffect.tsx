"use client"

import React from 'react'

import Lottie from 'react-lottie-player/dist/LottiePlayerLight'

import lottieRight from '../../public/animation/right effect.json';
import lottieLeft from '../../public/animation/left effect.json';

export default function VotingClickEffect({position, setOnEffect}: any) {

  const setPosition = () => {
    if(position === 'right'){
      return lottieRight
    }else {
      return lottieLeft
    }
  };

return (
    <Lottie
      loop={false}
      animationData={setPosition()}
      play
      style={{ 
        width: 60, 
        height: 60, 
        position: 'absolute', 
        right: `${position === 'right' ? '-20px' : 'null'}`, 
        left: `${position === 'left' ? '-20px' : 'null'}`, 
        top: '-50px' }}
      onComplete={() => setOnEffect(false)}
    />
  )
};

