import React from 'react';

interface CouncilLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  textColor?: string;
  badgeColor?: string;
}

export const CouncilLogo: React.FC<CouncilLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  textColor = 'text-[#b59268]',
  badgeColor = '#b59268',
}) => {
  const sizeMap = {
    sm: { icon: 30, font: 'text-xs tracking-[0.2em] font-semibold' },
    md: { icon: 42, font: 'text-sm tracking-[0.22em] font-semibold' },
    lg: { icon: 60, font: 'text-lg tracking-[0.25em] font-semibold' },
    xl: { icon: 96, font: 'text-2xl tracking-[0.28em] font-bold' },
  };

  const dim = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* Precision Vector Emblem matching official Council AI logo */}
      <svg
        width={dim.icon}
        height={dim.icon}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform hover:scale-105"
      >
        {/* Outer Ring */}
        <circle cx="50" cy="50" r="46" stroke={badgeColor} strokeWidth="2.5" fill="none" />

        {/* Top Council Head */}
        <circle cx="50" cy="20" r="5" fill={badgeColor} />

        {/* Top Robe Curve */}
        <path
          d="M 37 32 C 37 25, 63 25, 63 32 C 58 37, 42 37, 37 32 Z"
          fill={badgeColor}
        />

        {/* Central Ai Node Circle */}
        <circle cx="50" cy="50" r="21" stroke={badgeColor} strokeWidth="2.5" fill="#faf7f2" />

        {/* Network Nodes inside Central Circle */}
        <line x1="47" y1="41" x2="55" y2="41" stroke={badgeColor} strokeWidth="1.8" />
        <line x1="55" y1="41" x2="58" y2="47" stroke={badgeColor} strokeWidth="1.8" />
        <circle cx="47" cy="41" r="2.2" fill={badgeColor} />
        <circle cx="55" cy="41" r="2.2" fill={badgeColor} />
        <circle cx="58" cy="47" r="2.2" fill={badgeColor} />

        {/* Central "Ai" Text */}
        <text
          x="50"
          y="62"
          textAnchor="middle"
          fill={badgeColor}
          fontSize="16"
          fontWeight="700"
          fontFamily="system-ui, sans-serif"
        >
          Ai
        </text>

        {/* Left Council Head */}
        <circle cx="28" cy="35" r="4.5" fill={badgeColor} />

        {/* Left Seated Robe */}
        <path
          d="M 21 44 C 18 56, 26 72, 38 72 C 33 63, 26 53, 21 44 Z"
          fill={badgeColor}
        />
        <path
          d="M 28 42 C 34 40, 40 45, 38 52 C 34 50, 29 46, 28 42 Z"
          fill={badgeColor}
        />

        {/* Right Council Head */}
        <circle cx="72" cy="35" r="4.5" fill={badgeColor} />

        {/* Right Seated Robe */}
        <path
          d="M 79 44 C 82 56, 74 72, 62 72 C 67 63, 74 53, 79 44 Z"
          fill={badgeColor}
        />
        <path
          d="M 72 42 C 66 40, 60 45, 62 52 C 66 50, 71 46, 72 42 Z"
          fill={badgeColor}
        />

        {/* Base Robe Arch */}
        <path
          d="M 30 76 C 42 85, 58 85, 70 76 C 62 88, 38 88, 30 76 Z"
          fill={badgeColor}
        />
      </svg>

      {showText && (
        <span className={`font-sans uppercase ${dim.font} ${textColor}`}>
          Council AI
        </span>
      )}
    </div>
  );
};
