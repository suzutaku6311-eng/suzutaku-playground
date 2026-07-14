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
          title={stage === 'idle' ? 'なんか聞こえる…？タップしてみて！' : 'もう一回タップ！'}
        >
          {/* Crack lines overlay when cracking */}
          {stage === 'cracking' && (
            <svg className="egg-cracks" viewBox="0 0 80 96" width="86" height="120">
              <path d="M43 20 L38 38 L48 45 L38 65" stroke="#FFFFFF" strokeWidth="3" fill="none" strokeLinecap="round" />
              <path d="M30 35 L25 48 L35 52" stroke="#FFFFFF" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M55 30 L60 45 L50 54" stroke="#FFFFFF" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            </svg>
          )}

          {/* New transparent PNG Egg Image */}
          <img
            src="/rabbit_egg.png"
            alt="不思議な卵"
            className="egg-image"
          />
          
          <div className="egg-hint">
            {stage === 'idle' ? 'タップしてみてね 🥚' : stage === 'shaking' ? '揺れている…もう一回！' : 'もう少しで生まれそう！'}
          </div>
        </div>
      )}

      {/* Hatched Rabbit Scene */}
      {stage === 'hatched' && (
        <div className="hatch-scene">
          {/* Shell halves (cutout left & right PNGs) */}
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

            <p className="rabbit-msg">うさぎが生まれたよ！🐰</p>
            <button className="rabbit-reset-btn" onClick={handleReset}>
              もう一回卵を戻す 🔄
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
