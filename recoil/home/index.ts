"use client"

import { atom } from "recoil";

type filterTypeStateType = string;

export const filterTypeState = atom<filterTypeStateType>({
  key: 'filterTypeState',
  default: 'latest'
}); 

