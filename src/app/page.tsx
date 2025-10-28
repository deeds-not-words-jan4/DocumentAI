import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-16 lg:p-24">
      <div className="text-center max-w-4xl mx-auto">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
          夕飯はこれ！
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-8 px-4">
          私が作れるものから夕飯を選択できるアプリ
        </p>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Link
              href="/calendar"
              className="flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-base sm:text-lg font-semibold touch-manipulation"
            >
              献立カレンダー
            </Link>
            <Link
              href="/recipes"
              className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-base sm:text-lg touch-manipulation"
            >
              レシピ一覧
            </Link>
            <Link
              href="/recipes/new"
              className="flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-base sm:text-lg touch-manipulation"
            >
              レシピ登録
            </Link>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-8">
            Next.js + TypeScript + Tailwind CSS + Prisma
          </p>
        </div>
      </div>
    </main>
  )
}
