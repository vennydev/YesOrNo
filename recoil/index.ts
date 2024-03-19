import { atom } from "recoil";
import { v1 } from "uuid";

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

interface toastVisibleStateType {
  message: string,
  isShown: boolean,
}

export const loadingState = atom<loadingStatePropsType>({
  key: `loadingState ${v1}`,
  default: true,
});

export const showCommentBoxState = atom<showCommentBoxStateType>({
  key: `showCommentBoxState ${v1}`,
  default: {
    postId: "",
    isShown: false,
  },
})

export const commentsArray = atom<commentsArrayType[]>({
  key: `commentsArray ${v1}`,
  default: [],
})

export const toastVisibleState = atom<toastVisibleStateType>({
  key: `toastVisibleState ${v1}`,
  default: {
    message: '',
    isShown: false,
  },
});