"use client";

import React, { useState } from 'react';
import Image, { ImageProps } from 'next/image';
import { cn } from '../../lib/utils';
import { Film } from 'lucide-react';

interface OptimizedImageProps extends Omit<ImageProps, 'onError'> {
  fallbackSrc?: string;
  containerClassName?: string;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className,
  fallbackSrc,
  containerClassName,
  ...props
}) => {
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setError(true);
    setIsLoading(false);
  };

  // If error and no fallbackSrc, render a default fallback placeholder UI
  const hasFallback = !!fallbackSrc;

  return (
    <div className={cn("relative overflow-hidden bg-white/[0.02]", containerClassName)}>
      {isLoading && (
        <div 
          className="absolute inset-0 animate-pulse bg-white/[0.05]" 
          role="status" 
          aria-label="Loading image..."
        />
      )}
      
      {error && !hasFallback ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/[0.02] text-white/20">
          <Film className="w-1/4 h-1/4 max-w-[48px] max-h-[48px] opacity-40" />
        </div>
      ) : (
        <Image
          src={error && fallbackSrc ? fallbackSrc : src}
          alt={alt || "Media artwork"}
          className={cn(
            "transition-all duration-500 ease-out",
            isLoading ? "scale-105 blur-sm" : "scale-100 blur-0",
            className
          )}
          onLoad={handleLoad}
          onError={handleError}
          {...props}
        />
      )}
    </div>
  );
};
