import React, { useState } from 'react';
import './EggWidget.css';

type EggStage = 'idle' | 'shaking' | 'cracking' | 'hatched';

export const EggWidget: React.FC = () => {
  const [stage, setStage] = useState<EggStage>('idle');
  const [clickCount, setClickCount] = useState(0);

  const handleClick = () => {
    if (stage === 'hatched') return;

    const newCount = clickCount + 1;
    setClickCount(newCount);

    if (newCount === 1) {
      setStage('shaking');
    } else if (newCount === 2) {
      setStage('cracking');
    } else if (newCount >= 3) {
      setStage('hatched');
    }
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    setStage('idle');
    setClickCount(0);
  };

  return (
    <div className="egg-widget-area">
      {stage !== 'hatched' && (
        <div
          className={`egg-container egg-${stage}`}
          onClick={handleClick}
        >
          {/* Realistic intricate crack overlay on shaking and cracking */}
          {stage === 'shaking' && (
            <img
              src="/rabbit_egg_cracks.png"
              alt=""
              className="egg-cracks cracks-subtle"
            />
          )}

          {stage === 'cracking' && (
            <img
              src="/rabbit_egg_cracks.png"
              alt=""
              className="egg-cracks cracks-heavy"
            />
          )}

          {/* Main transparent PNG Egg Image */}
          <img
            src="/rabbit_egg.png"
            alt="不思議な青い卵"
            className="egg-image"
          />
        </div>
      )}

      {/* Hatched Rabbit Scene (Click anywhere on scene to reset to egg) */}
      {stage === 'hatched' && (
        <div className="hatch-scene" onClick={handleReset}>
          {/* Realistic split shell halves */}
          <img src="/rabbit_egg_left.png" alt="割れた卵左" className="shell-left shell-half-img" />
          <img src="/rabbit_egg_right.png" alt="割れた卵右" className="shell-right shell-half-img" />

          {/* Rabbit */}
          <div className="rabbit-born">
            <svg viewBox="0 0 100 120" width="100" height="120">
              {/* Ears */}
              <ellipse cx="34" cy="28" rx="9" ry="22" fill="#F5C1C8" />
              <ellipse cx="34" cy="28" rx="5" ry="16" fill="#F9A8B8" />
              <ellipse cx="66" cy="28" rx="9" ry="22" fill="#F5C1C8" />
              <ellipse cx="66" cy="28" rx="5" ry="16" fill="#F9A8B8" />

              {/* Head */}
              <ellipse cx="50" cy="55" rx="26" ry="24" fill="#FDE8EE" />

              {/* Eyes */}
              <circle cx="41" cy="50" r="5" fill="#1C1C1C" />
              <circle cx="59" cy="50" r="5" fill="#1C1C1C" />
              <circle cx="43" cy="48" r="2" fill="#FFFFFF" />
              <circle cx="61" cy="48" r="2" fill="#FFFFFF" />
              {/* Eye shine */}
              <circle cx="44" cy="47" r="1" fill="#FFFFFF" />
              <circle cx="62" cy="47" r="1" fill="#FFFFFF" />

              {/* Nose & mouth */}
              <ellipse cx="50" cy="60" rx="4" ry="3" fill="#F9A8B8" />
              <path d="M46 63 Q50 68 54 63" fill="none" stroke="#E88" strokeWidth="1.5" strokeLinecap="round" />

              {/* Cheeks */}
              <ellipse cx="34" cy="62" rx="7" ry="5" fill="rgba(255,180,200,0.45)" />
              <ellipse cx="66" cy="62" rx="7" ry="5" fill="rgba(255,180,200,0.45)" />

              {/* Body */}
              <ellipse cx="50" cy="95" rx="22" ry="20" fill="#FDE8EE" />

              {/* Arms */}
              <ellipse cx="28" cy="90" rx="8" ry="14" fill="#FDE8EE" transform="rotate(-20 28 90)" />
              <ellipse cx="72" cy="90" rx="8" ry="14" fill="#FDE8EE" transform="rotate(20 72 90)" />

              {/* Tummy */}
              <ellipse cx="50" cy="97" rx="12" ry="11" fill="rgba(255,255,255,0.6)" />
            </svg>

            {/* Stars & hearts */}
            <div className="rabbit-sparkles">
              <span className="rb-star rb-star-1">⭐</span>
              <span className="rb-star rb-star-2">💕</span>
              <span className="rb-star rb-star-3">✨</span>
              <span className="rb-star rb-star-4">🌸</span>
              <span className="rb-star rb-star-5">⭐</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
