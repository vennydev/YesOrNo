"use client"

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRecoilState } from "recoil";
import { toastVisibleState } from "@/recoil";
import './commentBox.css';
import { useEffect, useState } from 'react';
import Profile from '../../Profile';
import { DefaultProfile } from '@/public/images';
import { getItem } from '@/utils/localStorage';
import ClearIcon from '@mui/icons-material/Clear';
import uuid from 'react-uuid';
import { arrayUnion, doc, updateDoc } from 'firebase/firestore';
import firestore from '@/firebase/firestore';
import { commentsType, firstCommentType } from '../../LikeCommentContainer';
import CommentToast from '../../toast/components/commentToast';
import { createPortal } from 'react-dom';
import { apply_comment, delete_comment } from '@/constants';
import SlideBox from '../SlideBox';
import { commentTime } from '@/utils/commentTime';
import { emptyComment_comment } from '../../../constants';

interface CommentBoxPropsType {
  comments: commentsType[];
  setComments: (value: commentsType[]) => void;
  postID?: string;
  setShowCommentBox: (value: boolean) => void;
  setFirstComment: (value: firstCommentType) => void;
}

export default function CommentBox(prop: CommentBoxPropsType) {
  const { comments, setComments, postID, setShowCommentBox, setFirstComment} = prop;
  const [ animation, setAnimation ] = useState(false);
  const [ toast, setToast ] = useRecoilState(toastVisibleState);
  const [text, setText] = useState('');

  const userid = getItem('userID');

  const handleChange = (value: string) => {
    setText(value);
  };

  const handleSubmit = () => {
    const nickname = getItem("username");
    const commentObj = {
      author: nickname,
      userid: userid,
      text: text,
      createdAt: new Date().getTime(),
      commentid: uuid(),
    };
    setComments([commentObj, ...comments]);
    setText('');
    setToast({
      message: apply_comment,
      isShown: true,
    });
    setFirstComment({
      text: commentObj.text,
      username: nickname
    });
    
    uploadToFireStore(commentObj);
    showToast('create');
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
    setToast({
      message: delete_comment,
      isShown: true,
    });
    const commentRef = doc(firestore, 'comments', String(postID));
    await updateDoc(commentRef, {
      comments: filteredCommentsList
    });
  };

  const showToast = (type: string) => {
    return createPortal(
      <CommentToast text={type === 'create' ? apply_comment : delete_comment}/>,
      document.body
    )
  };

  useEffect(() => {
    setAnimation(true);
  }, []);

  useEffect(() => {
    setToast({...toast, isShown:  false});
  }, [])

  return (
    <SlideBox setShowBox={setShowCommentBox}>
      <div className={`${animation ? "comment-wrapper modal-enter-active" : ""}`}>
      <div className="comment-header">
        <div className="title">댓글</div> 
      </div>
      {/* 비었을 때 메시지 */}
      <div className="comment-section">
        <div className='comment-list-with-input'>
          <ul className="comment-list">
          {comments.length > 0 ? comments.map((comment) => {
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
                          {commentTime(comment.createdAt)}
                        </span>
                      </div>
                    </div>
                    <div className='meta_text'>
                      {comment.text}
                    </div>
                    {userid === comment.userid && (
                      <div className='remove-btn'>
                        <ClearIcon sx={{ color: '#8C8C8C', cursor: 'pointer'}} onClick={() => deleteComment(comment.commentid)}/>
                      </div>
                    )}
                  </div>
                </li>
            )
          }) : (
            <div className='comment-empty-text'>
              <div>아직 댓글이 없습니다.</div>
              <div>첫 댓글을 등록해보세요!</div>
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
    {toast.isShown && createPortal(
      <CommentToast text={toast.message}/>,
      document.body
    )}
    </SlideBox>
  )
}