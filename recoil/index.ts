"use client"

import { atom } from "recoil";

type loadingStatePropsType = boolean;

export const loadingState = atom<loadingStatePropsType>({
  key: 'loadingState',
  default: true,
});
