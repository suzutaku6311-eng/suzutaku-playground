import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import type { Game } from '../data/games';
import './GameCard.css';

interface GameCardProps {
  game: Game;
}

// サムネイル用のSVGアートを描画するヘルパー
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
          {/* おにぎりの影 */}
          <polygon points="160,50 100,140 220,140" fill="rgba(28, 28, 28, 0.1)" transform="translate(4, 4)" />
          {/* おにぎり本体 */}
          <polygon points="160,50 100,140 220,140" fill="#FFFFFF" />
          {/* のり */}
          <rect x="140" y="110" width="40" height="30" fill="#1C1C1C" rx="4" />
          {/* コイン (100円玉) */}
          <circle cx="230" cy="80" r="18" fill="#D1D5DB" stroke="#9CA3AF" strokeWidth="2" />
          <circle cx="230" cy="80" r="12" fill="none" stroke="#9CA3AF" strokeWidth="1" strokeDasharray="3 2" />
          <text x="230" y="85" fill="#4B5563" fontSize="12" fontWeight="900" textAnchor="middle">100</text>
          {/* コイン (500円玉) */}
          <circle cx="90" cy="90" r="22" fill="#FBBF24" stroke="#F59E0B" strokeWidth="2" />
          <text x="90" y="96" fill="#78350F" fontSize="14" fontWeight="900" textAnchor="middle">500</text>
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
          {/* 星々 */}
          <circle cx="60" cy="40" r="1.5" fill="#FFFFFF" opacity="0.8" />
          <circle cx="260" cy="130" r="1" fill="#FFFFFF" opacity="0.6" />
          <circle cx="120" cy="140" r="2" fill="#FFFFFF" opacity="0.9" />
          <circle cx="220" cy="50" r="1.5" fill="#FFFFFF" opacity="0.5" />
          {/* 土星本体 */}
          <ellipse cx="160" cy="90" rx="35" ry="35" fill="#F4E285" />
          {/* 環 */}
          <ellipse cx="160" cy="90" rx="55" ry="12" fill="none" stroke="#BC986A" strokeWidth="6" transform="rotate(-15 160 90)" opacity="0.9" />
          {/* 星雲の軌道 */}
          <circle cx="160" cy="90" r="70" fill="none" stroke="#38BDF8" strokeWidth="1" strokeDasharray="5 10" opacity="0.3" />
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
          {/* ネオンボタンのベース */}
          <rect x="100" y="50" width="120" height="80" rx="20" fill="#1C1C1C" stroke="#FF007F" strokeWidth="3" />
          {/* 赤いボタン部分 */}
          <circle cx="160" cy="90" r="28" fill="#EF4444" filter="drop-shadow(0 0 8px #EF4444)" />
          <circle cx="160" cy="90" r="24" fill="#DC2626" />
          <path d="M152 80 C 158 84, 162 84, 168 80" stroke="#FFAAAA" strokeWidth="2" strokeLinecap="round" fill="none" />
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
        
        {/* Category Badge */}
        <span className={`badge badge-${game.category} game-card-category`}>
          {t(`nav.${game.category}`)}
        </span>

        {/* Status Badge (coming soon のみ表示、または updated 等) */}
        {game.status !== 'play' && (
          <span className="game-card-status">
            {t(`gameCard.${game.status === 'coming_soon' ? 'comingSoon' : game.status}`)}
          </span>
        )}
      </div>

      <div className="game-card-content">
        <h3 className="game-card-title">{t(game.titleKey)}</h3>
        <p className="game-card-desc">{t(game.descKey)}</p>
        
        <div className="game-card-footer">
          <div className="game-card-time">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>{game.playTime} {t('gameCard.time')}</span>
          </div>

          {isPlayable && (
            <span className="game-card-btn">
              {t('gameCard.play')}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </span>
          )}
        </div>
      </div>
    </article>
  );
};
