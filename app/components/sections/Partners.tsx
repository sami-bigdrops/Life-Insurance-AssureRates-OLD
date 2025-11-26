import React from 'react'
// import Image from 'next/image'

const Partners = () => {

    // const partner = [
    //     {
    //         name: 'Amerisave',
    //         image: '/amerisave-logo.svg'
    //     },
    //     {
    //         name: 'Veterans First Mortgage',
    //         image: '/veterans-logo.svg'
    //     },
    //     {
    //         name: 'Mutual of Omaha',
    //         image: '/mutual-logo.svg'
    //     },
    //     {
    //         name: 'Loan Depot',
    //         image: '/loandepot-logo.svg'
    //     },
    // ]

  return (
    <div className='w-full py-0 pt-0 md:pt-20 pb-8 lg:pb-0 lg:pt-0 mt-0 lg:mt-10 xl:mt-0 lg:py-16 min-h-content flex flex-col relative mb-10'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <h2 className='text-lg font-base text-center mb-8'>We Partner With Top Providers</h2>
        </div>
        <div className='w-full max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4 px-4 sm:px-6 lg:px-8'>
            {/* {partner.map((partner) => (
                <div key={partner.name} className='flex flex-col items-center justify-center'>
                    <Image 
                        src={partner.image} 
                        alt={partner.name} 
                        width={50} 
                        height={50} 
                        className='w-40 h-40 md:w-50 md:h-50 lg:w-55 lg:h-55 object-contain'
                        loading="lazy"
                    />
                </div>
            ))} */}
            <div className='flex flex-col items-center justify-center border-2 border-gray-300 rounded-lg p-8 bg-gray-50'>
                <span className='text-gray-600 font-medium'>Brand 1</span>
            </div>
            <div className='flex flex-col items-center justify-center border-2 border-gray-300 rounded-lg p-8 bg-gray-50'>
                <span className='text-gray-600 font-medium'>Brand 2</span>
            </div>
            <div className='flex flex-col items-center justify-center border-2 border-gray-300 rounded-lg p-8 bg-gray-50'>
                <span className='text-gray-600 font-medium'>Brand 3</span>
            </div>
            <div className='flex flex-col items-center justify-center border-2 border-gray-300 rounded-lg p-8 bg-gray-50'>
                <span className='text-gray-600 font-medium'>Brand 4</span>
            </div>
        </div>
    </div>
  )
}

export default Partners