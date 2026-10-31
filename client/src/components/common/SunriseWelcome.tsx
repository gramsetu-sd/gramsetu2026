import React, { useState, useEffect } from 'react';

interface SunriseWelcomeProps {
  onComplete?: () => void;
}

export const SunriseWelcome: React.FC<SunriseWelcomeProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'dawn' | 'sunrise' | 'logo' | 'exit'>('dawn');
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // 0 -> 300ms: Deep quiet pre-dawn
    // 300ms -> 1400ms: Sun smoothly rises with golden acrylic radial glow & village lights up
    const tSunrise = setTimeout(() => setPhase('sunrise'), 300);

    // 1400ms -> 2500ms: GS Brand & Tagline smoothly emerges
    const tLogo = setTimeout(() => setPhase('logo'), 1400);

    // 2500ms: Cinematic transition into homepage
    const tExit = setTimeout(() => setPhase('exit'), 2500);

    // 3000ms: Unmount cleanly
    const tDone = setTimeout(() => {
      setVisible(false);
      if (onComplete) onComplete();
    }, 3000);

    return () => {
      clearTimeout(tSunrise);
      clearTimeout(tLogo);
      clearTimeout(tExit);
      clearTimeout(tDone);
    };
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 pointer-events-none flex items-center justify-center overflow-hidden transition-opacity duration-500 ease-out ${
        phase === 'exit' ? 'opacity-0' : 'opacity-100'
      }`}
      style={{
        background:
          phase === 'dawn'
            ? 'linear-gradient(180deg, #02120a 0%, #052618 60%, #153b26 100%)'
            : 'linear-gradient(180deg, #062316 0%, #0e432a 35%, #92400e 65%, #d97706 85%, #fef08a 100%)',
        transition: 'background 1.5s cubic-bezier(0.16, 1, 0.3, 1)',
        willChange: 'opacity, background',
      }}
    >
      {/* 1. Large Atmospheric Sunrise Glow (GPU-Accelerated Radial Light) */}
      <div
        className="absolute rounded-full pointer-events-none transition-all duration-1000 ease-out"
        style={{
          width: '750px',
          height: '750px',
          left: '50%',
          top: phase === 'dawn' ? '82%' : '48%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(254, 240, 138, 0.95) 0%, rgba(245, 158, 11, 0.75) 25%, rgba(217, 119, 6, 0.4) 48%, rgba(180, 83, 9, 0.15) 70%, transparent 85%)',
          filter: 'blur(32px)',
          opacity: phase === 'dawn' ? 0.35 : 1,
          transition: 'all 1.6s cubic-bezier(0.16, 1, 0.3, 1)',
          willChange: 'top, opacity',
        }}
      />

      {/* 2. Realistic Solar Disk with Photospheric Limb Darkening */}
      <div
        className="absolute rounded-full pointer-events-none transition-all duration-1000 ease-out"
        style={{
          width: '180px',
          height: '180px',
          left: '50%',
          top: phase === 'dawn' ? '76%' : '44%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle at 45% 45%, #ffffff 0%, #fef08a 28%, #f59e0b 65%, #ea580c 88%, #b45309 100%)',
          boxShadow: '0 0 60px 20px rgba(254, 215, 102, 0.85), 0 0 140px 60px rgba(245, 158, 11, 0.45)',
          opacity: phase === 'dawn' ? 0.4 : 1,
          transition: 'all 1.5s cubic-bezier(0.16, 1, 0.3, 1)',
          willChange: 'top, opacity',
        }}
      >
        {/* Subtle Solar Flare Halo */}
        <div className="absolute -inset-4 rounded-full border border-amber-300/40 animate-ping opacity-40 pointer-events-none" />
      </div>

      {/* 3. Landscape SVG: Crops, Fields, Tractors, Sprinklers, Distant Hills */}
      <svg
        className="absolute bottom-0 w-full h-[58%] pointer-events-none transition-all duration-1000"
        viewBox="0 0 1440 420"
        fill="none"
        preserveAspectRatio="none"
        style={{
          transform: phase === 'dawn' ? 'translateY(18px)' : 'translateY(0)',
          transition: 'transform 1.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Distant Hills (Layer 1) */}
        <path
          d="M0,230 Q360,160 720,210 T1440,185 L1440,420 L0,420 Z"
          fill="#0c3825"
          opacity="0.9"
        />

        {/* Mid-ground Village Forest & Trees (Layer 2) */}
        <path
          d="M0,265 Q200,215 400,260 Q600,210 800,255 Q1000,220 1200,265 Q1320,235 1440,270 L1440,420 L0,420 Z"
          fill="#072b1c"
        />

        {/* Village Granary & Temple Spire Outlines */}
        <g fill="#041b11" opacity="0.95">
          <polygon points="260,255 295,225 330,255" />
          <rect x="270" y="255" width="50" height="25" />
          <polygon points="710,245 720,195 730,245" />
          <rect x="715" y="245" width="10" height="30" />
          <polygon points="1060,250 1095,220 1130,250" />
          <rect x="1070" y="250" width="50" height="28" />
        </g>

        {/* TRACTOR SILHOUETTE on Mid-ground Field Terrace (x: 440, y: 260) */}
        <g fill="#02110a">
          {/* Rear large wheel */}
          <circle cx="420" cy="285" r="16" />
          <circle cx="420" cy="285" r="8" fill="#15803d" opacity={phase === 'dawn' ? '0.2' : '0.6'} />
          {/* Front small wheel */}
          <circle cx="458" cy="289" r="10" />
          <circle cx="458" cy="289" r="5" fill="#15803d" opacity={phase === 'dawn' ? '0.2' : '0.6'} />
          {/* Body & hood */}
          <rect x="424" y="272" width="34" height="15" />
          <rect x="448" y="278" width="14" height="9" />
          {/* Exhaust pipe */}
          <rect x="450" y="260" width="3" height="12" />
          {/* Cabin canopy */}
          <polygon points="418,272 426,252 444,252 444,272" />
          {/* Golden sun rim highlight on tractor */}
          <path
            d="M426,252 L444,252 L462,278"
            stroke={phase === 'dawn' ? 'transparent' : '#fef08a'}
            strokeWidth="1.8"
            fill="none"
          />
        </g>

        {/* WATER SPRINKLERS WITH SPRAY ARCS (x: 980, y: 275) */}
        <g>
          {/* Sprinkler stand */}
          <line x1="980" y1="290" x2="980" y2="274" stroke="#02110a" strokeWidth="2.5" />
          <line x1="975" y1="290" x2="980" y2="274" stroke="#02110a" strokeWidth="2" />
          <line x1="985" y1="290" x2="980" y2="274" stroke="#02110a" strokeWidth="2" />
          {/* Sprinkler Water Mist Arcs (Sunlight Shimmer) */}
          <path
            d="M980,274 Q1015,245 1045,280"
            stroke={phase === 'dawn' ? 'transparent' : '#bae6fd'}
            strokeWidth="2"
            strokeDasharray="3,3"
            fill="none"
            opacity="0.8"
          />
          <path
            d="M980,274 Q945,248 920,282"
            stroke={phase === 'dawn' ? 'transparent' : '#e0f2fe'}
            strokeWidth="1.8"
            strokeDasharray="3,3"
            fill="none"
            opacity="0.75"
          />
          <circle cx="980" cy="272" r="3" fill="#38bdf8" opacity="0.9" />
        </g>

        {/* Foreground Crop Fields & Terraces (Lush Emerald with Golden Glaze) */}
        <path
          d="M0,305 C260,285 520,335 780,300 C1040,325 1240,295 1440,315 L1440,420 L0,420 Z"
          fill={phase === 'dawn' ? '#072417' : '#14532d'}
          style={{ transition: 'fill 1s ease-out' }}
        />
        <path
          d="M0,345 C320,330 640,365 960,335 C1240,355 1360,345 1440,350 L1440,420 L0,420 Z"
          fill={phase === 'dawn' ? '#04180e' : '#15803d'}
          style={{ transition: 'fill 1.1s ease-out' }}
          opacity="0.95"
        />

        {/* Crop furrow lines reflecting morning sun */}
        <g stroke={phase === 'dawn' ? 'transparent' : '#fef08a'} strokeWidth="1.5" strokeOpacity="0.45" style={{ transition: 'stroke 1s ease' }}>
          <line x1="140" y1="355" x2="300" y2="420" />
          <line x1="320" y1="355" x2="520" y2="420" />
          <line x1="520" y1="355" x2="740" y2="420" />
          <line x1="780" y1="355" x2="1000" y2="420" />
          <line x1="1020" y1="355" x2="1240" y2="420" />
          <line x1="1220" y1="355" x2="1420" y2="420" />
        </g>
      </svg>

      {/* 4. Centerpiece: GramSetu Logo & Tagline Emerges */}
      <div
        className="relative z-10 text-center px-6 transition-all duration-700 ease-out flex flex-col items-center"
        style={{
          opacity: phase === 'logo' || phase === 'exit' ? 1 : 0,
          transform: phase === 'logo' || phase === 'exit' ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.92)',
          willChange: 'transform, opacity',
        }}
      >
        {/* Official GramSetu Logo Artwork */}
        <div className="relative mb-3 flex items-center justify-center">
          <img
            src="/images/gramsetu-logo.png"
            alt="GramSetu Logo"
            className="w-auto h-32 sm:h-44 object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
          />
        </div>

        {/* Golden Dawn Status Pill */}
        <div className="mt-2 inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-amber-300/40 text-amber-300 text-[11px] font-mono font-bold tracking-wider shadow-lg">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span>A NEW DAWN FOR RURAL SHARING</span>
        </div>
      </div>

      {/* Skip Button */}
      <button
        onClick={() => {
          setVisible(false);
          if (onComplete) onComplete();
        }}
        className="absolute top-6 right-6 z-20 text-white/80 hover:text-white text-xs font-mono font-semibold px-4 py-1.5 rounded-full bg-black/40 hover:bg-black/60 border border-white/20 backdrop-blur-md transition-all pointer-events-auto shadow-md"
      >
        Skip intro ✕
      </button>
    </div>
  );
};