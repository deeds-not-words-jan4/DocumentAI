'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Recipe } from '@/types/recipe'
import Link from 'next/link'

export default function RecipesPage() {
  const router = useRouter()
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState<string>('')
  const [sortBy, setSortBy] = useState<string>('createdAt')
  const [order, setOrder] = useState<string>('desc')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [searchType, setSearchType] = useState<string>('name')

  useEffect(() => {
    fetchRecipes()
  }, [category, sortBy, order])

  const fetchRecipes = async () => {
    try {
      const params = new URLSearchParams()
      if (category) params.append('category', category)
      params.append('sortBy', sortBy)
      params.append('order', order)
      if (searchQuery) {
        params.append('search', searchQuery)
        params.append('searchType', searchType)
      }

      const response = await fetch(`/api/recipes?${params.toString()}`)
      if (!response.ok) {
        throw new Error('レシピの取得に失敗しました')
      }

      const data = await response.json()
      setRecipes(data)
    } catch (error) {
      console.error('Error fetching recipes:', error)
      alert('レシピの取得に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    fetchRecipes()
  }

  const handleClearSearch = () => {
    setSearchQuery('')
    setSearchType('name')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">読み込み中...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 md:py-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold">レシピ一覧</h1>
          <div className="flex gap-2 sm:gap-4 w-full sm:w-auto">
            <Link
              href="/"
              className="flex-1 sm:flex-none px-4 sm:px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-center text-sm sm:text-base touch-manipulation"
            >
              ホーム
            </Link>
            <Link
              href="/recipes/new"
              className="flex-1 sm:flex-none px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-center text-sm sm:text-base touch-manipulation"
            >
              新規登録
            </Link>
          </div>
        </div>

        {/* 検索フォーム */}
        <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 mb-4 sm:mb-6">
          <h2 className="text-base sm:text-lg font-semibold mb-3">レシピを検索</h2>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-end">
            <div className="flex-1 min-w-0">
              <label className="block text-xs sm:text-sm font-medium mb-1">検索キーワード</label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="検索..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              />
            </div>
            <div className="w-full sm:w-auto">
              <label className="block text-xs sm:text-sm font-medium mb-1">検索対象</label>
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              >
                <option value="name">料理名</option>
                <option value="tags">タグ</option>
                <option value="ingredients">材料</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSearch}
                className="flex-1 sm:flex-none px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm sm:text-base touch-manipulation"
              >
                検索
              </button>
              {searchQuery && (
                <button
                  onClick={() => {
                    handleClearSearch()
                    fetchRecipes()
                  }}
                  className="flex-1 sm:flex-none px-4 sm:px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm sm:text-base touch-manipulation"
                >
                  クリア
                </button>
              )}
            </div>
          </div>
        </div>

        {/* フィルター・ソート */}
        <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 mb-4 sm:mb-6">
          <h2 className="text-base sm:text-lg font-semibold mb-3">絞り込み・並び替え</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium mb-1">カテゴリ</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              >
                <option value="">すべて</option>
                <option value="和食">和食</option>
                <option value="洋食">洋食</option>
                <option value="中華">中華</option>
                <option value="その他">その他</option>
                <option value="タレ">タレ</option>
              </select>
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium mb-1">並び順</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              >
                <option value="createdAt">登録日</option>
                <option value="name">料理名</option>
                <option value="category">カテゴリ</option>
              </select>
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium mb-1">順序</label>
              <select
                value={order}
                onChange={(e) => setOrder(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              >
                <option value="desc">降順</option>
                <option value="asc">昇順</option>
              </select>
            </div>
          </div>
        </div>

        {/* レシピ一覧 */}
        {recipes.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500">レシピが登録されていません</p>
            <Link
              href="/recipes/new"
              className="inline-block mt-4 text-blue-600 hover:text-blue-700"
            >
              最初のレシピを登録する
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <Link
                key={recipe.id}
                href={`/recipes/${recipe.id}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                {recipe.imageUrl ? (
                  <img
                    src={recipe.imageUrl}
                    alt={recipe.name}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">画像なし</span>
                  </div>
                )}
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2">{recipe.name}</h2>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                      {recipe.category}
                    </span>
                    {recipe.cookingTime && (
                      <span>{recipe.cookingTime}分</span>
                    )}
                    {recipe.servings && <span>{recipe.servings}人分</span>}
                  </div>
                  {recipe.tags && (
                    <div className="text-sm text-gray-500">
                      {recipe.tags}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
