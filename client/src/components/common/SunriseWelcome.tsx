import React, { useState, useEffect } from 'react';

interface SunriseWelcomeProps {
  onComplete?: () => void;
}

export const SunriseWelcome: React.FC<SunriseWelcomeProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'night' | 'sunrise' | 'fields' | 'logo' | 'exit'>('night');
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Stage 1: Night -> Sunrise (Sun starts rising and sky warms at 400ms)
    const t1 = setTimeout(() => setPhase('sunrise'), 350);

    // Stage 2: Sunrise -> Fields & village crops illuminate at 1100ms
    const t2 = setTimeout(() => setPhase('fields'), 1100);

    // Stage 3: Logo emerges at 1800ms
    const t3 = setTimeout(() => setPhase('logo'), 1800);

    // Stage 4: Cinematic exit transition begins at 2700ms
    const t4 = setTimeout(() => {
      setPhase('exit');
    }, 2700);

    // Stage 5: Unmount and callback at 3300ms
    const t5 = setTimeout(() => {
      setVisible(false);
      if (onComplete) onComplete();
    }, 3300);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 pointer-events-none flex items-center justify-center overflow-hidden transition-opacity duration-700 ease-in-out ${
        phase === 'exit' ? 'opacity-0' : 'opacity-100'
      }`}
      style={{
        background:
          phase === 'night'
            ? '#03140d'
            : phase === 'sunrise'
            ? 'linear-gradient(180deg, #072a1d 0%, #0e452e 50%, #1a5c3d 85%, #c87d29 100%)'
            : 'linear-gradient(180deg, #072e20 0%, #0f5238 45%, #2a8559 75%, #f5b83d 95%, #ffdf94 100%)',
        transition: 'background 1.4s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {/* 1. Golden Glowing Rising Sun */}
      <div
        className="absolute rounded-full transition-all duration-1000 ease-out pointer-events-none"
        style={{
          width: '280px',
          height: '280px',
          left: '50%',
          bottom: phase === 'night' ? '-140px' : phase === 'sunrise' ? '28%' : '38%',
          transform: 'translateX(-50%)',
          background: 'radial-gradient(circle, #ffea9f 0%, #f5b83d 40%, rgba(245, 184, 61, 0.3) 70%, transparent 100%)',
          boxShadow: '0 0 120px 40px rgba(245, 184, 61, 0.6), 0 0 200px 80px rgba(26, 163, 115, 0.3)',
          opacity: phase === 'night' ? 0 : 1,
          transition: 'all 1.6s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      />

      {/* Sun Ray Flares */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-1000"
        style={{
          background: 'radial-gradient(ellipse at 50% 60%, rgba(255, 235, 160, 0.25) 0%, transparent 65%)',
          opacity: phase === 'fields' || phase === 'logo' ? 0.9 : 0.2,
        }}
      />

      {/* 2. Scenic Village & Crop Field Silhouettes (Layered depth) */}
      <svg
        className="absolute bottom-0 w-full h-[55%] pointer-events-none transition-all duration-1000"
        viewBox="0 0 1440 400"
        fill="none"
        preserveAspectRatio="none"
        style={{
          opacity: phase === 'night' ? 0.3 : 1,
          transform: phase === 'night' ? 'translateY(30px)' : 'translateY(0)',
          transition: 'all 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Distant Hills */}
        <path
          d="M0,260 Q360,180 720,240 T1440,210 L1440,400 L0,400 Z"
          fill="#0c3a27"
          opacity="0.85"
        />

        {/* Mid-ground Village Trees & Hut Outlines */}
        <path
          d="M0,290 Q180,240 360,285 Q540,230 720,280 Q900,240 1080,285 Q1260,250 1440,295 L1440,400 L0,400 Z"
          fill="#082b1d"
        />

        {/* Village Houses & Granary Outlines */}
        <g fill="#051c13" opacity="0.95">
          {/* House 1 */}
          <polygon points="280,280 320,250 360,280" />
          <rect x="290" y="280" width="60" height="30" />
          {/* Temple / Panchayat Spire */}
          <polygon points="710,270 725,215 740,270" />
          <rect x="715" y="270" width="20" height="40" />
          {/* House 2 */}
          <polygon points="1080,275 1120,245 1160,275" />
          <rect x="1090" y="275" width="60" height="35" />
          {/* Rural Water Well / Structure */}
          <rect x="520" y="285" width="25" height="20" rx="3" />
        </g>

        {/* Foreground Crop Fields & Paddy Terraces (gently appearing with lush golden-green highlights) */}
        <path
          d="M0,320 C240,305 480,340 720,315 C960,335 1200,310 1440,330 L1440,400 L0,400 Z"
          fill={phase === 'fields' || phase === 'logo' ? '#14603d' : '#04160e'}
          style={{ transition: 'fill 1s ease-out' }}
        />
        <path
          d="M0,355 C300,345 600,370 900,350 C1200,365 1350,355 1440,360 L1440,400 L0,400 Z"
          fill={phase === 'fields' || phase === 'logo' ? '#1da674' : '#03120b'}
          style={{ transition: 'fill 1.1s ease-out' }}
          opacity="0.9"
        />

        {/* Subtle field furrow crop lines */}
        <g stroke={phase === 'fields' || phase === 'logo' ? '#ffdf94' : 'transparent'} strokeWidth="1.5" strokeOpacity="0.4" style={{ transition: 'stroke 1s ease' }}>
          <line x1="120" y1="365" x2="300" y2="400" />
          <line x1="280" y1="365" x2="480" y2="400" />
          <line x1="460" y1="365" x2="680" y2="400" />
          <line x1="720" y1="365" x2="940" y2="400" />
          <line x1="960" y1="365" x2="1180" y2="400" />
          <line x1="1160" y1="365" x2="1380" y2="400" />
        </g>
      </svg>

      {/* Morning Mist Rising Over Fields */}
      <div
        className="absolute bottom-0 inset-x-0 h-40 pointer-events-none transition-opacity duration-1000"
        style={{
          background: 'linear-gradient(to top, rgba(255, 245, 215, 0.25) 0%, rgba(26, 163, 115, 0.15) 50%, transparent 100%)',
          opacity: phase === 'fields' || phase === 'logo' ? 1 : 0,
        }}
      />

      {/* 3. Centerpiece: GramSetu Logo & Tagline emerges with smooth fade & elevation */}
      <div
        className="relative z-10 text-center px-6 transition-all duration-700 ease-out flex flex-col items-center"
        style={{
          opacity: phase === 'logo' || phase === 'exit' ? 1 : 0,
          transform: phase === 'logo' || phase === 'exit' ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.92)',
        }}
      >
        {/* Beveled 3D Logo Icon Tile */}
        <div
          className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl flex items-center justify-center font-extrabold text-white text-3xl sm:text-4xl mb-4 relative"
          style={{
            background: 'linear-gradient(135deg, #3cc391 0%, #12805a 60%, #072a1d 100%)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 50px rgba(60, 195, 145, 0.6), inset 0 2px 2px rgba(255, 255, 255, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
          }}
        >
          <span className="tracking-tight drop-shadow-md">GS</span>
          <div className="absolute -bottom-1 w-10 h-1 bg-amber-400 rounded-full blur-[1px]" />
        </div>

        {/* Brand Name */}
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight drop-shadow-lg flex items-center justify-center gap-2">
          <span>GRAM SETU</span>
        </h1>

        {/* Tagline */}
        <p className="text-xs sm:text-sm text-emerald-100 font-medium tracking-wide mt-2 max-w-md drop-shadow">
          Connecting What Villages Have with What Villages Need
        </p>

        {/* Golden Morning Indicator Pill */}
        <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-amber-300/40 text-amber-300 text-[11px] font-mono font-semibold tracking-wider shadow-lg">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
          <span>A NEW DAWN FOR RURAL SHARING</span>
        </div>
      </div>

      {/* Skip Button (Accessibility & Speed) */}
      <button
        onClick={() => {
          setVisible(false);
          if (onComplete) onComplete();
        }}
        className="absolute top-6 right-6 z-20 text-white/70 hover:text-white text-xs font-mono font-medium px-3.5 py-1.5 rounded-full bg-black/30 hover:bg-black/50 border border-white/20 backdrop-blur-md transition-all pointer-events-auto"
      >
        Skip intro ✕
      </button>
    </div>
  );
};