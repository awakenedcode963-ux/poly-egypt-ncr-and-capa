import React from 'react';

interface PoloEgyptLogoProps {
  variant?: 'full' | 'horizontal' | 'compact' | 'iconOnly';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  lightMode?: boolean;
  alt?: string;
}

export const PoloEgyptLogo: React.FC<PoloEgyptLogoProps> = ({
  size = 'md',
  className = '',
  lightMode = false,
  variant, // ignored but kept for compatibility
  alt = 'شعار شركة بولو إيجيبت للتجارة والصناعة'
}) => {
  
  // Dimensions for the full image containing both icon and text
  const dimensions = {
    sm: { width: 60 },
    md: { width: 90 },
    lg: { width: 140 },
    xl: { width: 180 }
  }[size];

  return (
    <div className={`flex flex-col items-center justify-center ${className} ${lightMode ? 'brightness-0 invert opacity-90' : ''}`}>
      <img 
        src="/assets/polo-egypt-logo.png"
        alt={alt}
        width={dimensions.width}
        className="object-contain"
        style={{ mixBlendMode: lightMode ? 'normal' : 'multiply' }}
      />
    </div>
  );
};
