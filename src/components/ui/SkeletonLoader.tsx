import React from 'react';

interface SkeletonLoaderProps {
  className?: string;
  variant?: 'card' | 'text' | 'circle' | 'rectangle';
  lines?: number;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  className = '',
  variant = 'rectangle',
  lines = 1
}) => {
  const baseClasses = 'bg-grey-200 bg-[length:200%_100%] animate-skeleton bg-gradient-to-r from-grey-200 via-grey-100 to-grey-200';

  // Respect reduced motion
  const prefersReduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (variant === 'card') {
    return (
      <div
        className={`bg-white rounded-xl shadow-sm border border-grey-100 p-4 ${className}`}
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        {/* Image skeleton */}
        <div className={`aspect-square rounded-lg ${baseClasses} mb-3 ${prefersReduced ? '' : 'animate-pulse'}`}></div>

        {/* Title skeleton */}
        <div className={`h-4 rounded ${baseClasses} mb-2 ${prefersReduced ? '' : 'animate-pulse'}`}></div>
        <div className={`h-4 rounded w-3/4 ${baseClasses} mb-3 ${prefersReduced ? '' : 'animate-pulse'}`}></div>

        {/* Price skeleton */}
        <div className={`h-6 rounded w-1/2 ${baseClasses} mb-2 ${prefersReduced ? '' : 'animate-pulse'}`}></div>

        {/* Location skeleton */}
        <div className={`h-3 rounded w-2/3 ${baseClasses} ${prefersReduced ? '' : 'animate-pulse'}`}></div>
      </div>
    );
  }

  if (variant === 'text') {
    return (
      <div className={className} role="status" aria-live="polite" aria-busy="true">
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={`h-4 rounded ${baseClasses} mb-2 ${index === lines - 1 ? 'w-3/4' : 'w-full'} ${prefersReduced ? '' : 'animate-pulse'}`}
          />
        ))}
      </div>
    );
  }

  if (variant === 'circle') {
    return (
      <div
        className={`rounded-full ${baseClasses} ${className} ${prefersReduced ? '' : 'animate-pulse'}`}
        role="status"
        aria-live="polite"
        aria-busy="true"
      />
    );
  }

  // Default rectangle
  return (
    <div
      className={`rounded ${baseClasses} ${className} ${prefersReduced ? '' : 'animate-pulse'}`}
      role="status"
      aria-live="polite"
      aria-busy="true"
    />
  );
};

export default SkeletonLoader;
