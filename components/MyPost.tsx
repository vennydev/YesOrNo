"use client"

import { useCallback, useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import firestore from "@/firebase/firestore";
import PostCard from "./PostCard";
import styled from "styled-components";
import CancelIcon from '@mui/icons-material/Cancel';
import ModalPortal from "./modal/ModalPortal";
import { useModal } from "@/hooks/useModal";
import { removePost } from "@/constants";
import Image from "next/image";
import { IconX } from "@/public/images";

export default function MyPost({post, myPost}: any) {
  const { Modal, isOpen, openModal, closeModal } = useModal();

  return (
    <MyPostContainer>
          <PostWrapper>
              <PostCard 
                text={post.text} 
                yesCount={post.yesUser.length} 
                noCount={post.noUser.length} 
                author={post.author} 
                imageUrl={post.imageUrl} 
                expiredAt={post.expiredAt}
                votingBtn={true} 
                id={post.id} 
                isOver={post.isOver}
                isParticipantCountPublic={post.isParticipantCountPublic}
                />
                {myPost && (
                  <RemoveBtn onClick={() => openModal()}>
                    <Image alt='x-icon' src={IconX} width={10} height={10}></Image>
                  </RemoveBtn>
                )}
              </PostWrapper>
          {isOpen && 
            <ModalPortal>
              <Modal text={removePost} close={closeModal} postId={post.id} performBtn></Modal>
            </ModalPortal>
          }
    </MyPostContainer>
  )
};

const MyPostContainer = styled.div`
`;

const PostWrapper = styled.div`
  position: relative;
`;

const RemoveBtn = styled.div`
  position: absolute;
  top:20px;
  right:20px;
  display:flex;
  align-items: center;
  justify-content:center;
  width:20px;
  height:20px;
  cursor: pointer;
`;
