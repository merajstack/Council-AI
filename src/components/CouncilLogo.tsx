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
  textColor = 'text-[#181e29]',
  badgeColor = '#b59268',
}) => {
  const sizeMap = {
    sm: { icon: 28, font: 'text-sm' },
    md: { icon: 38, font: 'text-base font-bold' },
    lg: { icon: 54, font: 'text-xl font-bold tracking-wider' },
    xl: { icon: 84, font: 'text-3xl font-extrabold tracking-widest' },
  };

  const dim = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Replicate Council AI SVG emblem matching Image 3 */}
      <svg
        width={dim.icon}
        height={dim.icon}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform hover:scale-105"
      >
        {/* Outer Circle Ring */}
        <circle cx="50" cy="50" r="46" stroke={badgeColor} strokeWidth="3" fill="none" />

        {/* Central Ai Node Circle */}
        <circle cx="50" cy="50" r="22" stroke={badgeColor} strokeWidth="3" fill="#faf7f2" />

        {/* Network Nodes inside central circle */}
        <line x1="42" y1="42" x2="56" y2="42" stroke={badgeColor} strokeWidth="2.5" />
        <line x1="56" y1="42" x2="52" y2="52" stroke={badgeColor} strokeWidth="2.5" />
        <circle cx="42" cy="42" r="3.5" fill={badgeColor} />
        <circle cx="56" cy="42" r="3.5" fill={badgeColor} />
        <circle cx="52" cy="52" r="3.5" fill={badgeColor} />

        {/* Ai Text in central emblem */}
        <text
          x="50"
          y="62"
          textAnchor="middle"
          fill={badgeColor}
          fontSize="17"
          fontWeight="800"
          fontFamily="system-ui, sans-serif"
        >
          Ai
        </text>

        {/* Top Sitting Council Figure */}
        <circle cx="50" cy="21" r="5" fill={badgeColor} />
        <path
          d="M38 32 C 38 27, 62 27, 62 32 C 60 37, 40 37, 38 32 Z"
          fill={badgeColor}
        />

        {/* Left Sitting Council Figure */}
        <circle cx="28" cy="35" r="4.5" fill={badgeColor} />
        <path
          d="M21 44 C 18 58, 28 72, 38 72 C 32 64, 25 54, 21 44 Z"
          fill={badgeColor}
        />

        {/* Right Sitting Council Figure */}
        <circle cx="72" cy="35" r="4.5" fill={badgeColor} />
        <path
          d="M79 44 C 82 58, 72 72, 62 72 C 68 64, 75 54, 79 44 Z"
          fill={badgeColor}
        />

        {/* Base Robe Curve */}
        <path
          d="M30 76 C 40 84, 60 84, 70 76 C 62 88, 38 88, 30 76 Z"
          fill={badgeColor}
        />
      </svg>

      {showText && (
        <span className={`font-sans uppercase ${dim.font} ${textColor} tracking-tight`}>
          Council AI
        </span>
      )}
    </div>
  );
};
