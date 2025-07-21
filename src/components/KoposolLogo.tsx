
import React from 'react';

interface KoposolLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const KoposolLogo: React.FC<KoposolLogoProps> = ({ 
  className = "", 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: "h-8",
    md: "h-12",
    lg: "h-16"
  };

  return (
    <div className={`flex items-center ${className}`}>
      <img 
        src="/lovable-uploads/97f2478e-2e56-41c6-8d23-cbaf96c39384.png" 
        alt="Koposol" 
        className={`${sizeClasses[size]} w-auto object-contain`}
      />
    </div>
  );
};
