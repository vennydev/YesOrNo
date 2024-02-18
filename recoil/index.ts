import { atom } from "recoil";

type loadingStatePropsType = boolean;
interface showCommentBoxStateType {
  postId?: string,
  isShown: boolean,
};
interface commentsArrayType {
  author: string,
  userid: string,
  text: string,
  createdAt: number,
  commentid: string,
}

export const loadingState = atom<loadingStatePropsType>({
  key: 'loadingState',
  default: true,
});

export const showCommentBoxState = atom<showCommentBoxStateType>({
  key: 'showCommentBoxState',
  default: {
    postId: "",
    isShown: false,
  },
})

export const commentsArray = atom<commentsArrayType[]>({
  key: 'commentsArray',
  default: [],
})