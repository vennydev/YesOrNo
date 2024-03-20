"use client"

import './slideBox.css';

export default function SlideBox({children, setShowFilterBox}: any) {
  const closeModal = () => {
    setShowFilterBox(false);
  };

  return (
      <div className='commentBox-container'>
        {children}
        <div className="commentBox-bg" onClick={closeModal}/>
      </div>
  )
}