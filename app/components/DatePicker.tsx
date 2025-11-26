'use client'

import React, { useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'

interface DatePickerProps {
  value: string
  onChange: (date: string) => void
  minAge?: number
  placeholder?: string
  error?: string
}

const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  minAge = 18,
  placeholder = 'Select Date of Birth',
  error
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [showYearPicker, setShowYearPicker] = useState(false)
  const [showMonthPicker, setShowMonthPicker] = useState(false)
  const datePickerRef = useRef<HTMLDivElement>(null)

  const selectedDate = value ? new Date(value) : null
  const maxDate = new Date()
  maxDate.setFullYear(maxDate.getFullYear() - minAge)

  useEffect(() => {
    if (value) {
      const date = new Date(value)
      // Use setTimeout to avoid synchronous setState in effect
      setTimeout(() => {
        setCurrentMonth(date.getMonth())
        setCurrentYear(date.getFullYear())
      }, 0)
    }
  }, [value])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setShowYearPicker(false)
        setShowMonthPicker(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const formatDate = (date: Date | null): string => {
    if (!date) return ''
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const year = date.getFullYear()
    return `${year}-${month}-${day}`
  }

  const formatDisplayDate = (date: Date | null): string => {
    if (!date) return ''
    const month = date.toLocaleString('default', { month: 'short' })
    const day = date.getDate()
    const year = date.getFullYear()
    return `${month} ${day}, ${year}`
  }

  const getDaysInMonth = (month: number, year: number): number => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (month: number, year: number): number => {
    return new Date(year, month, 1).getDay()
  }

  const isDateDisabled = (date: Date): boolean => {
    return date > maxDate
  }

  const handleDateSelect = (day: number) => {
    const selectedDate = new Date(currentYear, currentMonth, day)
    if (!isDateDisabled(selectedDate)) {
      onChange(formatDate(selectedDate))
      setIsOpen(false)
    }
  }

  const handleMonthChange = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11)
        setCurrentYear(currentYear - 1)
      } else {
        setCurrentMonth(currentMonth - 1)
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0)
        setCurrentYear(currentYear + 1)
      } else {
        setCurrentMonth(currentMonth + 1)
      }
    }
  }

  const handleYearSelect = (year: number) => {
    setCurrentYear(year)
    setShowYearPicker(false)
  }

  const handleMonthSelect = (month: number) => {
    setCurrentMonth(month)
    setShowMonthPicker(false)
  }

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const years = Array.from({ length: 100 }, (_, i) => maxDate.getFullYear() - i)

  const daysInMonth = getDaysInMonth(currentMonth, currentYear)
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear)
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const emptyDays = Array.from({ length: firstDay }, (_, i) => i)

  return (
    <div className="relative" ref={datePickerRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full px-3 py-2.5 text-gray-900 text-[15px] font-semibold rounded-lg border transition-all duration-200 h-11 bg-white
          flex items-center justify-between cursor-pointer
          focus:outline-none focus:ring-2
          ${
            error
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300 focus:ring-[#3498DB] focus:border-[#3498DB]'
          }
          ${isOpen ? 'ring-2 ring-[#3498DB] border-[#3498DB]' : ''}
        `}
      >
        <span className={selectedDate ? 'text-gray-900' : 'text-gray-400'}>
          {selectedDate ? formatDisplayDate(selectedDate) : placeholder}
        </span>
        <Calendar className="w-4 h-4 text-gray-400" />
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 w-full max-w-sm">
          {/* Header with Month/Year Selector */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => handleMonthChange('prev')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              type="button"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowMonthPicker(!showMonthPicker)
                  setShowYearPicker(false)
                }}
                className="px-4 py-2 font-semibold text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                type="button"
              >
                {months[currentMonth]}
              </button>
              <button
                onClick={() => {
                  setShowYearPicker(!showYearPicker)
                  setShowMonthPicker(false)
                }}
                className="px-4 py-2 font-semibold text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                type="button"
              >
                {currentYear}
              </button>
            </div>

            <button
              onClick={() => handleMonthChange('next')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              type="button"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Month Picker */}
          {showMonthPicker && (
            <div className="grid grid-cols-3 gap-2 mb-4 p-2 bg-gray-50 rounded-lg max-h-48 overflow-y-auto">
              {months.map((month, index) => (
                <button
                  key={index}
                  onClick={() => handleMonthSelect(index)}
                  className={`
                    px-3 py-2 text-sm rounded-lg transition-colors
                    ${
                      index === currentMonth
                        ? 'bg-[#3498DB] text-white font-semibold'
                        : 'bg-white text-gray-700 hover:bg-gray-200'
                    }
                  `}
                  type="button"
                >
                  {month.substring(0, 3)}
                </button>
              ))}
            </div>
          )}

          {/* Year Picker */}
          {showYearPicker && (
            <div className="grid grid-cols-4 gap-2 mb-4 p-2 bg-gray-50 rounded-lg max-h-48 overflow-y-auto">
              {years.map((year) => (
                <button
                  key={year}
                  onClick={() => handleYearSelect(year)}
                  className={`
                    px-3 py-2 text-sm rounded-lg transition-colors
                    ${
                      year === currentYear
                        ? 'bg-[#3498DB] text-white font-semibold'
                        : 'bg-white text-gray-700 hover:bg-gray-200'
                    }
                  `}
                  type="button"
                >
                  {year}
                </button>
              ))}
            </div>
          )}

          {/* Calendar Grid */}
          {!showMonthPicker && !showYearPicker && (
            <>
              {/* Day Labels */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="text-center text-xs font-semibold text-gray-500 py-1">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-1">
                {emptyDays.map((_, index) => (
                  <div key={`empty-${index}`} className="aspect-square" />
                ))}
                {days.map((day) => {
                  const date = new Date(currentYear, currentMonth, day)
                  const isDisabled = isDateDisabled(date)
                  const isSelected =
                    selectedDate &&
                    selectedDate.getDate() === day &&
                    selectedDate.getMonth() === currentMonth &&
                    selectedDate.getFullYear() === currentYear
                  const isToday =
                    date.toDateString() === new Date().toDateString()

                  return (
                    <button
                      key={day}
                      onClick={() => handleDateSelect(day)}
                      disabled={isDisabled}
                      className={`
                        aspect-square rounded-lg text-sm font-semibold transition-all
                        ${
                          isSelected
                            ? 'bg-[#3498DB] text-white shadow-md'
                            : isDisabled
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-gray-700 hover:bg-gray-100'
                        }
                        ${isToday && !isSelected ? 'ring-2 ring-[#3498DB]' : ''}
                      `}
                      type="button"
                    >
                      {day}
                    </button>
                  )
                })}
              </div>
            </>
          )}

          {/* Age Requirement Note */}
          <p className="text-xs text-gray-500 mt-3 text-center">
            Must be {minAge} years or older
          </p>
        </div>
      )}

      {error && (
        <p className="mt-1 text-sm text-red-600 font-medium">{error}</p>
      )}
    </div>
  )
}

export default DatePicker

