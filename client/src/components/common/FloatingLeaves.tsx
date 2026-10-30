import React, { useEffect, useRef } from 'react';

export const FloatingLeaves: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // 18 delicate floating green / golden leaf particles
    interface Leaf {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      rotation: number;
      rotSpeed: number;
      hue: number;
      opacity: number;
      sway: number;
      swaySpeed: number;
    }

    const leaves: Leaf[] = [];
    for (let i = 0; i < 16; i++) {
      leaves.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: 7 + Math.random() * 8,
        speedX: 0.15 + Math.random() * 0.45,
        speedY: 0.35 + Math.random() * 0.55,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.02,
        hue: Math.random() > 0.4 ? 145 : 42, // Emerald green or subtle golden wheat
        opacity: 0.18 + Math.random() * 0.28,
        sway: Math.random() * Math.PI * 2,
        swaySpeed: 0.015 + Math.random() * 0.02,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (const leaf of leaves) {
        leaf.y += leaf.speedY;
        leaf.sway += leaf.swaySpeed;
        leaf.x += Math.sin(leaf.sway) * 0.8 + leaf.speedX;
        leaf.rotation += leaf.rotSpeed;

        if (leaf.y > height + 20) {
          leaf.y = -20;
          leaf.x = Math.random() * width;
        }
        if (leaf.x > width + 20) {
          leaf.x = -20;
        }

        ctx.save();
        ctx.translate(leaf.x, leaf.y);
        ctx.rotate(leaf.rotation);
        ctx.globalAlpha = leaf.opacity;

        // Draw natural leaf shape
        ctx.fillStyle = leaf.hue === 145 ? '#15803d' : '#d97706';
        ctx.beginPath();
        ctx.moveTo(0, -leaf.size);
        ctx.bezierCurveTo(leaf.size * 0.75, -leaf.size * 0.4, leaf.size * 0.75, leaf.size * 0.4, 0, leaf.size);
        ctx.bezierCurveTo(-leaf.size * 0.75, leaf.size * 0.4, -leaf.size * 0.75, -leaf.size * 0.4, 0, -leaf.size);
        ctx.fill();

        // Leaf stem vein
        ctx.strokeStyle = leaf.hue === 145 ? '#86efac' : '#fde68a';
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(0, -leaf.size * 0.8);
        ctx.lineTo(0, leaf.size * 0.8);
        ctx.stroke();

        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-30 opacity-80"
      style={{ mixBlendMode: 'multiply' }}
    />
  );
};