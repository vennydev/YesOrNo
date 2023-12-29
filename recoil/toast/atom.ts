"use client"

import { atom } from "recoil";

interface ToastType {
  isShown: boolean;
  id: string;
  voteResult: string;
}

export const toastState = atom<ToastType>({
  key: 'toast',
  default: {
    isShown: false,
    id: '',
    voteResult: '',
  },
}); 