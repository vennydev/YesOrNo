"use client"

import './slideBox.css';

export default function SlideBox({children}: any) {
  return (
    <div className='commentBox-container'>
      {children}
      <div className="commentBox-bg"/>
    </div>
  )
};