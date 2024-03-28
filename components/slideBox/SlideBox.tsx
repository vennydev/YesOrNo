"use client"

import './slideBox.css';

export default function SlideBox({children, setShowBox}: any) {
  const closeModal = () => {
    setShowBox(false);
  };

  return (
      <div className='commentBox-container'>
        {children}
        <div className="commentBox-bg" onClick={closeModal}/>
      </div>
  )
}