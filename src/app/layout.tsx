import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '献立カレンダー',
  description: '自分のレシピ集から献立をカレンダーで選択できるアプリケーション',
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
