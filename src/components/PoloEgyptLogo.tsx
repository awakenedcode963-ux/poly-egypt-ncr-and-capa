import React from 'react';

interface PoloEgyptLogoProps {
  variant?: 'full' | 'horizontal' | 'compact' | 'iconOnly';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  lightMode?: boolean; // If true, adjusts text colors for dark backgrounds
  alt?: string;
}

export const PoloEgyptLogo: React.FC<PoloEgyptLogoProps> = ({
  variant = 'full',
  size = 'md',
  className = '',
  lightMode = false,
  alt = 'شعار شركة بولو إيجيبت للتجارة والصناعة'
}) => {
  const navyColor = lightMode ? '#FFFFFF' : '#113E6B';
  const goldColor = '#C0A46F';

  // Dimension scaling
  const iconDimensions = {
    sm: { width: 38, height: 38 },
    md: { width: 54, height: 54 },
    lg: { width: 76, height: 76 },
    xl: { width: 110, height: 110 }
  }[size];

  const logoMarkSVG = (
    <svg 
      width={iconDimensions.width} 
      height={iconDimensions.height} 
      viewBox="0 0 200 200" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={alt}
      className="shrink-0 drop-shadow-xs"
    >
      <title>{alt}</title>
      {/* Outer Navy Ring with Gap at bottom-right */}
      <path 
        d="M 148.5 152.5 C 134.8 165.7 116.3 173.8 96 173.8 C 53 173.8 18.2 139 18.2 96 C 18.2 53 53 18.2 96 18.2 C 139 18.2 173.8 53 173.8 96 C 173.8 107.5 171.3 118.4 166.8 128.2 L 146.5 128.2 C 149.8 118.4 151.6 107.5 151.6 96 C 151.6 65.3 126.7 40.4 96 40.4 C 65.3 40.4 40.4 65.3 40.4 96 C 40.4 126.7 65.3 151.6 96 151.6 C 109.8 151.6 122.4 146.6 132.2 138.2 Z" 
        fill={navyColor} 
      />
      
      {/* Gold Left Interlocking Shape (P / n) */}
      <path 
        d="M 59.8 51.5 H 122.2 V 96 H 98.4 V 140.5 H 59.8 V 51.5 Z M 83.6 73.7 V 96 H 98.4 V 73.7 Z" 
        fill={goldColor} 
        fillRule="evenodd"
      />

      {/* Navy Right Interlocking Shape (L / P) */}
      <path 
        d="M 83.6 73.7 H 146 V 140.5 H 83.6 V 118.3 H 122.2 V 96 H 83.6 V 73.7 Z" 
        fill={navyColor} 
      />
    </svg>
  );

  if (variant === 'iconOnly') {
    return <div className={`inline-flex items-center ${className}`}>{logoMarkSVG}</div>;
  }

  if (variant === 'horizontal') {
    return (
      <div className={`inline-flex items-center gap-3 ${className}`} dir="rtl">
        {logoMarkSVG}
        <div className="flex flex-col text-right">
          <span 
            className="font-black tracking-wider leading-none font-sans"
            style={{ 
              color: navyColor,
              fontSize: size === 'sm' ? '15px' : size === 'md' ? '19px' : '23px'
            }}
          >
            POLO EGYPT
          </span>
          <span 
            className="font-extrabold text-[11px] sm:text-[12px] leading-tight font-sans tracking-tight mt-0.5"
            style={{ color: goldColor }}
          >
            بولو إيجيبت للتجارة والصناعة ش.م.م
          </span>
          <span 
            className="font-bold text-[8px] sm:text-[9px] tracking-widest opacity-80 uppercase font-sans"
            style={{ color: lightMode ? '#CBD5E1' : '#1E4E79' }}
          >
            FOR TRADE & INDUSTRY S.A.E
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center text-center ${className}`}>
      {logoMarkSVG}
      <div className="mt-2 space-y-0.5">
        <h2 
          className="font-black tracking-wider leading-tight text-xl sm:text-2xl font-sans"
          style={{ color: navyColor }}
        >
          POLO EGYPT
        </h2>
        <p 
          className="font-bold text-xs tracking-widest uppercase font-sans opacity-80"
          style={{ color: lightMode ? '#CBD5E1' : '#1E4E79' }}
        >
          FOR TRADE & INDUSTRY S.A.E
        </p>
        <p 
          className="font-extrabold text-sm mt-1 font-sans"
          style={{ color: goldColor }}
        >
          بولو إيجيبت للتجارة والصناعة ش.م.م
        </p>
      </div>
    </div>
  );
};

