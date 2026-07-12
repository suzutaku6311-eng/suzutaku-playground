import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import './ParticlePlayground.css';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
}

type Theme = 'rainbow' | 'fire' | 'ocean' | 'neon';

const THEMES: Record<Theme, string[]> = {
  rainbow: ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899'],
  fire: ['#FEF08A', '#FDE047', '#FACC15', '#F59E0B', '#EA580C', '#DC2626'],
  ocean: ['#BAE6FD', '#7DD3FC', '#38BDF8', '#0EA5E9', '#0284C7', '#0369A1'],
  neon: ['#39FF14', '#0FF0FC', '#FF00FF', '#FFFF00', '#FF3131']
};

export const ParticlePlayground: React.FC = () => {
  const { t, language } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  
  const [theme, setTheme] = useState<Theme>('rainbow');
  const [isPointerDown, setIsPointerDown] = useState(false);

  // Emitter state
  const lastPosRef = useRef<{x: number, y: number} | null>(null);

  const emitParticles = (x: number, y: number, amount: number) => {
    const colors = THEMES[theme];
    for (let i = 0; i < amount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4 + 1;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        maxLife: Math.random() * 0.5 + 0.5, // Used for fade out multiplier
        size: Math.random() * 6 + 2,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsPointerDown(true);
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    lastPosRef.current = { x, y };
    emitParticles(x, y, 20); // Initial burst
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isPointerDown) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Interpolate if mouse moved fast to create a smooth trail
    if (lastPosRef.current) {
      const dx = x - lastPosRef.current.x;
      const dy = y - lastPosRef.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      const steps = Math.max(1, Math.floor(dist / 5));
      for (let i = 0; i < steps; i++) {
        const ix = lastPosRef.current.x + dx * (i / steps);
        const iy = lastPosRef.current.y + dy * (i / steps);
        emitParticles(ix, iy, 3);
      }
    } else {
      emitParticles(x, y, 5);
    }
    
    lastPosRef.current = { x, y };
  };

  const handlePointerUp = () => {
    setIsPointerDown(false);
    lastPosRef.current = null;
  };

  const clearParticles = () => {
    particlesRef.current = [];
  };

  const updateAndDraw = (width: number, height: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    // Fade effect for trails
    ctx.fillStyle = 'rgba(15, 23, 42, 0.2)'; // #0f172a with opacity
    ctx.fillRect(0, 0, width, height);

    // Use globalCompositeOperation for cool light blending
    ctx.globalCompositeOperation = 'lighter';

    const pList = particlesRef.current;
    for (let i = pList.length - 1; i >= 0; i--) {
      const p = pList[i];
      
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.98; // Friction
      p.vy *= 0.98;
      p.life -= 0.015 / p.maxLife;

      if (p.life <= 0) {
        pList.splice(i, 1);
        continue;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
    }
    
    ctx.globalCompositeOperation = 'source-over'; // Reset
  };

  const loop = () => {
    if (canvasRef.current && wrapperRef.current) {
      const width = wrapperRef.current.clientWidth;
      const height = wrapperRef.current.clientHeight;
      if (canvasRef.current.width !== width || canvasRef.current.height !== height) {
        canvasRef.current.width = width;
        canvasRef.current.height = height;
      }
      updateAndDraw(width, height);
    }
    requestRef.current = requestAnimationFrame(loop);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(loop);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [theme]); // Rebind if theme changes

  return (
    <div className="container animate-fade-in">
      <div className="particle-container">
        
        <div className="particle-header">
          <h1 className="particle-title">{t('particlePlayground.title')}</h1>
          <div className="particle-controls">
            <select 
              className="theme-select"
              value={theme}
              onChange={(e) => setTheme(e.target.value as Theme)}
            >
              <option value="rainbow">{language === 'ja' ? 'レインボー' : 'Rainbow'}</option>
              <option value="fire">{language === 'ja' ? '炎' : 'Fire'}</option>
              <option value="ocean">{language === 'ja' ? '海' : 'Ocean'}</option>
              <option value="neon">{language === 'ja' ? 'ネオン' : 'Neon'}</option>
            </select>
            <button className="particle-btn" onClick={clearParticles}>
              {language === 'ja' ? 'クリア' : 'Clear'}
            </button>
          </div>
        </div>

        <div className="particle-canvas-wrapper" ref={wrapperRef}>
          <div className="particle-hint">
            {language === 'ja' ? 'なぞってパーティクルを出す' : 'Drag to emit particles'}
          </div>
          <canvas
            ref={canvasRef}
            className="particle-canvas"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
          />
        </div>

      </div>
    </div>
  );
};
