import React, { useState } from 'react';
import { ImageOff } from 'lucide-react';

interface SmartImageProps {
  src: string;
  remoteSrc?: string;
  fallbackSrc?: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  onClick?: () => void;
}

export const SmartImage: React.FC<SmartImageProps> = ({
  src,
  remoteSrc,
  fallbackSrc,
  alt,
  className = '',
  imgClassName = '',
  onClick,
}) => {
  const [currentSrc, setCurrentSrc] = useState<string>(src);
  const [attempt, setAttempt] = useState<number>(0);
  const [hasError, setHasError] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const handleError = () => {
    if (attempt === 0 && remoteSrc && remoteSrc !== currentSrc) {
      setAttempt(1);
      setCurrentSrc(remoteSrc);
    } else if (attempt <= 1 && fallbackSrc && fallbackSrc !== currentSrc) {
      setAttempt(2);
      setCurrentSrc(fallbackSrc);
    } else {
      setHasError(true);
    }
  };

  if (hasError) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-slate-100 text-slate-500 p-6 rounded-xl border border-slate-200 ${className}`}
      >
        <ImageOff className="w-8 h-8 mb-2 text-slate-400" />
        <span className="text-xs text-center font-medium text-slate-600">{alt}</span>
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden ${className} ${onClick ? 'cursor-zoom-in' : ''}`}
      onClick={onClick}
    >
      {!isLoaded && (
        <div className="absolute inset-0 bg-slate-100 animate-pulse rounded-inherit" />
      )}
      <img
        src={currentSrc}
        alt={alt}
        referrerPolicy="no-referrer"
        onLoad={() => setIsLoaded(true)}
        onError={handleError}
        className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${imgClassName}`}
      />
    </div>
  );
};
