import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import './InfiniteJumperGame.css';

interface Platform {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'grass' | 'desert' | 'space' | 'lava' | 'cloud' | 'brick';
}

interface MysteryBlock {
  id: string;
  x: number;
  y: number;
  hit: boolean;
  reward: 'coin_bag' | 'star' | 'heart';
}

interface Coin {
  id: string;
  x: number;
  y: number;
  collected: boolean;
}

interface Enemy {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'shroom' | 'turtle' | 'fire';
  dir: number; // -1 or 1
  minX: number;
  maxX: number;
  alive: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  alpha: number;
  size: number;
}

export const InfiniteJumperGame: React.FC = () => {
  const { language } = useLanguage();

  // Game UI States
  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameover'>('start');
  const [distance, setDistance] = useState<number>(0);
  const [coins, setCoins] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [invincibleSec, setInvincibleSec] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      return Number(localStorage.getItem('infinite_mario_highscore')) || 0;
    } catch {
      return 0;
    }
  });

  // Canvas Ref & Physics Game State Ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animIdRef = useRef<number | null>(null);

  const worldRef = useRef<{
    cameraX: number;
    scrollSpeed: number;
    lastRightX: number;
    stageTheme: 'grass' | 'desert' | 'space' | 'lava';
    hero: {
      x: number;
      y: number;
      vy: number;
      width: number;
      height: number;
      jumpsLeft: number;
      invincibleTime: number;
      hurtTime: number;
      animFrame: number;
    };
    platforms: Platform[];
    mysteryBlocks: MysteryBlock[];
    coins: Coin[];
    enemies: Enemy[];
    particles: Particle[];
  }>({
    cameraX: 0,
    scrollSpeed: 5.5,
    lastRightX: 0,
    stageTheme: 'grass',
    hero: {
      x: 150,
      y: 330,
      vy: 0,
      width: 38,
      height: 48,
      jumpsLeft: 2,
      invincibleTime: 0,
      hurtTime: 0,
      animFrame: 0
    },
    platforms: [],
    mysteryBlocks: [],
    coins: [],
    enemies: [],
    particles: []
  });

  // Save High Score
  useEffect(() => {
    if (distance > highScore) {
      setHighScore(distance);
      try {
        localStorage.setItem('infinite_mario_highscore', String(distance));
      } catch (e) {
        console.error(e);
      }
    }
  }, [distance, highScore]);

  // Jump Action
  const handleJump = useCallback(() => {
    if (gameState !== 'playing') {
      if (gameState === 'start' || gameState === 'gameover') {
        startGame();
      }
      return;
    }

    const hero = worldRef.current.hero;
    if (hero.jumpsLeft > 0) {
      hero.vy = -13.8;
      hero.jumpsLeft -= 1;

      // Spawn jump dust particles
      const particles = worldRef.current.particles;
      for (let i = 0; i < 6; i++) {
        particles.push({
          x: hero.x + worldRef.current.cameraX + hero.width / 2,
          y: hero.y + hero.height,
          vx: (Math.random() - 0.5) * 5,
          vy: Math.random() * -3 - 1,
          color: '#ffffff',
          alpha: 1,
          size: Math.random() * 5 + 3
        });
      }
    }
  }, [gameState]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        handleJump();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleJump]);

  // Generate World Chunks
  const generateChunk = (startX: number) => {
    const world = worldRef.current;
    let currX = startX;

    // Determine theme based on camera X distance
    const distMeters = Math.floor(world.cameraX / 10);
    let theme: 'grass' | 'desert' | 'space' | 'lava' = 'grass';
    if (distMeters >= 1500) theme = 'lava';
    else if (distMeters >= 1000) theme = 'space';
    else if (distMeters >= 500) theme = 'desert';
    world.stageTheme = theme;

    for (let i = 0; i < 4; i++) {
      const pWidth = Math.floor(Math.random() * 200) + 180;
      const pY = Math.floor(Math.random() * 80) + 310; // floor platform

      world.platforms.push({
        id: `p-${currX}-${i}`,
        x: currX,
        y: pY,
        width: pWidth,
        height: 180,
        type: theme
      });

      // Spawn floating step platform above sometimes
      if (Math.random() < 0.6) {
        const floatW = Math.floor(Math.random() * 80) + 90;
        const floatY = pY - (Math.floor(Math.random() * 50) + 100);
        world.platforms.push({
          id: `fp-${currX}-${i}`,
          x: currX + Math.floor((pWidth - floatW) / 2),
          y: floatY,
          width: floatW,
          height: 24,
          type: 'cloud'
        });

        // Coins on floating platform
        for (let c = 0; c < 3; c++) {
          world.coins.push({
            id: `fc-${currX}-${c}-${Math.random()}`,
            x: currX + Math.floor((pWidth - floatW) / 2) + 20 + c * 25,
            y: floatY - 28,
            collected: false
          });
        }
      } else {
        // Coin arc on main platform
        for (let c = 0; c < 4; c++) {
          world.coins.push({
            id: `c-${currX}-${c}-${Math.random()}`,
            x: currX + 40 + c * 35,
            y: pY - 35 - Math.sin((c / 3) * Math.PI) * 40,
            collected: false
          });
        }
      }

      // Mystery Question Block
      if (Math.random() < 0.45) {
        const blockX = currX + Math.floor(pWidth * 0.4);
        const blockY = pY - 110;
        const randItem = Math.random();
        const reward: 'coin_bag' | 'star' | 'heart' =
          randItem < 0.65 ? 'coin_bag' : randItem < 0.85 ? 'star' : 'heart';

        world.mysteryBlocks.push({
          id: `mb-${currX}-${Math.random()}`,
          x: blockX,
          y: blockY,
          hit: false,
          reward
        });
      }

      // Spawn Enemy on platform
      if (Math.random() < 0.65 && pWidth > 150 && i > 0) {
        const eType: 'shroom' | 'turtle' | 'fire' =
          theme === 'lava' ? 'fire' : Math.random() < 0.7 ? 'shroom' : 'turtle';

        world.enemies.push({
          id: `e-${currX}-${Math.random()}`,
          x: currX + pWidth - 60,
          y: eType === 'turtle' ? pY - 70 : pY - 36,
          width: 36,
          height: 36,
          type: eType,
          dir: -1,
          minX: currX + 20,
          maxX: currX + pWidth - 20,
          alive: true
        });
      }

      // Gap between platforms
      const gap = Math.floor(Math.random() * 80) + 85 + Math.min(65, Math.floor(world.scrollSpeed * 5));
      currX += pWidth + gap;
    }

    world.lastRightX = currX;
  };

  // Start Game Function
  const startGame = () => {
    const world = worldRef.current;
    world.cameraX = 0;
    world.scrollSpeed = 5.5;
    world.lastRightX = 0;
    world.stageTheme = 'grass';
    world.platforms = [];
    world.mysteryBlocks = [];
    world.coins = [];
    world.enemies = [];
    world.particles = [];

    // Initial safe start platforms
    world.platforms.push({
      id: 'start-p0',
      x: 0,
      y: 380,
      width: 480,
      height: 180,
      type: 'grass'
    });
    world.lastRightX = 480;
    generateChunk(480);

    world.hero = {
      x: 140,
      y: 332,
      vy: 0,
      width: 38,
      height: 48,
      jumpsLeft: 2,
      invincibleTime: 0,
      hurtTime: 0,
      animFrame: 0
    };

    setDistance(0);
    setCoins(0);
    setLives(3);
    setInvincibleSec(0);
    setGameState('playing');
  };

  // Main Physics & Render Loop
  useEffect(() => {
    if (gameState !== 'playing') {
      if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
      return;
    }

    const ctx = canvasRef.current?.getContext('2d');
    let lastTime = performance.now();

    const loop = (now: number) => {
      if (!ctx || !canvasRef.current) return;
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      const world = worldRef.current;
      const hero = world.hero;
      const width = canvasRef.current.width;
      const height = canvasRef.current.height;

      // 1. Advance Camera & Speed
      world.cameraX += world.scrollSpeed;
      world.scrollSpeed = Math.min(11.5, world.scrollSpeed + 0.0006);
      hero.animFrame += 0.2;

      // Update UI stats roughly
      setDistance(Math.floor(world.cameraX / 10));

      // Check timers
      if (hero.invincibleTime > 0) {
        hero.invincibleTime = Math.max(0, hero.invincibleTime - dt);
        setInvincibleSec(Number(hero.invincibleTime.toFixed(1)));
      } else {
        setInvincibleSec(0);
      }
      if (hero.hurtTime > 0) {
        hero.hurtTime = Math.max(0, hero.hurtTime - dt);
      }

      // 2. Generate new chunk ahead if needed
      if (world.lastRightX - world.cameraX < width + 600) {
        generateChunk(world.lastRightX);
      }

      // 3. Clean up objects too far behind camera
      world.platforms = world.platforms.filter((p) => p.x + p.width - world.cameraX > -200);
      world.coins = world.coins.filter((c) => c.x - world.cameraX > -200);
      world.mysteryBlocks = world.mysteryBlocks.filter((b) => b.x - world.cameraX > -200);
      world.enemies = world.enemies.filter((e) => e.x - world.cameraX > -200 && e.y < height + 100);

      // 4. Hero Physics
      hero.vy += 0.68; // Gravity
      hero.y += hero.vy;

      // Platform Collisions
      if (hero.vy >= 0) {
        const heroBottom = hero.y + hero.height;
        const heroXWorld = hero.x + world.cameraX;

        world.platforms.forEach((p) => {
          // Check horizontal overlap
          if (heroXWorld + hero.width - 8 > p.x && heroXWorld + 8 < p.x + p.width) {
            // Check vertical landing from above
            if (heroBottom >= p.y && heroBottom - hero.vy <= p.y + 14) {
              hero.y = p.y - hero.height;
              hero.vy = 0;
              hero.jumpsLeft = 2;
            }
          }
        });
      }

      // Check Bottomless Pit Fall
      if (hero.y > height + 50) {
        // Fell down pit!
        setLives((prev) => {
          const n = prev - 1;
          if (n <= 0) {
            setGameState('gameover');
          } else {
            // Respawn hero safely on nearest platform or mid-air with jump
            hero.y = 120;
            hero.vy = -5;
            hero.jumpsLeft = 2;
            hero.hurtTime = 2.0;
          }
          return n;
        });
      }

      // 5. Coin Collisions
      const heroXWorld = hero.x + world.cameraX;
      world.coins.forEach((c) => {
        if (!c.collected) {
          const dist = Math.hypot(heroXWorld + hero.width / 2 - c.x, hero.y + hero.height / 2 - c.y);
          if (dist < 32) {
            c.collected = true;
            setCoins((prev) => {
              const nextCoins = prev + 1;
              if (nextCoins % 100 === 0) {
                setLives((l) => l + 1);
              }
              return nextCoins;
            });

            // Sparkle particles
            for (let i = 0; i < 8; i++) {
              world.particles.push({
                x: c.x,
                y: c.y,
                vx: (Math.random() - 0.5) * 6,
                vy: (Math.random() - 0.5) * 6,
                color: '#fbbf24',
                alpha: 1,
                size: Math.random() * 4 + 3
              });
            }
          }
        }
      });

      // 6. Mystery Block Collisions (Hitting bottom while jumping up)
      if (hero.vy < 0) {
        world.mysteryBlocks.forEach((b) => {
          if (!b.hit) {
            if (heroXWorld + hero.width > b.x && heroXWorld < b.x + 36) {
              if (hero.y <= b.y + 36 && hero.y - hero.vy >= b.y + 30) {
                b.hit = true;
                hero.vy = 3; // bounce back down

                if (b.reward === 'coin_bag') {
                  setCoins((prev) => prev + 10);
                } else if (b.reward === 'star') {
                  hero.invincibleTime = 8.0;
                } else if (b.reward === 'heart') {
                  setLives((l) => l + 1);
                }

                // Reward particles
                for (let i = 0; i < 15; i++) {
                  world.particles.push({
                    x: b.x + 18,
                    y: b.y,
                    vx: (Math.random() - 0.5) * 8,
                    vy: Math.random() * -6 - 2,
                    color: b.reward === 'star' ? '#ec4899' : '#fbbf24',
                    alpha: 1,
                    size: Math.random() * 6 + 4
                  });
                }
              }
            }
          }
        });
      }

      // 7. Enemy Movement & Collisions
      world.enemies.forEach((e) => {
        if (!e.alive) return;
        e.x += e.dir * 1.8;
        if (e.x < e.minX) { e.x = e.minX; e.dir = 1; }
        if (e.x > e.maxX) { e.x = e.maxX; e.dir = -1; }

        // Collision check with Hero
        if (
          heroXWorld + hero.width - 6 > e.x &&
          heroXWorld + 6 < e.x + e.width &&
          hero.y + hero.height - 6 > e.y &&
          hero.y + 6 < e.y + e.height
        ) {
          if (hero.invincibleTime > 0) {
            // Invincible Crush!
            e.alive = false;
            setCoins((prev) => prev + 5);
          } else if (hero.vy > 1.2 && hero.y + hero.height - hero.vy <= e.y + 16) {
            // Stomp on top!
            e.alive = false;
            hero.vy = -10.5; // bounce up
            hero.jumpsLeft = 1;
            setCoins((prev) => prev + 3);

            // Stomp particles
            for (let i = 0; i < 10; i++) {
              world.particles.push({
                x: e.x + e.width / 2,
                y: e.y + e.height / 2,
                vx: (Math.random() - 0.5) * 6,
                vy: (Math.random() - 0.5) * 6,
                color: '#ef4444',
                alpha: 1,
                size: Math.random() * 5 + 3
              });
            }
          } else if (hero.hurtTime <= 0) {
            // Side damage!
            hero.hurtTime = 1.5;
            hero.vy = -7;
            setLives((l) => {
              const n = l - 1;
              if (n <= 0) setGameState('gameover');
              return n;
            });
          }
        }
      });

      // 8. Update Particles
      world.particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.035;
        if (p.alpha <= 0) world.particles.splice(idx, 1);
      });

      // ==================== RENDERING ====================
      // Clear screen based on stage theme
      const themeColors = {
        grass: ['#38bdf8', '#bae6fd'],
        desert: ['#f97316', '#fef08a'],
        space: ['#0f172a', '#1e1b4b'],
        lava: ['#450a0a', '#7f1d1d']
      };
      const [topColor, botColor] = themeColors[world.stageTheme];
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, topColor);
      bgGrad.addColorStop(1, botColor);
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Draw background clouds / stars
      if (world.stageTheme === 'space') {
        ctx.fillStyle = '#ffffff';
        for (let i = 0; i < 20; i++) {
          const sx = ((i * 123 + world.cameraX * 0.1) % width);
          const sy = (i * 47) % 300;
          ctx.fillRect(sx, sy, 2, 2);
        }
      } else {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
        for (let i = 0; i < 6; i++) {
          const cx = ((i * 280 - world.cameraX * 0.3) % (width + 300)) - 100;
          const cy = 50 + (i * 35) % 120;
          ctx.beginPath();
          ctx.arc(cx, cy, 35, 0, Math.PI * 2);
          ctx.arc(cx + 30, cy - 10, 45, 0, Math.PI * 2);
          ctx.arc(cx + 65, cy, 35, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Save canvas context to apply camera offset
      ctx.save();
      ctx.translate(-world.cameraX, 0);

      // Draw Platforms
      world.platforms.forEach((p) => {
        if (p.type === 'cloud') {
          ctx.fillStyle = '#f8fafc';
          ctx.beginPath();
          ctx.roundRect(p.x, p.y, p.width, p.height, 12);
          ctx.fill();
          ctx.strokeStyle = '#cbd5e1';
          ctx.lineWidth = 2;
          ctx.stroke();
        } else {
          // Main ground/brick platforms
          ctx.fillStyle = p.type === 'desert' ? '#d97706' : p.type === 'lava' ? '#262626' : p.type === 'space' ? '#312e81' : '#15803d';
          ctx.fillRect(p.x, p.y, p.width, p.height);

          // Top grass/border layer
          ctx.fillStyle = p.type === 'desert' ? '#fbbf24' : p.type === 'lava' ? '#ef4444' : p.type === 'space' ? '#6366f1' : '#22c55e';
          ctx.fillRect(p.x, p.y, p.width, 16);
        }
      });

      // Draw Mystery Blocks
      world.mysteryBlocks.forEach((b) => {
        ctx.fillStyle = b.hit ? '#64748b' : '#f59e0b';
        ctx.beginPath();
        ctx.roundRect(b.x, b.y, 36, 36, 8);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 22px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(b.hit ? '✕' : '❓', b.x + 18, b.y + 18);
      });

      // Draw Coins
      world.coins.forEach((c) => {
        if (!c.collected) {
          ctx.fillStyle = '#fbbf24';
          ctx.beginPath();
          ctx.arc(c.x, c.y, 12, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#d97706';
          ctx.lineWidth = 2.5;
          ctx.stroke();

          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 12px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('$', c.x, c.y);
        }
      });

      // Draw Enemies
      world.enemies.forEach((e) => {
        if (!e.alive) return;
        ctx.save();
        ctx.translate(e.x + e.width / 2, e.y + e.height / 2);
        if (e.dir > 0) ctx.scale(-1, 1); // Flip facing

        ctx.font = '32px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(e.type === 'fire' ? '🔥' : e.type === 'turtle' ? '🐢' : '🍄', 0, 0);
        ctx.restore();
      });

      // Draw Particles
      world.particles.forEach((p) => {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1.0;

      // Draw Hero (Taku-Mario)
      ctx.restore(); // restore camera X to draw hero at fixed screen position x=140
      if (hero.hurtTime <= 0 || Math.floor(hero.hurtTime * 10) % 2 === 0) {
        ctx.save();
        ctx.translate(140 + hero.width / 2, hero.y + hero.height / 2);

        // Rainbow aura when invincible
        if (hero.invincibleTime > 0) {
          ctx.shadowColor = '#fbbf24';
          ctx.shadowBlur = 18;
        }

        // Draw Mario sprite using canvas shapes or cute emoji avatar
        ctx.font = '40px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const isAir = hero.vy < -1 || hero.vy > 1;
        ctx.fillText(isAir ? '🚀' : '🏃‍♂️', 0, 0);
        ctx.restore();
      }

      animIdRef.current = requestAnimationFrame(loop);
    };

    animIdRef.current = requestAnimationFrame(loop);
    return () => {
      if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
    };
  }, [gameState]);

  // Determine Title / Rank based on distance
  const getAdventurerRank = () => {
    if (distance >= 2000) return language === 'ja' ? '👑 無限スクロールの伝説神マリオ' : '👑 Infinite Scroll Legend';
    if (distance >= 1200) return language === 'ja' ? '🚀 大陸横断スーパーアスリート' : '🚀 Super Transcontinental Athlete';
    if (distance >= 600) return language === 'ja' ? '🌟 一騎当千の大冒険ランナー' : '🌟 Veteran Adventure Runner';
    return language === 'ja' ? '🍄 草原のお散歩ランナー' : '🍄 Rookie Hills Runner';
  };

  return (
    <div className="infinite-jumper-container animate-fade-in">
      <div className="infinite-header">
        <h1 className="infinite-title">
          {language === 'ja' ? '無限ラン＆ジャンプ：インフィニティ・マリオ' : 'Infinite Runner: Super Mario Jumper'}
        </h1>
        <p className="infinite-subtitle">
          {language === 'ja'
            ? '横スクロールの無限に続く自動生成世界を走り続けよう！スペースキーやタップで二段ジャンプ＆敵を踏んで自己ベスト距離を目指せ！'
            : 'Run and double-jump across an endless procedurally generated side-scrolling world! Stomp monsters and collect coins.'}
        </p>
      </div>

      <div className="infinite-stage-card animate-fade-in">
        {/* Top HUD Bar */}
        <div className="infinite-hud">
          <div className="hud-group">
            <div className="hud-stat">
              <span className="hud-stat-label">{language === 'ja' ? '移動距離' : 'DISTANCE'}</span>
              <span className="hud-stat-value distance">🏃 {distance} m</span>
            </div>

            <div className="hud-stat">
              <span className="hud-stat-label">{language === 'ja' ? 'コイン数' : 'COINS'}</span>
              <span className="hud-stat-value coins">🪙 {coins}</span>
            </div>
          </div>

          <div className="hud-group">
            {invincibleSec > 0 && (
              <div className="hud-invincible-badge">
                🌟 {language === 'ja' ? `無敵スターモード: ${invincibleSec}秒` : `INVINCIBLE: ${invincibleSec}s`}
              </div>
            )}

            <div className="hud-stat">
              <span className="hud-stat-label">{language === 'ja' ? 'ライフ' : 'LIVES'}</span>
              <div className="hud-lives">
                {Array.from({ length: Math.max(0, lives) }).map(() => '❤️').join('') || '💔'}
              </div>
            </div>
          </div>
        </div>

        {/* Canvas Stage */}
        <div className="infinite-canvas-wrapper" onClick={handleJump}>
          <canvas
            ref={canvasRef}
            width={860}
            height={480}
            className="infinite-canvas"
          />

          {/* Start & Game Over Overlay Cards */}
          {gameState !== 'playing' && (
            <div className="infinite-modal-overlay">
              <div className="infinite-modal-card">
                <h2 className="modal-title">
                  {gameState === 'start'
                    ? (language === 'ja' ? '無限スクロール冒険へ' : 'Infinite Mario Runner')
                    : (language === 'ja' ? 'ゲームオーバー…！' : 'GAME OVER')}
                </h2>
                <p className="modal-subtitle">
                  {gameState === 'start'
                    ? (language === 'ja' ? 'スペースキー / 上キー / W または画面タップでジャンプ！空中で二回押すと二段ジャンプを発動できます。' : 'Press Space / Up / W or Tap screen to Jump! Double-tap for Double Jump.')
                    : (language === 'ja' ? '素晴らしいランでした！あなたの冒険記録を振り返りましょう。' : 'Great run! Here are your final adventure statistics.')}
                </p>

                <div className="modal-result-box">
                  <div className="result-row">
                    <span>{language === 'ja' ? '到達した移動距離' : 'Distance Run'}:</span>
                    <span className="result-highlight">🏃 {distance} m</span>
                  </div>
                  <div className="result-row">
                    <span>{language === 'ja' ? '獲得したコイン数' : 'Coins Collected'}:</span>
                    <span className="result-highlight" style={{ color: '#fbbf24' }}>🪙 {coins}枚</span>
                  </div>
                  <div className="result-row">
                    <span>{language === 'ja' ? '自己ベスト最高記録' : 'Personal High Score'}:</span>
                    <span className="result-highlight" style={{ color: '#34d399' }}>👑 {Math.max(highScore, distance)} m</span>
                  </div>

                  {gameState === 'gameover' && (
                    <div className="result-rank-title">
                      {getAdventurerRank()}
                    </div>
                  )}
                </div>

                <button className="modal-start-btn" onClick={startGame}>
                  {gameState === 'start'
                    ? (language === 'ja' ? '🍄 冒険をスタート！ (Space / タップ)' : '🍄 Start Adventure!')
                    : (language === 'ja' ? '🔄 もう一度挑戦する！' : '🔄 Try Again!')}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Controls Hint Bar */}
        <div className="infinite-controls-bar">
          <div className="controls-hint">
            <span>🎮 {language === 'ja' ? '操作方法:' : 'Controls:'}</span>
            <span className="kbd-badge">Space / W / ⬆️</span>
            <span>{language === 'ja' ? 'ジャンプ (空中で2回押して二段ジャンプ ✨)' : 'Jump (Press twice for Double Jump ✨)'}</span>
          </div>

          <button className="jump-action-btn" onClick={handleJump}>
            ⬆️ {language === 'ja' ? 'ジャンプする！ (タップ)' : 'JUMP!'}
          </button>
        </div>
      </div>
    </div>
  );
};
