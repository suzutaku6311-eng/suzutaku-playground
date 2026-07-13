import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import './DorayakiBaibainGame.css';

interface DebrisPiece {
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
  rot: number;
  vrot: number;
  color: string;
}

export const DorayakiBaibainGame: React.FC = () => {
  const { language } = useLanguage();

  // Exponential growth state
  const [doublings, setDoublings] = useState<number>(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Array<{ x: number; y: number; vx: number; vy: number; r: number; rot: number; vrot: number; angle?: number; dist?: number; speed?: number; settled?: boolean; doublingStep?: number; targetFloorY?: number }>>([]);
  const earthImgRef = useRef<HTMLImageElement | null>(null);
  const fujiImgRef = useRef<HTMLImageElement | null>(null);
  const roomImgRef = useRef<HTMLImageElement | null>(null);
  const collapseFrameRef = useRef<number>(0);
  const debrisRef = useRef<DebrisPiece[]>([]);
  const eruptionFrameRef = useRef<number>(0);
  const eruptionParticlesRef = useRef<Array<{ x: number; y: number; vx: number; vy: number; r: number; rot: number; vrot: number; color?: string; isLava?: boolean; doublingStep?: number }>>([]);

  useEffect(() => {
    const imgEarth = new Image();
    imgEarth.src = '/real_earth.jpg';
    imgEarth.onload = () => { earthImgRef.current = imgEarth; };

    const imgFuji = new Image();
    imgFuji.src = '/red_fuji.jpg';
    imgFuji.onload = () => { fujiImgRef.current = imgFuji; };

    const imgRoom = new Image();
    imgRoom.src = '/nobita_room.png';
    imgRoom.onload = () => { roomImgRef.current = imgRoom; };
  }, []);

  // Calculate actual count as bigint / float
  const getDorayakiCount = (n: number): number => {
    return Math.pow(2, n);
  };

  const count = getDorayakiCount(doublings);

  // Format gigantic numbers nicely
  const formatCount = (val: number): string => {
    if (val < 1e6) return val.toLocaleString();
    if (language === 'en') {
      if (val < 1e9) return `${(val / 1e6).toFixed(2)} Million`;
      if (val < 1e12) return `${(val / 1e9).toFixed(2)} Billion`;
      if (val < 1e15) return `${(val / 1e12).toFixed(2)} Trillion`;
      if (val < 1e18) return `${(val / 1e15).toFixed(2)} Quadrillion`;
      if (val < 1e21) return `${(val / 1e18).toFixed(2)} Quintillion`;
      if (val < 1e24) return `${(val / 1e21).toFixed(2)} Sextillion`;
      return val.toExponential(3);
    } else {
      // Japanese units: 万, 億, 兆, 京, 垓, 𥝱, 穣, 溝, 澗, 正, 載, 極, 恒河沙, 阿僧祇, 那由他, 不可思議, 無量大数
      if (val < 1e8) return `${(val / 1e4).toFixed(2)} 万`;
      if (val < 1e12) return `${(val / 1e8).toFixed(2)} 億`;
      if (val < 1e16) return `${(val / 1e12).toFixed(2)} 兆`;
      if (val < 1e20) return `${(val / 1e16).toFixed(2)} 京`;
      if (val < 1e24) return `${(val / 1e20).toFixed(2)} 垓`;
      if (val < 1e28) return `${(val / 1e24).toFixed(2)} 𥝱 (じょ)`;
      if (val < 1e32) return `${(val / 1e28).toFixed(2)} 穣 (じょう)`;
      if (val < 1e36) return `${(val / 1e32).toFixed(2)} 溝 (こう)`;
      if (val < 1e40) return `${(val / 1e36).toFixed(2)} 澗 (かん)`;
      if (val < 1e44) return `${(val / 1e40).toFixed(2)} 正 (せい)`;
      if (val < 1e48) return `${(val / 1e44).toFixed(2)} 載 (さい)`;
      if (val < 1e52) return `${(val / 1e48).toFixed(2)} 極 (ごく)`;
      if (val < 1e56) return `${(val / 1e52).toFixed(2)} 恒河沙`;
      if (val < 1e60) return `${(val / 1e56).toFixed(2)} 阿僧祇`;
      if (val < 1e64) return `${(val / 1e60).toFixed(2)} 那由他`;
      if (val < 1e68) return `${(val / 1e64).toFixed(2)} 不可思議`;
      if (val < 1e72) return `${(val / 1e68).toFixed(2)} 無量大数`;
      return val.toExponential(3);
    }
  };

  // When Double button is clicked (doublings increments), drop an exact exponential burst (`1回目は2粒, 2回目は4粒...`)!
  useEffect(() => {
    if (doublings === 0) {
      // At doublings = 0 (1 pancake), start with exactly 1 dorayaki falling right onto the center of the kotatsu table
      const canvas = canvasRef.current;
      const W = canvas ? canvas.width : 1200;
      particlesRef.current = [{
        x: W / 2,
        y: -25,
        vx: 0,
        vy: 3,
        r: 16,
        rot: 0,
        vrot: 0.02,
        settled: false,
        doublingStep: 0,
      }];
      return;
    }
    const canvas = canvasRef.current;
    const W = canvas ? canvas.width : 1200;
    const H = canvas ? canvas.height : 800;
    
    const exactCount = Math.pow(2, doublings);
    const burstCount = Math.min(exactCount, 160);

    const newParticles = [];
    for (let i = 0; i < burstCount; i++) {
      const depthT = Math.pow(Math.random(), 0.75);
      // Strictly restrict targetFloorY to the actual flat floor (from near image center H-220 down to bottom H-16) so particles never float on walls!
      const targetFloorY = doublings <= 21 ? (H - 220 + depthT * 204) : undefined;
      const radius = doublings <= 20 ? ((11 + Math.random() * 5) * (0.68 + 0.32 * depthT)) : (12 + Math.random() * 4);
      // Calculate trapezoidal floor bounds (`台形`) at this particle's depth so it falls strictly inside the room floor!
      const minX = doublings <= 21 ? (40 + (1 - depthT) * (W * 0.26)) : 50;
      const maxX = doublings <= 21 ? ((W - 40) - (1 - depthT) * (W * 0.26)) : (W - 50);
      newParticles.push({
        x: Math.random() * (maxX - minX) + minX,
        y: -15 - (i * 10) - Math.random() * (burstCount * 3 + 30),
        vx: (Math.random() - 0.5) * 4.0,
        vy: Math.random() * 4 + 4.8,
        r: radius,
        rot: (Math.random() - 0.5) * 0.4,
        vrot: (Math.random() - 0.5) * 0.12,
        settled: false,
        doublingStep: doublings,
        targetFloorY,
      });
    }

    if (doublings === 21) {
      collapseFrameRef.current = 0;
      const newDebris: DebrisPiece[] = [];
      const colors = ['#4E342E', '#654321', '#A16207', '#D6CEBE', '#10B981', '#3B82F6', '#D32F2F', '#E6DFD3', '#93C5FD', '#F59E0B', '#EC4899'];
      for (let i = 0; i < 130; i++) {
        newDebris.push({
          x: Math.random() * (W - 100) + 50,
          y: Math.random() * 300 + 50,
          vx: (Math.random() - 0.5) * 26,
          vy: -10 - Math.random() * 22,
          w: 12 + Math.random() * 45,
          h: 10 + Math.random() * 35,
          rot: Math.random() * Math.PI * 2,
          vrot: (Math.random() - 0.5) * 0.4,
          color: colors[i % colors.length]
        });
      }
      debrisRef.current = newDebris;
    }

    if (doublings === 27) {
      eruptionFrameRef.current = 0;
      const eruptionList = [];
      const lavaColors = ['#FF4500', '#FF0000', '#FF8C00', '#FFD700', '#B22222', '#F59E0B'];
      for (let i = 0; i < 150; i++) {
        const isLava = i % 2 === 0;
        eruptionList.push({
          x: W * 0.5 + (Math.random() - 0.5) * 80,
          y: H - 360,
          vx: (Math.random() - 0.5) * 28,
          vy: -14 - Math.random() * 26,
          r: isLava ? (8 + Math.random() * 18) : (12 + Math.random() * 6),
          rot: Math.random() * Math.PI * 2,
          vrot: (Math.random() - 0.5) * 0.35,
          color: lavaColors[i % lavaColors.length],
          isLava,
          doublingStep: 27,
        });
      }
      eruptionParticlesRef.current = eruptionList;
    }

    if (doublings <= 20) {
      // Never slice or erase fallen dorayaki in Nobita's room (`double20まではのび太の部屋であってください`)!
      particlesRef.current = [...particlesRef.current, ...newParticles];
    } else {
      particlesRef.current = [...particlesRef.current, ...newParticles].slice(-600);
    }
  }, [doublings]);


  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const drawDorayaki = (x: number, y: number, r: number, rot: number, doublingStep = 0) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);

      const layerType = Math.abs(doublingStep) % 4;
      const bottomColors = ['#D97706', '#B45309', '#F59E0B', '#92400E'];
      const topColors = ['#F59E0B', '#D97706', '#FBBF24', '#B45309'];
      const strokeColors = ['#92400E', '#78350F', '#B45309', '#451A03'];

      ctx.fillStyle = bottomColors[layerType];
      ctx.beginPath();
      ctx.ellipse(0, r * 0.2, r, r * 0.55, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = strokeColors[layerType];
      ctx.lineWidth = 1.2;
      ctx.stroke();

      ctx.fillStyle = '#451A03';
      ctx.beginPath();
      ctx.ellipse(0, 0, r * 0.9, r * 0.32, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = topColors[layerType];
      ctx.beginPath();
      ctx.ellipse(0, -r * 0.2, r, r * 0.55, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = strokeColors[layerType];
      ctx.stroke();

      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.beginPath();
      ctx.ellipse(-r * 0.3, -r * 0.3, r * 0.3, r * 0.15, -0.3, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    const drawDorayakiStrata = (getBaseGroundY: (px: number) => number, maxLayers: number, r: number) => {
      const W = canvas.width;
      const dx = r * 1.25;
      const dy = r * 0.52;
      for (let layer = 0; layer < maxLayers; layer++) {
        const layerRot = ((layer % 2 === 0 ? 1 : -1) * 0.06);
        for (let x = 24 + ((layer % 2) * (r * 0.6)); x < W - 20; x += dx) {
          const baseY = getBaseGroundY(x);
          const y = baseY - layer * dy;
          if (y > 30) {
            drawDorayaki(x, y, r, layerRot, layer);
          }
        }
      }
    };

    const drawRoomDepthStrata = (progress: number, baseR: number) => {
      if (progress <= 0) return;
      const W = canvas.width;
      const H = canvas.height;
      const minY = H - 220; // Top edge of trapezoid brought closer to image center (y = 340px near H/2 = 280px)
      const maxY = H - 14;  // Bottom front edge of tatami floor
      const totalDepthRows = 46;
      const activeRows = Math.floor(progress * totalDepthRows);
      const startRow = totalDepthRows - activeRows; // Start from bottom edge (maxY) and build up to center (minY)

      for (let dRow = startRow; dRow < totalDepthRows; dRow++) {
        const t = dRow / totalDepthRows;
        const rowY = minY + t * (maxY - minY);
        const rowR = baseR * (0.68 + 0.32 * t);
        const dx = rowR * 1.35;
        const dy = rowR * 0.55;

        // Trapezoidal boundaries (`台形の範囲`) matching the 1-point perspective of the tatami floor
        const rowMinX = 40 + (1 - t) * (W * 0.26);
        const rowMaxX = (W - 40) - (1 - t) * (W * 0.26);

        const verticalLayers = 1 + Math.floor(progress * 3.5 * t);
        for (let vLayer = 0; vLayer < verticalLayers; vLayer++) {
          const y = rowY - vLayer * dy;
          const layerRot = ((vLayer % 2 === 0 ? 1 : -1) * 0.05) + ((dRow % 2 === 0 ? 1 : -1) * 0.04);
          const startX = rowMinX + ((vLayer + dRow) % 2) * (rowR * 0.65);
          for (let x = startX; x <= rowMaxX - rowR * 0.5; x += dx) {
            drawDorayaki(x, y, rowR, layerRot, dRow + vLayer);
          }
        }
      }
    };

    const render = () => {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      if (doublings <= 20) {
        const wallGrad = ctx.createLinearGradient(0, 0, 0, H - 75);
        wallGrad.addColorStop(0, '#E6DFD3');
        wallGrad.addColorStop(0.6, '#D6CEBE');
        wallGrad.addColorStop(1, '#C8BFA9');
        ctx.fillStyle = wallGrad;
        ctx.fillRect(0, 0, W, H - 75);

        const woodGrad = ctx.createLinearGradient(0, 0, 24, 0);
        woodGrad.addColorStop(0, '#3E2723'); woodGrad.addColorStop(0.5, '#4E342E'); woodGrad.addColorStop(1, '#2D1E17');
        ctx.fillStyle = woodGrad;
        ctx.fillRect(0, 0, 24, H - 75);
        ctx.fillRect(W - 24, 0, 24, H - 75);
        ctx.fillRect(W * 0.38, 0, 20, H - 75);
        ctx.fillRect(0, 22, W, 14);

        const shojiX = 45, shojiY = 48, shojiW = 280, shojiH = 190;
        const paperGrad = ctx.createLinearGradient(shojiX, shojiY, shojiX + shojiW, shojiY + shojiH);
        paperGrad.addColorStop(0, '#FFFFFF'); paperGrad.addColorStop(0.6, '#FDFBF7'); paperGrad.addColorStop(1, '#F3EFE6');
        ctx.fillStyle = paperGrad;
        ctx.fillRect(shojiX, shojiY, shojiW, shojiH);
        
        ctx.strokeStyle = '#5D4037';
        ctx.lineWidth = 4;
        ctx.strokeRect(shojiX, shojiY, shojiW, shojiH);
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        for (let gx = shojiX + 56; gx < shojiX + shojiW; gx += 56) {
          ctx.moveTo(gx, shojiY); ctx.lineTo(gx, shojiY + shojiH);
        }
        for (let gy = shojiY + 47; gy < shojiY + shojiH; gy += 47) {
          ctx.moveTo(shojiX, gy); ctx.lineTo(shojiX + shojiW, gy);
        }
        ctx.stroke();

        ctx.save();
        const sunBeam = ctx.createLinearGradient(shojiX, shojiY, shojiX + 450, H - 50);
        sunBeam.addColorStop(0, 'rgba(255, 250, 235, 0.28)');
        sunBeam.addColorStop(1, 'rgba(255, 250, 235, 0)');
        ctx.fillStyle = sunBeam;
        ctx.beginPath();
        ctx.moveTo(shojiX + 20, shojiY + shojiH);
        ctx.lineTo(shojiX + shojiW, shojiY);
        ctx.lineTo(shojiX + shojiW + 360, H - 60);
        ctx.lineTo(shojiX - 40, H - 60);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        ctx.fillStyle = '#4E342E';
        ctx.fillRect(0, H - 80, W, 8);

        const tatamiGrad = ctx.createLinearGradient(0, H - 72, 0, H);
        tatamiGrad.addColorStop(0, '#C5A880'); tatamiGrad.addColorStop(0.5, '#D6BA90'); tatamiGrad.addColorStop(1, '#B89C74');
        ctx.fillStyle = tatamiGrad;
        ctx.fillRect(0, H - 72, W, 72);

        ctx.strokeStyle = 'rgba(141, 110, 99, 0.35)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let ty = H - 68; ty < H; ty += 4) {
          ctx.moveTo(0, ty); ctx.lineTo(W, ty);
        }
        ctx.stroke();

        ctx.fillStyle = '#1E3620';
        ctx.fillRect(0, H - 72, W, 6);
        ctx.fillRect(0, H - 38, W, 6);
        ctx.fillRect(W * 0.38 - 8, H - 72, 16, 72);
        ctx.fillRect(W * 0.78 - 8, H - 72, 16, 72);

        const tableCenterX = W * 0.65;
        const tableW = 240;
        const blanketGrad = ctx.createLinearGradient(tableCenterX - tableW/2 - 15, H - 54, tableCenterX + tableW/2 + 15, H - 36);
        blanketGrad.addColorStop(0, '#991B1B'); blanketGrad.addColorStop(0.5, '#DC2626'); blanketGrad.addColorStop(1, '#7F1D1D');
        ctx.fillStyle = blanketGrad;
        ctx.beginPath(); ctx.roundRect(tableCenterX - tableW/2 - 12, H - 54, tableW + 24, 18, 6); ctx.fill();
        ctx.fillStyle = '#F8FAFC';
        ctx.fillRect(tableCenterX - tableW/2 - 14, H - 38, tableW + 28, 4);

        const topGrad = ctx.createLinearGradient(tableCenterX - tableW/2, H - 68, tableCenterX + tableW/2, H - 54);
        topGrad.addColorStop(0, '#5D4037'); topGrad.addColorStop(0.3, '#8D6E63'); topGrad.addColorStop(0.7, '#6D4C41'); topGrad.addColorStop(1, '#4E342E');
        ctx.fillStyle = topGrad;
        ctx.beginPath(); ctx.roundRect(tableCenterX - tableW/2, H - 68, tableW, 14, 4); ctx.fill();

        if (roomImgRef.current && roomImgRef.current.complete) {
          ctx.drawImage(roomImgRef.current, 0, 0, W, H);
        } else {
          const wallGrad = ctx.createLinearGradient(0, 0, 0, H - 75);
          wallGrad.addColorStop(0, '#E6DFD3'); wallGrad.addColorStop(0.6, '#D6CEBE'); wallGrad.addColorStop(1, '#C8BFA9');
          ctx.fillStyle = wallGrad; ctx.fillRect(0, 0, W, H - 75);
        }


        const progress = doublings < 15 ? 0 : Math.min((doublings - 14) / 6, 1);
        if (progress > 0) {
          drawRoomDepthStrata(progress, 14);
        }

        const sortedParticles = [...particlesRef.current].sort((a, b) => a.y - b.y);
        sortedParticles.forEach((p) => {
          if (p.settled) {
            drawDorayaki(p.x, p.y, p.r, p.rot, p.doublingStep);
            return;
          }
          p.vy += 0.38;
          p.x += p.vx;
          p.y += p.vy;
          p.rot += p.vrot;

          const targetY = p.targetFloorY !== undefined ? p.targetFloorY : (H - 15);
          const effectiveFloorY = targetY - (progress > 0 && targetY >= H - 220 ? Math.min((targetY - (H - 220)) * 0.35, progress * 4 * p.r * 0.4) : 0);

          // Constrain horizontally within the perspective trapezoid floor (`台形`) so particles never spill onto walls
          const t = p.targetFloorY !== undefined 
            ? Math.min(Math.max((p.targetFloorY - (H - 220)) / 204, 0), 1)
            : Math.min(Math.max((p.y - (H - 220)) / 204, 0), 1);
          const trapMinX = 40 + (1 - t) * (W * 0.26) + p.r;
          const trapMaxX = (W - 40) - (1 - t) * (W * 0.26) - p.r;

          if (p.x < trapMinX) {
            p.x = trapMinX;
            p.vx = Math.abs(p.vx) * 0.65;
          } else if (p.x > trapMaxX) {
            p.x = trapMaxX;
            p.vx = -Math.abs(p.vx) * 0.65;
          }

          if (p.y >= effectiveFloorY - p.r) {
            if (p.vy > 2.2) {
              p.y = effectiveFloorY - p.r;
              p.vy = -p.vy * 0.32;
              p.vx *= 0.82;
            } else {
              p.y = effectiveFloorY - p.r;
              p.vy = 0;
              p.vx = 0;
              p.rot = (Math.random() - 0.5) * 0.25;
              p.settled = true;
            }
          }
          drawDorayaki(p.x, p.y, p.r, p.rot, p.doublingStep);
        });
      } else if (doublings === 21) {
        collapseFrameRef.current += 1;
        const frame = collapseFrameRef.current;
        const fujiBaseY = H - 35;

        if (frame <= 45) {
          ctx.save();
          // Gentle, soft, non-nauseating rumble so users don't get motion-sick!
          const shakeMag = 2 + Math.sin(frame * 0.3) * 1.5;
          ctx.translate((Math.random() - 0.5) * shakeMag, (Math.random() - 0.5) * shakeMag);
          if (roomImgRef.current && roomImgRef.current.complete) {
            ctx.drawImage(roomImgRef.current, 0, 0, W, H);
          }

          // Blazing glowing fissures bursting through the room (gentle glow)
          ctx.save();
          ctx.shadowColor = '#FF0000'; ctx.shadowBlur = 14;
          ctx.strokeStyle = 'rgba(254, 240, 138, 0.8)'; ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(W * 0.05, 0); ctx.lineTo(W * 0.2, H * 0.35); ctx.lineTo(W * 0.15, H * 0.65); ctx.lineTo(W * 0.3, H - 20);
          ctx.moveTo(W * 0.95, 0); ctx.lineTo(W * 0.75, H * 0.4); ctx.lineTo(W * 0.82, H * 0.7); ctx.lineTo(W * 0.65, H - 20);
          ctx.moveTo(W * 0.45, H * 0.1); ctx.lineTo(W * 0.55, H * 0.5); ctx.lineTo(W * 0.4, H * 0.85);
          ctx.stroke();
          ctx.restore();

          drawRoomDepthStrata(1.0, 14);
          const sortedCollapseParticles = [...particlesRef.current].sort((a, b) => a.y - b.y);
          sortedCollapseParticles.forEach((p) => {
            p.x += Math.sin(frame * 0.5 + p.y) * 0.8;
            p.y += Math.cos(frame * 0.5 + p.x) * 0.4;
            drawDorayaki(p.x, p.y, p.r, p.rot, p.doublingStep);
          });
          ctx.restore();
        } else {
          if (fujiImgRef.current && fujiImgRef.current.complete) {
            ctx.drawImage(fujiImgRef.current, 0, 0, W, H);
          } else {
            const skyGrad = ctx.createLinearGradient(0, 0, 0, H);
            skyGrad.addColorStop(0, '#38BDF8'); skyGrad.addColorStop(1, '#FEF08A');
            ctx.fillStyle = skyGrad; ctx.fillRect(0, 0, W, H);
          }

          // Blinding shockwave flash fading over 20 frames right after explosion
          if (frame - 45 < 20) {
            ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, (20 - (frame - 45)) / 20)})`;
            ctx.fillRect(0, 0, W, H);
          }

          // Expanding explosion ring on blast
          if (frame - 45 < 25) {
            ctx.save();
            ctx.strokeStyle = `rgba(254, 240, 138, ${Math.max(0, (25 - (frame - 45)) / 25)})`;
            ctx.lineWidth = 12;
            ctx.beginPath();
            ctx.arc(W / 2, H / 2, (frame - 45) * 35, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
          }

          debrisRef.current.forEach((d: DebrisPiece) => {
            d.vy += 0.45;
            d.x += d.vx;
            d.y += d.vy;
            d.rot += d.vrot;

            if (d.y >= fujiBaseY - d.h/2) {
              d.y = fujiBaseY - d.h/2;
              d.vy = -d.vy * 0.35;
              d.vx *= 0.85;
              d.vrot *= 0.85;
            }

            ctx.save();
            ctx.translate(d.x, d.y);
            ctx.rotate(d.rot);
            ctx.fillStyle = d.color;
            ctx.fillRect(-d.w/2, -d.h/2, d.w, d.h);
            ctx.strokeStyle = '#1E293B'; ctx.lineWidth = 2;
            ctx.strokeRect(-d.w/2, -d.h/2, d.w, d.h);
            ctx.restore();
          });

          if (frame === 46) {
            particlesRef.current.forEach((p) => {
              p.settled = false;
              p.vy = -14 - Math.random() * 20;
              p.vx = (Math.random() - 0.5) * 30;
            });
          }

          particlesRef.current.forEach((p) => {
            if (p.settled) { drawDorayaki(p.x, p.y, p.r, p.rot, p.doublingStep); return; }
            p.vy += 0.4; p.x += p.vx; p.y += p.vy; p.rot += p.vrot;
            if (p.y >= fujiBaseY - p.r) {
              if (p.vy > 2.2) { p.vy = -p.vy * 0.35; p.vx *= 0.85; }
              else { p.y = fujiBaseY - p.r; p.vy = 0; p.vx = 0; p.settled = true; }
            }
            drawDorayaki(p.x, p.y, p.r, p.rot, p.doublingStep);
          });
        }
      } else if (doublings <= 26) {
        const fujiBaseY = H - 35;
        if (fujiImgRef.current && fujiImgRef.current.complete) {
          ctx.drawImage(fujiImgRef.current, 0, 0, W, H);
        } else {
          const skyGrad = ctx.createLinearGradient(0, 0, 0, H);
          skyGrad.addColorStop(0, '#38BDF8'); skyGrad.addColorStop(1, '#FEF08A');
          ctx.fillStyle = skyGrad; ctx.fillRect(0, 0, W, H);
        }

        const progress = Math.min(Math.max(doublings - 21, 0) / 5, 1);
        const maxStrataLayers = Math.floor(progress * 60);
        if (maxStrataLayers > 0) {
          drawDorayakiStrata(() => fujiBaseY, maxStrataLayers, 13);
        }

        particlesRef.current.forEach((p) => {
          if (p.settled) {
            drawDorayaki(p.x, p.y, p.r, p.rot, p.doublingStep);
            return;
          }
          p.vy += 0.38;
          p.x += p.vx;
          p.y += p.vy;
          p.rot += p.vrot;

          const horizontalSeaY = fujiBaseY - maxStrataLayers * (p.r * 0.52);
          const effectiveGroundY = horizontalSeaY;

          if (p.y >= effectiveGroundY - p.r) {
            if (p.vy > 2.2) {
              p.y = effectiveGroundY - p.r;
              p.vy = -p.vy * 0.35;
              p.vx *= 0.85;
            } else {
              p.y = effectiveGroundY - p.r;
              p.vy = 0;
              p.vx = 0;
              p.rot = (Math.random() - 0.5) * 0.3;
              p.settled = true;
            }
          }
          drawDorayaki(p.x, p.y, p.r, p.rot, p.doublingStep);
        });
      } else if (doublings === 27) {
        // ==========================================
        // STAGE 2.5 (DOUBLING 27): 🌋 富士山完全埋没＆大噴火！ (Mount Fuji Submerged & Volcanic Eruption!)
        // ==========================================
        eruptionFrameRef.current += 1;
        const fujiBaseY = H - 35;
        const fujiPeakX = W * 0.5;
        const fujiPeakY = H - 360;

        ctx.save();
        ctx.translate((Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20);
        if (fujiImgRef.current && fujiImgRef.current.complete) {
          ctx.drawImage(fujiImgRef.current, 0, 0, W, H);
        } else {
          const skyGrad = ctx.createLinearGradient(0, 0, 0, H);
          skyGrad.addColorStop(0, '#B91C1C'); skyGrad.addColorStop(1, '#FEF08A');
          ctx.fillStyle = skyGrad; ctx.fillRect(0, 0, W, H);
        }

        // Draw 100% submerged strata (60 layers covering Fuji!)
        drawDorayakiStrata(() => fujiBaseY, 60, 13);

        // Draw volcanic eruption pillar exploding out of the submerged peak!
        const plumeGrad = ctx.createLinearGradient(fujiPeakX, fujiPeakY, fujiPeakX, 0);
        plumeGrad.addColorStop(0, 'rgba(255, 69, 0, 0.95)');
        plumeGrad.addColorStop(0.3, 'rgba(239, 68, 68, 0.85)');
        plumeGrad.addColorStop(0.7, 'rgba(30, 41, 59, 0.9)');
        plumeGrad.addColorStop(1, 'rgba(15, 23, 42, 0.95)');
        ctx.fillStyle = plumeGrad;
        ctx.beginPath();
        ctx.moveTo(fujiPeakX - 55, fujiPeakY);
        ctx.quadraticCurveTo(fujiPeakX - 160, fujiPeakY * 0.5, fujiPeakX - 280, 0);
        ctx.lineTo(fujiPeakX + 280, 0);
        ctx.quadraticCurveTo(fujiPeakX + 160, fujiPeakY * 0.5, fujiPeakX + 55, fujiPeakY);
        ctx.closePath();
        ctx.fill();

        // Volcanic lightning flashes
        if (Math.random() < 0.45) {
          ctx.strokeStyle = '#FEF08A'; ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(fujiPeakX + (Math.random() - 0.5) * 120, fujiPeakY - Math.random() * 200);
          ctx.lineTo(fujiPeakX + (Math.random() - 0.5) * 200, fujiPeakY - Math.random() * 300);
          ctx.lineTo(fujiPeakX + (Math.random() - 0.5) * 260, 50);
          ctx.stroke();
        }

        ctx.fillStyle = '#EF4444';
        ctx.font = '900 26px sans-serif';
        ctx.fillText(language === 'ja' ? '⚠️ 富士山完全埋没＆大噴火！1億3,421万個のどら焼きがマグマと爆発！ ⚠️' : '⚠️ FUJI SUBMERGED & ERUPTING! 134,217,728 DORAYAKI VOLCANO! ⚠️', 30, H/2 - 40);
        ctx.restore();

        // Animate eruption particles shooting up and raining down
        eruptionParticlesRef.current.forEach((ep) => {
          ep.vy += 0.45;
          ep.x += ep.vx;
          ep.y += ep.vy;
          ep.rot += ep.vrot;

          if (ep.y >= H - 25) {
            ep.y = H - 25;
            ep.vy = -ep.vy * 0.45;
            ep.vx *= 0.85;
          }

          if (ep.isLava) {
            ctx.save();
            ctx.translate(ep.x, ep.y);
            ctx.rotate(ep.rot);
            const lavaGlow = ctx.createRadialGradient(0, 0, 2, 0, 0, ep.r);
            lavaGlow.addColorStop(0, '#FEF08A');
            lavaGlow.addColorStop(0.5, ep.color || '#FF4500');
            lavaGlow.addColorStop(1, 'rgba(185, 28, 28, 0)');
            ctx.fillStyle = lavaGlow;
            ctx.beginPath(); ctx.arc(0, 0, ep.r * 1.5, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = ep.color || '#FF4500';
            ctx.beginPath(); ctx.arc(0, 0, ep.r * 0.7, 0, Math.PI * 2); ctx.fill();
            ctx.restore();
          } else {
            drawDorayaki(ep.x, ep.y, ep.r, ep.rot, ep.doublingStep || 27);
          }
        });

        particlesRef.current.forEach((p) => {
          p.vy += 0.4; p.x += p.vx; p.y += p.vy; p.rot += p.vrot;
          if (p.y >= H - 35 - p.r) {
            if (p.vy > 2.2) { p.vy = -p.vy * 0.35; p.vx *= 0.85; }
            else { p.y = H - 35 - p.r; p.vy = -12 - Math.random() * 16; p.vx = (Math.random() - 0.5) * 20; }
          }
          drawDorayaki(p.x, p.y, p.r, p.rot, p.doublingStep);
        });
      } else if (doublings <= 38) {
        // ==========================================
        // STAGE 3: 世界の大洋と大陸 (Global Ocean & Continents)
        // ==========================================
        ctx.fillStyle = '#020617';
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = '#1E3A8A';
        ctx.beginPath(); ctx.arc(W / 2, H + 400, 520, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#15803D';
        ctx.beginPath(); ctx.ellipse(W * 0.3, H - 80, 90, 35, -0.2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(W * 0.75, H - 60, 110, 45, 0.1, 0, Math.PI * 2); ctx.fill();
        particlesRef.current.forEach((p) => {
          if (p.settled) {
            drawDorayaki(p.x, p.y, p.r, p.rot, p.doublingStep);
            return;
          }
          p.vy += 0.35; p.x += p.vx; p.y += p.vy; p.rot += p.vrot;
          const landingY = H - 35 - ((Math.abs(p.x - W/2) * 0.08) % 40);
          if (p.y >= landingY - p.r) {
            if (p.vy > 2.2) p.vy = -p.vy * 0.35;
            else { p.y = landingY - p.r; p.vy = 0; p.vx = 0; p.settled = true; }
          }
          drawDorayaki(p.x, p.y, p.r, p.rot, p.doublingStep);
        });

      } else if (doublings <= 45) {
        // ==========================================
        // STAGE 4: 🌍 リアルな地球がどら焼きの色にだんだん染まる (Earth Gradually Dyed into Dorayaki Planet!)
        // ==========================================
        ctx.fillStyle = '#020617'; ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = '#FFFFFF';
        for (let i = 0; i < 45; i++) {
          const sx = (i * 97) % W; const sy = (i * 53) % H;
          ctx.fillRect(sx, sy, ((i % 3) === 0) ? 2 : 1.2, ((i % 3) === 0) ? 2 : 1.2);
        }
        const cx = W / 2; const cy = H / 2 + 15;
        const earthR = 120;
        // Engulf percentage scales from 0% (at doublings 38) up to 100% (at doublings 45)
        const engulfPct = Math.min(100, Math.max(0, Math.floor(((doublings - 38) / 7) * 100)));

        const haloGrad = ctx.createRadialGradient(cx, cy, earthR - 2, cx, cy, earthR + 25);
        haloGrad.addColorStop(0, 'rgba(56, 189, 248, 0.65)'); haloGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
        ctx.fillStyle = haloGrad; ctx.beginPath(); ctx.arc(cx, cy, earthR + 25, 0, Math.PI * 2); ctx.fill();

        // Step 1: Draw Realistic Green & Blue Planet Earth (`real_earth.jpg`)
        ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, earthR, 0, Math.PI * 2); ctx.clip();
        if (earthImgRef.current && earthImgRef.current.complete) {
          ctx.drawImage(earthImgRef.current, cx - earthR, cy - earthR, earthR * 2, earthR * 2);
        } else {
          const oceanGrad = ctx.createRadialGradient(cx - 35, cy - 35, 15, cx, cy, earthR);
          oceanGrad.addColorStop(0, '#60A5FA'); oceanGrad.addColorStop(0.35, '#2563EB'); oceanGrad.addColorStop(0.75, '#1E3A8A'); oceanGrad.addColorStop(1, '#030712');
          ctx.fillStyle = oceanGrad; ctx.fillRect(cx - earthR, cy - earthR, earthR * 2, earthR * 2);
        }
        const shadowGrad = ctx.createLinearGradient(cx - 40, cy - 40, cx + earthR, cy + earthR);
        shadowGrad.addColorStop(0, 'rgba(3, 7, 18, 0)'); shadowGrad.addColorStop(0.7, 'rgba(3, 7, 18, 0.45)'); shadowGrad.addColorStop(1, 'rgba(3, 7, 18, 0.92)');
        ctx.fillStyle = shadowGrad; ctx.fillRect(cx - earthR, cy - earthR, earthR * 2, earthR * 2);
        ctx.restore();

        // Step 2: Overlay Golden Dorayaki Crust exactly proportional to engulfPct ("どら焼きの色にだんだん染まる")
        if (engulfPct > 0) {
          ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, earthR, 0, Math.PI * 2); ctx.clip();
          const crustGrad = ctx.createRadialGradient(cx - 25, cy - 25, 15, cx, cy, earthR);
          crustGrad.addColorStop(0, '#F59E0B'); crustGrad.addColorStop(0.6, '#D97706'); crustGrad.addColorStop(1, '#78350F');
          ctx.fillStyle = crustGrad;
          ctx.globalAlpha = engulfPct / 100; // gradual blending dye!
          ctx.fillRect(cx - earthR, cy - earthR, earthR * 2, earthR * 2);

          if (engulfPct > 45) {
            ctx.fillStyle = '#451A03'; ctx.beginPath(); ctx.ellipse(cx, cy, earthR * 0.95, earthR * 0.28, -0.15, 0, Math.PI * 2); ctx.fill();
            ctx.strokeStyle = '#B45309'; ctx.lineWidth = 3; ctx.stroke();
          }
          ctx.restore();
        }

        if (engulfPct >= 100) {
          const auraGrad = ctx.createRadialGradient(cx, cy, earthR, cx, cy, earthR + 55);
          auraGrad.addColorStop(0, 'rgba(245, 158, 11, 0.65)'); auraGrad.addColorStop(1, 'rgba(245, 158, 11, 0)');
          ctx.fillStyle = auraGrad; ctx.beginPath(); ctx.arc(cx, cy, earthR + 55, 0, Math.PI * 2); ctx.fill();
        }

        particlesRef.current.forEach((p) => {
          if (p.settled) { drawDorayaki(p.x, p.y, p.r, p.rot, p.doublingStep); return; }
          p.vy += 0.35; p.x += p.vx; p.y += p.vy; p.rot += p.vrot;
          const distToEarth = Math.sqrt((p.x - cx) ** 2 + (p.y - cy) ** 2);
          if (distToEarth <= earthR + p.r + 3) {
            p.settled = true;
          } else if (p.y > H - 15) {
            p.y = H - 15; p.vy = 0; p.vx = 0; p.settled = true;
          }
          drawDorayaki(p.x, p.y, p.r, p.rot, p.doublingStep);
        });

      } else if (doublings <= 51) {
        // ==========================================
        // STAGE 5: 🪐 人工衛星軌道！どら焼きが土星の輪っかのように地球を周回 (Saturn-Ring Orbiting Satellites!)
        // ==========================================
        ctx.fillStyle = '#020617'; ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = '#FFFFFF';
        for (let i = 0; i < 60; i++) {
          const sx = (i * 89) % W; const sy = (i * 61) % H;
          ctx.fillRect(sx, sy, ((i % 4) === 0) ? 2 : 1.2, ((i % 4) === 0) ? 2 : 1.2);
        }
        const cx = W / 2; const cy = H / 2 + 15;
        const earthR = 110;

        // Draw background section of Saturn-style planetary rings (behind the Earth sphere)
        const ringCount = Math.min((doublings - 45) * 45 + 100, 360);
        const timeRot = Date.now() * 0.0012;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(0.32); // 18 degree Saturn inclination
        for (let i = 0; i < ringCount; i++) {
          const angle = (i * 0.17) + timeRot + (i % 5) * 0.4;
          // Only draw particles currently on the far (back) side of the orbit (sin < 0)
          if (Math.sin(angle) < 0) {
            const rx = Math.cos(angle) * (210 + (i % 14) * 13);
            const ry = Math.sin(angle) * (65 + (i % 14) * 4);
            drawDorayaki(rx, ry, 11 + (i % 4), angle, i);
          }
        }
        ctx.restore();

        // Draw Central Golden Dorayaki Planet Earth (with underlying real_earth texture subtly showing)
        ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, earthR, 0, Math.PI * 2); ctx.clip();
        if (earthImgRef.current && earthImgRef.current.complete) {
          ctx.drawImage(earthImgRef.current, cx - earthR, cy - earthR, earthR * 2, earthR * 2);
        }
        const crustGrad = ctx.createRadialGradient(cx - 25, cy - 25, 15, cx, cy, earthR);
        crustGrad.addColorStop(0, '#F59E0B'); crustGrad.addColorStop(0.6, '#D97706'); crustGrad.addColorStop(1, '#78350F');
        ctx.fillStyle = crustGrad; ctx.globalAlpha = 0.92; ctx.fillRect(cx - earthR, cy - earthR, earthR * 2, earthR * 2);
        ctx.globalAlpha = 1.0;
        ctx.fillStyle = '#451A03'; ctx.beginPath(); ctx.ellipse(cx, cy, earthR * 0.95, earthR * 0.28, -0.15, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#B45309'; ctx.lineWidth = 3; ctx.stroke();
        ctx.restore();

        const auraGrad = ctx.createRadialGradient(cx, cy, earthR, cx, cy, earthR + 35);
        auraGrad.addColorStop(0, 'rgba(245, 158, 11, 0.5)'); auraGrad.addColorStop(1, 'rgba(245, 158, 11, 0)');
        ctx.fillStyle = auraGrad; ctx.beginPath(); ctx.arc(cx, cy, earthR + 35, 0, Math.PI * 2); ctx.fill();

        // Draw foreground section of Saturn-style planetary rings (in front of the Earth sphere)
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(0.32);
        for (let i = 0; i < ringCount; i++) {
          const angle = (i * 0.17) + timeRot + (i % 5) * 0.4;
          if (Math.sin(angle) >= 0) {
            const rx = Math.cos(angle) * (210 + (i % 14) * 13);
            const ry = Math.sin(angle) * (65 + (i % 14) * 4);
            drawDorayaki(rx, ry, 11 + (i % 4), angle, i);
          }
        }
        ctx.restore();

        particlesRef.current.forEach((p) => {
          if (p.angle === undefined || p.dist === undefined || p.speed === undefined) {
            p.angle = Math.atan2(p.y - cy, p.x - cx);
            p.dist = Math.sqrt((p.x - cx) ** 2 + (p.y - cy) ** 2);
            p.speed = (Math.random() * 0.035 + 0.015) * (Math.random() > 0.5 ? 1 : -1);
          }
          p.angle += p.speed;
          // Settle into the ring orbit between radius 210 and 380!
          if (p.dist > 380) p.dist *= 0.98;
          else if (p.dist < 210) p.dist *= 1.02;
          p.x = cx + Math.cos(p.angle) * p.dist;
          p.y = cy + Math.sin(p.angle) * (p.dist * 0.32);
          p.rot += p.vrot || 0.05;
          drawDorayaki(p.x, p.y, p.r, p.rot, p.doublingStep);
        });

      } else if (doublings <= 57) {
        // ==========================================
        // STAGE 6: ☀️ 太陽系飽和！太陽から全惑星の軌道までどら焼きで埋め尽くす (Solar System Engulfed!)
        // ==========================================
        const cosmicGrad = ctx.createRadialGradient(W / 2, H / 2, 30, W / 2, H / 2, 450);
        cosmicGrad.addColorStop(0, '#451A03'); cosmicGrad.addColorStop(0.5, '#1E1B4B'); cosmicGrad.addColorStop(1, '#020617');
        ctx.fillStyle = cosmicGrad; ctx.fillRect(0, 0, W, H);

        const cx = W / 2; const cy = H / 2 + 10;

        // Draw Solar System orbits & planets
        const orbits = [70, 130, 190, 260, 340, 430];
        const planetColors = ['#9CA3AF', '#FCD34D', '#F59E0B', '#EF4444', '#F97316', '#38BDF8'];
        const planetNames = ['水星', '金星', 'どら焼き星', '火星', '木星', '土星'];
        orbits.forEach((or, idx) => {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)'; ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.arc(cx, cy, or, 0, Math.PI * 2); ctx.stroke();
          const ang = (Date.now() * 0.0006 * (idx + 1)) + idx * 1.3;
          const px = cx + Math.cos(ang) * or; const py = cy + Math.sin(ang) * (or * 0.65);
          ctx.fillStyle = planetColors[idx]; ctx.beginPath(); ctx.arc(px, py, 6 + idx * 2.5, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = 'rgba(255, 255, 255, 0.65)'; ctx.font = '10px sans-serif'; ctx.fillText(planetNames[idx], px - 12, py - 10);
        });

        // Blazing Central Sun (太陽)
        const sunGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 65);
        sunGrad.addColorStop(0, '#FFFFFF'); sunGrad.addColorStop(0.4, '#FEF08A'); sunGrad.addColorStop(0.8, '#FF4500'); sunGrad.addColorStop(1, 'rgba(255, 69, 0, 0)');
        ctx.fillStyle = sunGrad; ctx.beginPath(); ctx.arc(cx, cy, 65, 0, Math.PI * 2); ctx.fill();

        // Astronomical Dorayaki Flood extending outward from the center burying the Solar System!
        const solarProgress = Math.min((doublings - 51) / 6, 1);
        const engulfRadius = solarProgress * 550;
        const floodCount = Math.floor(solarProgress * 280) + 60;
        for (let i = 0; i < floodCount; i++) {
          const ang = (i * 0.23) + (Date.now() * 0.0005);
          const rad = (i * 19) % engulfRadius;
          const sx = cx + Math.cos(ang) * rad;
          const sy = cy + Math.sin(ang) * (rad * 0.65);
          drawDorayaki(sx, sy, 14 + (i % 5), ang, i);
        }

        particlesRef.current.forEach((p) => {
          if (p.angle === undefined || p.dist === undefined || p.speed === undefined) {
            p.angle = Math.atan2(p.y - cy, p.x - cx);
            p.dist = Math.sqrt((p.x - cx) ** 2 + (p.y - cy) ** 2);
            p.speed = (Math.random() * 0.04 + 0.01) * (Math.random() > 0.5 ? 1 : -1);
          }
          p.angle += p.speed;
          if (p.dist > engulfRadius) p.dist *= 0.97;
          p.x = cx + Math.cos(p.angle) * p.dist;
          p.y = cy + Math.sin(p.angle) * (p.dist * 0.65);
          p.rot += p.vrot || 0.05;
          drawDorayaki(p.x, p.y, p.r, p.rot, p.doublingStep);
        });

      } else {
        // ==========================================
        // STAGE 7: 🕳️ 重力崩壊・極限収縮！超大質量ブラックホールの誕生 (Black Hole Gravitational Collapse!)
        // ==========================================
        ctx.fillStyle = '#020617'; ctx.fillRect(0, 0, W, H);
        const cx = W / 2; const cy = H / 2 + 10;
        const time = Date.now() * 0.003;
        const bhRadius = 42 + Math.sin(time * 0.5) * 3;

        // Relativistic Astrophysical Jets (ブラックホール両極からの相対論的ジェット)
        const jetGrad = ctx.createLinearGradient(cx, 0, cx, H);
        jetGrad.addColorStop(0, 'rgba(168, 85, 247, 0.45)');
        jetGrad.addColorStop(0.45, 'rgba(56, 189, 248, 0.85)');
        jetGrad.addColorStop(0.5, 'rgba(255, 255, 255, 1)');
        jetGrad.addColorStop(0.55, 'rgba(56, 189, 248, 0.85)');
        jetGrad.addColorStop(1, 'rgba(168, 85, 247, 0.45)');
        ctx.fillStyle = jetGrad;
        ctx.beginPath(); ctx.ellipse(cx, cy, 18, H / 2, 0, 0, Math.PI * 2); ctx.fill();

        // Fiery Relativistic Accretion Disk (超高速回転するどら焼き降着円盤)
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(time * 0.8);
        for (let r = 240; r >= bhRadius + 12; r -= 14) {
          const diskGrad = ctx.createRadialGradient(0, 0, r - 12, 0, 0, r);
          diskGrad.addColorStop(0, 'rgba(254, 240, 138, 0.8)');
          diskGrad.addColorStop(0.4, 'rgba(245, 158, 11, 0.7)');
          diskGrad.addColorStop(0.7, 'rgba(220, 38, 38, 0.6)');
          diskGrad.addColorStop(1, 'rgba(76, 29, 149, 0)');
          ctx.fillStyle = diskGrad;
          ctx.beginPath(); ctx.ellipse(0, 0, r, r * 0.32, 0, 0, Math.PI * 2); ctx.fill();
        }
        ctx.restore();

        // Gravitational Photon Ring & Pitch Black Event Horizon (事象の地平線)
        const photonRing = ctx.createRadialGradient(cx, cy, bhRadius - 4, cx, cy, bhRadius + 14);
        photonRing.addColorStop(0, '#FFFFFF'); photonRing.addColorStop(0.5, '#38BDF8'); photonRing.addColorStop(1, 'rgba(56, 189, 248, 0)');
        ctx.fillStyle = photonRing; ctx.beginPath(); ctx.arc(cx, cy, bhRadius + 14, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#000000';
        ctx.beginPath(); ctx.arc(cx, cy, bhRadius, 0, Math.PI * 2); ctx.fill();

        // Slowly and majestically rotating accretion swirl (`ゆっくり大回転するように`)
        particlesRef.current.forEach((p) => {
          if (p.angle === undefined || p.dist === undefined || p.speed === undefined) {
            p.angle = Math.atan2(p.y - cy, p.x - cx);
            p.dist = Math.sqrt((p.x - cx) ** 2 + (p.y - cy) ** 2);
            // Gentle, uniform, slow grand rotation speed (all in the same majestic clockwise swirl)
            p.speed = 0.005 + Math.random() * 0.003;
          }
          p.angle += p.speed;
          p.dist = p.dist * 0.993; // slow, smooth spiral inward without jerky strobing
          if (p.dist <= bhRadius + 5) {
            p.dist = 420 + Math.random() * 160;
            p.angle = Math.random() * Math.PI * 2;
          }
          p.x = cx + Math.cos(p.angle) * p.dist;
          p.y = cy + Math.sin(p.angle) * (p.dist * 0.55);
          p.rot += 0.015;
          drawDorayaki(p.x, p.y, Math.max(6, p.r * (p.dist / 320)), p.rot, p.doublingStep);
        });
      }

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [doublings, language]);

  const handleManualDouble = () => {
    setDoublings(prev => prev + 1);
  };

  const handleReset = () => {
    setDoublings(0);
    particlesRef.current = [];
  };

  return (
    <div className="container baibain-game animate-fade-in">
      {/* Header */}
      <div className="baibain-header">
        <h1 className="baibain-title">
          {language === 'ja' ? 'どら焼き・バイバイン増殖シミュレーター' : 'Dorayaki Exponential Multiplier'}
        </h1>
      </div>

      {/* Interactive Physics & Simulation Area (Full Width Across Screen) */}
      <div className="sim-canvas-panel full-width-panel">
        <div className="canvas-wrapper full-width-wrapper">
          <canvas ref={canvasRef} width={1200} height={560} className="dorayaki-canvas" />

          {/* Top-Left Live Stream Recording Badge Overlay inside Simulation Screen */}
          <div className="stage-topleft-live">
            <span className="live-rec-ring">
              <span className="live-rec-dot" />
            </span>
            <span className="live-stream-text">LIVE STREAM</span>
          </div>

          {/* Top-Right Premium Glassmorphism HUD Overlay */}
          <div className="stage-topright-stats premium-hud-card">
            <div className="hud-header">
              <span className="hud-pulse-dot" />
              <span className="stats-label">
                {language === 'ja' ? '現在のどら焼き総数' : 'Current Dorayaki Count'}
              </span>
            </div>
            
            <div className="stats-count-row">
              <span className="stats-count-number">{formatCount(count)}</span>
              <span className="stats-unit-badge">dorayaki</span>
            </div>

            <div className="hud-divider" />

            <div className="stats-doublings-row">
              <div className="doublings-info">
                <span className="doublings-title">{language === 'ja' ? '倍増回数' : 'Doublings'}</span>
                <span className="doublings-value">{doublings} <small>{language === 'ja' ? '回' : 'x'}</small></span>
              </div>
              <div className="doublings-progress-bar">
                <div 
                  className="doublings-progress-fill" 
                  style={{ width: `${Math.min(100, (doublings / 27) * 100)}%` }} 
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Centered Controls inside Live Physics Container */}
        <div className="canvas-bottom-controls">
          <button className="action-btn btn-step hero-double-btn" onClick={handleManualDouble}>
            Double
          </button>
          <button className="action-btn btn-reset-subtle" onClick={handleReset}>
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};
