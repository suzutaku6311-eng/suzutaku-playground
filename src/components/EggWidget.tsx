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

  return (
    <div className="egg-widget-area">
      {stage !== 'hatched' && (
        <div
          className={`egg-container egg-${stage}`}
          onClick={handleClick}
          title={stage === 'idle' ? 'なんか聞こえる…？' : 'もう一回！'}
        >
          {/* Crack lines */}
          {(stage === 'cracking') && (
            <svg className="egg-cracks" viewBox="0 0 80 96" width="80" height="96">
              <path d="M40 20 L35 35 L45 40 L38 55" stroke="#8B6914" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M30 30 L25 42 L33 45" stroke="#8B6914" strokeWidth="2" fill="none" strokeLinecap="round" />
              <path d="M50 25 L55 38 L48 44" stroke="#8B6914" strokeWidth="2" fill="none" strokeLinecap="round" />
            </svg>
          )}

          {/* Egg SVG */}
          <svg viewBox="0 0 80 96" width="80" height="96" className="egg-svg">
            <defs>
              <radialGradient id="eggGrad" cx="38%" cy="35%" r="60%">
                <stop offset="0%" stopColor="#FFF9E6" />
                <stop offset="60%" stopColor="#FDE8A0" />
                <stop offset="100%" stopColor="#F0C040" />
              </radialGradient>
            </defs>
            <ellipse cx="40" cy="54" rx="30" ry="36" fill="url(#eggGrad)" />
            <ellipse cx="40" cy="40" rx="22" ry="28" fill="url(#eggGrad)" />
            <ellipse cx="30" cy="30" rx="7" ry="10" fill="rgba(255,255,255,0.45)" transform="rotate(-15 30 30)" />
            <circle cx="28" cy="58" r="4" fill="rgba(255,150,180,0.5)" />
            <circle cx="52" cy="65" r="3" fill="rgba(150,220,255,0.5)" />
            <circle cx="42" cy="50" r="3.5" fill="rgba(200,255,150,0.5)" />
          </svg>
        </div>
      )}

      {/* Hatched Rabbit */}
      {stage === 'hatched' && (
        <div className="hatch-scene">
          {/* Shell halves */}
          <svg className="shell-left" viewBox="0 0 50 60" width="50" height="60">
            <path d="M25 0 Q0 10 0 40 L25 40 Z" fill="#F0C040" />
            <path d="M25 0 Q8 8 6 35 L22 38 Z" fill="#FFF0A0" opacity="0.6" />
          </svg>
          <svg className="shell-right" viewBox="0 0 50 60" width="50" height="60">
            <path d="M25 0 Q50 10 50 40 L25 40 Z" fill="#F0C040" />
          </svg>

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
          </div>
        </div>
      )}
    </div>
  );
};
