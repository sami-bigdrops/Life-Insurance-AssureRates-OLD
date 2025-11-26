'use client'

import React, { useState, useEffect } from 'react'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ProgressBar from '@/app/long/components/ui/ProgressBar'
import DatePicker from '@/app/components/DatePicker'
import RadioButtonGroup from '@/app/components/RadioButtonGroup'
import StateDropdown from '@/app/components/StateDropdown'
import { validateDateOfBirth, validateName, validateAddress, validateCity, validateZipCode, validateEmail, validatePhoneNumber } from '@/utils/validation'

const LongForm = () => {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize form data with zip code from localStorage
  const [formData, setFormData] = useState(() => {
    if (typeof window !== 'undefined') {
      const storedZip = localStorage.getItem('zipCode')
      return {
        zipCode: storedZip || '',
        dateOfBirth: '',
        gender: '',
        married: '',
        heightFeet: '',
        heightInches: '',
        weight: '',
        tobacco: '',
        hasHealthConditions: '',
        coverage: '',
        coverageAmount: '',
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        state: '',
        addressZipCode: '',
        email: '',
        phoneNumber: '',
        // Add more fields as steps are added
      }
    }
    return {
      zipCode: '',
      dateOfBirth: '',
      gender: '',
      married: '',
      heightFeet: '',
      heightInches: '',
      weight: '',
      tobacco: '',
      hasHealthConditions: '',
      coverage: '',
      coverageAmount: '',
      firstName: '',
      lastName: '',
      address: '',
      city: '',
      state: '',
      addressZipCode: '',
      email: '',
      phoneNumber: '',
    }
  })

  // Load form data and current step from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && !isInitialized) {
      try {
        const savedFormData = localStorage.getItem('long_form_data')
        const savedCurrentStep = localStorage.getItem('long_current_step')

        if (savedFormData) {
          const parsedData = JSON.parse(savedFormData)
          // Use setTimeout to avoid synchronous setState in effect
          setTimeout(() => {
            setFormData(prev => ({ ...prev, ...parsedData }))
          }, 0)

          // Get zip code from localStorage if not in saved form data
          if (!parsedData.zipCode) {
            const storedZip = localStorage.getItem('zipCode')
            if (storedZip && storedZip.length === 5) {
              setTimeout(() => {
                setFormData(prev => ({ ...prev, zipCode: storedZip, addressZipCode: storedZip }))
              }, 0)
            }
          }
          // Also set addressZipCode if not in saved data
          if (!parsedData.addressZipCode) {
            const storedZip = localStorage.getItem('zipCode')
            if (storedZip && storedZip.length === 5) {
              setTimeout(() => {
                setFormData(prev => ({ ...prev, addressZipCode: storedZip }))
              }, 0)
            }
          }
        } else {
          // If no saved form data, get zip code from localStorage
          const storedZip = localStorage.getItem('zipCode')
          if (storedZip && storedZip.length === 5) {
            setTimeout(() => {
              setFormData(prev => ({ ...prev, zipCode: storedZip, addressZipCode: storedZip }))
            }, 0)
          }
        }

        if (savedCurrentStep) {
          const step = parseInt(savedCurrentStep, 10)
          if (step >= 1) {
            // Use setTimeout to avoid synchronous setState in effect
            setTimeout(() => {
              setCurrentStep(step)
            }, 0)
          }
        }
      } catch (error) {
        console.error('Error loading form data from localStorage:', error)
      }
      // Use setTimeout to avoid synchronous setState in effect
      setTimeout(() => {
        setIsInitialized(true)
      }, 0)
    }
  }, [isInitialized])

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined' && isInitialized) {
      try {
        localStorage.setItem('long_form_data', JSON.stringify(formData))
      } catch (error) {
        console.error('Error saving form data to localStorage:', error)
      }
    }
  }, [formData, isInitialized])

  // Save current step to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined' && isInitialized) {
      try {
        localStorage.setItem('long_current_step', currentStep.toString())
      } catch (error) {
        console.error('Error saving current step to localStorage:', error)
      }
    }
  }, [currentStep, isInitialized])

  // Clear localStorage on successful submission
  const clearFormData = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('long_form_data')
      localStorage.removeItem('long_current_step')
    }
  }

  const handleInputChange = (field: string, value: string | number | object, autoAdvance = false) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }

    // Auto-advance to next step if enabled
    if (autoAdvance) {
      setTimeout(() => {
        setCurrentStep(prev => prev + 1)
      }, 150)
    }
  }

  // Validate field on blur
  const validateField = (field: string, value: string | number) => {
    let validation: { valid: boolean; error?: string } = { valid: true }
    
    switch (field) {
      case 'dateOfBirth':
        validation = validateDateOfBirth(String(value))
        break
    }

    if (!validation.valid && validation.error) {
      setErrors(prev => ({ ...prev, [field]: validation.error! }))
    } else {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }

    return validation.valid
  }

  const handleNext = async () => {
    if (isStepValid()) {
      // TODO: Add final step number when steps are defined
      const finalStep = 13 // This will be updated when steps are added

      if (currentStep === finalStep) {
        // Submit form
        setIsSubmitting(true)

        // Format height as "5ft 6in"
        const formattedHeight = formData.heightFeet && formData.heightInches 
          ? `${formData.heightFeet}ft ${formData.heightInches}in`
          : ''

        // Prepare form data for submission
        const submissionData = {
          ...formData,
          height: formattedHeight
        }

        console.log('Form submitted:', submissionData)

        // Clear form data from localStorage on successful submission
        clearFormData()

        // Direct redirect to thank you page
        router.push('/thankyou')

        // TODO: Add API submission logic here when ready
      } else {
        setCurrentStep(prev => prev + 1)
        console.log('Form data:', formData)
      }
    }
  }

  const handleBack = () => {
    setCurrentStep(prev => Math.max(1, prev - 1))
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return validateDateOfBirth(formData.dateOfBirth).valid && !errors.dateOfBirth
      case 2:
        return formData.gender !== '' && !errors.gender
      case 3:
        return formData.married !== '' && !errors.married
      case 4:
        return formData.heightFeet !== '' && formData.heightInches !== '' && !errors.heightFeet && !errors.heightInches
      case 5:
        return formData.weight !== '' && !errors.weight
      case 6:
        return formData.tobacco !== '' && !errors.tobacco
      case 7:
        return formData.hasHealthConditions !== '' && !errors.hasHealthConditions
      case 8:
        return formData.coverage !== '' && !errors.coverage
      case 9:
        return formData.coverageAmount !== '' && !errors.coverageAmount
      case 10:
        return (
          validateName(formData.firstName, 'First name').valid &&
          validateName(formData.lastName, 'Last name').valid &&
          !errors.firstName &&
          !errors.lastName
        )
      case 11:
        return (
          validateAddress(formData.address).valid &&
          validateCity(formData.city).valid &&
          formData.state !== '' &&
          validateZipCode(formData.addressZipCode).valid &&
          !errors.address &&
          !errors.city &&
          !errors.state &&
          !errors.addressZipCode
        )
      case 12:
        return (
          validateEmail(formData.email).valid &&
          !errors.email
        )
      case 13:
        return (
          validatePhoneNumber(formData.phoneNumber).valid &&
          !errors.phoneNumber
        )
      default:
        return true
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
    const oldValue = formData.phoneNumber
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
          
          handleInputChange('phoneNumber', formatted)
          
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
      handleInputChange('phoneNumber', formatted)
      
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
    handleInputChange('phoneNumber', formatted)
    
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

  // Calculate progress percentage
  const totalSteps = 13 // This will be updated when steps are added
  const progress = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0

  return (
    <div className="min-h-screen px-4 pt-12 md:pt-24 pb-8 md:pb-12">
      <div className="w-full max-w-2xl mx-auto">
        {/* Progress Indicator */}
        <div className="mb-8">
          <ProgressBar 
            progress={progress}
            showPercentage={true}
          />
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl p-6 md:p-10">
          {/* Step 1: Date of Birth */}
          {currentStep === 1 && (
            <>
              <h2 className="text-2xl md:text-3xl font-bold text-[#246a99] mb-8 md:mb-10 font-sans">
                What is your Date of Birth?
              </h2>
              <div className="mb-8">
                <DatePicker
                  value={formData.dateOfBirth}
                  onChange={(date) => {
                    handleInputChange('dateOfBirth', date)
                    if (errors.dateOfBirth) {
                      setErrors(prev => {
                        const newErrors = { ...prev }
                        delete newErrors.dateOfBirth
                        return newErrors
                      })
                    }
                  }}
                  minAge={18}
                  placeholder="Select Date of Birth"
                  error={errors.dateOfBirth}
                />
              </div>
            </>
          )}

          {/* Step 2: Gender */}
          {currentStep === 2 && (
            <>
              <h2 className="text-2xl md:text-3xl font-bold text-[#246a99] mb-8 md:mb-10 font-sans">
                What is your gender?
              </h2>
              <div className="mb-8">
                <RadioButtonGroup
                  value={formData.gender}
                  onChange={(value: string) => {
                    handleInputChange('gender', value)
                    if (errors.gender) {
                      setErrors(prev => {
                        const newErrors = { ...prev }
                        delete newErrors.gender
                        return newErrors
                      })
                    }
                  }}
                  options={[
                    { id: 'male', label: 'Male' },
                    { id: 'female', label: 'Female' }
                  ]}
                  columns={2}
                />
                {errors.gender && (
                  <p className="mt-2 text-sm text-red-600 font-medium">{errors.gender}</p>
                )}
              </div>
            </>
          )}

          {/* Step 3: Married */}
          {currentStep === 3 && (
            <>
              <h2 className="text-2xl md:text-3xl font-bold text-[#246a99] mb-8 md:mb-10 font-sans">
                Are you married?
              </h2>
              <div className="mb-8">
                <RadioButtonGroup
                  value={formData.married}
                  onChange={(value: string) => {
                    handleInputChange('married', value)
                    if (errors.married) {
                      setErrors(prev => {
                        const newErrors = { ...prev }
                        delete newErrors.married
                        return newErrors
                      })
                    }
                  }}
                  options={[
                    { id: 'yes', label: 'Yes' },
                    { id: 'no', label: 'No' }
                  ]}
                  columns={2}
                />
                {errors.married && (
                  <p className="mt-2 text-sm text-red-600 font-medium">{errors.married}</p>
                )}
              </div>
            </>
          )}

          {/* Step 4: Height */}
          {currentStep === 4 && (
            <>
              <h2 className="text-2xl md:text-3xl font-bold text-[#246a99] mb-8 md:mb-10 font-sans">
                How tall are you?
              </h2>
              <div className="mb-8">
                <div className="grid grid-cols-2 gap-4">
            <div>
                    <label htmlFor="heightFeet" className="block text-sm font-semibold text-gray-700 mb-2">
                      Feet
              </label>
                    <div className="relative">
                      <input
                        type="number"
                        id="heightFeet"
                        min="0"
                        max="8"
                        value={formData.heightFeet}
                        onChange={(e) => {
                          const value = e.target.value
                          if (value === '' || (parseInt(value) >= 0 && parseInt(value) <= 8)) {
                            handleInputChange('heightFeet', value)
                            if (errors.heightFeet) {
                              setErrors(prev => {
                                const newErrors = { ...prev }
                                delete newErrors.heightFeet
                                return newErrors
                              })
                            }
                          }
                        }}
                        onBlur={() => {
                          if (formData.heightFeet === '') {
                            setErrors(prev => ({ ...prev, heightFeet: 'Feet is required' }))
                          } else {
                            setErrors(prev => {
                              const newErrors = { ...prev }
                              delete newErrors.heightFeet
                              return newErrors
                            })
                          }
                        }}
                        placeholder="0"
                        className={`w-full px-4 py-3 pr-12 text-gray-900 text-[16px] font-semibold rounded-lg border transition-all duration-200 h-12 bg-white focus:outline-none focus:ring-2 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield] ${
                          errors.heightFeet
                            ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                            : 'border-gray-300 focus:ring-[#3498DB] focus:border-[#3498DB]'
                        }`}
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 font-semibold">
                        ft
                      </span>
              </div>
                    {errors.heightFeet && (
                      <p className="mt-1 text-sm text-red-600 font-medium">{errors.heightFeet}</p>
              )}
            </div>
            <div>
                    <label htmlFor="heightInches" className="block text-sm font-semibold text-gray-700 mb-2">
                      Inches
              </label>
                    <div className="relative">
              <input
                        type="number"
                        id="heightInches"
                        min="0"
                        max="11"
                        value={formData.heightInches}
                        onChange={(e) => {
                          const value = e.target.value
                          if (value === '' || (parseInt(value) >= 0 && parseInt(value) <= 11)) {
                            handleInputChange('heightInches', value)
                            if (errors.heightInches) {
                              setErrors(prev => {
                                const newErrors = { ...prev }
                                delete newErrors.heightInches
                                return newErrors
                              })
                            }
                          }
                        }}
                onBlur={() => {
                          if (formData.heightInches === '') {
                            setErrors(prev => ({ ...prev, heightInches: 'Inches is required' }))
                  } else {
                            setErrors(prev => {
                              const newErrors = { ...prev }
                              delete newErrors.heightInches
                              return newErrors
                            })
                          }
                        }}
                        placeholder="0"
                        className={`w-full px-4 py-3 pr-12 text-gray-900 text-[16px] font-semibold rounded-lg border transition-all duration-200 h-12 bg-white focus:outline-none focus:ring-2 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield] ${
                          errors.heightInches
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:ring-[#3498DB] focus:border-[#3498DB]'
                }`}
              />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 font-semibold">
                        in
                      </span>
                    </div>
                    {errors.heightInches && (
                      <p className="mt-1 text-sm text-red-600 font-medium">{errors.heightInches}</p>
              )}
            </div>
                </div>
              </div>
            </>
          )}

          {/* Step 5: Weight */}
          {currentStep === 5 && (
            <>
              <h2 className="text-2xl md:text-3xl font-bold text-[#246a99] mb-8 md:mb-10 font-sans">
                How much do you weigh?
              </h2>
              <div className="mb-8">
                <label htmlFor="weight" className="block text-sm font-semibold text-gray-700 mb-2">
                  Weight
              </label>
                <div className="relative">
                  <input
                    type="number"
                    id="weight"
                    min="0"
                    value={formData.weight}
                    onChange={(e) => {
                      const value = e.target.value
                      if (value === '' || (parseInt(value) >= 0)) {
                        handleInputChange('weight', value)
                        if (errors.weight) {
                          setErrors(prev => {
                            const newErrors = { ...prev }
                            delete newErrors.weight
                            return newErrors
                          })
                        }
                      }
                    }}
                    onBlur={() => {
                      if (formData.weight === '') {
                        setErrors(prev => ({ ...prev, weight: 'Weight is required' }))
                      } else {
                        setErrors(prev => {
                          const newErrors = { ...prev }
                          delete newErrors.weight
                          return newErrors
                        })
                      }
                    }}
                    placeholder="0"
                    className={`w-full px-4 py-3 pr-12 text-gray-900 text-[16px] font-semibold rounded-lg border transition-all duration-200 h-12 bg-white focus:outline-none focus:ring-2 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield] ${
                      errors.weight
                        ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:ring-[#3498DB] focus:border-[#3498DB]'
                    }`}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 font-semibold">
                    lbs
                  </span>
                </div>
                {errors.weight && (
                  <p className="mt-1 text-sm text-red-600 font-medium">{errors.weight}</p>
                )}
              </div>
            </>
          )}

          {/* Step 6: Tobacco */}
          {currentStep === 6 && (
            <>
              <h2 className="text-2xl md:text-3xl font-bold text-[#246a99] mb-8 md:mb-10 font-sans">
                Do you use Tobacco?
              </h2>
              <div className="mb-8">
                <RadioButtonGroup
                  value={formData.tobacco}
                  onChange={(value: string) => {
                    handleInputChange('tobacco', value)
                    if (errors.tobacco) {
                      setErrors(prev => {
                        const newErrors = { ...prev }
                        delete newErrors.tobacco
                        return newErrors
                      })
                    }
                  }}
                  options={[
                    { id: 'yes', label: 'Yes' },
                    { id: 'no', label: 'No' }
                  ]}
                  columns={2}
                />
                {errors.tobacco && (
                  <p className="mt-2 text-sm text-red-600 font-medium">{errors.tobacco}</p>
              )}
            </div>
            </>
          )}

          {/* Step 7: Health Conditions */}
          {currentStep === 7 && (
            <>
              <h2 className="text-2xl md:text-3xl font-bold text-[#246a99] mb-8 md:mb-10 font-sans">
                Do You Have Any of the Following Health Conditions?
              </h2>
              <div className="mb-8">
                <div className="bg-gray-50 rounded-xl p-6 md:p-8 border border-gray-200 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 md:gap-x-8 gap-y-3">
                    {[
                      { id: 'aids_hiv', label: 'AIDS / HIV' },
                      { id: 'alcohol_drug_abuse', label: 'Alcohol / Drug Abuse' },
                      { id: 'alzheimers', label: 'Alzheimer\'s Disease' },
                      { id: 'asthma', label: 'Asthma' },
                      { id: 'cancer', label: 'Cancer' },
                      { id: 'high_cholesterol', label: 'High Cholesterol' },
                      { id: 'clinical_depression', label: 'Clinical Depression' },
                      { id: 'diabetes', label: 'Diabetes' },
                      { id: 'heart_disease', label: 'Heart Disease' },
                      { id: 'high_blood_pressure', label: 'High Blood Pressure' },
                      { id: 'kidney_disease', label: 'Kidney Disease' },
                      { id: 'liver_disease', label: 'Liver Disease' },
                      { id: 'mental_illness', label: 'Mental Illness' },
                      { id: 'pulmonary_disease', label: 'Pulmonary Disease' },
                      { id: 'stroke', label: 'Stroke' },
                      { id: 'ulcer', label: 'Ulcer' },
                      { id: 'vascular_disease', label: 'Vascular Disease' },
                      { id: 'other', label: 'Other / Not Listed' }
                    ].map((condition) => (
                      <div 
                        key={condition.id} 
                        className="text-gray-800 text-sm md:text-base font-medium py-2.5 leading-relaxed"
                      >
                        {condition.label}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <RadioButtonGroup
                    value={formData.hasHealthConditions || ''}
                    onChange={(value: string) => {
                      handleInputChange('hasHealthConditions', value)
                      if (errors.hasHealthConditions) {
                        setErrors(prev => {
                          const newErrors = { ...prev }
                          delete newErrors.hasHealthConditions
                          return newErrors
                        })
                      }
                    }}
                    options={[
                      { id: 'yes', label: 'Yes' },
                      { id: 'no', label: 'No' }
                    ]}
                    columns={2}
                  />
                  {errors.hasHealthConditions && (
                    <p className="mt-2 text-sm text-red-600 font-medium">{errors.hasHealthConditions}</p>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Step 8: Coverage */}
          {currentStep === 8 && (
            <>
              <h2 className="text-2xl md:text-3xl font-bold text-[#246a99] mb-8 md:mb-10 font-sans">
                What coverage are you interested in?
              </h2>
              <div className="mb-8">
                <RadioButtonGroup
                  value={formData.coverage || ''}
                  onChange={(value: string) => {
                    handleInputChange('coverage', value)
                    if (errors.coverage) {
                      setErrors(prev => {
                        const newErrors = { ...prev }
                        delete newErrors.coverage
                        return newErrors
                      })
                    }
                  }}
                  options={[
                    { id: 'term_1_year', label: 'Term 1 Year' },
                    { id: 'term_5_year', label: 'Term 5 Year' },
                    { id: 'term_10_year', label: 'Term 10 Year' },
                    { id: 'term_15_year', label: 'Term 15 Year' },
                    { id: 'term_20_year', label: 'Term 20 Year' },
                    { id: 'term_25_year', label: 'Term 25 Year' },
                    { id: 'term_30_year', label: 'Term 30 Year' },
                    { id: 'whole_life', label: 'Whole Life' },
                    { id: 'universal_life', label: 'Universal Life' },
                    { id: 'variable_life', label: 'Variable Life' },
                    { id: 'investment', label: 'Investment' },
                    { id: 'not_sure', label: 'Not Sure' }
                  ]}
                  columns={2}
                />
                {errors.coverage && (
                  <p className="mt-2 text-sm text-red-600 font-medium">{errors.coverage}</p>
                )}
              </div>
            </>
          )}

          {/* Step 9: Coverage Amount */}
          {currentStep === 9 && (
            <>
              <h2 className="text-2xl md:text-3xl font-bold text-[#246a99] mb-8 md:mb-10 font-sans">
                What coverage amount are you interested in?
              </h2>
              <div className="mb-8">
                <RadioButtonGroup
                  value={formData.coverageAmount || ''}
                  onChange={(value: string) => {
                    handleInputChange('coverageAmount', value)
                    if (errors.coverageAmount) {
                      setErrors(prev => {
                        const newErrors = { ...prev }
                        delete newErrors.coverageAmount
                        return newErrors
                      })
                    }
                  }}
                  options={[
                    { id: '50000', label: '$50,000' },
                    { id: '100000', label: '$100,000' },
                    { id: '150000', label: '$150,000' },
                    { id: '200000', label: '$200,000' },
                    { id: '250000', label: '$250,000' },
                    { id: '300000', label: '$300,000' },
                    { id: '350000', label: '$350,000' },
                    { id: '400000', label: '$400,000' },
                    { id: '450000', label: '$450,000' },
                    { id: '500000', label: '$500,000' },
                    { id: '600000', label: '$600,000' },
                    { id: '700000', label: '$700,000' },
                    { id: '800000', label: '$800,000' },
                    { id: '900000', label: '$900,000' },
                    { id: '1000000', label: '$1,000,000' },
                    { id: '1250000', label: '$1,250,000' },
                    { id: '1500000', label: '$1,500,000' },
                    { id: '1750000', label: '$1,750,000' },
                    { id: '2000000', label: '$2,000,000' }
                  ]}
                  columns={2}
                />
                {errors.coverageAmount && (
                  <p className="mt-2 text-sm text-red-600 font-medium">{errors.coverageAmount}</p>
                )}
              </div>
            </>
          )}

          {/* Step 10: Name */}
          {currentStep === 10 && (
            <>
              <h2 className="text-2xl md:text-3xl font-bold text-[#246a99] mb-8 md:mb-10 font-sans">
                What is your name?
              </h2>
              <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  placeholder="First Name"
                      value={formData.firstName}
                  onChange={(e) => {
                        handleInputChange('firstName', e.target.value)
                        if (errors.firstName) {
                          setErrors(prev => {
                            const newErrors = { ...prev }
                            delete newErrors.firstName
                            return newErrors
                          })
                        }
                  }}
                  onBlur={() => {
                        const validation = validateName(formData.firstName, 'First name')
                    if (!validation.valid) {
                          setErrors(prev => ({ ...prev, firstName: validation.error || '' }))
                    } else {
                          setErrors(prev => {
                            const newErrors = { ...prev }
                            delete newErrors.firstName
                            return newErrors
                          })
                    }
                  }}
                  className={`w-full px-4 py-3 text-gray-900 text-[16px] font-semibold rounded-lg border transition-all duration-200 h-12 bg-white focus:outline-none focus:ring-2 ${
                        errors.firstName
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:ring-[#3498DB] focus:border-[#3498DB]'
                  }`}
                />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-600 font-medium">{errors.firstName}</p>
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
                      value={formData.lastName}
                  onChange={(e) => {
                        handleInputChange('lastName', e.target.value)
                        if (errors.lastName) {
                          setErrors(prev => {
                            const newErrors = { ...prev }
                            delete newErrors.lastName
                            return newErrors
                          })
                        }
                  }}
                  onBlur={() => {
                        const validation = validateName(formData.lastName, 'Last name')
                    if (!validation.valid) {
                          setErrors(prev => ({ ...prev, lastName: validation.error || '' }))
                    } else {
                          setErrors(prev => {
                            const newErrors = { ...prev }
                            delete newErrors.lastName
                            return newErrors
                          })
                    }
                  }}
                  className={`w-full px-4 py-3 text-gray-900 text-[16px] font-semibold rounded-lg border transition-all duration-200 h-12 bg-white focus:outline-none focus:ring-2 ${
                        errors.lastName
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:ring-[#3498DB] focus:border-[#3498DB]'
                  }`}
                />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-600 font-medium">{errors.lastName}</p>
                )}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Step 11: Address */}
          {currentStep === 11 && (
            <>
              <h2 className="text-2xl md:text-3xl font-bold text-[#246a99] mb-8 md:mb-10 font-sans">
                What is your address?
              </h2>
              <div className="mb-8 space-y-6">
                {/* Address */}
                <div>
                  <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    placeholder="Street Address"
                    value={formData.address}
                    onChange={(e) => {
                      handleInputChange('address', e.target.value)
                      if (errors.address) {
                        setErrors(prev => {
                          const newErrors = { ...prev }
                          delete newErrors.address
                          return newErrors
                        })
                      }
                    }}
                    onBlur={() => {
                      const validation = validateAddress(formData.address)
                      if (!validation.valid) {
                        setErrors(prev => ({ ...prev, address: validation.error || '' }))
                      } else {
                        setErrors(prev => {
                          const newErrors = { ...prev }
                          delete newErrors.address
                          return newErrors
                        })
                      }
                    }}
                    className={`w-full px-4 py-3 text-gray-900 text-[16px] font-semibold rounded-lg border transition-all duration-200 h-12 bg-white focus:outline-none focus:ring-2 ${
                      errors.address
                        ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:ring-[#3498DB] focus:border-[#3498DB]'
                    }`}
                  />
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-600 font-medium">{errors.address}</p>
                  )}
            </div>

                {/* City and State - Same Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
                    <label htmlFor="city" className="block text-sm font-semibold text-gray-700 mb-2">
                      City
              </label>
                    <input
                      type="text"
                      id="city"
                      placeholder="City"
                      value={formData.city}
                      onChange={(e) => {
                        handleInputChange('city', e.target.value)
                        if (errors.city) {
                          setErrors(prev => {
                            const newErrors = { ...prev }
                            delete newErrors.city
                            return newErrors
                          })
                        }
                      }}
                      onBlur={() => {
                        const validation = validateCity(formData.city)
                        if (!validation.valid) {
                          setErrors(prev => ({ ...prev, city: validation.error || '' }))
                        } else {
                          setErrors(prev => {
                            const newErrors = { ...prev }
                            delete newErrors.city
                            return newErrors
                          })
                        }
                      }}
                      className={`w-full px-4 py-3 text-gray-900 text-[16px] font-semibold rounded-lg border transition-all duration-200 h-12 bg-white focus:outline-none focus:ring-2 ${
                        errors.city
                          ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                          : 'border-gray-300 focus:ring-[#3498DB] focus:border-[#3498DB]'
                      }`}
                    />
                    {errors.city && (
                      <p className="mt-1 text-sm text-red-600 font-medium">{errors.city}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="state" className="block text-sm font-semibold text-gray-700 mb-2">
                      State
                    </label>
                    <StateDropdown
                      value={formData.state}
                      onChange={(stateId) => {
                        handleInputChange('state', stateId)
                        if (errors.state) {
                          setErrors(prev => {
                            const newErrors = { ...prev }
                            delete newErrors.state
                            return newErrors
                          })
                        }
                      }}
                      error={errors.state}
                      placeholder="Choose a state..."
                />
              </div>
            </div>

            {/* Zip Code */}
            <div>
                  <label htmlFor="addressZipCode" className="block text-sm font-semibold text-gray-700 mb-2">
                Zip Code
              </label>
              <input
                type="text"
                    id="addressZipCode"
                placeholder="Zip Code e.g. 11102"
                    value={formData.addressZipCode}
                    onChange={(e) => {
                      const value = e.target.value
                      // Only allow digits and limit to 5 characters
                      if (/^\d{0,5}$/.test(value)) {
                        handleInputChange('addressZipCode', value)
                        // Store zip code in localStorage
                        if (typeof window !== 'undefined') {
                          localStorage.setItem('zipCode', value)
                        }
                        // Clear error when user starts typing
                        if (errors.addressZipCode) {
                          setErrors(prev => {
                            const newErrors = { ...prev }
                            delete newErrors.addressZipCode
                            return newErrors
                          })
                        }
                      }
                    }}
                onBlur={() => {
                      const validation = validateZipCode(formData.addressZipCode)
                  if (!validation.valid) {
                        setErrors(prev => ({ ...prev, addressZipCode: validation.error || '' }))
                  } else {
                        setErrors(prev => {
                          const newErrors = { ...prev }
                          delete newErrors.addressZipCode
                          return newErrors
                        })
                  }
                }}
                className={`w-full px-4 py-3 text-gray-900 text-[16px] font-semibold rounded-lg border transition-all duration-200 h-12 bg-white focus:outline-none focus:ring-2 ${
                      errors.addressZipCode
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:ring-[#3498DB] focus:border-[#3498DB]'
                }`}
              />
                  {errors.addressZipCode && (
                    <p className="mt-1 text-sm text-red-600 font-medium">{errors.addressZipCode}</p>
              )}
            </div>
              </div>
            </>
          )}

          {/* Step 12: Email */}
          {currentStep === 12 && (
            <>
              <h2 className="text-2xl md:text-3xl font-bold text-[#246a99] mb-8 md:mb-10 font-sans">
                What is Your Email?
              </h2>
              <div className="mb-8">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
              </label>
                <input
                  type="email"
                  id="email"
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={(e) => {
                    handleInputChange('email', e.target.value)
                    if (errors.email) {
                      setErrors(prev => {
                        const newErrors = { ...prev }
                        delete newErrors.email
                        return newErrors
                      })
                    }
                  }}
                  onBlur={() => {
                    const validation = validateEmail(formData.email)
                    if (!validation.valid) {
                      setErrors(prev => ({ ...prev, email: validation.error || '' }))
                    } else {
                      setErrors(prev => {
                        const newErrors = { ...prev }
                        delete newErrors.email
                        return newErrors
                      })
                    }
                  }}
                  className={`w-full px-4 py-3 text-gray-900 text-[16px] font-semibold rounded-lg border transition-all duration-200 h-12 bg-white focus:outline-none focus:ring-2 ${
                    errors.email
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:ring-[#3498DB] focus:border-[#3498DB]'
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 font-medium">{errors.email}</p>
                )}
              </div>
            </>
          )}

          {/* Step 13: Phone Number */}
          {currentStep === 13 && (
            <>
              <h2 className="text-2xl md:text-3xl font-bold text-[#246a99] mb-8 md:mb-10 font-sans">
                What is Your Phone Number?
              </h2>
              <div className="mb-8">
                <label htmlFor="phoneNumber" className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  placeholder="(123) 456 - 7890"
                  value={formData.phoneNumber}
                  onChange={handlePhoneNumberChange}
                  onBlur={() => {
                    const validation = validatePhoneNumber(formData.phoneNumber)
                    if (!validation.valid) {
                      setErrors(prev => ({ ...prev, phoneNumber: validation.error || '' }))
                    } else {
                      setErrors(prev => {
                        const newErrors = { ...prev }
                        delete newErrors.phoneNumber
                        return newErrors
                      })
                    }
                  }}
                  className={`w-full px-4 py-3 text-gray-900 text-[16px] font-semibold rounded-lg border transition-all duration-200 h-12 bg-white focus:outline-none focus:ring-2 ${
                    errors.phoneNumber
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:ring-[#3498DB] focus:border-[#3498DB]'
                  }`}
                />
                {errors.phoneNumber && (
                  <p className="mt-1 text-sm text-red-600 font-medium">{errors.phoneNumber}</p>
                )}
              </div>
            </>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-4">
            {currentStep > 1 && (
              <button
                onClick={handleBack}
                className="px-6 py-4 rounded-xl font-bold text-base md:text-lg
                  border-2 border-gray-300 text-gray-700 hover:border-[#3498DB] hover:text-[#3498DB]
                  transition-all duration-300 hover:shadow-lg flex items-center gap-2"
              >
                <ArrowLeft size={20} />
                Back
              </button>
            )}

            {/* Continue/Submit Button */}
            <button
              onClick={handleNext}
              disabled={!isStepValid() || isSubmitting}
              className={`
                ${currentStep > 1 ? '' : 'flex-1'} py-4 rounded-xl font-bold text-base md:text-lg
                transition-all duration-300 flex items-center justify-center gap-2
                ${
                  !isStepValid() || isSubmitting
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-[#3498DB] text-white hover:bg-[#246a99] shadow-lg hover:shadow-xl hover:scale-105 cursor-pointer'
                }
                ${currentStep > 1 ? 'flex-1' : 'w-full'}
              `}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Submitting...
                </>
              ) : currentStep === 13 ? (
                'Submit Details'
              ) : (
                'Continue'
              )}
            </button>
          </div>

          {/* Disclaimer - Show on final step */}
          {currentStep === totalSteps && (
            <div className="mt-8 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <p className="text-xs text-gray-600 leading-relaxed">
                By clicking Submit Details, you agree to our{' '}
                <Link href="/privacy-policy" className="text-[#3498DB] hover:underline">
                  Privacy Policy
                </Link>{' '}
                and to receive insurance offers from AssureRates, or their partner agents at the email address or telephone numbers you provided, including autodialed, pre-recorded calls, artificial voice or text messages. You understand that consent is not a condition of purchase and your consent may be revoked at any time.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function LongFormWrapper() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
          <div className="text-[#246a99] text-xl font-semibold">Loading...</div>
        </div>
      }
    >
      <LongForm />
    </React.Suspense>
  )
}
