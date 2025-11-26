'use client';

import React from 'react';
import { Heart } from 'lucide-react';

interface ProgressBarProps {
  progress: number; // 0-100
  className?: string;
  showPercentage?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  progress, 
  className = '',
  showPercentage = true 
}) => {
  // Clamp progress between 0 and 100
  const clampedProgress = Math.max(0, Math.min(100, progress));
  
  // Calculate icon position - icon badge is approximately 40px (20px radius with padding)
  // Position icon at the right edge of the progress fill
  const iconBadgeSize = 40;
  const iconOffset = iconBadgeSize / 2;
  
  return (
    <div className={`w-full ${className}`}>
      {/* Progress Percentage Badge */}
      {showPercentage && (
        <div className="flex justify-center mb-4">
          <div className="bg-[#3498DB] text-white text-sm sm:text-base font-bold px-4 py-2 rounded-lg shadow-md mb-4">
            {Math.round(clampedProgress)}%
          </div>
        </div>
      )}
      
      {/* Progress Bar Container */}
      <div className="relative w-full h-2 sm:h-3 bg-gray-200 rounded-full overflow-visible shadow-inner">
        {/* Progress Fill */}
        <div
          className="absolute top-0 left-0 h-full bg-[#3498DB] transition-all duration-700 ease-out rounded-full"
          style={{ width: `${clampedProgress}%` }}
        />
        
        {/* Dollar Icon - positioned at the progress edge */}
        <div
          className="absolute top-1/2 -translate-y-1/2 transition-all duration-700 ease-out z-20"
          style={{ 
            left: clampedProgress === 0 
              ? '0px' 
              : clampedProgress === 100 
                ? `calc(100% - ${iconBadgeSize}px)`
                : `calc(${clampedProgress}% - ${iconOffset}px)`
          }}
        >
          <div className="bg-white rounded-full p-2 shadow-2xl border-[3px] border-[#3498DB] flex items-center justify-center">
            <Heart 
              size={20}
              className="text-[#3498DB]"
              strokeWidth={2.5}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;

