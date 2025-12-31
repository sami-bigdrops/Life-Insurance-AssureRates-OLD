'use client'

import React, { useState, useRef, useEffect, useImperativeHandle, forwardRef } from 'react'
import { ChevronDown } from 'lucide-react'

interface DateInputSelectProps {
  value: string
  onChange: (value: string) => void
  options: Array<{ value: string; label: string }>
  placeholder?: string
  error?: boolean
  id?: string
  label?: string
  maxLength?: number
  onMaxLengthReached?: () => void
  autoFocus?: boolean
}

export interface DateInputSelectRef {
  focus: () => void
}

const DateInputSelect = forwardRef<DateInputSelectRef, DateInputSelectProps>(({
  value,
  onChange,
  options,
  placeholder = 'Select...',
  error = false,
  id,
  label,
  maxLength = 2,
  onMaxLengthReached,
  autoFocus = false
}, ref) => {
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current?.focus()
    }
  }))

  useEffect(() => {
    if (!isTyping) {
      if (value) {
        const option = options.find(opt => opt.value === value)
        setInputValue(option ? option.label : value)
      } else {
        setInputValue('')
      }
    }
  }, [value, options, isTyping])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setIsTyping(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus()
    }
  }, [autoFocus])

  const selectedOption = options.find(opt => opt.value === value)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value.replace(/\D/g, '')
    
    if (maxLength && newValue.length > maxLength) {
      newValue = newValue.slice(0, maxLength)
    }
    
    setInputValue(newValue)
    setIsTyping(true)
    
    if (newValue === '') {
      onChange('')
      return
    }

    const findMatchingOption = (val: string) => {
      if (!val) return null
      
      return options.find(opt => {
        if (opt.value === '') return false
        
        const optValueNum = parseInt(opt.value, 10)
        const optLabelNum = parseInt(opt.label, 10)
        const inputNum = parseInt(val, 10)
        
        if (isNaN(inputNum)) return false
        
        if (optValueNum === inputNum || optLabelNum === inputNum) {
          return true
        }
        
        const optValueStr = String(optValueNum)
        const optLabelStr = String(optLabelNum)
        
        return optValueStr.startsWith(val) || optLabelStr.startsWith(val) ||
               opt.value.startsWith(val) || opt.label.startsWith(val)
      })
    }

    const matchingOption = findMatchingOption(newValue)

    if (matchingOption) {
      onChange(matchingOption.value)
      
      if (newValue.length === maxLength && onMaxLengthReached) {
        setTimeout(() => {
          onMaxLengthReached()
        }, 50)
      }
    } else if (newValue.length === maxLength) {
      const exactMatch = findMatchingOption(newValue)
      if (exactMatch) {
        onChange(exactMatch.value)
        if (onMaxLengthReached) {
          setTimeout(() => {
            onMaxLengthReached()
          }, 50)
        }
      }
    }
  }

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsOpen(true)
    if (e.target.value === '' || e.target.value === selectedOption?.label) {
      setIsTyping(false)
    } else {
      setIsTyping(true)
    }
  }

  const handleInputClick = (e: React.MouseEvent<HTMLInputElement>) => {
    e.stopPropagation()
    setIsOpen(true)
    if (e.currentTarget.value === '' || e.currentTarget.value === selectedOption?.label) {
      setIsTyping(false)
      e.currentTarget.select()
    }
  }

  const handleInputBlur = () => {
    setTimeout(() => {
      setIsTyping(false)
      if (value && selectedOption) {
        setInputValue(selectedOption.label)
      }
    }, 200)
  }

  const handleSelect = (optionValue: string) => {
    onChange(optionValue)
    setIsOpen(false)
    setIsTyping(false)
    inputRef.current?.blur()
  }

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).closest('.chevron-icon')) {
      setIsOpen(!isOpen)
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {label && (
        <label htmlFor={id} className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div
        onClick={handleContainerClick}
        className={`
          w-full px-4 py-3 text-gray-900 text-[16px] font-semibold rounded-lg border transition-all duration-200 h-12 bg-white
          flex items-center justify-between
          focus-within:outline-none focus-within:ring-2
          ${
            error
              ? 'border-red-500 focus-within:ring-red-500 focus-within:border-red-500'
              : 'border-gray-300 focus-within:ring-[#3498DB] focus-within:border-[#3498DB]'
          }
          ${isOpen && !isTyping ? 'ring-2 ring-[#3498DB] border-[#3498DB]' : ''}
        `}
      >
        <input
          ref={inputRef}
          type="text"
          id={id}
          value={isTyping ? inputValue : (selectedOption ? selectedOption.label : '')}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onClick={handleInputClick}
          onBlur={handleInputBlur}
          placeholder={placeholder}
          maxLength={maxLength}
          className={`flex-1 bg-transparent outline-none border-none font-semibold w-full cursor-pointer ${
            isTyping || selectedOption ? 'text-gray-900' : 'text-gray-400'
          }`}
        />
        <ChevronDown 
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 flex-shrink-0 chevron-icon cursor-pointer ${isOpen ? 'rotate-180' : ''}`}
          onClick={(e) => {
            e.stopPropagation()
            setIsOpen(!isOpen)
          }}
        />
      </div>

      {isOpen && !isTyping && (
        <div className="absolute z-50 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-h-64 overflow-y-auto">
          {options.filter(opt => opt.value !== '').map((option) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`
                w-full px-4 py-3 text-left transition-colors
                ${value === option.value 
                  ? 'bg-[#3498DB] text-white hover:bg-[#2980b9]' 
                  : 'text-gray-700 hover:bg-gray-100'
                }
              `}
            >
              <span className="font-medium">{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
})

DateInputSelect.displayName = 'DateInputSelect'

export default DateInputSelect

