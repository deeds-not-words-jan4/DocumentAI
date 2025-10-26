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

  useEffect(() => {
    fetchRecipes()
  }, [category, sortBy, order])

  const fetchRecipes = async () => {
    try {
      const params = new URLSearchParams()
      if (category) params.append('category', category)
      params.append('sortBy', sortBy)
      params.append('order', order)

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">読み込み中...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">レシピ一覧</h1>
          <Link
            href="/recipes/new"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            新規登録
          </Link>
        </div>

        {/* フィルター・ソート */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex gap-4 flex-wrap">
            <div>
              <label className="block text-sm font-medium mb-1">カテゴリ</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">すべて</option>
                <option value="和食">和食</option>
                <option value="洋食">洋食</option>
                <option value="中華">中華</option>
                <option value="その他">その他</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">並び順</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="createdAt">登録日</option>
                <option value="name">料理名</option>
                <option value="category">カテゴリ</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">順序</label>
              <select
                value={order}
                onChange={(e) => setOrder(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
