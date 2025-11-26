import React from 'react'
import { DollarSign, Clock, Shield } from 'lucide-react'

const Features = () => {
  const features = [
    {
      icon: DollarSign,
      title: 'Affordable Monthly Rates',
      description: 'Get competitive coverage with affordable monthly rates. No hidden fees, no surprises.',
      highlight: 'Affordable'
    },
    {
      icon: Shield,
      title: 'No Medical Exam Required',
      description: 'Qualify for coverage without a medical exam. Simple health questions, quick approval process.',
      highlight: 'Easy'
    },
    {
      icon: Clock,
      title: 'Fast Approval Process',
      description: 'Get approved and covered quickly. No waiting weeks for a decision.',
      highlight: 'Fast'
    }
  ]

  return (
    <div className='w-full py-12 md:py-16 lg:py-20 bg-linear-to-b from-white to-[#F8FAFC]'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='text-center mb-12 md:mb-16'>
          <h2 className='text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#246a99] mb-4'>
            Why Choose Our Life Insurance?
          </h2>
          <p className='text-lg md:text-xl text-gray-600 max-w-3xl mx-auto'>
            Get the protection your family deserves with coverage that&apos;s affordable, fast, and hassle-free
          </p>
        </div>

        {/* Features Grid */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8'>
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <div
                key={index}
                className='bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#8EC4F6] group'
              >
                {/* Icon Container */}
                <div className='relative mb-6'>
                  <div className='absolute inset-0 bg-linear-to-br from-[#8EC4F6] to-[#12266D] rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-300 blur-xl'></div>
                  <div className='relative w-16 h-16 bg-[#3498DB] rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300'>
                    <IconComponent className='w-8 h-8 text-white' strokeWidth={2.5} />
                  </div>
                  <span className='absolute -top-2 -right-2 bg-[#F7782B] text-white text-xs font-bold px-2 py-1 rounded-full shadow-md'>
                    {feature.highlight}
                  </span>
                </div>

                {/* Content */}
                <h3 className='text-xl md:text-2xl font-bold text-[#12266D] mb-3 group-hover:text-[#1a3a8a] transition-colors duration-300'>
                  {feature.title}
                </h3>
                <p className='text-gray-600 leading-relaxed text-base md:text-lg'>
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Features