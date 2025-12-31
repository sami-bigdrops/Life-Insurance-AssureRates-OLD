'use client'

import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

interface CustomSelectProps {
  value: string
  onChange: (value: string) => void
  options: Array<{ value: string; label: string }>
  placeholder?: string
  error?: boolean
  id?: string
  label?: string
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  value,
  onChange,
  options,
  placeholder = 'Select...',
  error = false,
  id,
  label
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const selectedOption = options.find(opt => opt.value === value)

  const handleSelect = (optionValue: string) => {
    onChange(optionValue)
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {label && (
        <label htmlFor={id} className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full px-4 py-3 text-gray-900 text-[16px] font-semibold rounded-lg border transition-all duration-200 h-12 bg-white
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
        <span className={selectedOption ? 'text-gray-900' : 'text-gray-400'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-h-64 overflow-y-auto">
          {options.map((option) => (
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
}

export default CustomSelect

