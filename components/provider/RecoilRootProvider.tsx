'use client'

import { usePathname } from "next/navigation"
import Navigation from '../Navigation';
import { RecoilRoot } from 'recoil';
import AuthSessionProvider from './AuthSessionProvider';

export default function RecoilRootProvider({children} : {children: React.ReactNode}) {
  const pathname = usePathname();

  return (
      <RecoilRoot>
        <AuthSessionProvider>
          {children}
          {(pathname === '/' || pathname === '/post' || pathname === '/mypage') && <Navigation/>}
        </AuthSessionProvider>
      </RecoilRoot>
  )
};