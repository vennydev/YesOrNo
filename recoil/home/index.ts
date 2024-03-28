"use client"

import { atom, selector } from "recoil";
import { v1 } from "uuid";

type filterTypeStateType = string;

interface postListStateType {
  list: any[]
}

interface postClosedListStateType {
  list: any[]
}

interface firstCommentStateType {
  text: string,
  username: string,
}

export const filterTypeState = atom<filterTypeStateType>({
  key: `filterTypeState ${v1}`,
  default: 'latest'
}); 

export const postListState = atom<postListStateType>({
  key: `postListState ${v1}`,
  default: {list: []},
});

export const postClosedListState = atom<postClosedListStateType>({
  key: `postClosedListState ${v1}`,
  default: {list: []},
});

export const filteredOpenPostListState = selector({
  key: `filteredOpenPostListState ${v1}`,
  get: ({get}) => {
    const filter = get(filterTypeState);
    const openPostList = get(postListState).list;

    switch (filter) {
      case 'latest':
        return openPostList
      case 'out-of-date':
        return openPostList.toReversed();
      case 'likes':
        const newArr = [...openPostList];
        const sortedArr = newArr.sort(function(a, b)  {
          return b.likes - a.likes
        });
        return sortedArr
      }},
    });

export const filteredClosedPostListState = selector({
  key: `filteredClosedPostListState ${v1}`,
  get: ({get}) => {
    const filter = get(filterTypeState);
    const closePostList = get(postClosedListState).list;

    switch (filter) {
      case 'latest':
        return closePostList
      case 'out-of-date':
        return closePostList.toReversed();
      case 'likes':
        const newArr = [...closePostList];
        const sortedArr = newArr.sort(function(a, b)  {
          return b.likes - a.likes
        });
        return sortedArr
      }},
    });

export const firstCommentState = atom<firstCommentStateType>({
  key: `firstComment ${v1}`,
  default: {
    text : '',
    username: '',
  }
})
