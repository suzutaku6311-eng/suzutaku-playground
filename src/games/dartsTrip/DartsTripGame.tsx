import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { countryGeoList, type CountryGeoInfo } from './countryGeoData';
import { allFlags, type FlagQuestion } from '../flagQuiz/flagData';
import './DartsTripGame.css';

interface Star {
  x: number;
  y: number;
  size: number;
  alpha: number;
  speed: number;
}

interface Shockwave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
}

export const DartsTripGame: React.FC = () => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'globe' | 'passport'>('globe');

  // Game States
  const [isThrowing, setIsThrowing] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<{ geo: CountryGeoInfo; flag: FlagQuestion } | null>(null);
  const [passportHistory, setPassportHistory] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('darts_trip_passport_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Canvas & Globe Animation Refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rotLonRef = useRef<number>(0);
  const rotLatRef = useRef<number>(0.2);
  const isDraggingRef = useRef<boolean>(false);
  const lastMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const starsRef = useRef<Star[]>([]);
  const shockwavesRef = useRef<Shockwave[]>([]);

  // Dart Throwing Animation Ref
  const dartAnimRef = useRef<{
    active: boolean;
    progress: number; // 0 to 1
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    hitLat: number;
    hitLon: number;
  }>({
    active: false,
    progress: 0,
    startX: 290,
    startY: 560,
    endX: 290,
    endY: 290,
    hitLat: 0,
    hitLon: 0
  });

  // Save to localStorage when passport updates
  useEffect(() => {
    try {
      localStorage.setItem('darts_trip_passport_history', JSON.stringify(passportHistory));
    } catch (e) {
      console.error(e);
    }
  }, [passportHistory]);

  // Initialize Stars
  useEffect(() => {
    const stars: Star[] = [];
    for (let i = 0; i < 140; i++) {
      stars.push({
        x: Math.random() * 580,
        y: Math.random() * 580,
        size: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.8 + 0.2,
        speed: Math.random() * 0.02 + 0.005
      });
    }
    starsRef.current = stars;
  }, []);

  // 3D Globe Projection Formula
  const project3D = (lat: number, lon: number, R = 230) => {
    const phi = (lat * Math.PI) / 180;
    const theta = (lon * Math.PI) / 180 + rotLonRef.current;
    const latRad = rotLatRef.current;

    const x0 = R * Math.cos(phi) * Math.sin(theta);
    const y0 = R * Math.sin(phi);
    const z0 = R * Math.cos(phi) * Math.cos(theta);

    // Rotate around X axis for tilt
    const x = x0;
    const y = -y0 * Math.cos(latRad) + z0 * Math.sin(latRad);
    const z = y0 * Math.sin(latRad) + z0 * Math.cos(latRad);

    return { x, y, z };
  };

  // Main Canvas Render Loop
  useEffect(() => {
    let animId: number;
    const ctx = canvasRef.current?.getContext('2d');

    const render = () => {
      if (!ctx || !canvasRef.current) return;
      const width = canvasRef.current.width;
      const height = canvasRef.current.height;
      const cx = width / 2;
      const cy = height / 2;
      const R = 230;

      // Auto rotation when not dragging or throwing dart
      if (!isDraggingRef.current && !dartAnimRef.current.active && activeTab === 'globe') {
        rotLonRef.current += 0.004;
      }

      // 1. Clear background & draw stars
      ctx.clearRect(0, 0, width, height);
      starsRef.current.forEach((star) => {
        star.alpha += star.speed;
        if (star.alpha > 1 || star.alpha < 0.2) star.speed *= -1;
        ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // 2. Draw Atmosphere Glow
      const glowGrad = ctx.createRadialGradient(cx, cy, R * 0.85, cx, cy, R * 1.25);
      glowGrad.addColorStop(0, 'rgba(6, 182, 212, 0.4)');
      glowGrad.addColorStop(0.6, 'rgba(16, 185, 129, 0.15)');
      glowGrad.addColorStop(1, 'rgba(16, 185, 129, 0)');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.25, 0, Math.PI * 2);
      ctx.fill();

      // 3. Draw Globe Sphere Body
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.clip();

      const sphereGrad = ctx.createRadialGradient(cx - R * 0.35, cy - R * 0.35, R * 0.1, cx, cy, R);
      sphereGrad.addColorStop(0, '#1e3a8a');
      sphereGrad.addColorStop(0.5, '#0f172a');
      sphereGrad.addColorStop(1, '#020617');
      ctx.fillStyle = sphereGrad;
      ctx.fillRect(0, 0, width, height);

      // 4. Draw Latitude/Longitude Grid Lines
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.18)';
      ctx.lineWidth = 1;

      // Latitude lines
      for (let lat = -75; lat <= 75; lat += 25) {
        ctx.beginPath();
        let first = true;
        for (let lon = -180; lon <= 180; lon += 5) {
          const pt = project3D(lat, lon, R);
          if (pt.z > -20) {
            if (first) {
              ctx.moveTo(cx + pt.x, cy + pt.y);
              first = false;
            } else {
              ctx.lineTo(cx + pt.x, cy + pt.y);
            }
          } else {
            first = true;
          }
        }
        ctx.stroke();
      }

      // Longitude lines
      for (let lon = -180; lon < 180; lon += 30) {
        ctx.beginPath();
        let first = true;
        for (let lat = -80; lat <= 80; lat += 5) {
          const pt = project3D(lat, lon, R);
          if (pt.z > -20) {
            if (first) {
              ctx.moveTo(cx + pt.x, cy + pt.y);
              first = false;
            } else {
              ctx.lineTo(cx + pt.x, cy + pt.y);
            }
          } else {
            first = true;
          }
        }
        ctx.stroke();
      }

      // 5. Draw All 197 Country Dots on Globe
      countryGeoList.forEach((country) => {
        const pt = project3D(country.lat, country.lon, R);
        if (pt.z > 0) {
          const depthAlpha = Math.min(1, pt.z / R + 0.25);
          const isVisited = passportHistory.includes(country.id);

          ctx.beginPath();
          ctx.arc(cx + pt.x, cy + pt.y, isVisited ? 6 : 4, 0, Math.PI * 2);
          ctx.fillStyle = isVisited
            ? `rgba(245, 158, 11, ${depthAlpha})`
            : `rgba(52, 211, 153, ${depthAlpha * 0.85})`;
          ctx.fill();

          if (isVisited) {
            ctx.strokeStyle = `rgba(255, 255, 255, ${depthAlpha})`;
            ctx.lineWidth = 1.5;
            ctx.stroke();
          }
        }
      });

      // 6. Draw Shockwaves
      shockwavesRef.current.forEach((sw, sIdx) => {
        sw.radius += 3.5;
        sw.alpha -= 0.025;
        if (sw.alpha <= 0 || sw.radius > sw.maxRadius) {
          shockwavesRef.current.splice(sIdx, 1);
        } else {
          ctx.strokeStyle = `rgba(245, 158, 11, ${sw.alpha})`;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
          ctx.stroke();
        }
      });

      ctx.restore(); // end globe sphere clip

      // Globe Border
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.stroke();

      // 7. Draw Flying Dart Animation
      if (dartAnimRef.current.active) {
        const dart = dartAnimRef.current;
        dart.progress += 0.035;

        // Curved parabolic path
        const currentX = dart.startX + (dart.endX - dart.startX) * dart.progress;
        const currentY = dart.startY + (dart.endY - dart.startY) * dart.progress - Math.sin(dart.progress * Math.PI) * 120;
        const scale = 2.0 - dart.progress * 1.1;

        ctx.save();
        ctx.translate(currentX, currentY);
        ctx.scale(scale, scale);
        ctx.font = '36px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🎯', 0, 0);
        ctx.restore();

        // Check impact
        if (dart.progress >= 1.0) {
          dart.active = false;
          setIsThrowing(false);

          // Add shockwaves at impact
          shockwavesRef.current.push(
            { x: dart.endX, y: dart.endY, radius: 5, maxRadius: 100, alpha: 1 },
            { x: dart.endX, y: dart.endY, radius: 2, maxRadius: 65, alpha: 1 }
          );

          // Find closest country to hit coordinates
          let bestCountry = countryGeoList[0];
          let minDist = 999999;

          countryGeoList.forEach((c) => {
            const pt = project3D(c.lat, c.lon, R);
            if (pt.z > -50) {
              const dist = Math.hypot((cx + pt.x) - dart.endX, (cy + pt.y) - dart.endY);
              if (dist < minDist) {
                minDist = dist;
                bestCountry = c;
              }
            }
          });

          const foundFlag = allFlags.find((f) => f.id === bestCountry.id) || allFlags[0];
          setSelectedTicket({ geo: bestCountry, flag: foundFlag });

          // Add to passport if not already collected
          setPassportHistory((prev) => {
            if (!prev.includes(bestCountry.id)) {
              return [bestCountry.id, ...prev];
            }
            return prev;
          });
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [activeTab, passportHistory]);

  // Pointer/Mouse handlers for manual rotation
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isThrowing) return;
    isDraggingRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current || isThrowing) return;
    const dx = e.clientX - lastMousePosRef.current.x;
    const dy = e.clientY - lastMousePosRef.current.y;
    rotLonRef.current += dx * 0.007;
    rotLatRef.current = Math.max(-1.0, Math.min(1.0, rotLatRef.current + dy * 0.007));
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = false;
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  // Throw Dart Function
  const handleThrowDart = () => {
    if (isThrowing || !canvasRef.current) return;
    setIsThrowing(true);

    // Pick a random target spot on the front hemisphere or slightly near a country
    const targetCountry = countryGeoList[Math.floor(Math.random() * countryGeoList.length)];
    const pt = project3D(targetCountry.lat, targetCountry.lon, 230);

    // If target is on the back side, smoothly snap longitude around so it faces front!
    if (pt.z <= 0) {
      const neededLonRad = -((targetCountry.lon * Math.PI) / 180);
      rotLonRef.current = neededLonRad;
    }

    const newPt = project3D(targetCountry.lat, targetCountry.lon, 230);
    const canvasW = canvasRef.current.width;
    const canvasH = canvasRef.current.height;

    dartAnimRef.current = {
      active: true,
      progress: 0,
      startX: canvasW / 2,
      startY: canvasH + 40,
      endX: canvasW / 2 + newPt.x,
      endY: canvasH / 2 + newPt.y,
      hitLat: targetCountry.lat,
      hitLon: targetCountry.lon
    };
  };

  return (
    <div className="darts-trip-container animate-fade-in">
      <div className="darts-trip-header">
        <h1 className="darts-trip-title">
          {language === 'ja' ? '地球儀ダーツの旅' : 'Globe Dart Trip World Tour'}
        </h1>
        <p className="darts-trip-subtitle">
          {language === 'ja'
            ? 'ゆっくり回る3D地球儀に向かってダーツを投げよう！命中した旅行先の国旗・名所・絶品グルメの航空券が発行されます。'
            : 'Throw a dart at the spinning 3D globe! Discover your next travel destination with custom boarding pass tickets.'}
        </p>
      </div>

      {/* Tabs */}
      <div className="darts-tabs-nav">
        <button
          className={`darts-tab-btn ${activeTab === 'globe' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('globe');
            setSelectedTicket(null);
          }}
        >
          🌐 {language === 'ja' ? '地球儀ダーツに挑戦' : 'Throw Dart'}
        </button>
        <button
          className={`darts-tab-btn ${activeTab === 'passport' ? 'active' : ''}`}
          onClick={() => setActiveTab('passport')}
        >
          📖 {language === 'ja'
            ? `制覇パスポート履歴 (${passportHistory.length} / 197カ国)`
            : `My Passport (${passportHistory.length} / 197)`}
        </button>
      </div>

      {activeTab === 'globe' ? (
        <div className="globe-stage-card animate-fade-in">
          <div className="globe-status-banner">
            🎯 {language === 'ja'
              ? '地球儀をドラッグして回すこともできます！準備ができたらダーツを投げてみよう！'
              : 'Drag to spin the globe or click Throw Dart right now!'}
          </div>

          <div className="globe-canvas-wrapper">
            <canvas
              ref={canvasRef}
              width={580}
              height={580}
              className="globe-canvas"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
            />
          </div>

          <div className="dart-throw-container">
            <button
              className="dart-throw-btn"
              onClick={handleThrowDart}
              disabled={isThrowing}
            >
              🎯 {isThrowing
                ? (language === 'ja' ? 'ダーツ飛行中…！' : 'Dart Flying...!')
                : (language === 'ja' ? 'ダーツを投げる！ (運命の国決定)' : 'Throw Dart! (Pick Country)')}
            </button>
          </div>
        </div>
      ) : (
        /* Passport History Tab */
        <div className="passport-collection-card animate-fade-in">
          <div className="passport-header">
            <h2 className="passport-title">
              📖 {language === 'ja' ? 'あなたの旅行先スタンプ・コレクション' : 'Your Visited Destination Stamps'}
            </h2>
            <div className="passport-count-badge">
              {language === 'ja'
                ? `制覇率: ${Math.round((passportHistory.length / 197) * 100)}% (${passportHistory.length}/197カ国)`
                : `${passportHistory.length} of 197 Countries Collected`}
            </div>
          </div>

          {passportHistory.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#94a3b8', fontSize: '1.1rem' }}>
              {language === 'ja'
                ? 'まだ旅行先スタンプがありません。「地球儀ダーツに挑戦」タブからダーツを投げて最初の国を獲得しよう！'
                : 'No destinations visited yet. Switch to the Globe tab and throw your first dart!'}
            </div>
          ) : (
            <div className="passport-grid">
              {passportHistory.map((countryId) => {
                const foundFlag = allFlags.find((f) => f.id === countryId);
                const foundGeo = countryGeoList.find((g) => g.id === countryId);
                if (!foundFlag || !foundGeo) return null;

                return (
                  <div
                    key={countryId}
                    className="passport-stamp-item"
                    onClick={() => setSelectedTicket({ geo: foundGeo, flag: foundFlag })}
                  >
                    <div className="stamp-emoji">{foundFlag.flag}</div>
                    <div className="stamp-name">{language === 'ja' ? foundFlag.nameJa : foundFlag.nameEn}</div>
                    <div className="stamp-region">{language === 'ja' ? foundGeo.regionJa : foundGeo.regionEn}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Boarding Pass Ticket & Travel Guide Modal */}
      {selectedTicket !== null && (
        <div className="dart-modal-overlay" onClick={() => setSelectedTicket(null)}>
          <div className="dart-ticket-card" onClick={(e) => e.stopPropagation()}>
            <div className="dart-ticket-header">
              <div className="dart-ticket-brand">
                ✈️ SUZUTAKU GLOBE AIRWAYS
              </div>
              <div className="dart-ticket-class">
                🎯 {language === 'ja' ? '旅行先決定 PASS' : 'DART DESTINATION PASS'}
              </div>
            </div>

            <div className="dart-ticket-body">
              <div className="dart-ticket-flag-box">
                {selectedTicket.flag.flag}
              </div>

              <div className="dart-ticket-info">
                <div className="ticket-label">
                  {language === 'ja' ? '次の旅行先・目的地' : 'NEXT TRAVEL DESTINATION'}
                </div>
                <div className="ticket-destination-name">
                  {language === 'ja' ? selectedTicket.flag.nameJa : selectedTicket.flag.nameEn}
                </div>
                <div className="ticket-destination-en">
                  {language === 'ja' ? selectedTicket.flag.nameEn : selectedTicket.flag.nameJa}
                </div>

                <div className="ticket-meta-grid">
                  <div className="ticket-meta-item">
                    <div className="ticket-label">{language === 'ja' ? 'エリア・地域' : 'REGION'}</div>
                    <div className="ticket-meta-value">
                      {language === 'ja' ? selectedTicket.geo.regionJa : selectedTicket.geo.regionEn}
                    </div>
                  </div>
                  <div className="ticket-meta-item">
                    <div className="ticket-label">{language === 'ja' ? '命中座標' : 'COORDINATES'}</div>
                    <div className="ticket-meta-value">
                      {Math.abs(selectedTicket.geo.lat).toFixed(1)}°{selectedTicket.geo.lat >= 0 ? 'N' : 'S'}, {Math.abs(selectedTicket.geo.lon).toFixed(1)}°{selectedTicket.geo.lon >= 0 ? 'E' : 'W'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Travel Guide Highlights */}
            <div className="travel-guide-section">
              <div className="guide-section-title">
                🗺️ {language === 'ja' ? 'この国の旅行ガイド＆ご当地トリビア' : 'Travel Guide & Culture Highlights'}
              </div>

              <div className="guide-item">
                <div className="guide-item-title">
                  🏛️ {language === 'ja' ? '見どころ・おすすめ観光名所' : 'Must-Visit Attractions'}
                </div>
                <div className="guide-item-content">
                  {language === 'ja' ? selectedTicket.geo.attractionJa : selectedTicket.geo.attractionEn}
                </div>
              </div>

              <div className="guide-item" style={{ marginTop: '0.85rem' }}>
                <div className="guide-item-title">
                  🍽️ {language === 'ja' ? '必食！絶品ご当地グルメ' : 'Local Gourmet & Cuisine'}
                </div>
                <div className="guide-item-content">
                  {language === 'ja' ? selectedTicket.geo.cuisineJa : selectedTicket.geo.cuisineEn}
                </div>
              </div>

              <div className="guide-item" style={{ marginTop: '0.85rem' }}>
                <div className="guide-item-title">
                  💡 {language === 'ja' ? '国の歴史・旅のヒント' : 'Country History & Travel Vibe'}
                </div>
                <div className="guide-item-content">
                  {language === 'ja' ? selectedTicket.geo.vibeJa : selectedTicket.geo.vibeEn}
                </div>
              </div>
            </div>

            <div className="dart-ticket-actions">
              <button
                className="ticket-action-btn"
                onClick={() => {
                  setSelectedTicket(null);
                  handleThrowDart();
                }}
              >
                🔄 {language === 'ja' ? 'もう一度ダーツを投げる！' : 'Throw Dart Again!'}
              </button>
              <button
                className="ticket-close-btn"
                onClick={() => setSelectedTicket(null)}
              >
                ✕ {language === 'ja' ? '閉じる' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
