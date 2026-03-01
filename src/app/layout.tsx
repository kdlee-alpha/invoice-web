import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import { Noto_Sans_KR } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const notoSansKR = Noto_Sans_KR({
  variable: '--font-noto-sans-kr',
  subsets: ['latin'],
  weight: ['400', '500', '700'],
})

export const metadata: Metadata = {
  title: '견적서 웹 뷰어',
  description:
    '노션 데이터베이스의 견적 정보를 웹으로 확인하고 PDF로 다운로드합니다.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${notoSansKR.variable} font-sans antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  )
}
