import React, { useState, useEffect } from 'react';
import './PlantWidget.css';

// Module-level global state preserves mushroom growth across SPA screen transitions / tab switching
// while automatically resetting to initial state when the browser window/tab is reloaded (F5 / Refresh).
let globalGrowthStage = 1;
let globalHarvestCount = 0;

export const PlantWidget: React.FC = () => {
  const [growthStage, setGrowthStage] = useState<number>(() => globalGrowthStage);
  const [isLighting, setIsLighting] = useState<boolean>(false);
  const [lightParticles, setLightParticles] = useState<number[]>([]);
  const [harvestCount, setHarvestCount] = useState<number>(() => globalHarvestCount);
  const [showHarvestBubble, setShowHarvestBubble] = useState<boolean>(false);

  // Keep global variables in sync whenever local state updates
  useEffect(() => {
    globalGrowthStage = growthStage;
  }, [growthStage]);

  useEffect(() => {
    globalHarvestCount = harvestCount;
  }, [harvestCount]);

  const handleClick = () => {
    if (isLighting) return;

    // Calculate stemHeight with 10px per tap up to exactly 700px limit
    // Base is 30px. Each stage adds +10px. Limit is 700px (stage 68).
    const maxStages = 68; // 30 + (68 - 1) * 10 = 700px

    // If fully grown to the 700px limit (stage >= 68), harvest and reset!
    if (growthStage >= maxStages) {
      setShowHarvestBubble(true);
      setHarvestCount((prev) => {
        const next = prev + 1;
        globalHarvestCount = next;
        return next;
      });
      setTimeout(() => {
        setGrowthStage(1);
        globalGrowthStage = 1;
        setShowHarvestBubble(false);
      }, 1400);
      return;
    }

    setIsLighting(true);
    setLightParticles([1, 2, 3, 4, 5, 6]);

    setTimeout(() => {
      setGrowthStage((prev) => {
        const next = prev + 1;
        globalGrowthStage = next;
        return next;
      });
    }, 120);

    setTimeout(() => {
      setLightParticles([]);
      setIsLighting(false);
    }, 1100);
  };

  // Calculate dynamic stem height: starts at 30px, grows by +10px per tap up to exactly 700px limit!
  const stemHeight = Math.min(700, 30 + (growthStage - 1) * 10);
  const svgHeight = stemHeight + 110;
  const logY = svgHeight - 18;
  const capY = logY - stemHeight;

  // The Light Lamp rises dynamically and precisely alongside the mushroom cap height!
  const lampBottom = stemHeight + 15;

  return (
    <div
      className={`mushroom-widget ${stemHeight >= 700 ? 'ready-harvest' : ''}`}
      onClick={handleClick}
      title="クリックで光を浴びせ、きのこを天まで届くほどどんどん上に伸ばす🍄"
    >
      {/* Celebration bubble ONLY during harvest animation! No tooltip text when growing */}
      {showHarvestBubble && (
        <div className="mushroom-tooltip" style={{ bottom: `${stemHeight + 80}px` }}>
          <span className="harvest-msg">✨ 超巨大きのこ大豊作！(収穫数: {harvestCount}) ✨</span>
        </div>
      )}

      {/* Magical Light Lamp & Sunbeam Cone that rises with the mushroom! */}
      <div
        className={`light-lamp-wrapper ${isLighting ? 'shining' : ''}`}
        style={{ bottom: `${lampBottom}px` }}
      >
        <svg viewBox="0 0 100 120" width="100" height="120" className="light-lamp-svg">
          {/* Golden Sunbeam Light Cone shining down over the mushroom cap */}
          <polygon
            points="70,25 20,115 90,115"
            fill="url(#lightConeGradient)"
            className="sunbeam-cone"
          />
          <defs>
            <linearGradient id="lightConeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(254, 240, 138, 0.85)" />
              <stop offset="60%" stopColor="rgba(250, 204, 21, 0.35)" />
              <stop offset="100%" stopColor="rgba(250, 204, 21, 0)" />
            </linearGradient>
          </defs>

          {/* Nature Glowing Lamp / Lantern head */}
          <circle cx="70" cy="22" r="14" fill="#fef08a" filter="drop-shadow(0 0 14px #eab308)" />
          <circle cx="70" cy="22" r="9" fill="#ffffff" />
          <path d="M60 12 L80 12 L75 4 L65 4 Z" fill="#713f12" />
          <rect x="68" y="0" width="4" height="4" fill="#a16207" />
        </svg>

        {/* Floating Sparkle Light Motes */}
        {lightParticles.map((_, i) => (
          <div
            key={i}
            className="light-mote"
            style={{
              left: `${35 + (i % 3) * 16}px`,
              top: `${30 + i * 14}px`,
              animationDelay: `${i * 0.1}s`,
            }}
          >
            ✨
          </div>
        ))}
      </div>

      {/* Mossy Log & Super-Tall Stretchy Mushroom SVG */}
      <svg
        className="mushroom-patch-svg"
        viewBox={`0 0 130 ${svgHeight}`}
        width="130"
        height={svgHeight}
        style={{ height: `${svgHeight}px` }}
      >
        {/* Earth & Moss Base Log at dynamic bottom */}
        <ellipse cx="65" cy={logY} rx="55" ry="14" fill="#3f6212" />
        <path d={`M15 ${logY} C15 ${logY + 12} 115 ${logY + 12} 115 ${logY} C115 ${logY - 6} 15 ${logY - 6} 15 ${logY} Z`} fill="#22543d" />
        {/* Moss tufts */}
        <circle cx="35" cy={logY - 4} r="10" fill="#65a30d" />
        <circle cx="65" cy={logY - 7} r="13" fill="#65a30d" />
        <circle cx="95" cy={logY - 4} r="10" fill="#65a30d" />
        <circle cx="50" cy={logY - 2} r="8" fill="#84cc16" />
        <circle cx="80" cy={logY - 2} r="8" fill="#84cc16" />

        {/* The Single Super-Tall Growing Mushroom Stalk / Stem */}
        <g className="single-mushroom-group">
          {/* Stalk/Stem growing straight up from base logY to capY */}
          <path
            d={`M 56 ${logY - 4} L 58 ${capY + 6} L 72 ${capY + 6} L 74 ${logY - 4} Z`}
            fill="#fef08a"
            stroke="#fde047"
            strokeWidth="1.5"
            className="mushroom-stalk"
          />
          {/* Stem shading */}
          <path
            d={`M 64 ${logY - 4} L 65 ${capY + 6} L 72 ${capY + 6} L 74 ${logY - 4} Z`}
            fill="#fef9c3"
            opacity="0.6"
          />

          {/* Stalk ring/skirt right below cap */}
          <ellipse cx="65" cy={capY + 16} rx="11" ry="4" fill="#fde047" />

          {/* Mushroom Cap (Rises right up to height equal to full page height!) */}
          <g transform={`translate(0, ${capY})`} className="mushroom-cap">
            <path d="M 32 6 Q 65 -22 98 6 Q 65 12 32 6 Z" fill="#ef4444" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.15))" />
            <path d="M 38 6 Q 65 11 92 6 Q 65 10 38 6 Z" fill="#fca5a5" />
            {/* White polka dots on cap */}
            <circle cx="52" cy="-4" r="4.5" fill="#ffffff" />
            <circle cx="78" cy="-3" r="4" fill="#ffffff" />
            <circle cx="65" cy="-11" r="5" fill="#ffffff" />
            <circle cx="43" cy="2" r="3" fill="#ffffff" />
            <circle cx="86" cy="2" r="3" fill="#ffffff" />
            {/* Crown sparkle when reaching 700px limit */}
            {stemHeight >= 700 && (
              <text x="56" y="-26" fontSize="18" className="king-sparkle">👑</text>
            )}
          </g>
        </g>
      </svg>
    </div>
  );
};
