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
    const DURATION = 3300; // 3.3s rich cinematic experience

    // Sprinkler water droplets simulation
    interface WaterDrop {
      x: number;
      y: number;
      vx: number;
      vy: number;
      alpha: number;
    }
    const waterDrops: WaterDrop[] = [];

    // Realistic Solar Corona Flares (dynamic solar plasma rays)
    const solarRays: { angle: number; length: number; speed: number; intensity: number }[] = [];
    for (let i = 0; i < 32; i++) {
      solarRays.push({
        angle: (i / 32) * Math.PI * 2,
        length: 0.9 + Math.random() * 0.8,
        speed: 0.2 + Math.random() * 0.5,
        intensity: 0.5 + Math.random() * 0.5,
      });
    }

    // Oil pastel stroke texture seeds
    const oilDabs: { x: number; y: number; len: number; angle: number; color: string; alpha: number }[] = [];
    for (let i = 0; i < 350; i++) {
      oilDabs.push({
        x: Math.random(),
        y: Math.random(),
        len: 10 + Math.random() * 25,
        angle: (Math.random() - 0.5) * 0.5,
        color: Math.random() > 0.6 ? '#f59e0b' : Math.random() > 0.3 ? '#ea580c' : '#fbbf24',
        alpha: 0.04 + Math.random() * 0.07,
      });
    }

    const render = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / DURATION, 1);

      // Logo emerges at ~1.7s (52% progress)
      if (progress > 0.52 && !textVisible) {
        setTextVisible(true);
      }

      // Cinematic fade starts at 86% progress
      if (progress > 0.86 && phase === 'animating') {
        setPhase('fading');
      }

      if (progress >= 1) {
        setPhase('done');
        if (onComplete) onComplete();
        return;
      }

      // Smooth sunrise easing
      const tSun = Math.min(progress / 0.82, 1);
      const sunRiseEase = 1 - Math.pow(1 - tSun, 3); // cubic ease out

      ctx.clearRect(0, 0, width, height);

      // -----------------------------------------------------------------
      // 1. SKY GRADIENT (Deep night forest -> Warm golden dawn)
      // -----------------------------------------------------------------
      const sunCenterX = width * 0.5;
      const horizonY = height * 0.64;
      const sunStartY = height * 0.86;
      const sunPeakY = height * 0.42;
      const sunY = sunStartY - (sunStartY - sunPeakY) * sunRiseEase;
      const sunRadius = Math.min(width, height) * 0.125;

      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      if (progress < 0.28) {
        const blend = progress / 0.28;
        skyGrad.addColorStop(0, '#02120a');
        skyGrad.addColorStop(0.4, '#041d13');
        skyGrad.addColorStop(0.75, blendColor('#062d1d', '#54260a', blend));
        skyGrad.addColorStop(1, blendColor('#041d12', '#8c3a11', blend));
      } else if (progress < 0.76) {
        const blend = (progress - 0.28) / 0.48;
        skyGrad.addColorStop(0, blendColor('#031a0e', '#093623', blend));
        skyGrad.addColorStop(0.35, blendColor('#0a3e28', '#1a5c3a', blend));
        skyGrad.addColorStop(0.65, blendColor('#54260a', '#b84e14', blend));
        skyGrad.addColorStop(0.85, blendColor('#8c3a11', '#d97706', blend));
        skyGrad.addColorStop(1, blendColor('#c25e10', '#f59e0b', blend));
      } else {
        skyGrad.addColorStop(0, '#0a3622');
        skyGrad.addColorStop(0.3, '#175636');
        skyGrad.addColorStop(0.6, '#b45309');
        skyGrad.addColorStop(0.82, '#d97706');
        skyGrad.addColorStop(1, '#fde68a');
      }
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // -----------------------------------------------------------------
      // 2. VOLUMETRIC ATMOSPHERIC BLOOM (Acrylic glaze glow)
      // -----------------------------------------------------------------
      const atmosphericBloom = ctx.createRadialGradient(
        sunCenterX,
        sunY,
        sunRadius * 0.2,
        sunCenterX,
        sunY,
        width * 0.8
      );
      atmosphericBloom.addColorStop(0, 'rgba(255, 243, 199, 0.95)');
      atmosphericBloom.addColorStop(0.12, 'rgba(254, 215, 102, 0.75)');
      atmosphericBloom.addColorStop(0.3, 'rgba(245, 158, 11, 0.45)');
      atmosphericBloom.addColorStop(0.6, 'rgba(180, 83, 9, 0.16)');
      atmosphericBloom.addColorStop(0.85, 'rgba(21, 128, 61, 0.05)');
      atmosphericBloom.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      ctx.fillStyle = atmosphericBloom;
      ctx.beginPath();
      ctx.arc(sunCenterX, sunY, width * 0.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // -----------------------------------------------------------------
      // 3. PHOTOREALISTIC SOLAR DISK (Solar corona, limb darkening)
      // -----------------------------------------------------------------
      // A. Solar Corona Plasma Rays
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      const coronaTime = elapsed * 0.001;
      for (const ray of solarRays) {
        const rayAngle = ray.angle + Math.sin(coronaTime * ray.speed) * 0.08;
        const rayLen = sunRadius * (1.6 + ray.length * Math.sin(coronaTime * 1.6 + ray.angle));

        const rayGrad = ctx.createRadialGradient(
          sunCenterX,
          sunY,
          sunRadius * 0.75,
          sunCenterX + Math.cos(rayAngle) * rayLen,
          sunY + Math.sin(rayAngle) * rayLen,
          rayLen
        );
        rayGrad.addColorStop(0, `rgba(254, 240, 138, ${0.45 * ray.intensity})`);
        rayGrad.addColorStop(0.5, `rgba(249, 115, 22, ${0.22 * ray.intensity})`);
        rayGrad.addColorStop(1, 'rgba(194, 65, 12, 0)');

        ctx.fillStyle = rayGrad;
        ctx.beginPath();
        ctx.moveTo(sunCenterX, sunY);
        ctx.arc(sunCenterX, sunY, rayLen, rayAngle - 0.12, rayAngle + 0.12);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();

      // B. Main Sun Body with Limb Darkening
      const sunDiskGrad = ctx.createRadialGradient(
        sunCenterX,
        sunY - sunRadius * 0.05,
        sunRadius * 0.05,
        sunCenterX,
        sunY,
        sunRadius
      );
      sunDiskGrad.addColorStop(0, '#ffffff'); // blinding core
      sunDiskGrad.addColorStop(0.28, '#fef08a');
      sunDiskGrad.addColorStop(0.6, '#f59e0b');
      sunDiskGrad.addColorStop(0.85, '#ea580c');
      sunDiskGrad.addColorStop(0.97, '#c2410c'); // limb darkening
      sunDiskGrad.addColorStop(1.0, 'rgba(180, 40, 5, 0.95)');

      ctx.save();
      ctx.shadowColor = 'rgba(254, 215, 102, 0.95)';
      ctx.shadowBlur = 50;
      ctx.fillStyle = sunDiskGrad;
      ctx.beginPath();
      ctx.arc(sunCenterX, sunY, sunRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // C. Oil pastel canvas dabs
      ctx.save();
      ctx.globalCompositeOperation = 'soft-light';
      for (const dab of oilDabs) {
        ctx.strokeStyle = dab.color;
        ctx.lineWidth = 2.5;
        ctx.globalAlpha = dab.alpha;
        ctx.lineCap = 'round';
        const dx = dab.x * width;
        const dy = dab.y * height * 0.72;
        ctx.beginPath();
        ctx.moveTo(dx, dy);
        ctx.lineTo(dx + Math.cos(dab.angle) * dab.len, dy + Math.sin(dab.angle) * dab.len);
        ctx.stroke();
      }
      ctx.restore();

      // -----------------------------------------------------------------
      // 4. LANDSCAPE: FIELDS, CROPS, TRACTORS, SPRINKLERS
      // -----------------------------------------------------------------
      drawRealisticLandscape(ctx, width, height, horizonY, sunRiseEase, elapsed, waterDrops);

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [onComplete]);

  // Color helper
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

  // Draw realistic fields, crops, tractor, and active water sprinklers
  function drawRealisticLandscape(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    horizon: number,
    sunFactor: number,
    timeMs: number,
    waterDrops: { x: number; y: number; vx: number; vy: number; alpha: number }[]
  ) {
    // 1. Distant rolling hills
    const hillGrad = ctx.createLinearGradient(0, horizon - 90, 0, horizon + 40);
    hillGrad.addColorStop(0, blendColor('#052115', '#165337', sunFactor));
    hillGrad.addColorStop(1, blendColor('#03140d', '#0d3623', sunFactor));
    ctx.fillStyle = hillGrad;
    ctx.beginPath();
    ctx.moveTo(0, horizon);
    ctx.bezierCurveTo(w * 0.25, horizon - 55, w * 0.45, horizon - 80, w * 0.65, horizon - 40);
    ctx.bezierCurveTo(w * 0.8, horizon - 15, w * 0.9, horizon - 60, w, horizon - 30);
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fill();

    // 2. Midground lush crop field & tree line
    const cropGrad = ctx.createLinearGradient(0, horizon + 10, 0, horizon + 140);
    cropGrad.addColorStop(0, blendColor('#041a10', '#156b3e', sunFactor));
    cropGrad.addColorStop(1, blendColor('#020f09', '#0e4226', sunFactor));
    ctx.fillStyle = cropGrad;
    ctx.beginPath();
    ctx.moveTo(0, horizon + 25);
    ctx.bezierCurveTo(w * 0.3, horizon - 15, w * 0.6, horizon + 45, w, horizon + 15);
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fill();

    // 3. TRACTOR SILHOUETTE on midground field terrace (Left-center at w * 0.32)
    const tx = w * 0.32;
    const ty = horizon + 42;
    ctx.save();
    ctx.fillStyle = '#03140d';
    // Rear large tractor wheel
    ctx.beginPath();
    ctx.arc(tx - 18, ty + 12, 16, 0, Math.PI * 2);
    ctx.fill();
    // Inner wheel rim highlight
    ctx.strokeStyle = `rgba(251, 191, 36, ${0.4 * sunFactor})`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(tx - 18, ty + 12, 9, 0, Math.PI * 2);
    ctx.stroke();

    // Front smaller tractor wheel
    ctx.fillStyle = '#03140d';
    ctx.beginPath();
    ctx.arc(tx + 22, ty + 16, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(tx + 22, ty + 16, 5, 0, Math.PI * 2);
    ctx.stroke();

    // Tractor body & hood
    ctx.fillRect(tx - 12, ty - 2, 34, 16);
    ctx.fillRect(tx + 12, ty + 4, 14, 10);
    // Exhaust stack & silencer
    ctx.fillRect(tx + 14, ty - 14, 2.5, 12);
    // Driver cabin / roll cage canopy
    ctx.beginPath();
    ctx.moveTo(tx - 18, ty - 2);
    ctx.lineTo(tx - 10, ty - 22);
    ctx.lineTo(tx + 8, ty - 22);
    ctx.lineTo(tx + 8, ty - 2);
    ctx.closePath();
    ctx.fill();

    // Golden morning rim highlight on tractor hood
    ctx.strokeStyle = `rgba(254, 240, 138, ${0.6 * sunFactor})`;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(tx - 10, ty - 22);
    ctx.lineTo(tx + 8, ty - 22);
    ctx.lineTo(tx + 26, ty + 4);
    ctx.stroke();
    ctx.restore();

    // 4. WATER SPRINKLERS with rotating spray arcs (Right side at w * 0.72)
    const sx = w * 0.72;
    const sy = horizon + 50;
    ctx.save();
    // Sprinkler stand & riser
    ctx.strokeStyle = '#020d07';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(sx, sy + 18);
    ctx.lineTo(sx, sy);
    ctx.lineTo(sx - 6, sy + 18);
    ctx.moveTo(sx, sy);
    ctx.lineTo(sx + 6, sy + 18);
    ctx.stroke();

    // Active Rotating Jet Spray
    const sprayAngle = (timeMs * 0.003) % (Math.PI * 2);
    const sprayIntensity = Math.sin(timeMs * 0.008) * 0.5 + 0.5;

    // Spawn sprinkler droplets
    if (Math.random() > 0.3) {
      const sprayVel = 2.5 + Math.random() * 2.5;
      waterDrops.push({
        x: sx,
        y: sy,
        vx: Math.cos(sprayAngle) * sprayVel * (Math.random() > 0.5 ? 1 : -0.7),
        vy: -2 - Math.random() * 2.5,
        alpha: 0.7,
      });
    }

    // Render sprinkler mist / drops reflecting sunlight
    ctx.fillStyle = `rgba(224, 242, 254, ${0.75 * sunFactor})`;
    for (let i = waterDrops.length - 1; i >= 0; i--) {
      const drop = waterDrops[i];
      drop.x += drop.vx;
      drop.y += drop.vy;
      drop.vy += 0.08; // gravity
      drop.alpha -= 0.015;

      ctx.globalAlpha = Math.max(drop.alpha * sunFactor, 0);
      ctx.beginPath();
      ctx.arc(drop.x, drop.y, 1.3, 0, Math.PI * 2);
      ctx.fill();

      if (drop.alpha <= 0 || drop.y > sy + 25) {
        waterDrops.splice(i, 1);
      }
    }

    // Sprinkler arc mist glow
    ctx.globalAlpha = 0.4 * sunFactor * sprayIntensity;
    const mistGrad = ctx.createRadialGradient(sx, sy - 8, 2, sx, sy - 8, 45);
    mistGrad.addColorStop(0, 'rgba(186, 230, 253, 0.6)');
    mistGrad.addColorStop(0.6, 'rgba(254, 240, 138, 0.25)');
    mistGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = mistGrad;
    ctx.beginPath();
    ctx.arc(sx, sy - 8, 45, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 5. Foreground sweeping paddy crop furrows
    const tGrad = ctx.createLinearGradient(0, horizon + 110, 0, h);
    tGrad.addColorStop(0, blendColor('#052e1d', '#1e824c', sunFactor));
    tGrad.addColorStop(0.5, blendColor('#031a10', '#156b3e', sunFactor));
    tGrad.addColorStop(1, blendColor('#020d07', '#0d4025', sunFactor));

    ctx.fillStyle = tGrad;
    ctx.beginPath();
    ctx.moveTo(0, horizon + 115);
    ctx.bezierCurveTo(w * 0.35, horizon + 85, w * 0.65, horizon + 155, w, horizon + 110);
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fill();

    // Golden morning furrows with crop grain ripples
    ctx.save();
    ctx.strokeStyle = `rgba(254, 240, 138, ${0.45 * sunFactor})`;
    ctx.lineWidth = 2.2;
    for (let f = 0; f < 11; f++) {
      const startX = (w * f) / 10;
      ctx.beginPath();
      ctx.moveTo(startX, horizon + 120);
      ctx.lineTo(startX + (startX - w * 0.5) * 0.75, h);
      ctx.stroke();
    }
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
          background: 'radial-gradient(circle at center, transparent 40%, rgba(2, 18, 10, 0.42) 100%)',
        }}
      />

      {/* Centerpiece: GramSetu Brand & Tagline with Golden Dawn Emergence */}
      <div
        className="relative z-10 text-center px-6 transition-all duration-1000 ease-out flex flex-col items-center"
        style={{
          opacity: textVisible ? 1 : 0,
          transform: textVisible ? 'translateY(0) scale(1)' : 'translateY(28px) scale(0.92)',
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