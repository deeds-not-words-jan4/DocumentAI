'use client'

import { useState, useEffect } from 'react'
import { Menu } from '@/types/menu'

type MonthCalendarProps = {
  year: number
  month: number
  menus: Menu[]
  onDateClick: (date: Date) => void
  onPrevMonth: () => void
  onNextMonth: () => void
}

export default function MonthCalendar({
  year,
  month,
  menus,
  onDateClick,
  onPrevMonth,
  onNextMonth,
}: MonthCalendarProps) {
  const [calendarDays, setCalendarDays] = useState<Date[]>([])

  useEffect(() => {
    generateCalendarDays()
  }, [year, month])

  const generateCalendarDays = () => {
    const firstDay = new Date(year, month - 1, 1)
    const lastDay = new Date(year, month, 0)
    const daysInMonth = lastDay.getDate()
    const startDayOfWeek = firstDay.getDay()

    const days: Date[] = []

    // 前月の日付を追加
    for (let i = 0; i < startDayOfWeek; i++) {
      const date = new Date(year, month - 1, -startDayOfWeek + i + 1)
      days.push(date)
    }

    // 当月の日付を追加
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month - 1, i))
    }

    // 次月の日付を追加（カレンダーを6週分にする）
    const remainingDays = 42 - days.length
    for (let i = 1; i <= remainingDays; i++) {
      days.push(new Date(year, month, i))
    }

    setCalendarDays(days)
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

  const isCurrentMonth = (date: Date): boolean => {
    return date.getMonth() === month - 1
  }

  const isToday = (date: Date): boolean => {
    const today = new Date()
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    )
  }

  const weekDays = ['日', '月', '火', '水', '木', '金', '土']

  return (
    <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 md:p-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <button
          onClick={onPrevMonth}
          className="px-3 sm:px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-sm sm:text-base touch-manipulation"
        >
          前月
        </button>
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold">
          {year}年 {month}月
        </h2>
        <button
          onClick={onNextMonth}
          className="px-3 sm:px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-sm sm:text-base touch-manipulation"
        >
          次月
        </button>
      </div>

      {/* 曜日ヘッダー */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2">
        {weekDays.map((day, index) => (
          <div
            key={index}
            className={`text-center font-semibold py-1 sm:py-2 text-xs sm:text-sm ${
              index === 0 ? 'text-red-600' : index === 6 ? 'text-blue-600' : ''
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* カレンダーグリッド */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {calendarDays.map((date, index) => {
          const menu = getMenuForDate(date)
          const isCurrent = isCurrentMonth(date)
          const today = isToday(date)

          return (
            <button
              key={index}
              onClick={() => onDateClick(date)}
              className={`
                min-h-[80px] sm:min-h-[100px] md:min-h-[120px] p-1 sm:p-2 border rounded-md text-left
                hover:bg-blue-50 transition-colors touch-manipulation
                ${!isCurrent ? 'bg-gray-50 text-gray-400' : ''}
                ${today ? 'border-blue-500 border-2' : 'border-gray-300'}
                ${menu ? 'bg-green-50' : ''}
              `}
            >
              <div
                className={`text-xs sm:text-sm font-semibold mb-1 ${
                  index % 7 === 0
                    ? 'text-red-600'
                    : index % 7 === 6
                    ? 'text-blue-600'
                    : ''
                }`}
              >
                {date.getDate()}
              </div>
              {menu && (
                <div className="text-xs space-y-1">
                  {menu.recipe.imageUrl && (
                    <img
                      src={menu.recipe.imageUrl}
                      alt={menu.recipe.name}
                      className="w-full h-10 sm:h-12 md:h-16 object-cover rounded"
                    />
                  )}
                  <div className="font-medium text-green-800 truncate text-[10px] sm:text-xs">
                    {menu.recipe.name}
                  </div>
                </div>
              )}
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
