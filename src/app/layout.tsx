import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '献立カレンダー',
  description: '自分のレシピ集から献立をカレンダーで選択できるアプリケーション',
  manifest: '/manifest.json',
  themeColor: '#9333ea',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: '献立カレンダー',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
