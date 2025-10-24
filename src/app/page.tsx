export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">献立カレンダーアプリ</h1>
        <p className="text-lg text-gray-600 mb-8">
          自分のレシピ集から献立をカレンダーで選択できるアプリケーション
        </p>
        <div className="space-y-2">
          <p className="text-sm text-gray-500">開発中...</p>
          <p className="text-sm text-gray-500">
            Next.js + TypeScript + Tailwind CSS
          </p>
        </div>
      </div>
    </main>
  )
}
