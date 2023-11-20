import type { Metadata } from 'next'
import './globals.css'
import ThemeClient from '../components/ThemeClient';

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
      <body>
      <link href="https://hangeul.pstatic.net/hangeul_static/css/maru-buri.css" rel="stylesheet"></link>
          <ThemeClient>
            {children}
          </ThemeClient>
      </body>
    </html>
  )
}