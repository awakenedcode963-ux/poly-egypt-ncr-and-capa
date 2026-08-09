import React, { useState } from 'react';

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
  variant,
  alt = 'شعار شركة بولو إيجيبت'
}) => {
  const [imgError, setImgError] = useState(false);
  
  // Dimensions for the full image containing both icon and text
  const dimensions = {
    sm: { width: 70, height: 30 },
    md: { width: 110, height: 45 },
    lg: { width: 150, height: 60 },
    xl: { width: 200, height: 80 }
  }[size];

  if (imgError) {
    return (
      <div 
        className={`flex items-center justify-center rounded-lg border-2 border-dashed ${lightMode ? 'border-white/40 text-white/60 bg-white/10' : 'border-[#0B3A60]/30 text-[#0B3A60]/50 bg-slate-50'} ${className}`}
        style={{ width: dimensions.width, height: dimensions.height }}
      >
        <span className="text-[10px] font-bold">Logo Space</span>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center ${className} ${lightMode ? 'brightness-0 invert opacity-90' : ''}`}>
      <img 
        src="/assets/polo-egypt-logo.png"
        alt={alt}
        width={dimensions.width}
        className="object-contain"
        onError={() => setImgError(true)}
        style={{ 
          mixBlendMode: lightMode ? 'normal' : 'multiply',
          clipPath: 'inset(18% 0 18% 0)',
          marginTop: '-18%',
          marginBottom: '-18%'
        }}
      />
    </div>
  );
};
