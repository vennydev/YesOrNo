import type { Metadata } from 'next'
import ThemeClient from '../components/ThemeClient';
import RecoilRootProvider from '@/components/provider/RecoilRootProvider';
import StyledComponentsRegistry from '../lib/registry';
import Header from '@/components/Header';

// export const metadata: Metadata = {
//   title: '질문있어욘',
//   description: "사소하고 별거 아닌 고민들을 올려봅시다",
// }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <head>
	      <meta property="og:title" content="rtrt" />
	      <meta property="og:description" content="사소하고 별거 아닌 고민들을 올려봅시다" />
	      <meta property="og:url" content="https://yesorno-lac.vercel.app"/>
        <meta
          property="og:image"
          content="../"
        />
      </head>
      <body suppressHydrationWarning={true}>
      <link href="https://hangeul.pstatic.net/hangeul_static/css/maru-buri.css" rel="stylesheet"></link>
            <StyledComponentsRegistry>
              <ThemeClient>
                <RecoilRootProvider>
                  <Header></Header>
                  {children}      
                </RecoilRootProvider>
              </ThemeClient>
            </StyledComponentsRegistry>
        <div id="modal-root" />
      </body>
      <script src="https://t1.kakaocdn.net/kakao_js_sdk/2.5.0/kakao.min.js" integrity="sha384-kYPsUbBPlktXsY6/oNHSUDZoTX6+YI51f63jCPEIPFP09ttByAdxd2mEjKuhdqn4" crossOrigin="anonymous" async></script>
    </html>
  )
}