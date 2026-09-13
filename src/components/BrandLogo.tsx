import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  tagline?: string;
  isDarkMode?: boolean;
  align?: 'left' | 'center';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size = 'md',
  showTagline = false,
  tagline,
  isDarkMode = true,
  align = 'left',
}) => {
  // Height & scale configs based on size
  const scaleMap = {
    sm: { height: 32, iconWidth: 38, iconHeight: 34, titleSize: 'text-lg', subSize: 'text-[13px]', subOffset: '-mt-1' },
    md: { height: 44, iconWidth: 50, iconHeight: 45, titleSize: 'text-xl sm:text-2xl', subSize: 'text-[15px] sm:text-[17px]', subOffset: '-mt-1.5' },
    lg: { height: 56, iconWidth: 64, iconHeight: 58, titleSize: 'text-2xl sm:text-3xl', subSize: 'text-[18px] sm:text-[21px]', subOffset: '-mt-2' },
    xl: { height: 72, iconWidth: 80, iconHeight: 72, titleSize: 'text-3xl sm:text-4xl', subSize: 'text-[22px] sm:text-[26px]', subOffset: '-mt-2.5' },
  };

  const currentScale = scaleMap[size];

  return (
    <div
      className={`inline-flex flex-col ${align === 'center' ? 'items-center text-center' : 'items-start text-left'} select-none ${className}`}
    >
      {/* Main Logo Composition: [HK 3D Gold Monogram] + [HATİPOĞLU Kuyumculuk] */}
      <div className={`flex items-center gap-3 sm:gap-3.5 ${align === 'center' ? 'justify-center' : ''}`}>
        {/* Authentic HK 3D Monogram Icon from user photo (Unchanged 3D Gold Monogram) */}
        <div
          className={`shrink-0 transition-transform duration-300 hover:scale-105 filter ${
            isDarkMode
              ? 'drop-shadow-[0_4px_14px_rgba(212,175,55,0.45)]'
              : 'drop-shadow-[0_3px_10px_rgba(0,0,0,0.2)] drop-shadow-[0_1px_3px_rgba(212,175,55,0.35)]'
          }`}
          style={{ width: currentScale.iconWidth, height: currentScale.iconHeight }}
        >
          <svg
            viewBox="0 0 250 220"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            <defs>
              {/* Primary 3D Polished Gold Gradient for Main Faces */}
              <linearGradient id="hkGoldMain" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFF9D8" />
                <stop offset="16%" stopColor="#F9D768" />
                <stop offset="38%" stopColor="#E3A528" />
                <stop offset="65%" stopColor="#9F6B10" />
                <stop offset="85%" stopColor="#DDA126" />
                <stop offset="100%" stopColor="#784A04" />
              </linearGradient>

              {/* Upper Diagonal Arm Flare (K top branch) */}
              <linearGradient id="hkGoldUpperArm" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#986610" />
                <stop offset="24%" stopColor="#DFAB34" />
                <stop offset="50%" stopColor="#FFFBD8" />
                <stop offset="76%" stopColor="#F4CD5E" />
                <stop offset="100%" stopColor="#784B04" />
              </linearGradient>

              {/* Lower Diagonal Arm Shine (K bottom detached branch) */}
              <linearGradient id="hkGoldLowerArm" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F6CF60" />
                <stop offset="32%" stopColor="#FFF4BA" />
                <stop offset="62%" stopColor="#C98F1D" />
                <stop offset="100%" stopColor="#5D3702" />
              </linearGradient>

              {/* Specular Edge Highlight (Light reflection on top/left bevels) */}
              <linearGradient id="hkSpecHighlight" x1="0%" y1="0%" x2="100%" y2="50%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
                <stop offset="35%" stopColor="#FFF5BB" stopOpacity="0.85" />
                <stop offset="70%" stopColor="#F2C753" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#B57B10" stopOpacity="0.1" />
              </linearGradient>

              {/* Deep 3D Bevel Shadow (Extrusion / Underside cuts) */}
              <linearGradient id="hkBevelShadow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#361E01" />
                <stop offset="50%" stopColor="#5B3504" />
                <stop offset="100%" stopColor="#88570C" />
              </linearGradient>

              {/* Soft Ambient Depth Glow */}
              <filter id="hkAmbientGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow
                  dx="0"
                  dy="3.5"
                  stdDeviation="3.5"
                  floodColor="#7A4B05"
                  floodOpacity={isDarkMode ? 0.5 : 0.35}
                />
              </filter>
            </defs>

            <g filter="url(#hkAmbientGlow)">
              {/* ============================================================ */}
              {/* 1. TOP-LEFT 'L' HOOK OF 'H' (Upper vertical stem + right foot) */}
              {/* ============================================================ */}
              <path
                d="M 18,22 L 52,22 L 52,88 L 100,88 L 110,120 L 18,120 Z"
                fill="url(#hkGoldMain)"
              />
              {/* Top bevel highlight */}
              <polygon points="18,22 52,22 48,26 22,26" fill="url(#hkSpecHighlight)" />
              {/* Left outer bevel highlight */}
              <polygon points="18,22 18,120 22,116 22,26" fill="url(#hkSpecHighlight)" />
              {/* Inner vertical step shadow */}
              <polygon points="52,22 52,88 48,84 48,26" fill="url(#hkBevelShadow)" />
              {/* Horizontal foot top reflection */}
              <polygon points="52,88 100,88 96,92 48,88" fill="url(#hkSpecHighlight)" />
              {/* Foot right slanted cut shadow */}
              <polygon points="100,88 110,120 106,116 96,92" fill="url(#hkBevelShadow)" />
              {/* Bottom edge shadow */}
              <polygon points="18,120 110,120 106,116 22,116" fill="url(#hkBevelShadow)" />

              {/* ============================================================ */}
              {/* 2. BOTTOM-LEFT STANDALONE BAR OF 'H' (Vertical 3D rectangle) */}
              {/* ============================================================ */}
              <path
                d="M 18,132 L 52,132 L 52,196 L 18,196 Z"
                fill="url(#hkGoldMain)"
              />
              {/* Top bevel highlight */}
              <polygon points="18,132 52,132 48,136 22,136" fill="url(#hkSpecHighlight)" />
              {/* Left bevel highlight */}
              <polygon points="18,132 18,196 22,192 22,136" fill="url(#hkSpecHighlight)" />
              {/* Right bevel shadow */}
              <polygon points="52,132 52,196 48,192 48,136" fill="url(#hkBevelShadow)" />
              {/* Bottom bevel shadow */}
              <polygon points="18,196 52,196 48,192 22,192" fill="url(#hkBevelShadow)" />

              {/* ============================================================ */}
              {/* 3. CENTRAL STEM & UPPER ARM WITH POINTED V-TIP               */}
              {/* ============================================================ */}
              <path
                d="M 118,22 L 146,22 L 146,94 L 196,22 L 226,22 L 118,168 Z"
                fill="url(#hkGoldUpperArm)"
              />
              {/* Top stem bevel highlight */}
              <polygon points="118,22 146,22 142,26 122,26" fill="url(#hkSpecHighlight)" />
              {/* Left long vertical bevel highlight */}
              <polygon points="118,22 118,168 122,164 122,26" fill="url(#hkSpecHighlight)" />
              {/* Inner vertical stem shadow */}
              <polygon points="146,22 146,94 142,90 142,26" fill="url(#hkBevelShadow)" />
              {/* Inner diagonal arm bevel shine */}
              <polygon points="146,94 196,22 198,26 148,96" fill="url(#hkSpecHighlight)" />
              {/* Top arm cut bevel highlight */}
              <polygon points="196,22 226,22 222,26 198,26" fill="url(#hkSpecHighlight)" />
              {/* Long outer diagonal bevel shadow */}
              <polygon points="226,22 118,168 122,164 222,26" fill="url(#hkBevelShadow)" />

              {/* ============================================================ */}
              {/* 4. LOWER DIAGONAL DETACHED ARM OF 'K'                         */}
              {/* ============================================================ */}
              <path
                d="M 176,112 L 236,196 L 204,196 L 148,132 Z"
                fill="url(#hkGoldLowerArm)"
              />
              {/* Top-left angled cut bevel highlight */}
              <polygon points="148,132 176,112 178,116 152,134" fill="url(#hkSpecHighlight)" />
              {/* Upper diagonal edge bevel highlight */}
              <polygon points="176,112 236,196 232,192 178,116" fill="url(#hkSpecHighlight)" />
              {/* Flat base horizontal bevel shadow */}
              <polygon points="236,196 204,196 207,192 232,192" fill="url(#hkBevelShadow)" />
              {/* Lower diagonal edge bevel shadow */}
              <polygon points="204,196 148,132 152,134 207,192" fill="url(#hkBevelShadow)" />

              {/* Luxury Diamond glint star on the upper branch intersection */}
              <circle cx="146" cy="94" r="3" fill="#FFFFFF" opacity="0.9" />
              <polygon
                points="146,87 148,94 155,94 149,97 151,103 146,99 141,103 143,97 137,94 144,94"
                fill="#FFFDE8"
                opacity="0.8"
              />
            </g>
          </svg>
        </div>

        {/* Brand Text Stack: HATİPOĞLU + Kuyumculuk */}
        <div className="flex flex-col justify-center shrink-0">
          {/* HATİPOĞLU (Gold in Dark Mode, Royal Blue in Light Mode) */}
          <div className="relative flex items-center">
            <h1
              className={`font-serif font-black tracking-[0.14em] uppercase leading-none whitespace-nowrap ${currentScale.titleSize}`}
              style={{
                fontFamily: "'Cinzel', 'Playfair Display', Georgia, serif",
                background: isDarkMode
                  ? 'linear-gradient(180deg, #FFF6BD 0%, #F5CE68 28%, #DCA02C 52%, #B87915 78%, #ECC058 100%)'
                  : 'linear-gradient(180deg, #1D4ED8 0%, #2563EB 35%, #1E40AF 70%, #172554 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: isDarkMode
                  ? 'drop-shadow(0px 1px 1px rgba(0,0,0,0.4)) drop-shadow(0px 2px 5px rgba(212,175,55,0.25))'
                  : 'drop-shadow(0px 1px 2px rgba(29,78,216,0.25))',
                textShadow: isDarkMode ? '0 0 1px rgba(255,246,189,0.3)' : 'none',
              }}
            >
              HATİPOĞLU
            </h1>
          </div>

          {/* Kuyumculuk (Gold in Dark Mode, Royal Blue in Light Mode) */}
          <div className={`flex justify-end ${currentScale.subOffset}`}>
            <span
              className={`font-normal tracking-wide italic leading-tight whitespace-nowrap ${currentScale.subSize}`}
              style={{
                fontFamily: "'Great Vibes', 'Alex Brush', 'Playfair Display', cursive, serif",
                background: isDarkMode
                  ? 'linear-gradient(135deg, #FFF2A8 0%, #F6CF6B 35%, #DDA02B 65%, #AE7410 100%)'
                  : 'linear-gradient(135deg, #2563EB 0%, #3B82F6 40%, #1D4ED8 75%, #1E40AF 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: isDarkMode
                  ? 'drop-shadow(0px 1px 2px rgba(0,0,0,0.3)) drop-shadow(0px 2px 4px rgba(212,175,55,0.2))'
                  : 'drop-shadow(0px 1px 1px rgba(37,99,235,0.2))',
                transform: 'rotate(-1.5deg)',
                display: 'inline-block',
              }}
            >
              Kuyumculuk
            </span>
          </div>
        </div>
      </div>

      {/* Optional Tagline */}
      {showTagline && tagline && (
        <span
          className={`text-[10px] sm:text-[11px] font-medium tracking-tight mt-1 ${
            isDarkMode ? 'text-amber-200/60' : 'text-slate-500'
          } ${align === 'center' ? 'mx-auto' : ''}`}
        >
          {tagline}
        </span>
      )}
    </div>
  );
};
