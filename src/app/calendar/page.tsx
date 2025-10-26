'use client'

import { useState, useEffect } from 'react'
import MonthCalendar from '@/components/MonthCalendar'
import MenuDialog from '@/components/MenuDialog'
import { Menu } from '@/types/menu'
import { Recipe } from '@/types/recipe'
import Link from 'next/link'

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [menus, setMenus] = useState<Menu[]>([])
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null)

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth() + 1

  useEffect(() => {
    fetchData()
  }, [year, month])

  const fetchData = async () => {
    setLoading(true)
    try {
      // 月の開始日と終了日を計算
      const startDate = new Date(year, month - 1, 1)
      const endDate = new Date(year, month, 0)

      // 献立とレシピを並列で取得
      const [menusRes, recipesRes] = await Promise.all([
        fetch(
          `/api/menus?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
        ),
        fetch('/api/recipes'),
      ])

      if (!menusRes.ok || !recipesRes.ok) {
        throw new Error('データの取得に失敗しました')
      }

      const menusData = await menusRes.json()
      const recipesData = await recipesRes.json()

      setMenus(menusData)
      setRecipes(recipesData)
    } catch (error) {
      console.error('Error fetching data:', error)
      alert('データの取得に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 2, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month, 1))
  }

  const handleDateClick = (date: Date) => {
    // クリックした日付に既に献立があるかチェック
    const menu = menus.find((m) => {
      const menuDate = new Date(m.date)
      return (
        menuDate.getFullYear() === date.getFullYear() &&
        menuDate.getMonth() === date.getMonth() &&
        menuDate.getDate() === date.getDate()
      )
    })

    if (menu) {
      setSelectedMenu(menu)
      setSelectedDate(date)
    } else {
      setSelectedDate(date)
      setIsDialogOpen(true)
    }
  }

  const handleMenuSubmit = async (recipeId: string, date: Date) => {
    try {
      const response = await fetch('/api/menus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipeId,
          date: date.toISOString(),
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || '献立の登録に失敗しました')
      }

      alert('献立を登録しました')
      fetchData() // データを再取得
    } catch (error: any) {
      console.error('Error creating menu:', error)
      alert(error.message || 'エラーが発生しました')
    }
  }

  const handleDeleteMenu = async () => {
    if (!selectedMenu) return

    if (!confirm('この献立を削除しますか？')) {
      return
    }

    try {
      const response = await fetch(`/api/menus/${selectedMenu.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('献立の削除に失敗しました')
      }

      alert('献立を削除しました')
      setSelectedMenu(null)
      setSelectedDate(null)
      fetchData() // データを再取得
    } catch (error) {
      console.error('Error deleting menu:', error)
      alert('献立の削除に失敗しました')
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
          <h1 className="text-3xl font-bold">献立カレンダー</h1>
          <div className="flex gap-4">
            <Link
              href="/recipes"
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              レシピ一覧
            </Link>
            <Link
              href="/"
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              ホームに戻る
            </Link>
          </div>
        </div>

        <MonthCalendar
          year={year}
          month={month}
          menus={menus}
          onDateClick={handleDateClick}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
        />

        {/* 献立登録ダイアログ */}
        <MenuDialog
          isOpen={isDialogOpen}
          selectedDate={selectedDate}
          recipes={recipes}
          onClose={() => {
            setIsDialogOpen(false)
            setSelectedDate(null)
          }}
          onSubmit={handleMenuSubmit}
        />

        {/* 献立詳細モーダル */}
        {selectedMenu && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full mx-4">
              <h2 className="text-2xl font-bold mb-4">献立詳細</h2>
              <p className="text-gray-600 mb-6">
                {new Date(selectedMenu.date).getFullYear()}年
                {new Date(selectedMenu.date).getMonth() + 1}月
                {new Date(selectedMenu.date).getDate()}日
              </p>

              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">
                  {selectedMenu.recipe.name}
                </h3>
                <div className="flex gap-2 text-sm text-gray-600 mb-4">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                    {selectedMenu.recipe.category}
                  </span>
                  {selectedMenu.recipe.cookingTime && (
                    <span>{selectedMenu.recipe.cookingTime}分</span>
                  )}
                  {selectedMenu.recipe.servings && (
                    <span>{selectedMenu.recipe.servings}人分</span>
                  )}
                </div>
                <Link
                  href={`/recipes/${selectedMenu.recipe.id}`}
                  className="text-blue-600 hover:text-blue-700 text-sm"
                >
                  レシピの詳細を見る →
                </Link>
              </div>

              <div className="flex gap-4 justify-end">
                <button
                  onClick={handleDeleteMenu}
                  className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  削除
                </button>
                <button
                  onClick={() => {
                    setSelectedMenu(null)
                    setSelectedDate(null)
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  閉じる
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
