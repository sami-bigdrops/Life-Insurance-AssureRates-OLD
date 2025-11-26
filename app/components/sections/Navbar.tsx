'use client'

import Link from 'next/link'
import React, { useEffect } from 'react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

// List of landing pages that should be tracked
const landingPages = ['/fps', '/long']

// Check if a path is a landing page
const isLandingPage = (path: string | null): boolean => {
    if (!path) return false
    return landingPages.some(page => path === page || path.startsWith(page + '/'))
}

const Navbar = () => {
    const pathname = usePathname()
    
    // Track route changes - store landing pages in sessionStorage
    useEffect(() => {
        if (typeof window === 'undefined') return
        
        // If current page is a landing page, store it
        if (isLandingPage(pathname)) {
            sessionStorage.setItem('previousLandingPage', pathname)
        }
    }, [pathname])
    
    // Determine logo href based on previous route or current pathname
    const getLogoHref = (): string => {
        if (typeof window === 'undefined') {
            // Server-side fallback
            if (pathname?.includes('/fps')) return '/fps'
            if (pathname?.includes('/long')) return '/long'
            return '/'
        }
        
        // Get stored previous landing page from sessionStorage
        const storedPreviousRoute = sessionStorage.getItem('previousLandingPage')
        
        // If we have a stored previous landing page, use it
        if (storedPreviousRoute && isLandingPage(storedPreviousRoute)) {
            return storedPreviousRoute
        }
        
        // Fallback to current pathname logic
        if (pathname?.includes('/fps')) {
            return '/fps'
        }
        if (pathname?.includes('/long')) {
            return '/long'
        }
        return '/'
    }

    return (
        <nav className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center items-center h-20">
              <div className="shrink-0">
                <Link href={getLogoHref()} className="block">
                  <Image
                    src="/AssureRates.svg"
                    alt="AssureRates Logo"
                    width={180}
                    height={40}
                    priority
                    quality={90}
                    loading="eager"
                    className="h-auto w-60 cursor-pointer"
                  />
                </Link>
              </div>
            </div>
          </div>
        </nav>
      )
}

export default Navbar