"use client"

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRecoilValue, useSetRecoilState } from "recoil";
import { showCommentBoxState } from "@/recoil";
import '../css/commentBox.css';
import { useEffect, useState } from 'react';
import Profile from '../components/Profile';
import { DefaultProfile } from '@/public/images';
import { getItem } from '@/utils/localStorage';
import ClearIcon from '@mui/icons-material/Clear';
import uuid from 'react-uuid';
import { addDoc, arrayUnion, collection, deleteField, doc, getDoc, getFirestore, serverTimestamp, updateDoc } from 'firebase/firestore';
import firestore from '@/firebase/firestore';
import { commentsType } from './LikeCommentContainer';

interface CommnetBoxPropsType {
  comments: commentsType[];
  setComments: (value: commentsType[]) => void;
  postID?: string;
  setShowCommentBox: (value: setShowCommentBoxType) => void;
}

interface setShowCommentBoxType {
  postId: string;
  isShown: boolean;
}

export default function CommentBox(prop: CommnetBoxPropsType) {
  const { comments, setComments, postID, setShowCommentBox} = prop;
  const [animation, setAnimation] = useState(false);
  const [text, setText] = useState('');
  
  const userid = getItem('user');

  const hideCommentBox = () => {
    setShowCommentBox({
      postId: "",
      isShown: false
    });
    setAnimation(false);
  };

  const handleChange = (value: string) => {
    setText(value);
  };

  const handleSubmit = () => {
    const nickname = getItem("user").nickname;
    const userid = getItem("user").id;
    const commentObj = {
      author: nickname,
      userid: userid,
      text: text,
      createdAt: new Date().getTime(),
      commentid: uuid(),
    };
    setComments([...comments, commentObj]);
    setText('');
    uploadToFireStore(commentObj);
  };

  const uploadToFireStore = async (data: object) => {
    const commentsRef = doc(firestore, "comments", String(postID));
    await updateDoc(commentsRef, {
      comments: arrayUnion(data)
    });
  };

  const deleteComment = async (id: string) => {
    const filteredCommentsList = comments.filter(comment => comment.commentid !== id);
    setComments(filteredCommentsList);

    const commentRef = doc(firestore, 'comments', String(postID));
    await updateDoc(commentRef, {
      comments: filteredCommentsList
    });
  };

  
  useEffect(() => {
    setAnimation(true);
  }, [])

  return (
    <div className={`commentBox-container`}>
      <div className={`${animation ? "comment-wrapper modal-enter-active" : ""}`}>
        <div className="comment-header">
          <div className="arrowBack" onClick={hideCommentBox}>
            <ArrowBackIcon/>
          </div>
          <div className="title">댓글</div> 
        </div>
        {/* 비었을 때 메시지 */}
        <div className="comment-section">
          <div className='comment-list-with-input'>
            <ul className="comment-list">
            {comments.length > 0 ? comments.map((comment, index) => {
              return (
                  <li key={uuid()} className='comment-item'>
                    <Profile image={DefaultProfile.src} alt={"default profile"} width={36} height={36}/>
                    <div className='metaInfo'>
                      <div className='metaInfo_top'>
                        <div className='meta_author'>
                          {comment.author}
                        </div>
                        <div className='timestamp'>
                           <div className='dot'></div>
                           <span className='timestamp_text'>
                            지금
                           </span>
                        </div>
                      </div>
                      <div className='meta_text'>
                        {comment.text}
                      </div>
                      {userid.id === comment.userid && (
                        <div className='remove-btn'>
                          <ClearIcon sx={{ color: '#8C8C8C', cursor: 'pointer'}} onClick={() => deleteComment(comment.commentid)}/>
                        </div>
                      )}
                    </div>
                  </li>
              )
            }) : (
              <div className='comment-empty-text'>
                <h2>댓글을 달아주세요</h2>
              </div>)}
            </ul>
            <div className="comment-input-wrapper">
              <Profile image={DefaultProfile.src} alt={"default profile"} width={44} height={44} />
              <div className='input-wrapper'>
                <input type="text" value={text} placeholder="댓글을 입력해주세요." className="comment-input" onChange={(e) => handleChange(e.target.value)}/>
                {text !== "" && <button onClick={handleSubmit} className='submit-button'>등록</button> }
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="commentBox-bg"/>
    </div>
  )
};