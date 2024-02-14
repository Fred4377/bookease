import React from 'react';

const Loader = ({ size = 'medium', fullPage = false }) => {
  const sizeClasses = {
    small: 'w-6 h-6 border-2',
    medium: 'w-12 h-12 border-4',
    large: 'w-16 h-16 border-4'
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center space-y-3">
      <div className={`animate-spin rounded-full border-t-transparent border-primary ${sizeClasses[size]}`}></div>
      <span className="text-[#E6EDF3] text-sm font-medium tracking-wide">Loading...</span>
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 bg-[#0D1117]/90 z-50 flex items-center justify-center">
        {spinner}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-8">
      {spinner}
    </div>
  );
};

export default Loader;
