'use client'

import { useState, useEffect } from 'react'
import { Menu } from '@/types/menu'

type WeekCalendarProps = {
  currentDate: Date
  menus: Menu[]
  onDateClick: (date: Date) => void
  onPrevWeek: () => void
  onNextWeek: () => void
}

export default function WeekCalendar({
  currentDate,
  menus,
  onDateClick,
  onPrevWeek,
  onNextWeek,
}: WeekCalendarProps) {
  const [weekDays, setWeekDays] = useState<Date[]>([])

  useEffect(() => {
    generateWeekDays()
  }, [currentDate])

  const generateWeekDays = () => {
    const days: Date[] = []
    const startOfWeek = new Date(currentDate)

    // 週の始まり（日曜日）を取得
    const dayOfWeek = startOfWeek.getDay()
    startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek)

    // 日曜日から土曜日までの7日間
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + i)
      days.push(date)
    }

    setWeekDays(days)
  }

  const getMenuForDate = (date: Date): Menu | undefined => {
    return menus.find((menu) => {
      const menuDate = new Date(menu.date)
      return (
        menuDate.getFullYear() === date.getFullYear() &&
        menuDate.getMonth() === date.getMonth() &&
        menuDate.getDate() === date.getDate()
      )
    })
  }

  const isToday = (date: Date): boolean => {
    const today = new Date()
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    )
  }

  const getWeekRange = () => {
    if (weekDays.length === 0) return ''
    const start = weekDays[0]
    const end = weekDays[6]
    return `${start.getMonth() + 1}月${start.getDate()}日 - ${end.getMonth() + 1}月${end.getDate()}日`
  }

  const dayNames = ['日', '月', '火', '水', '木', '金', '土']

  return (
    <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 md:p-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <button
          onClick={onPrevWeek}
          className="px-3 sm:px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-sm sm:text-base touch-manipulation"
        >
          前週
        </button>
        <h2 className="text-sm sm:text-lg md:text-2xl font-bold text-center">
          {weekDays.length > 0 && `${weekDays[0].getFullYear()}年 ${getWeekRange()}`}
        </h2>
        <button
          onClick={onNextWeek}
          className="px-3 sm:px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-sm sm:text-base touch-manipulation"
        >
          次週
        </button>
      </div>

      {/* 週間カレンダーグリッド - 横長を縦に並べる */}
      <div className="space-y-2">
        {weekDays.map((date, index) => {
          const menu = getMenuForDate(date)
          const today = isToday(date)

          return (
            <button
              key={index}
              onClick={() => onDateClick(date)}
              className={`
                w-full p-3 sm:p-4 border rounded-lg
                hover:bg-blue-50 transition-colors touch-manipulation
                ${today ? 'border-blue-500 border-2' : 'border-gray-300'}
                ${menu ? 'bg-green-50' : ''}
              `}
            >
              <div className="flex items-center gap-3 sm:gap-4">
                {/* 曜日と日付 */}
                <div className="flex-shrink-0 w-16 sm:w-20 text-left">
                  <div
                    className={`text-xs sm:text-sm font-semibold ${
                      index === 0
                        ? 'text-red-600'
                        : index === 6
                        ? 'text-blue-600'
                        : ''
                    }`}
                  >
                    {dayNames[index]}
                  </div>
                  <div className="text-xl sm:text-2xl font-bold">{date.getDate()}</div>
                  <div className="text-xs text-gray-500">
                    {date.getMonth() + 1}月
                  </div>
                </div>

                {/* 献立情報 */}
                {menu ? (
                  <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                    {menu.recipe.imageUrl && (
                      <img
                        src={menu.recipe.imageUrl}
                        alt={menu.recipe.name}
                        className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0 text-left">
                      <div className="text-sm sm:text-base font-medium text-green-800 mb-1 line-clamp-2">
                        {menu.recipe.name}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600">
                        {menu.recipe.category}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 text-sm text-gray-400 text-center">
                    献立なし
                  </div>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {/* 凡例 */}
      <div className="mt-4 flex gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-blue-500 rounded"></div>
          <span>今日</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-50 border border-gray-300 rounded"></div>
          <span>献立あり</span>
        </div>
      </div>
    </div>
  )
}
