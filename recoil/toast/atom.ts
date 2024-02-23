"use client"

import { atom } from "recoil";

interface ToastType {
  isShown: boolean;
  id: string;
  voteResult: string;
}

type ToastVisibleType = {
  isShown: false,
}

export const toastState = atom<ToastType>({
  key: 'toast',
  default: {
    isShown: false,
    id: '',
    voteResult: '',
  },
}); 

// export const toastState = atom<ToastVisibleType  >({
//   key: 'toast',
//   default: {
//     isShown: false,
//     id: '',
//     voteResult: '',
//   },
// }); 