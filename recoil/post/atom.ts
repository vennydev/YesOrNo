"use client"

import { atom } from "recoil";

type selectedImgIndexStateType = number | null;

const selectedImgIndexState = atom<selectedImgIndexStateType>({
  key: 'selectedImgIndexState',
  default: 0,
});

export { selectedImgIndexState };