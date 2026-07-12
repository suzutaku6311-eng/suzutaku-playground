import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import './GravitySim.css';

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
}

const COLORS = ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#14B8A6'];

export const GravitySim: React.FC = () => {
  const { t, language } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>();
  const ballsRef = useRef<Ball[]>([]);
  
  // Settings
  const [gravity, setGravity] = useState(0.5);
  const [restitution, setRestitution] = useState(0.7); // Bounciness
  
  const spawnBall = (x: number, y: number) => {
    const newBall: Ball = {
      x,
      y,
      vx: (Math.random() - 0.5) * 10,
      vy: (Math.random() - 0.5) * 10,
      radius: Math.random() * 15 + 10, // 10 to 25
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    };
    ballsRef.current.push(newBall);
    
    // Limit max balls to keep performance good
    if (ballsRef.current.length > 200) {
      ballsRef.current.shift();
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    spawnBall(x, y);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    // Only spawn if dragging (buttons > 0 for mouse, touch always triggers if down)
    if (e.buttons > 0 || e.pointerType === 'touch') {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      // To prevent spawning too many too fast on drag, we can throttle or just spawn occasionally.
      // We'll spawn roughly every 3rd event or based on math random
      if (Math.random() > 0.6) {
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        spawnBall(x, y);
      }
    }
  };

  const clearBalls = () => {
    ballsRef.current = [];
  };

  const updatePhysics = (width: number, height: number) => {
    const balls = ballsRef.current;
    
    for (let i = 0; i < balls.length; i++) {
      const b = balls[i];
      
      // Apply gravity
      b.vy += gravity;
      
      // Update position
      b.x += b.vx;
      b.y += b.vy;
      
      // Floor collision
      if (b.y + b.radius > height) {
        b.y = height - b.radius;
        b.vy *= -restitution;
        // Friction on floor
        b.vx *= 0.98;
      }
      
      // Ceiling collision
      if (b.y - b.radius < 0) {
        b.y = b.radius;
        b.vy *= -restitution;
      }
      
      // Wall collisions
      if (b.x + b.radius > width) {
        b.x = width - b.radius;
        b.vx *= -restitution;
      } else if (b.x - b.radius < 0) {
        b.x = b.radius;
        b.vx *= -restitution;
      }
    }
  };

  const draw = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const balls = ballsRef.current;
    for (let i = 0; i < balls.length; i++) {
      const b = balls[i];
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
      ctx.fillStyle = b.color;
      ctx.fill();
      
      // Slight highlight for 3D effect
      ctx.beginPath();
      ctx.arc(b.x - b.radius * 0.3, b.y - b.radius * 0.3, b.radius * 0.2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.fill();
    }
  };

  const loop = () => {
    if (canvasRef.current && wrapperRef.current) {
      // Handle resizing cleanly
      const width = wrapperRef.current.clientWidth;
      const height = wrapperRef.current.clientHeight;
      if (canvasRef.current.width !== width || canvasRef.current.height !== height) {
        canvasRef.current.width = width;
        canvasRef.current.height = height;
      }
      
      updatePhysics(width, height);
      draw();
    }
    requestRef.current = requestAnimationFrame(loop);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(loop);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [gravity, restitution]); // Re-bind loop if physics settings change

  return (
    <div className="container animate-fade-in">
      <div className="gravity-container">
        
        <div className="gravity-header">
          <h1 className="gravity-title">{t('gravity.title')}</h1>
          <div className="gravity-controls">
            <div className="control-group">
              <label>Gravity ({gravity.toFixed(1)})</label>
              <input 
                type="range" 
                min="0" max="2" step="0.1" 
                value={gravity} 
                onChange={(e) => setGravity(parseFloat(e.target.value))} 
              />
            </div>
            <div className="control-group">
              <label>Bounce ({(restitution * 100).toFixed(0)}%)</label>
              <input 
                type="range" 
                min="0" max="1.2" step="0.1" 
                value={restitution} 
                onChange={(e) => setRestitution(parseFloat(e.target.value))} 
              />
            </div>
            <button className="gravity-btn" onClick={clearBalls}>
              Clear
            </button>
          </div>
        </div>

        <div className="gravity-canvas-wrapper" ref={wrapperRef}>
          <div className="gravity-hint">
            {language === 'ja' ? 'クリックして落とす' : 'Click/Tap to drop'}
          </div>
          <canvas
            ref={canvasRef}
            className="gravity-canvas"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
          />
        </div>

      </div>
    </div>
  );
};
