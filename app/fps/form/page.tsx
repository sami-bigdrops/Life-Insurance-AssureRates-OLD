'use client'

import React, { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import RadioButtonGroup from '@/app/components/RadioButtonGroup'
import DateOfBirthInput from '@/app/components/DateOfBirthInput'
import { validateName, validateZipCode, validateDateOfBirth, validatePhoneNumber } from '@/utils/validation'

const FpsForm = () => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [gender, setGender] = useState('')
  // Initialize zip code from localStorage if available
  const [zipCode, setZipCode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('zipCode') || ''
    }
    return ''
  })
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')

  const [firstNameError, setFirstNameError] = useState<string>('')
  const [lastNameError, setLastNameError] = useState<string>('')
  const [genderError, setGenderError] = useState<string>('')
  const [zipCodeError, setZipCodeError] = useState<string>('')
  const [dateOfBirthError, setDateOfBirthError] = useState<string>('')
  const [phoneNumberError, setPhoneNumberError] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    // Validate all fields
    const firstNameValidation = validateName(firstName, 'First name')
    const lastNameValidation = validateName(lastName, 'Last name')
    const genderValidation = gender ? { valid: true } : { valid: false, error: 'Gender is required' }
    const zipCodeValidation = validateZipCode(zipCode)
    const dateOfBirthValidation = validateDateOfBirth(dateOfBirth)
    const phoneNumberValidation = validatePhoneNumber(phoneNumber)

    // Set errors
    if (!firstNameValidation.valid) {
      setFirstNameError(firstNameValidation.error || 'First name is required')
      return
    }
    setFirstNameError('')

    if (!lastNameValidation.valid) {
      setLastNameError(lastNameValidation.error || 'Last name is required')
      return
    }
    setLastNameError('')

    if (!genderValidation.valid) {
      setGenderError(genderValidation.error || 'Gender is required')
      return
    }
    setGenderError('')

    if (!zipCodeValidation.valid) {
      setZipCodeError(zipCodeValidation.error || 'Please enter a valid 5-digit ZIP code')
      return
    }
    setZipCodeError('')

    if (!dateOfBirthValidation.valid) {
      setDateOfBirthError(dateOfBirthValidation.error || 'Date of birth is required')
      return
    }
    setDateOfBirthError('')

    if (!phoneNumberValidation.valid) {
      setPhoneNumberError(phoneNumberValidation.error || 'Phone number is required')
      return
    }
    setPhoneNumberError('')

    // Store zip code in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('zipCode', zipCode)
    }

    // Set submitting state
    setIsSubmitting(true)

    // Form is valid, proceed with submission
    // TODO: Add form submission logic here
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      console.log('Form submitted:', {
        firstName,
        lastName,
        gender,
        zipCode,
        dateOfBirth,
        phoneNumber
      })
      
      // TODO: Handle successful submission (redirect, etc.)
    } catch (error) {
      console.error('Form submission error:', error)
      setIsSubmitting(false)
    }
  }

  const handleZipCodeChange = (value: string) => {
    // Only allow digits and limit to 5 characters
    if (/^\d{0,5}$/.test(value)) {
      setZipCode(value)
      // Store zip code in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('zipCode', value)
      }
      // Clear error when user starts typing
      if (zipCodeError) {
        setZipCodeError('')
      }
    }
  }

  // Custom phone number formatter: (123) 456 - 7890
  const formatPhoneNumberCustom = (digits: string): string => {
    const cleanDigits = digits.replace(/\D/g, '').slice(0, 10)
    
    if (cleanDigits.length === 0) {
      return ''
    } else if (cleanDigits.length <= 3) {
      return `(${cleanDigits}`
    } else if (cleanDigits.length <= 6) {
      return `(${cleanDigits.slice(0, 3)}) ${cleanDigits.slice(3)}`
    } else {
      return `(${cleanDigits.slice(0, 3)}) ${cleanDigits.slice(3, 6)} - ${cleanDigits.slice(6)}`
    }
  }

  // Helper function to count digits before a given position
  const countDigitsBeforePosition = (value: string, position: number): number => {
    let count = 0
    for (let i = 0; i < Math.min(position, value.length); i++) {
      if (/\d/.test(value[i])) {
        count++
      }
    }
    return count
  }

  // Helper function to find cursor position after a specific number of digits
  const findCursorPositionAfterDigits = (formatted: string, digitCount: number): number => {
    let count = 0
    for (let i = 0; i < formatted.length; i++) {
      if (/\d/.test(formatted[i])) {
        count++
        if (count === digitCount) {
          return i + 1
        }
      }
    }
    return formatted.length
  }

  // Handle phone number input with proper cursor management
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target
    const cursorPosition = input.selectionStart || 0
    const oldValue = phoneNumber
    const newValue = e.target.value

    // Extract digits from old and new values
    const oldDigits = oldValue.replace(/\D/g, '')
    const newDigits = newValue.replace(/\D/g, '')

    // Count how many digits were before the cursor in the old value
    const digitsBeforeCursor = countDigitsBeforePosition(oldValue, cursorPosition)

    // Handle backspace
    if (e.nativeEvent instanceof InputEvent && e.nativeEvent.inputType === 'deleteContentBackward') {
      // If cursor is right after a formatting character, delete the digit before it
      if (cursorPosition > 0) {
        const charBefore = oldValue[cursorPosition - 1]
        if (charBefore === '(' || charBefore === ')' || charBefore === ' ' || charBefore === '-') {
          // We want to delete the digit that comes before this formatting character
          // So we keep digitsBeforeCursor - 1 digits
          const digitsToKeep = Math.max(0, digitsBeforeCursor - 1)
          const updatedDigits = oldDigits.slice(0, digitsToKeep)
          const formatted = formatPhoneNumberCustom(updatedDigits)
          
          setPhoneNumber(formatted)
          if (phoneNumberError) {
            setPhoneNumberError('')
          }
          
          // Position cursor after the kept digits
          setTimeout(() => {
            const newCursorPos = findCursorPositionAfterDigits(formatted, digitsToKeep)
            input.setSelectionRange(newCursorPos, newCursorPos)
          }, 0)
          
          return
        }
      }

      // Normal backspace - format and maintain cursor position
      const formatted = formatPhoneNumberCustom(newDigits)
      setPhoneNumber(formatted)
      if (phoneNumberError) {
        setPhoneNumberError('')
      }
      
      // Position cursor to maintain the same digit position
      setTimeout(() => {
        const targetDigitCount = Math.min(digitsBeforeCursor, newDigits.length)
        const newCursorPos = findCursorPositionAfterDigits(formatted, targetDigitCount)
        input.setSelectionRange(newCursorPos, newCursorPos)
      }, 0)
      
      return
    }

    // Handle normal typing
    const formatted = formatPhoneNumberCustom(newDigits)
    setPhoneNumber(formatted)
    if (phoneNumberError) {
      setPhoneNumberError('')
    }
    
    // Determine new cursor position
    setTimeout(() => {
      let targetDigitCount: number
      
      if (newDigits.length > oldDigits.length) {
        // Added a digit - move cursor forward by one digit
        targetDigitCount = digitsBeforeCursor + 1
      } else if (newDigits.length < oldDigits.length) {
        // Removed a digit (delete key) - maintain position
        targetDigitCount = Math.min(digitsBeforeCursor, newDigits.length)
      } else {
        // Same number of digits (paste or other operation) - maintain position
        targetDigitCount = Math.min(digitsBeforeCursor, newDigits.length)
      }
      
      const newCursorPos = findCursorPositionAfterDigits(formatted, targetDigitCount)
      input.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 md:p-10">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#12266D] mb-2 text-center">
            Complete Your Life Insurance Application
          </h1>
          <p className="text-gray-600 mb-8 text-center">
            Please fill in the following information to continue
          </p>

          <div className="space-y-6">
            {/* First Name and Last Name - Same Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value)
                    if (firstNameError) setFirstNameError('')
                  }}
                  onBlur={() => {
                    const validation = validateName(firstName, 'First name')
                    if (!validation.valid) {
                      setFirstNameError(validation.error || '')
                    } else {
                      setFirstNameError('')
                    }
                  }}
                  className={`w-full px-4 py-3 text-gray-900 text-[16px] font-semibold rounded-lg border transition-all duration-200 h-12 bg-white focus:outline-none focus:ring-2 ${
                    firstNameError
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:ring-[#3498DB] focus:border-[#3498DB]'
                  }`}
                />
                {firstNameError && (
                  <p className="mt-1 text-sm text-red-600 font-medium">{firstNameError}</p>
                )}
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value)
                    if (lastNameError) setLastNameError('')
                  }}
                  onBlur={() => {
                    const validation = validateName(lastName, 'Last name')
                    if (!validation.valid) {
                      setLastNameError(validation.error || '')
                    } else {
                      setLastNameError('')
                    }
                  }}
                  className={`w-full px-4 py-3 text-gray-900 text-[16px] font-semibold rounded-lg border transition-all duration-200 h-12 bg-white focus:outline-none focus:ring-2 ${
                    lastNameError
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:ring-[#3498DB] focus:border-[#3498DB]'
                  }`}
                />
                {lastNameError && (
                  <p className="mt-1 text-sm text-red-600 font-medium">{lastNameError}</p>
                )}
              </div>
            </div>

            {/* Gender - Custom Radio Buttons */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Gender
              </label>
              <div className="flex gap-4">
                <RadioButtonGroup
                  options={[
                    { id: 'male', label: 'Male' },
                    { id: 'female', label: 'Female' }
                  ]}
                  value={gender}
                  onChange={(value) => setGender(value)}
                  columns={2}
                />
                {genderError && (
                  <p className="mt-2 text-sm text-red-600 font-medium">{genderError}</p>
                )}
              </div>
            </div>

            {/* Zip Code */}
            <div>
              <label htmlFor="zipCode" className="block text-sm font-semibold text-gray-700 mb-2">
                Zip Code
              </label>
              <input
                type="text"
                id="zipCode"
                placeholder="Zip Code e.g. 11102"
                value={zipCode}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleZipCodeChange(e.target.value)}
                onBlur={() => handleZipCodeChange(zipCode)}
                className={`w-full px-4 py-3 text-gray-900 text-[16px] font-semibold rounded-lg border transition-all duration-200 h-12 bg-white focus:outline-none focus:ring-2 ${
                  zipCodeError
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:ring-[#3498DB] focus:border-[#3498DB]'
                }`}
              />
              {zipCodeError && (
                <p className="mt-1 text-sm text-red-600 font-medium">{zipCodeError}</p>
              )}
            </div>

            {/* Date of Birth */}
            <div>
              <DateOfBirthInput
                value={dateOfBirth}
                onChange={(date) => {
                  setDateOfBirth(date)
                  if (dateOfBirthError) setDateOfBirthError('')
                }}
                minAge={18}
                error={dateOfBirthError}
              />
            </div>

            {/* Phone Number */}
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                placeholder="(123) 456 - 7890"
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
                onBlur={() => {
                  const validation = validatePhoneNumber(phoneNumber)
                  if (!validation.valid) {
                    setPhoneNumberError(validation.error || '')
                  } else {
                    setPhoneNumberError('')
                  }
                }}
                className={`w-full px-4 py-3 text-gray-900 text-[16px] font-semibold rounded-lg border transition-all duration-200 h-12 bg-white focus:outline-none focus:ring-2 ${
                  phoneNumberError
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:ring-[#3498DB] focus:border-[#3498DB]'
                }`}
              />
              {phoneNumberError && (
                <p className="mt-1 text-sm text-red-600 font-medium">{phoneNumberError}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`w-full px-4 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 text-[16px] h-12 text-white shadow-lg ${
                isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-[#3498DB] hover:bg-[#2980b9] hover:shadow-xl'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Submitting
                </>
              ) : (
                <>
                  Submit Details
                  <ArrowRight className="w-4 h-4 text-white font-semibold" />
                </>
              )}
            </button>

            {/* Disclaimer */}
            <div className="text-sm text-gray-600 mt-4">
              <p>
                By clicking above, you agree to our <a href="/privacy-policy" className="text-[#3498DB] hover:underline">Privacy Policy</a> and to receive insurance offers from AssureRates.com or their partner agents at the email address or telephone numbers you provided, including autodialed, pre-recorded calls, artificial voice or text messages. You understand that consent is not a condition of purchase and your consent may be revoked at any time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FpsForm
