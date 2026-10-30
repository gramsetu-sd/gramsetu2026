import React, { useEffect, useRef, useState } from 'react';

interface SunriseWelcomeProps {
  onComplete?: () => void;
}

export const SunriseWelcome: React.FC<SunriseWelcomeProps> = ({ onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [phase, setPhase] = useState<'animating' | 'fading' | 'done'>('animating');
  const [textVisible, setTextVisible] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const startTime = performance.now();
    const DURATION = 3200; // total cinematic run in ms

    // Seeded oil pastel particle texture & strokes
    interface OilStroke {
      x: number;
      y: number;
      length: number;
      angle: number;
      color: string;
      alpha: number;
      width: number;
    }

    const strokes: OilStroke[] = [];
    // Generate tactile oil pastel canvas texture dab points
    for (let i = 0; i < 400; i++) {
      strokes.push({
        x: Math.random(),
        y: Math.random(),
        length: 8 + Math.random() * 22,
        angle: (Math.random() - 0.5) * 0.4,
        color: Math.random() > 0.5 ? '#e08b28' : Math.random() > 0.5 ? '#d9531e' : '#f5c842',
        alpha: 0.04 + Math.random() * 0.08,
        width: 1.5 + Math.random() * 3.5,
      });
    }

    // Solar Corona Flares (dynamic solar plasma rays)
    const solarRays: { angle: number; length: number; speed: number; intensity: number }[] = [];
    for (let i = 0; i < 28; i++) {
      solarRays.push({
        angle: (i / 28) * Math.PI * 2,
        length: 0.8 + Math.random() * 0.7,
        speed: 0.2 + Math.random() * 0.4,
        intensity: 0.4 + Math.random() * 0.6,
      });
    }

    // Floating golden dawn dust particles
    const dustMotes: { x: number; y: number; vx: number; vy: number; size: number; alpha: number }[] = [];
    for (let i = 0; i < 70; i++) {
      dustMotes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: -0.3 - Math.random() * 0.8,
        size: 1 + Math.random() * 2.5,
        alpha: 0.2 + Math.random() * 0.5,
      });
    }

    const render = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / DURATION, 1);

      // Trigger logo emergence at 55% progress (~1.7s)
      if (progress > 0.52 && !textVisible) {
        setTextVisible(true);
      }

      // Trigger final cinematic dissolve at 85% progress (~2.7s)
      if (progress > 0.84 && phase === 'animating') {
        setPhase('fading');
      }

      if (progress >= 1) {
        setPhase('done');
        if (onComplete) onComplete();
        return;
      }

      // Easing functions for organic natural sunrise curve
      // Ease out cubic for sun elevation
      const tSun = Math.min(progress / 0.8, 1);
      const sunRiseEase = 1 - Math.pow(1 - tSun, 3);

      ctx.clearRect(0, 0, width, height);

      // -------------------------------------------------------------
      // 1. ACRYLIC & OIL PASTEL SKY GRADIENT (Rich blend of deep viridian, cadmium amber, vermilion)
      // -------------------------------------------------------------
      // Sun position
      const sunCenterX = width * 0.5;
      const horizonY = height * 0.64;
      const sunStartElevation = height * 0.82;
      const sunPeakElevation = height * 0.42;
      const sunY = sunStartElevation - (sunStartElevation - sunPeakElevation) * sunRiseEase;
      const sunRadius = Math.min(width, height) * 0.12;

      // Dynamic Sky Canvas Gradient based on progress
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      if (progress < 0.3) {
        // Deep pre-dawn viridian night transitioning into early glow
        const blend = progress / 0.3;
        skyGrad.addColorStop(0, '#02120a');
        skyGrad.addColorStop(0.4, '#041f14');
        skyGrad.addColorStop(0.75, blendColor('#062d1d', '#5a2d0c', blend));
        skyGrad.addColorStop(1, blendColor('#052417', '#9c4314', blend));
      } else if (progress < 0.75) {
        // Full Acrylic Golden Dawn (Lapis night sky blending through viridian, fiery crimson, warm ochre)
        const blend = (progress - 0.3) / 0.45;
        skyGrad.addColorStop(0, blendColor('#03190e', '#083321', blend));
        skyGrad.addColorStop(0.35, blendColor('#0a3d28', '#1a5938', blend));
        skyGrad.addColorStop(0.65, blendColor('#5a2d0c', '#c75916', blend));
        skyGrad.addColorStop(0.85, blendColor('#9c4314', '#e08324', blend));
        skyGrad.addColorStop(1, blendColor('#d96b14', '#f7be43', blend));
      } else {
        // Brilliant morning radiance
        skyGrad.addColorStop(0, '#0a3a25');
        skyGrad.addColorStop(0.3, '#185c39');
        skyGrad.addColorStop(0.6, '#bf5b17');
        skyGrad.addColorStop(0.82, '#e08a26');
        skyGrad.addColorStop(1, '#ffdf6e');
      }
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // -------------------------------------------------------------
      // 2. REALISTIC SOLAR ATMOSPHERIC HALO & VOLUMETRIC SCATTERING
      // -------------------------------------------------------------
      // Large atmospheric bloom (oil pastel haze)
      const atmosphericBloom = ctx.createRadialGradient(
        sunCenterX,
        sunY,
        sunRadius * 0.2,
        sunCenterX,
        sunY,
        width * 0.75
      );
      atmosphericBloom.addColorStop(0, 'rgba(255, 240, 180, 0.95)');
      atmosphericBloom.addColorStop(0.12, 'rgba(255, 195, 80, 0.75)');
      atmosphericBloom.addColorStop(0.28, 'rgba(235, 115, 30, 0.45)');
      atmosphericBloom.addColorStop(0.55, 'rgba(180, 50, 15, 0.18)');
      atmosphericBloom.addColorStop(0.85, 'rgba(20, 80, 50, 0.05)');
      atmosphericBloom.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      ctx.fillStyle = atmosphericBloom;
      ctx.beginPath();
      ctx.arc(sunCenterX, sunY, width * 0.75, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // -------------------------------------------------------------
      // 3. PHOTOREALISTIC SOLAR BODY (Granulation, Limb Darkening & Corona)
      // -------------------------------------------------------------
      // A. Solar Corona / Radial Plasma Rays
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      const coronaTime = elapsed * 0.001;
      for (const ray of solarRays) {
        const rayAngle = ray.angle + Math.sin(coronaTime * ray.speed) * 0.08;
        const rayLen = sunRadius * (1.5 + ray.length * Math.sin(coronaTime * 1.5 + ray.angle));

        const rayGrad = ctx.createRadialGradient(
          sunCenterX,
          sunY,
          sunRadius * 0.8,
          sunCenterX + Math.cos(rayAngle) * rayLen,
          sunY + Math.sin(rayAngle) * rayLen,
          rayLen
        );
        rayGrad.addColorStop(0, `rgba(255, 230, 130, ${0.45 * ray.intensity})`);
        rayGrad.addColorStop(0.5, `rgba(240, 130, 30, ${0.2 * ray.intensity})`);
        rayGrad.addColorStop(1, 'rgba(200, 70, 10, 0)');

        ctx.fillStyle = rayGrad;
        ctx.beginPath();
        ctx.moveTo(sunCenterX, sunY);
        ctx.arc(sunCenterX, sunY, rayLen, rayAngle - 0.12, rayAngle + 0.12);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();

      // B. Main Sun Disk with Photospheric Limb Darkening
      // Realistic astronomical sun has a super-bright hot white-yellow core and darker reddish-orange limbs
      const sunDiskGrad = ctx.createRadialGradient(
        sunCenterX,
        sunY - sunRadius * 0.05,
        sunRadius * 0.05,
        sunCenterX,
        sunY,
        sunRadius
      );
      sunDiskGrad.addColorStop(0, '#ffffff'); // blinding thermonuclear core
      sunDiskGrad.addColorStop(0.25, '#fffce0');
      sunDiskGrad.addColorStop(0.55, '#fed766'); // golden ochre
      sunDiskGrad.addColorStop(0.82, '#f89a24'); // cadmium orange
      sunDiskGrad.addColorStop(0.96, '#e25114'); // limb darkening edge
      sunDiskGrad.addColorStop(1.0, 'rgba(215, 60, 10, 0.95)');

      ctx.save();
      ctx.shadowColor = 'rgba(255, 215, 100, 0.9)';
      ctx.shadowBlur = 45;
      ctx.fillStyle = sunDiskGrad;
      ctx.beginPath();
      ctx.arc(sunCenterX, sunY, sunRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // C. Heavy Oil Pastel / Impasto Pigment Texture over the Sun
      // Creates the distinct physical brushwork and tactile pastel ridges
      ctx.save();
      ctx.globalCompositeOperation = 'overlay';
      for (let i = 0; i < 45; i++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * (sunRadius * 0.95);
        const px = sunCenterX + Math.cos(angle) * dist;
        const py = sunY + Math.sin(angle) * dist;
        const pSize = 3 + Math.random() * 8;

        const pGrad = ctx.createRadialGradient(px, py, 0, px, py, pSize);
        pGrad.addColorStop(0, 'rgba(255, 255, 220, 0.5)');
        pGrad.addColorStop(0.6, 'rgba(245, 160, 40, 0.25)');
        pGrad.addColorStop(1, 'rgba(200, 60, 10, 0)');

        ctx.fillStyle = pGrad;
        ctx.beginPath();
        ctx.arc(px, py, pSize, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // -------------------------------------------------------------
      // 4. OIL PASTEL SKY TEXTURE (Canvas weave, chalky dabs & brush strokes)
      // -------------------------------------------------------------
      ctx.save();
      ctx.globalCompositeOperation = 'soft-light';
      for (const stroke of strokes) {
        const sx = stroke.x * width;
        const sy = stroke.y * height * 0.75; // sky region
        ctx.strokeStyle = stroke.color;
        ctx.lineWidth = stroke.width;
        ctx.globalAlpha = stroke.alpha;
        ctx.lineCap = 'round';

        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(
          sx + Math.cos(stroke.angle) * stroke.length,
          sy + Math.sin(stroke.angle) * stroke.length
        );
        ctx.stroke();
      }
      ctx.restore();

      // -------------------------------------------------------------
      // 5. HORIZON HAZE & MORNING MIST (Acrylic glaze layer)
      // -------------------------------------------------------------
      const mistGrad = ctx.createLinearGradient(0, horizonY - 80, 0, horizonY + 80);
      mistGrad.addColorStop(0, 'rgba(255, 215, 130, 0)');
      mistGrad.addColorStop(0.45, 'rgba(255, 225, 160, 0.55)');
      mistGrad.addColorStop(0.7, 'rgba(240, 160, 60, 0.4)');
      mistGrad.addColorStop(1, 'rgba(10, 50, 30, 0)');

      ctx.fillStyle = mistGrad;
      ctx.fillRect(0, horizonY - 80, width, 160);

      // -------------------------------------------------------------
      // 6. PAINTERLY RURAL LANDSCAPE & FIELDS (Lush Acrylic Emerald & Viridian)
      // -------------------------------------------------------------
      drawLushOilPastelLandscape(ctx, width, height, horizonY, sunRiseEase);

      // -------------------------------------------------------------
      // 7. GOLDEN DAWN DUST MOTES (Floating atmospheric light particles)
      // -------------------------------------------------------------
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      for (const mote of dustMotes) {
        mote.x += mote.vx;
        mote.y += mote.vy;
        if (mote.y < 0) mote.y = height;
        if (mote.x < 0) mote.x = width;
        if (mote.x > width) mote.x = 0;

        ctx.fillStyle = `rgba(255, 240, 180, ${mote.alpha * sunRiseEase})`;
        ctx.beginPath();
        ctx.arc(mote.x, mote.y, mote.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [onComplete]);

  // Helper color interpolator
  function blendColor(c1: string, c2: string, factor: number): string {
    const parse = (hex: string) => [
      parseInt(hex.slice(1, 3), 16),
      parseInt(hex.slice(3, 5), 16),
      parseInt(hex.slice(5, 7), 16),
    ];
    const rgb1 = parse(c1);
    const rgb2 = parse(c2);
    const r = Math.round(rgb1[0] + factor * (rgb2[0] - rgb1[0]));
    const g = Math.round(rgb1[1] + factor * (rgb2[1] - rgb1[1]));
    const b = Math.round(rgb1[2] + factor * (rgb2[2] - rgb1[2]));
    return `rgb(${r},${g},${b})`;
  }

  // Draw rich painterly acrylic rural silhouettes & field terraces
  function drawLushOilPastelLandscape(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    horizon: number,
    sunFactor: number
  ) {
    // A. Distant Mountain Ridges (Layer 1 - Misty Viridian)
    ctx.save();
    const ridgeGrad = ctx.createLinearGradient(0, horizon - 100, 0, horizon + 50);
    ridgeGrad.addColorStop(0, blendColor('#062417', '#1a5035', sunFactor));
    ridgeGrad.addColorStop(1, blendColor('#04160e', '#0e3824', sunFactor));

    ctx.fillStyle = ridgeGrad;
    ctx.beginPath();
    ctx.moveTo(0, horizon);
    ctx.bezierCurveTo(w * 0.2, horizon - 60, w * 0.35, horizon - 90, w * 0.5, horizon - 45);
    ctx.bezierCurveTo(w * 0.65, horizon - 15, w * 0.8, horizon - 80, w, horizon - 35);
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fill();

    // B. Mid-ground Village Canopy & Terraces (Layer 2 - Deep Forest Jade)
    const midGrad = ctx.createLinearGradient(0, horizon - 20, 0, horizon + 120);
    midGrad.addColorStop(0, blendColor('#031a10', '#12482c', sunFactor));
    midGrad.addColorStop(1, blendColor('#020f09', '#082918', sunFactor));

    ctx.fillStyle = midGrad;
    ctx.beginPath();
    ctx.moveTo(0, horizon + 10);
    ctx.bezierCurveTo(w * 0.25, horizon - 25, w * 0.45, horizon + 30, w * 0.7, horizon - 10);
    ctx.bezierCurveTo(w * 0.85, horizon - 30, w * 0.95, horizon + 15, w, horizon + 5);
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fill();

    // C. Village Rooflines, Panchayat Spire & Trees Silhouetted
    ctx.fillStyle = '#020d07';
    // Left cluster
    ctx.fillRect(w * 0.2, horizon + 10, 45, 24);
    ctx.beginPath();
    ctx.moveTo(w * 0.18, horizon + 10);
    ctx.lineTo(w * 0.222, horizon - 12);
    ctx.lineTo(w * 0.265, horizon + 10);
    ctx.closePath();
    ctx.fill();

    // Sacred Pipal Tree Canopy (Impasto foliage bubbles)
    ctx.beginPath();
    ctx.arc(w * 0.29, horizon - 10, 26, 0, Math.PI * 2);
    ctx.arc(w * 0.31, horizon - 22, 22, 0, Math.PI * 2);
    ctx.arc(w * 0.33, horizon - 8, 24, 0, Math.PI * 2);
    ctx.fill();

    // Center-right village house & granary
    ctx.fillRect(w * 0.72, horizon + 15, 55, 30);
    ctx.beginPath();
    ctx.moveTo(w * 0.7, horizon + 15);
    ctx.lineTo(w * 0.75, horizon - 10);
    ctx.lineTo(w * 0.8, horizon + 15);
    ctx.closePath();
    ctx.fill();

    // Panchayat flag / wind-vane pole
    ctx.fillRect(w * 0.52, horizon - 25, 3, 40);
    ctx.beginPath();
    ctx.moveTo(w * 0.523, horizon - 25);
    ctx.lineTo(w * 0.545, horizon - 18);
    ctx.lineTo(w * 0.523, horizon - 12);
    ctx.closePath();
    ctx.fill();

    // D. Foreground Sweeping Paddy Terraces with Morning Sunlight Rim Reflections
    // Terrace 1
    const t1Grad = ctx.createLinearGradient(0, horizon + 50, 0, horizon + 180);
    t1Grad.addColorStop(0, blendColor('#052115', '#197042', sunFactor));
    t1Grad.addColorStop(1, blendColor('#02110a', '#0d4025', sunFactor));

    ctx.fillStyle = t1Grad;
    ctx.beginPath();
    ctx.moveTo(0, horizon + 70);
    ctx.bezierCurveTo(w * 0.3, horizon + 35, w * 0.6, horizon + 95, w, horizon + 60);
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fill();

    // Golden morning rim highlight on terrace ridge
    ctx.save();
    ctx.strokeStyle = `rgba(255, 220, 120, ${0.45 * sunFactor})`;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(0, horizon + 70);
    ctx.bezierCurveTo(w * 0.3, horizon + 35, w * 0.6, horizon + 95, w, horizon + 60);
    ctx.stroke();
    ctx.restore();

    // Terrace 2 (Lush Foreground Crop Furrows)
    const t2Grad = ctx.createLinearGradient(0, horizon + 130, 0, h);
    t2Grad.addColorStop(0, blendColor('#062b1b', '#259458', sunFactor));
    t2Grad.addColorStop(0.5, blendColor('#03190e', '#196b3e', sunFactor));
    t2Grad.addColorStop(1, blendColor('#020d07', '#0e4225', sunFactor));

    ctx.fillStyle = t2Grad;
    ctx.beginPath();
    ctx.moveTo(0, horizon + 150);
    ctx.bezierCurveTo(w * 0.4, horizon + 110, w * 0.7, horizon + 175, w, horizon + 135);
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fill();

    // Golden crop furrow rays streaming across the foreground
    ctx.save();
    ctx.strokeStyle = `rgba(255, 230, 140, ${0.5 * sunFactor})`;
    ctx.lineWidth = 2;
    for (let f = 0; f < 10; f++) {
      const startX = (w * f) / 9;
      ctx.beginPath();
      ctx.moveTo(startX, horizon + 145);
      ctx.lineTo(startX + (startX - w * 0.5) * 0.7, h);
      ctx.stroke();
    }
    ctx.restore();
    ctx.restore();
  }

  if (phase === 'done') return null;

  return (
    <div
      className={`fixed inset-0 z-50 pointer-events-none flex items-center justify-center overflow-hidden transition-opacity duration-1000 ease-out ${
        phase === 'fading' ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Dynamic Photorealistic Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

      {/* Atmospheric Acrylic Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, transparent 40%, rgba(2, 18, 10, 0.45) 100%)',
        }}
      />

      {/* Centerpiece: GramSetu Brand & Tagline with Golden Dawn Emergence */}
      <div
        className="relative z-10 text-center px-6 transition-all duration-1000 ease-out flex flex-col items-center"
        style={{
          opacity: textVisible ? 1 : 0,
          transform: textVisible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.92)',
        }}
      >
        {/* 3D Tactile Emerald & Gold Sun Emblem */}
        <div
          className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl flex items-center justify-center font-extrabold text-white text-3xl sm:text-4xl mb-4 relative transition-transform duration-700"
          style={{
            background: 'linear-gradient(135deg, #4ed9a4 0%, #158f64 45%, #073824 100%)',
            boxShadow:
              '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 60px rgba(254, 215, 102, 0.8), inset 0 2px 2px rgba(255, 255, 255, 0.7)',
            border: '1.5px solid rgba(255, 255, 255, 0.35)',
          }}
        >
          <span className="tracking-tight drop-shadow-lg font-heading">GS</span>
          <div className="absolute -bottom-1.5 w-12 h-1.5 bg-amber-400 rounded-full blur-[2px]" />
        </div>

        {/* Brand Name with Golden Light Edge */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight drop-shadow-2xl flex items-center justify-center gap-2 font-heading">
          <span className="bg-gradient-to-r from-amber-100 via-white to-amber-200 bg-clip-text text-transparent">
            GRAM SETU
          </span>
        </h1>

        {/* Official Tagline */}
        <p className="text-xs sm:text-base text-amber-100 font-semibold tracking-wide mt-2 max-w-lg drop-shadow-md">
          Connecting What Villages Have with What Villages Need
        </p>

        {/* Golden Dawn Status Pill */}
        <div className="mt-4 inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-amber-300/40 text-amber-300 text-[11px] font-mono font-bold tracking-wider shadow-xl">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span>A NEW DAWN FOR VILLAGE SHARING</span>
        </div>
      </div>

      {/* Skip Button (Interactive & Accessible) */}
      <button
        onClick={() => {
          setPhase('done');
          if (onComplete) onComplete();
        }}
        className="absolute top-6 right-6 z-20 text-white/80 hover:text-white text-xs font-mono font-semibold px-4 py-1.5 rounded-full bg-black/40 hover:bg-black/60 border border-white/20 backdrop-blur-md transition-all pointer-events-auto shadow-md"
      >
        Skip intro ✕
      </button>
    </div>
  );
};