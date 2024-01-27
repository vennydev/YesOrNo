"use client"

import firebasedb from "@/firebase/firebasedb";
import firestore from "@/firebase/firestore";
import { atom, selector } from "recoil";


type usernameStateType = string;
type myPostsArrayStateType = any[];
type votedPostsArrayStateType = any[];

export const usernameState = atom<usernameStateType>({
  key: 'usernameState',
  default: ''
});

export const myPostsArrayState = atom<myPostsArrayStateType>({
  key: "myPostsArrayState",
  default: [],
});

export const votedPostsArrayState = atom<votedPostsArrayStateType>({
  key: "votedPostsArrayState",
  default: [],
});

// // const filteredPostsListState = selector({
// //   key: 'filteredPostsListState',
// //   get: ({get}) => {
// //     const filter = get(postsFilterState);
// //     const list = get(votedPostsArrayState);

// //     switch(filter){
// //       case 'myPost':
// //         return list
// //       case 'votedPost': 
// //         return list
// //     }
// //   }
// // });
