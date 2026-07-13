import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import './KitetsuBladeLuckGame.css';

type ThrowStatus = 'idle' | 'throwing' | 'slowmo' | 'miracle' | 'blunt' | 'cut';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  color: string;
  alpha: number;
  life: number;
}

export const KitetsuBladeLuckGame: React.FC = () => {
  const { language } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Status
  const [status, setStatus] = useState<ThrowStatus>('idle');

  // Sliders
  const [throwPower, setThrowPower] = useState<number>(18.5); // Initial upward velocity
  const [spinSpeed, setSpinSpeed] = useState<number>(7.2); // Rotational velocity rad/s

  const armImgRef = useRef<HTMLImageElement | null>(null);
  const bladeImgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const armImg = new Image();
    armImg.src = '/zoro_arm.png';
    armImg.onload = () => {
      armImgRef.current = armImg;
    };

    const bladeImg = new Image();
    bladeImg.src = '/kitetsu_blade.png';
    bladeImg.onload = () => {
      bladeImgRef.current = bladeImg;
    };
  }, []);

  // Physics animation state inside refs to avoid re-renders
  const physicsRef = useRef({
    bladeX: 505,
    bladeY: 260,
    vx: 0,
    vy: 0,
    rot: -Math.PI / 2,
    vrot: 0,
    armX1: 302,
    armX2: 707,
    armY: 290,
    armRadius: 45,
    isThrowing: false,
    isSlowMo: false,
    minDistDuringFall: 999,
    particles: [] as Particle[],
    cameraY: 0,
    maxAltitude: 0,
  });

  // Dynamic bilingual text helpers for manga bubble
  const getDisplayTitle = () => {
    if (status === 'cut') return language === 'ja' ? '流血切断…鬼徹の呪いに呑まれた！' : 'BLOODSHED! Sliced by the cursed blade Kitetsu!';
    if (status === 'blunt') return language === 'ja' ? '峰打ち打撲！刃の背中で弾かれセーフ！' : 'BLUNT HIT! Bounced off the spine safely!';
    if (status === 'miracle') return language === 'ja' ? '大成功！刃がするりと腕をすり抜けた！' : 'MIRACLE EVASION! The rotating blade slipped right through!';
    return '';
  };

  const getDisplayQuote = () => {
    if (status === 'cut') return language === 'ja' ? '「チッ…運の悪りィ日だぜ…」' : '"Tch... just my unlucky day..."';
    if (status === 'blunt') return language === 'ja' ? '「痛ェな…だが腕は繋がってやがる」' : '"Ouch... but the arm is still attached."';
    if (status === 'miracle') return language === 'ja' ? '「この刀……もらっていく！」' : '"I\'ll take this blade..."';
    return '';
  };

  // Trigger heart-beat / haptic shake when entering slow motion or landing
  const triggerHaptics = (pattern: number[]) => {
    if (typeof window !== 'undefined' && 'navigator' in window && navigator.vibrate) {
      try {
        navigator.vibrate(pattern);
      } catch {
        // Ignore if unsupported
      }
    }
  };

  // Launch single throw
  const launchThrow = () => {
    if (physicsRef.current.isThrowing) return;

    setStatus('throwing');
    triggerHaptics([30]);

    const p = physicsRef.current;
    p.bladeX = 505;
    p.bladeY = 260;
    p.vx = (Math.random() - 0.5) * 0.6;
    p.vy = -throwPower * 1.1;
    p.rot = -Math.PI / 2 + (Math.random() - 0.5) * 0.15;
    p.vrot = spinSpeed;
    p.isThrowing = true;
    p.isSlowMo = false;
    p.minDistDuringFall = 999;
    p.particles = [];
    p.cameraY = 0;
    p.maxAltitude = 0;

    // Burst launch aura particles
    for (let i = 0; i < 24; i++) {
      p.particles.push({
        x: p.bladeX,
        y: p.bladeY,
        vx: (Math.random() - 0.5) * 6,
        vy: -Math.random() * 8 - 2,
        r: Math.random() * 5 + 3,
        color: Math.random() > 0.4 ? '#a855f7' : '#f43f5e',
        alpha: 1,
        life: 1,
      });
    }
  };



  // Main Canvas Render & Physics Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const renderLoop = () => {
      const W = canvas.width;
      const H = canvas.height;
      const p = physicsRef.current;

      // Step physics
      if (p.isThrowing) {
        // Smooth camera tracking when blade rises high above normal screen height
        let targetCameraY = 0;
        if (p.bladeY < 150) {
          targetCameraY = p.bladeY - 150; // keep blade clearly visible 150px below top edge
        }
        targetCameraY = Math.min(0, targetCameraY); // Never track downwards below normal baseline!
        p.cameraY += (targetCameraY - p.cameraY) * 0.16;

        // Slow motion check: near arm during fall OR during vertical camera tracking up/down!
        const isNearArmFall = p.vy > 0 && Math.abs(p.bladeY - p.armY) <= 105;
        const isCameraMoving = Math.abs(p.cameraY) > 10 || p.bladeY < 155;

        if ((isNearArmFall || isCameraMoving) && !p.isSlowMo) {
          p.isSlowMo = true;
          setStatus('slowmo');
          if (isNearArmFall) triggerHaptics([40, 50, 40]);
        } else if (!isNearArmFall && !isCameraMoving && p.isSlowMo && p.bladeY > p.armY + 105) {
          p.isSlowMo = false;
          setStatus('throwing');
        }

        const dtScale = p.isSlowMo ? (isNearArmFall ? 0.18 : 0.25) : 1.0;
        p.vy += 0.45 * dtScale; // Gravity
        p.bladeX += p.vx * dtScale;
        p.bladeY += p.vy * dtScale;
        p.rot += p.vrot * 0.05 * dtScale;

        // Emit aura trailing particles
        if (Math.random() < (p.isSlowMo ? 0.8 : 0.4)) {
          p.particles.push({
            x: p.bladeX + (Math.random() - 0.5) * 30,
            y: p.bladeY + (Math.random() - 0.5) * 30,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            r: Math.random() * 4 + 2,
            color: p.isSlowMo ? '#ec4899' : '#a855f7',
            alpha: 0.85,
            life: 1,
          });
        }

        // Collision check while falling through the bare tattooed arm width [armX1, armX2]
        if (p.vy > 0 && Math.abs(p.bladeY - p.armY) <= 100 && p.bladeX >= p.armX1 && p.bladeX <= p.armX2) {
          const tipX = p.bladeX + Math.cos(p.rot) * 290;
          const tipY = p.bladeY + Math.sin(p.rot) * 290;

          const distTip = Math.abs(tipY - p.armY);
          if (distTip < p.minDistDuringFall) {
            p.minDistDuringFall = distTip;
          }

          // Check when blade center reaches the horizontal arm band (armY ± armRadius * 1.05)
          if (Math.abs(p.bladeY - p.armY) <= p.armRadius * 1.05) {
            const verticality = Math.abs(Math.sin(p.rot));
            const miracleThreshold = 0.66;

            if (verticality >= miracleThreshold) {
              // Slips through vertically without touching the arm! Keep falling smoothly!
            } else {
              // Collides with arm!
              p.isThrowing = false;
              p.isSlowMo = false;
              const sinR = Math.sin(p.rot);
              if (sinR > 0.05) {
                // Cut!
                setStatus('cut');
                triggerHaptics([80, 40, 150]);
                for (let i = 0; i < 40; i++) {
                  p.particles.push({
                    x: tipX,
                    y: tipY,
                    vx: (Math.random() - 0.5) * 12,
                    vy: (Math.random() - 0.5) * 12,
                    r: Math.random() * 6 + 3,
                    color: '#ef4444',
                    alpha: 1,
                    life: 1.2,
                  });
                }
              } else {
                // Blunt hit / bounce!
                setStatus('blunt');
                triggerHaptics([60, 40, 60]);
              }
            }
          }
        }

        // If blade slips safely past the arm and plunges deep downwards out of sight (y >= 680)
        if (p.isThrowing && p.bladeY >= 680) {
          p.isThrowing = false;
          p.isSlowMo = false;
          setStatus('miracle');
          triggerHaptics([40, 40, 40, 40, 120]);
        }
      } else {
        // Smoothly return camera to 0 when not throwing
        p.cameraY += (0 - p.cameraY) * 0.16;
      }

      // Update particles
      p.particles.forEach((pt) => {
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.alpha -= 0.02 / pt.life;
      });
      p.particles = p.particles.filter((pt) => pt.alpha > 0);

      // --- Draw Canvas ---
      ctx.clearRect(0, 0, W, H);

      // Background atmospheric glow (White background)
      const bgGrad = ctx.createRadialGradient(W / 2, H / 2, 50, W / 2, H / 2, W * 0.7);
      bgGrad.addColorStop(0, p.isSlowMo ? '#ffe4e6' : '#ffffff');
      bgGrad.addColorStop(1, p.isSlowMo ? '#fff1f2' : '#f8fafc');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, W, H);

      // --- Apply Vertical Camera Pan for High Altitude Throws ---
      ctx.save();
      ctx.translate(0, -p.cameraY);

      // Draw Altitude Guide Lines and Numbers across background sky showing rising height
      if (p.isThrowing || p.cameraY < -10 || p.bladeY < 200) {
        ctx.save();
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.45)';
        ctx.lineWidth = 1.2;
        ctx.setLineDash([8, 6]);
        ctx.font = 'bold 13px sans-serif';
        ctx.fillStyle = '#64748b';

        // Draw horizontal height markers every 5 meters up from start Y=260
        for (let alt = 5; alt <= 50; alt += 5) {
          const lineY = 260 - alt * 25;
          if (lineY > p.cameraY - 50 && lineY < p.cameraY + H + 50) {
            ctx.beginPath();
            ctx.moveTo(20, lineY);
            ctx.lineTo(W - 20, lineY);
            ctx.stroke();
            const text = language === 'ja' ? `── 高度 +${alt}m ──` : `── ALT +${alt}m ──`;
            ctx.fillText(text, W - 145, lineY - 6);
          }
        }
        ctx.restore();
      }

      // Draw Zoro's outstretched Left Arm Image
      ctx.save();
      if (armImgRef.current && armImgRef.current.complete) {
        ctx.drawImage(armImgRef.current, 25, p.armY - 220, 750, 435);
      } else {
        // Fallback if image still loading
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.roundRect(p.armX1, p.armY - p.armRadius, p.armX2 - p.armX1, p.armRadius * 2, p.armRadius);
        ctx.fill();
      }
      ctx.restore();

      // Draw Particles
      p.particles.forEach((pt) => {
        ctx.save();
        ctx.globalAlpha = Math.max(0, pt.alpha);
        ctx.fillStyle = pt.color;
        ctx.shadowColor = pt.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Draw Cursed Katana Image (Sandai Kitetsu - Transparent background, scaled precisely to 400x72)
      ctx.save();
      ctx.translate(p.bladeX, p.bladeY);
      ctx.rotate(p.rot);

      // Cursed purple aura glow around blade image
      ctx.shadowColor = status === 'slowmo' ? '#ec4899' : '#a855f7';
      ctx.shadowBlur = status === 'slowmo' ? 25 : 12;

      if (bladeImgRef.current && bladeImgRef.current.complete) {
        // Draw 1024x184 katana image scaled to width=400, height=72
        ctx.drawImage(bladeImgRef.current, -88, -25, 400, 72);
      } else {
        // Fallback if image still loading
        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(-15, -4, 90, 8);
        ctx.fillStyle = '#7f1d1d';
        ctx.fillRect(-65, -5, 50, 10);
      }
      ctx.restore();

      // Restore camera space
      ctx.restore();

      // Slow Motion Screen Border Flash
      if (p.isSlowMo) {
        ctx.strokeStyle = 'rgba(236, 72, 153, 0.7)';
        ctx.lineWidth = 8;
        ctx.strokeRect(4, 4, W - 8, H - 8);
      }

      animId = requestAnimationFrame(renderLoop);
    };

    animId = requestAnimationFrame(renderLoop);
    return () => cancelAnimationFrame(animId);
  }, [status, language]);

  return (
    <div className="kitetsu-game-container">
      {/* Header */}
      <header className="kitetsu-header">
        <div className="kitetsu-header-top">
          <div className="kitetsu-title-wrapper">
            <div>
              <h1 className="kitetsu-title">
                {language === 'ja'
                  ? '妖刀すり抜けシミュレーター'
                  : 'Cursed Katana Evasion Simulator'}
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <div className="kitetsu-main-grid">
        {/* Left: Canvas Area */}
        <div className="kitetsu-canvas-card">
          <div className="kitetsu-canvas-wrapper">
            <canvas ref={canvasRef} width={800} height={580} className="kitetsu-canvas" />

            {/* Manga-style Speech Bubble right on the arm canvas screen */}
            {status !== 'idle' && status !== 'throwing' && status !== 'slowmo' && (
              <div className={`kitetsu-manga-bubble ${status}`}>
                <div className="kitetsu-manga-bubble-content">
                  <div className="kitetsu-bubble-title">{getDisplayTitle()}</div>
                  <div className="kitetsu-bubble-quote">{getDisplayQuote()}</div>
                </div>
                <div className="kitetsu-manga-bubble-tail" />
              </div>
            )}
          </div>
        </div>

        {/* Right: Controls Panel */}
        <div className="kitetsu-controls-card">
          <h3 className="kitetsu-section-title">
            <span>{language === 'ja' ? '投擲パラメータ設定' : 'Throw Parameters'}</span>
          </h3>

          {/* Slider 1: Throw Power */}
          <div className="kitetsu-slider-group">
            <div className="kitetsu-slider-label">
              <span>{language === 'ja' ? '投げの強さ・高さ (初速)' : 'Upward Launch Power'}</span>
              <span className="kitetsu-slider-value">{throwPower.toFixed(1)} m/s</span>
            </div>
            <input
              type="range"
              min={12}
              max={26}
              step={0.5}
              value={throwPower}
              onChange={(e) => setThrowPower(parseFloat(e.target.value))}
              disabled={status === 'throwing' || status === 'slowmo'}
              className="kitetsu-slider"
            />
          </div>

          {/* Slider 2: Spin Speed */}
          <div className="kitetsu-slider-group">
            <div className="kitetsu-slider-label">
              <span>{language === 'ja' ? '刀の回転スピード (角速度)' : 'Blade Spin Velocity'}</span>
              <span className="kitetsu-slider-value">{spinSpeed.toFixed(1)} rad/s</span>
            </div>
            <input
              type="range"
              min={1.0}
              max={18.0}
              step={0.2}
              value={spinSpeed}
              onChange={(e) => setSpinSpeed(parseFloat(e.target.value))}
              disabled={status === 'throwing' || status === 'slowmo'}
              className="kitetsu-slider"
            />
          </div>

          {/* Launch Button */}
          <button
            className="kitetsu-launch-btn"
            onClick={launchThrow}
            disabled={status === 'throwing' || status === 'slowmo'}
          >
            <span>{language === 'ja' ? '妖刀を天に放つ！' : 'Toss Cursed Katana Into Air!'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
