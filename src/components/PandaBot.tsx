export type PandaPose = 
  | 'welcome' 
  | 'dashboard' 
  | 'upload' 
  | 'scanning' 
  | 'ai' 
  | 'analytics' 
  | 'family' 
  | 'reminders' 
  | 'emergency' 
  | 'celebration' 
  | 'empty' 
  | 'error'

interface PandaBotProps {
  pose?: PandaPose | string
  size?: 'small' | 'medium' | 'large' | 'xlarge'
  className?: string
  animated?: boolean
}

export function PandaBot({ 
  pose = 'welcome', 
  size = 'medium', 
  className = '', 
  animated = true 
}: PandaBotProps) {
  const pixelSizes = {
    small: { w: 48, h: 50 },
    medium: { w: 110, h: 116 },
    large: { w: 170, h: 180 },
    xlarge: { w: 240, h: 250 }
  }

  const { w, h } = pixelSizes[size] || pixelSizes.medium

  return (
    <div 
      className={`pandabot-character size-${size} pose-${pose} ${animated ? 'animated' : ''} ${className}`}
      style={{ width: w, height: h, display: 'inline-block', position: 'relative' }}
      role="img"
      aria-label={`MediVault PandaBot - ${pose} pose`}
    >
      <svg 
        viewBox="0 0 200 200" 
        width="100%" 
        height="100%" 
        style={{ overflow: 'visible' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Shadow filters */}
          <filter id="soft-shadow" x="-10%" y="-10%" width="130%" height="130%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#174D85" floodOpacity="0.12"/>
          </filter>
          {/* Gradients */}
          <linearGradient id="coat-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3B8BF0" />
            <stop offset="100%" stopColor="#256FD0" />
          </linearGradient>
          <linearGradient id="badge-gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFE082" />
            <stop offset="100%" stopColor="#FFB300" />
          </linearGradient>
          <linearGradient id="scan-visor" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#48D6D2" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#0284C7" stopOpacity="0.95" />
          </linearGradient>
          <linearGradient id="pill-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3185E8" />
            <stop offset="50%" stopColor="#3185E8" />
            <stop offset="50%" stopColor="#FFD66B" />
            <stop offset="100%" stopColor="#FFD66B" />
          </linearGradient>
        </defs>

        {/* Ground shadow */}
        <ellipse cx="100" cy="186" rx="58" ry="9" fill="#174D85" opacity="0.12" />

        {/* EARS */}
        <g className="panda-ear-left">
          <circle cx="48" cy="52" r="26" fill="#1E2C3D" />
          <circle cx="48" cy="52" r="15" fill="#3A4D62" />
        </g>
        <g className="panda-ear-right">
          <circle cx="152" cy="52" r="26" fill="#1E2C3D" />
          <circle cx="152" cy="52" r="15" fill="#3A4D62" />
        </g>

        {/* HEAD */}
        <ellipse cx="100" cy="74" rx="66" ry="58" fill="#FFFFFF" stroke="#1E2C3D" strokeWidth="5.5" />

        {/* EYE PATCHES */}
        <ellipse cx="73" cy="74" rx="18" ry="22" fill="#1E2C3D" transform="rotate(18 73 74)" />
        <ellipse cx="127" cy="74" rx="18" ry="22" fill="#1E2C3D" transform="rotate(-18 127 74)" />

        {/* CHEEK BLUSH */}
        <circle cx="56" cy="92" r="10" fill="#FF927D" opacity="0.45" />
        <circle cx="144" cy="92" r="10" fill="#FF927D" opacity="0.45" />

        {/* EYES */}
        {pose === 'celebration' ? (
          // Joyful closed happy eyes ^ ^
          <g stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" fill="none">
            <path d="M66 76 Q 73 68 80 76" />
            <path d="M120 76 Q 127 68 134 76" />
          </g>
        ) : (
          <g className="panda-eyes">
            <circle cx="74" cy="72" r="6" fill="#FFFFFF" />
            <circle cx="126" cy="72" r="6" fill="#FFFFFF" />
            <circle cx="76" cy="70" r="2.5" fill="#1E2C3D" />
            <circle cx="128" cy="70" r="2.5" fill="#1E2C3D" />
          </g>
        )}

        {/* SCANNING VISOR (FOR OCR / SCANNING POSE) */}
        {pose === 'scanning' && (
          <g className="panda-visor">
            <rect x="52" y="60" width="96" height="28" rx="14" fill="url(#scan-visor)" stroke="#1E2C3D" strokeWidth="3.5" />
            <line x1="56" y1="74" x2="144" y2="74" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="6,4" />
            <circle cx="100" cy="74" r="5" fill="#FFD66B" />
          </g>
        )}

        {/* NOSE */}
        <ellipse cx="100" cy="89" rx="9" ry="7" fill="#1E2C3D" />

        {/* MOUTH */}
        {pose === 'celebration' ? (
          <path d="M92 97 Q 100 110 108 97 Z" fill="#FF927D" stroke="#1E2C3D" strokeWidth="3.5" strokeLinejoin="round" />
        ) : pose === 'empty' || pose === 'error' ? (
          <path d="M94 100 Q 100 96 106 100" fill="none" stroke="#1E2C3D" strokeWidth="3.5" strokeLinecap="round" />
        ) : (
          <path d="M100 96 c-5 8-15 7-19 2 M100 96 c5 8 15 7 19 2" fill="none" stroke="#1E2C3D" strokeWidth="3.5" strokeLinecap="round" />
        )}

        {/* TORSO & MEDICAL COAT */}
        {/* Main Body */}
        <path d="M50 118 c10-9 22-13 50-13 s40 4 50 13 v44 c-14 20-86 20-100 0 z" fill="url(#coat-grad)" stroke="#174D85" strokeWidth="4.5" />
        
        {/* White Lab Coat Shirt Inset */}
        <path d="M80 114 h40 l-6 30 H86 z" fill="#FFFFFF" stroke="#174D85" strokeWidth="3" />
        <line x1="100" y1="134" x2="100" y2="160" stroke="#174D85" strokeWidth="3.5" />
        
        {/* Coat Button */}
        <circle cx="100" cy="158" r="6" fill="#FFD66B" stroke="#174D85" strokeWidth="2.5" />

        {/* STETHOSCOPE */}
        <path 
          d="M72 116 c4 16 12 28 28 28 s24-12 28-28" 
          fill="none" 
          stroke="#1E2C3D" 
          strokeWidth="4" 
          strokeLinecap="round" 
        />
        <circle cx="100" cy="144" r="8" fill="url(#badge-gold)" stroke="#174D85" strokeWidth="2.5" />

        {/* ARMS & PROPS PER POSE */}
        {pose === 'welcome' && (
          <g>
            {/* Left resting arm */}
            <path d="M52 126 c-14 4-20 18-14 28" fill="none" stroke="#1E2C3D" strokeWidth="15" strokeLinecap="round" />
            <circle cx="38" cy="154" r="10" fill="#1E2C3D" />
            
            {/* Right waving arm */}
            <g className="panda-arm-waving">
              <path d="M148 126 c16-4 24-18 18-30" fill="none" stroke="#1E2C3D" strokeWidth="15" strokeLinecap="round" />
              <circle cx="166" cy="96" r="10" fill="#1E2C3D" />
            </g>
          </g>
        )}

        {pose === 'dashboard' && (
          <g>
            {/* Left arm holding clipboard */}
            <path d="M52 126 c-12 10-10 26 2 34" fill="none" stroke="#1E2C3D" strokeWidth="14" strokeLinecap="round" />
            {/* Clipboard prop */}
            <rect x="22" y="126" width="30" height="40" rx="4" fill="#FFFFFF" stroke="#174D85" strokeWidth="3" />
            <rect x="28" y="122" width="18" height="6" rx="2" fill="#FFD66B" stroke="#174D85" strokeWidth="2" />
            <line x1="28" y1="138" x2="46" y2="138" stroke="#3185E8" strokeWidth="2.5" />
            <line x1="28" y1="146" x2="44" y2="146" stroke="#728096" strokeWidth="2" />
            <line x1="28" y1="154" x2="40" y2="154" stroke="#4DBB7A" strokeWidth="2" />
            <circle cx="54" cy="160" r="8" fill="#1E2C3D" />

            {/* Right arm resting */}
            <path d="M148 126 c12 6 16 20 10 32" fill="none" stroke="#1E2C3D" strokeWidth="14" strokeLinecap="round" />
            <circle cx="158" cy="158" r="9" fill="#1E2C3D" />
          </g>
        )}

        {pose === 'upload' && (
          <g>
            {/* Both arms holding an open blue document folder */}
            <path d="M52 128 c-6 14 4 28 20 28" fill="none" stroke="#1E2C3D" strokeWidth="14" strokeLinecap="round" />
            <path d="M148 128 c6 14-4 28-20 28" fill="none" stroke="#1E2C3D" strokeWidth="14" strokeLinecap="round" />
            {/* Document Folder */}
            <rect x="68" y="126" width="64" height="46" rx="6" fill="#3185E8" stroke="#174D85" strokeWidth="3" />
            <path d="M68 132 h22 l6 6 h36 v28 H68 z" fill="#FFFFFF" stroke="#174D85" strokeWidth="2" />
            {/* Upload Arrow */}
            <path d="M100 160 v-16 M94 150 l6-6 6 6" fill="none" stroke="#4DBB7A" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="72" cy="156" r="8" fill="#1E2C3D" />
            <circle cx="128" cy="156" r="8" fill="#1E2C3D" />
          </g>
        )}

        {pose === 'scanning' && (
          <g>
            {/* Arms operating scanner */}
            <path d="M52 126 c-12 12-4 26 14 26" fill="none" stroke="#1E2C3D" strokeWidth="14" strokeLinecap="round" />
            <path d="M148 126 c12 12 4 26-14 26" fill="none" stroke="#1E2C3D" strokeWidth="14" strokeLinecap="round" />
            {/* Scanning beam graphic */}
            <circle cx="100" cy="150" r="16" fill="#48D6D2" opacity="0.3" />
            <rect x="76" y="136" width="48" height="28" rx="4" fill="#FFFFFF" stroke="#48D6D2" strokeWidth="3" />
            <line x1="80" y1="150" x2="120" y2="150" stroke="#FF927D" strokeWidth="2" />
          </g>
        )}

        {pose === 'ai' && (
          <g>
            {/* Arms holding AI sparkle crystal */}
            <path d="M52 126 c-10 12 0 24 16 22" fill="none" stroke="#1E2C3D" strokeWidth="14" strokeLinecap="round" />
            <path d="M148 126 c10 12 0 24-16 22" fill="none" stroke="#1E2C3D" strokeWidth="14" strokeLinecap="round" />
            {/* Sparkling AI Star / Bulb */}
            <polygon points="100,126 104,138 116,142 104,146 100,158 96,146 84,142 96,138" fill="#FFD66B" stroke="#174D85" strokeWidth="2" />
            <circle cx="76" cy="120" r="3" fill="#48D6D2" />
            <circle cx="124" cy="120" r="3.5" fill="#FF927D" />
          </g>
        )}

        {pose === 'analytics' && (
          <g>
            {/* Holding ECG Pulse Card */}
            <path d="M52 126 c-12 8-8 24 8 28" fill="none" stroke="#1E2C3D" strokeWidth="14" strokeLinecap="round" />
            <path d="M148 126 c12 8 8 24-8 28" fill="none" stroke="#1E2C3D" strokeWidth="14" strokeLinecap="round" />
            <rect x="66" y="130" width="68" height="38" rx="6" fill="#1E2C3D" stroke="#3185E8" strokeWidth="3" />
            <path d="M72 150 h12 l4-12 8 20 6-14 4 6 h14" fill="none" stroke="#4DBB7A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        )}

        {pose === 'family' && (
          <g>
            {/* Holding warm protective heart */}
            <path d="M52 128 c-8 12 8 24 22 20" fill="none" stroke="#1E2C3D" strokeWidth="14" strokeLinecap="round" />
            <path d="M148 128 c8 12-8 24-22 20" fill="none" stroke="#1E2C3D" strokeWidth="14" strokeLinecap="round" />
            <path d="M100 134 c-10-12-24-2-14 12 l14 14 14-14 c10-14-4-24-14-12 z" fill="#FF927D" stroke="#174D85" strokeWidth="2.5" />
          </g>
        )}

        {pose === 'reminders' && (
          <g>
            {/* Holding Capsule Pill */}
            <path d="M52 126 c-12 6-6 22 10 26" fill="none" stroke="#1E2C3D" strokeWidth="14" strokeLinecap="round" />
            <path d="M148 126 c12 6 6 22-10 26" fill="none" stroke="#1E2C3D" strokeWidth="14" strokeLinecap="round" />
            {/* Giant cute capsule */}
            <rect x="74" y="136" width="52" height="24" rx="12" fill="url(#pill-grad)" stroke="#174D85" strokeWidth="3" transform="rotate(-15 100 148)" />
            <circle cx="138" cy="146" r="6" fill="#4DBB7A" />
          </g>
        )}

        {pose === 'emergency' && (
          <g>
            {/* Emergency badge */}
            <path d="M52 126 c-10 10-2 24 14 24" fill="none" stroke="#1E2C3D" strokeWidth="14" strokeLinecap="round" />
            <path d="M148 126 c10 10 2 24-14 24" fill="none" stroke="#1E2C3D" strokeWidth="14" strokeLinecap="round" />
            {/* Shield with Red Cross */}
            <path d="M100 126 l18 8 v14 c0 14-18 22-18 22 s-18-8-18-22 v-14 z" fill="#FFFFFF" stroke="#E5484D" strokeWidth="3" />
            <rect x="96" y="136" width="8" height="18" rx="2" fill="#E5484D" />
            <rect x="91" y="141" width="18" height="8" rx="2" fill="#E5484D" />
          </g>
        )}

        {pose === 'celebration' && (
          <g>
            {/* Both arms raised up joyfully */}
            <path d="M52 124 c-16-16-24-32-12-42" fill="none" stroke="#1E2C3D" strokeWidth="14" strokeLinecap="round" />
            <circle cx="38" cy="80" r="10" fill="#1E2C3D" />
            
            <path d="M148 124 c16-16 24-32 12-42" fill="none" stroke="#1E2C3D" strokeWidth="14" strokeLinecap="round" />
            <circle cx="162" cy="80" r="10" fill="#1E2C3D" />

            {/* Confetti / Stars around */}
            <polygon points="30,50 33,56 40,57 35,62 36,68 30,65 24,68 25,62 20,57 27,56" fill="#FFD66B" />
            <polygon points="170,48 173,54 180,55 175,60 176,66 170,63 164,66 165,60 160,55 167,54" fill="#4DBB7A" />
            <circle cx="100" cy="18" r="4" fill="#FF927D" />
          </g>
        )}

        {pose === 'empty' && (
          <g>
            {/* Puzzled thinking pose */}
            <path d="M52 126 c-14 4-20 18-14 28" fill="none" stroke="#1E2C3D" strokeWidth="14" strokeLinecap="round" />
            <path d="M148 126 c8-10 18-26 10-38" fill="none" stroke="#1E2C3D" strokeWidth="14" strokeLinecap="round" />
            <circle cx="158" cy="88" r="9" fill="#1E2C3D" />
            {/* Question Mark */}
            <text x="170" y="80" fontSize="24" fontWeight="bold" fill="#3185E8">?</text>
          </g>
        )}

        {pose === 'error' && (
          <g>
            {/* Puzzled comparison pose */}
            <path d="M52 126 c-12 8-10 24 6 28" fill="none" stroke="#1E2C3D" strokeWidth="14" strokeLinecap="round" />
            <path d="M148 126 c12 8 10 24-6 28" fill="none" stroke="#1E2C3D" strokeWidth="14" strokeLinecap="round" />
            <circle cx="48" cy="154" r="8" fill="#1E2C3D" />
            <circle cx="152" cy="154" r="8" fill="#1E2C3D" />
            <polygon points="100,132 114,156 86,156" fill="#FFD66B" stroke="#174D85" strokeWidth="2.5" strokeLinejoin="round" />
            <text x="98" y="152" fontSize="14" fontWeight="bold" fill="#174D85">!</text>
          </g>
        )}
      </svg>
    </div>
  )
}
