"use client"

import firebasedb from "@/firebase/firebasedb";
import firestore from "@/firebase/firestore";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { atom, selector } from "recoil";

// type postsFilterStateType = string;
// type votedPostsArrayStateType = [];
// type myPostsArrayStateType = [];
// type getUserIdType = string | null;

// interface userObjectStateType {
//   id: string,
//   name: string,
//   email: string,
//   myPost: [],
//   votedPosts: []
// }

type usernameStateType = string;

export const usernameState = atom<usernameStateType>({
  key: 'usernameState',
  default: ''
});



// const votedPostsArrayState = atom<votedPostsArrayStateType>({
//   key: "votedPostsArrayState",
//   default: [],
// });

// const myPostsArrayState = atom<myPostsArrayStateType>({
//   key: "myPostsArrayState",
//   default: [],
// });


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

// export {
//   postsFilterState,
//   votedPostsArrayState,
//   myPostsArrayState,
//   getUserId,
//   myPostQuery,
//   // filteredPostsListState,
// }
