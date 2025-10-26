import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">献立カレンダーアプリ</h1>
        <p className="text-lg text-gray-600 mb-8">
          自分のレシピ集から献立をカレンダーで選択できるアプリケーション
        </p>
        <div className="space-y-4">
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/calendar"
              className="px-8 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-lg font-semibold"
            >
              献立カレンダー
            </Link>
            <Link
              href="/recipes"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              レシピ一覧
            </Link>
            <Link
              href="/recipes/new"
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              レシピ登録
            </Link>
          </div>
          <p className="text-sm text-gray-500 mt-8">
            Next.js + TypeScript + Tailwind CSS + Prisma
          </p>
        </div>
      </div>
    </main>
  )
}
