import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import type { Game } from '../data/games';
import './GameCard.css';

interface GameCardProps {
  game: Game;
}

const renderThumbnailArt = (id: string) => {
  switch (id) {
    case 'konbini-1000':
      return (
        <svg viewBox="0 0 320 180" width="100%" height="100%" className="thumbnail-visual">
          <defs>
            <linearGradient id="konbiniGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E94B3C" />
              <stop offset="100%" stopColor="#FF8A7A" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#konbiniGrad)" />
          <polygon points="160,30 85,130 235,130" fill="rgba(28, 28, 28, 0.1)" transform="translate(4, 4)" />
          <polygon points="160,30 85,130 235,130" fill="#FFFFFF" />
          <rect x="135" y="100" width="50" height="30" fill="#1C1C1C" rx="4" />
          <circle cx="255" cy="65" r="22" fill="#D1D5DB" stroke="#9CA3AF" strokeWidth="2" />
          <text x="255" y="72" fill="#4B5563" fontSize="13" fontWeight="900" textAnchor="middle">100</text>
          <circle cx="70" cy="75" r="26" fill="#FBBF24" stroke="#F59E0B" strokeWidth="2" />
          <text x="70" y="82" fill="#78350F" fontSize="15" fontWeight="900" textAnchor="middle">500</text>
        </svg>
      );
    case 'universe-scale':
      return (
        <svg viewBox="0 0 320 180" width="100%" height="100%" className="thumbnail-visual">
          <defs>
            <linearGradient id="universeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0B132B" />
              <stop offset="100%" stopColor="#1C2541" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#universeGrad)" />
          <circle cx="60" cy="40" r="1.5" fill="#FFFFFF" opacity="0.8" />
          <circle cx="260" cy="130" r="1" fill="#FFFFFF" opacity="0.6" />
          <circle cx="120" cy="140" r="2" fill="#FFFFFF" opacity="0.9" />
          <circle cx="220" cy="50" r="1.5" fill="#FFFFFF" opacity="0.5" />
          <ellipse cx="160" cy="90" rx="40" ry="40" fill="#F4E285" />
          <ellipse cx="160" cy="90" rx="65" ry="14" fill="none" stroke="#BC986A" strokeWidth="7" transform="rotate(-15 160 90)" opacity="0.9" />
          <circle cx="160" cy="90" r="75" fill="none" stroke="#38BDF8" strokeWidth="1" strokeDasharray="5 10" opacity="0.3" />
        </svg>
      );
    case 'infinite-button':
      return (
        <svg viewBox="0 0 320 180" width="100%" height="100%" className="thumbnail-visual">
          <defs>
            <linearGradient id="funGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8A2BE2" />
              <stop offset="100%" stopColor="#C71585" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#funGrad)" />
          <rect x="95" y="45" width="130" height="90" rx="22" fill="#1C1C1C" stroke="#FF007F" strokeWidth="3" />
          <circle cx="160" cy="90" r="32" fill="#EF4444" filter="drop-shadow(0 0 8px #EF4444)" />
          <circle cx="160" cy="90" r="27" fill="#DC2626" />
          <path d="M150 80 C 157 85, 163 85, 170 80" stroke="#FFAAAA" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </svg>
      );
    case 'tokyo-distance':
      return (
        <img
          src="/thumbnails/tokyo-distance.jpg"
          alt="Tokyo Equivalence"
          className="thumbnail-visual"
          style={{ objectFit: 'cover', width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
        />
      );
    case 'british-sarcasm':
      return (
        <img
          src="/thumbnails/british-sarcasm.jpg"
          alt="British Sarcasm Quiz"
          className="thumbnail-visual"
          style={{ objectFit: 'cover', width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
        />
      );
    case 'dorayaki-baibain':
      return (
        <img
          src="/thumbnails/dorayaki-baibain.png"
          alt="Dorayaki Exponential Multiplier"
          className="thumbnail-visual"
          style={{ objectFit: 'cover', width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
        />
      );
    case 'kitetsu-blade-luck':
      return (
        <img
          src="/thumbnails/kitetsu-blade-luck.png"
          alt="Cursed Katana Evasion Game"
          className="thumbnail-visual"
          style={{ objectFit: 'cover', width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
        />
      );
    case 'flag-quiz':
      return (
        <svg viewBox="0 0 320 180" width="100%" height="100%" className="thumbnail-visual">
          <defs>
            <linearGradient id="flagGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0F172A" />
              <stop offset="100%" stopColor="#1E293B" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#flagGrad)" />
          <g transform="translate(60, 40)">
            {/* Pole */}
            <rect x="0" y="0" width="6" height="110" fill="#cbd5e1" rx="3" />
            <circle cx="3" cy="0" r="6" fill="#facc15" />
            {/* Flag cloth */}
            <path d="M6 10 C 60 0, 120 30, 180 10 L 180 65 C 120 85, 60 55, 6 65 Z" fill="#38bdf8" />
            <circle cx="90" cy="38" r="16" fill="#facc15" />
          </g>
        </svg>
      );
    case 'element-quiz':
      return (
        <svg viewBox="0 0 320 180" width="100%" height="100%" className="thumbnail-visual">
          <defs>
            <linearGradient id="elemGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#064E3B" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#elemGrad)" />
          <rect x="100" y="30" width="120" height="120" rx="14" fill="#0f172a" stroke="#06b6d4" strokeWidth="3" />
          <text x="115" y="55" fill="#06b6d4" fontSize="16" fontWeight="800">79</text>
          <text x="160" y="105" fill="#ffffff" fontSize="48" fontWeight="900" textAnchor="middle">Au</text>
          <text x="160" y="132" fill="#67e8f9" fontSize="14" fontWeight="700" textAnchor="middle">Gold</text>
        </svg>
      );
    case 'gravity-sim':
      return (
        <svg viewBox="0 0 320 180" width="100%" height="100%" className="thumbnail-visual">
          <defs>
            <linearGradient id="gravityGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E3A8A" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#gravityGrad)" />
          <circle cx="160" cy="50" r="24" fill="#EF4444" />
          <path d="M160 78 L160 140" stroke="#FFFFFF" strokeWidth="4" strokeDasharray="6 6" strokeLinecap="round" />
          <polygon points="148,132 172,132 160,150" fill="#FFFFFF" />
          <rect x="70" y="155" width="180" height="10" fill="#1C1C1C" rx="5" />
        </svg>
      );
    case 'color-mixer':
      return (
        <svg viewBox="0 0 320 180" width="100%" height="100%" className="thumbnail-visual">
          <defs>
            <linearGradient id="colorMixerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="100%" stopColor="#F97316" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#colorMixerGrad)" />
          <g style={{ mixBlendMode: 'multiply' }}>
            <circle cx="140" cy="80" r="40" fill="#38BDF8" opacity="0.9" />
            <circle cx="180" cy="80" r="40" fill="#FB7185" opacity="0.9" />
            <circle cx="160" cy="118" r="40" fill="#FDE047" opacity="0.9" />
          </g>
        </svg>
      );
    case 'particle-playground':
      return (
        <svg viewBox="0 0 320 180" width="100%" height="100%" className="thumbnail-visual">
          <defs>
            <linearGradient id="particleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0F172A" />
              <stop offset="100%" stopColor="#334155" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#particleGrad)" />
          <circle cx="160" cy="90" r="12" fill="#FFFFFF" filter="drop-shadow(0 0 6px #FFFFFF)" />
          <circle cx="115" cy="45" r="4" fill="#A7F3D0" />
          <circle cx="205" cy="55" r="5" fill="#FDE047" />
          <circle cx="125" cy="135" r="3.5" fill="#FBCFE8" />
          <circle cx="195" cy="125" r="4.5" fill="#BAE6FD" />
          <circle cx="160" cy="22" r="3" fill="#FFFFFF" />
          <circle cx="95" cy="90" r="5" fill="#C4B5FD" />
          <circle cx="225" cy="90" r="4" fill="#FECACA" />
          <circle cx="148" cy="155" r="5.5" fill="#86EFAC" />
          <path d="M160 90 L115 45" stroke="#A7F3D0" strokeWidth="1.5" strokeDasharray="2 4" opacity="0.6" />
          <path d="M160 90 L205 55" stroke="#FDE047" strokeWidth="1.5" strokeDasharray="2 4" opacity="0.6" />
          <path d="M160 90 L125 135" stroke="#FBCFE8" strokeWidth="1.5" strokeDasharray="2 4" opacity="0.6" />
          <path d="M160 90 L195 125" stroke="#BAE6FD" strokeWidth="1.5" strokeDasharray="2 4" opacity="0.6" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 320 180" width="100%" height="100%" className="thumbnail-visual">
          <rect width="100%" height="100%" fill="#D1D5DB" />
        </svg>
      );
  }
};

export const GameCard: React.FC<GameCardProps> = ({ game }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const isPlayable = game.status === 'play' || game.status === 'prototype' || game.status === 'updated';

  const handleClick = () => {
    if (isPlayable) {
      if (game.route.startsWith('/')) {
        navigate(game.route);
      } else {
        window.location.href = game.route;
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <article 
      className={`game-card ${isPlayable ? 'playable' : 'coming-soon'}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={isPlayable ? 0 : -1}
      role={isPlayable ? 'button' : 'article'}
      aria-disabled={!isPlayable}
    >
      <div className="game-card-thumbnail">
        {renderThumbnailArt(game.id)}

        {/* Gradient overlay for text legibility */}
        <div className="game-card-overlay" />

        {/* Title embedded inside thumbnail */}
        <h3 className="game-card-title">{t(game.titleKey)}</h3>

        {/* Status Badge */}
        {game.status !== 'play' && (
          <span className="game-card-status">
            {t(`gameCard.${game.status === 'coming_soon' ? 'comingSoon' : game.status}`)}
          </span>
        )}
      </div>
    </article>
  );
};
