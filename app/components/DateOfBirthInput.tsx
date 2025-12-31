'use client'

import React, { useState, useEffect, useRef } from 'react'
import DateInputSelect, { DateInputSelectRef } from './DateInputSelect'

interface DateOfBirthInputProps {
  value: string
  onChange: (date: string) => void
  minAge?: number
  error?: string
  onComplete?: (date: string) => void
}

const DateOfBirthInput: React.FC<DateOfBirthInputProps> = ({
  value,
  onChange,
  minAge = 18,
  error,
  onComplete
}) => {
  const [day, setDay] = useState('')
  const [month, setMonth] = useState('')
  const [year, setYear] = useState('')

  const dayRef = useRef<DateInputSelectRef>(null)
  const monthRef = useRef<DateInputSelectRef>(null)
  const yearRef = useRef<DateInputSelectRef>(null)

  const months = [
    { value: '', label: 'Month' },
    { value: '01', label: '01' },
    { value: '02', label: '02' },
    { value: '03', label: '03' },
    { value: '04', label: '04' },
    { value: '05', label: '05' },
    { value: '06', label: '06' },
    { value: '07', label: '07' },
    { value: '08', label: '08' },
    { value: '09', label: '09' },
    { value: '10', label: '10' },
    { value: '11', label: '11' },
    { value: '12', label: '12' }
  ]

  const currentYear = new Date().getFullYear()
  const maxYear = currentYear - minAge
  const minYear = maxYear - 100
  const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => maxYear - i)

  useEffect(() => {
    if (value) {
      const date = new Date(value)
      if (!isNaN(date.getTime())) {
        setDay(String(date.getDate()).padStart(2, '0'))
        setMonth(String(date.getMonth() + 1).padStart(2, '0'))
        setYear(String(date.getFullYear()))
      }
    } else {
      setDay('')
      setMonth('')
      setYear('')
    }
  }, [value])

  const getDaysInMonth = (month: string, year: string): number => {
    if (!month || !year) return 31
    const monthNum = parseInt(month, 10)
    const yearNum = parseInt(year, 10)
    if (isNaN(monthNum) || isNaN(yearNum)) return 31
    return new Date(yearNum, monthNum, 0).getDate()
  }

  const formatDate = (d: string, m: string, y: string): string => {
    if (!d || !m || !y) return ''
    const dayNum = parseInt(d, 10)
    const monthNum = parseInt(m, 10)
    const yearNum = parseInt(y, 10)
    
    if (isNaN(dayNum) || isNaN(monthNum) || isNaN(yearNum)) return ''
    
    const formattedDay = String(dayNum).padStart(2, '0')
    const formattedMonth = String(monthNum).padStart(2, '0')
    return `${yearNum}-${formattedMonth}-${formattedDay}`
  }

  const handleDayChange = (value: string) => {
    setDay(value)
    const formattedDate = formatDate(value, month, year)
    onChange(formattedDate)
    if (formattedDate && value && month && year && onComplete) {
      setTimeout(() => onComplete(formattedDate), 300)
    }
  }

  const handleDayMaxLength = () => {
    if (day && day.length === 2) {
      setTimeout(() => {
        monthRef.current?.focus()
      }, 50)
    }
  }

  const handleMonthChange = (value: string) => {
    setMonth(value)
    
    if (value && day) {
      const maxDays = getDaysInMonth(value, year)
      const dayNum = parseInt(day, 10)
      if (dayNum > maxDays) {
        const adjustedDay = String(maxDays).padStart(2, '0')
        setDay(adjustedDay)
        const formattedDate = formatDate(adjustedDay, value, year)
        onChange(formattedDate)
        if (formattedDate && adjustedDay && value && year && onComplete) {
          setTimeout(() => onComplete(formattedDate), 300)
        }
      } else {
        const formattedDate = formatDate(day, value, year)
        onChange(formattedDate)
        if (formattedDate && day && value && year && onComplete) {
          setTimeout(() => onComplete(formattedDate), 300)
        }
      }
    } else {
      onChange(formatDate(day, value, year))
    }
  }

  const handleMonthMaxLength = () => {
    if (month && month.length === 2) {
      setTimeout(() => {
        yearRef.current?.focus()
      }, 50)
    }
  }

  const handleYearChange = (value: string) => {
    setYear(value)
    
    if (value && day && month) {
      const maxDays = getDaysInMonth(month, value)
      const dayNum = parseInt(day, 10)
      if (dayNum > maxDays) {
        const adjustedDay = String(maxDays).padStart(2, '0')
        setDay(adjustedDay)
        const formattedDate = formatDate(adjustedDay, month, value)
        onChange(formattedDate)
        if (formattedDate && onComplete) {
          setTimeout(() => onComplete(formattedDate), 300)
        }
      } else {
        const formattedDate = formatDate(day, month, value)
        onChange(formattedDate)
        if (formattedDate && onComplete) {
          setTimeout(() => onComplete(formattedDate), 300)
        }
      }
    } else {
      onChange(formatDate(day, month, value))
    }
  }

  const maxDays = getDaysInMonth(month, year)
  const days = Array.from({ length: maxDays }, (_, i) => i + 1)
  const dayOptions = [
    { value: '', label: 'Day' },
    ...days.map(d => ({ value: String(d).padStart(2, '0'), label: String(d) }))
  ]

  const yearOptions = [
    { value: '', label: 'Year' },
    ...years.map(y => ({ value: String(y), label: String(y) }))
  ]

  return (
    <div>
      <div className="grid grid-cols-3 gap-4">
        {/* Day Input/Dropdown */}
        <DateInputSelect
          ref={dayRef}
          id="day"
          value={day}
          onChange={handleDayChange}
          options={dayOptions}
          placeholder="Day"
          error={!!error}
          label="Day"
          maxLength={2}
          onMaxLengthReached={handleDayMaxLength}
        />

        {/* Month Input/Dropdown */}
        <DateInputSelect
          ref={monthRef}
          id="month"
          value={month}
          onChange={handleMonthChange}
          options={months}
          placeholder="Month"
          error={!!error}
          label="Month"
          maxLength={2}
          onMaxLengthReached={handleMonthMaxLength}
        />

        {/* Year Input/Dropdown */}
        <DateInputSelect
          ref={yearRef}
          id="year"
          value={year}
          onChange={handleYearChange}
          options={yearOptions}
          placeholder="Year"
          error={!!error}
          label="Year"
          maxLength={4}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600 font-medium">{error}</p>
      )}
    </div>
  )
}

export default DateOfBirthInput

