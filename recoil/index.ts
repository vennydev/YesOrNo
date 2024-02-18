import { atom } from "recoil";

type loadingStatePropsType = boolean;
type showCommentBoxStateType = boolean;

export const loadingState = atom<loadingStatePropsType>({
  key: 'loadingState',
  default: true,
});

export const showCommentBoxState = atom<showCommentBoxStateType>({
  key: 'showCommentBoxState',
  default: false,
})