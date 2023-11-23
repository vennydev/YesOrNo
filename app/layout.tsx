import type { Metadata } from 'next'
import ThemeClient from '../components/ThemeClient';
import Script from 'next/script'
import ProvidersWrapper from './ProvidersWrapper';
import Header from '@/components/Header';

export const metadata: Metadata = {
  title: '질문있어욘',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body suppressHydrationWarning={true}>
      <link href="https://hangeul.pstatic.net/hangeul_static/css/maru-buri.css" rel="stylesheet"></link>
          <ThemeClient>
            <ProvidersWrapper>
              <Header/>
              {children}
            </ProvidersWrapper>
          </ThemeClient>
      </body>
      <Script src="https://t1.kakaocdn.net/kakao_js_sdk/2.5.0/kakao.min.js" integrity="sha384-kYPsUbBPlktXsY6/oNHSUDZoTX6+YI51f63jCPEIPFP09ttByAdxd2mEjKuhdqn4" crossOrigin="anonymous" async></Script>
    </html>
  )
}