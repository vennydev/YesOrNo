"use client"

import { atom } from "recoil";

type selectedImgIndexStateType = number | null;

type isCheckDeletionModalVisibleStateType = boolean;

const selectedImgIndexState = atom<selectedImgIndexStateType>({
  key: 'selectedImgIndexState',
  default: 0,
});

const isCheckDeletionModalVisible = atom<isCheckDeletionModalVisibleStateType>({
  key: 'isCheckDeletionModalVisible',
  default: false,
});

export { 
  selectedImgIndexState,
  isCheckDeletionModalVisible
};