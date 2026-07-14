import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { games } from '../data/games';
import { categories } from '../data/categories';
import { GameCard } from '../components/GameCard';
import { CategoryCard } from '../components/CategoryCard';
import './HomePage.css';

export const HomePage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  // フィーチャードゲーム (コンビニゲーム)
  const featuredGame = games.find(g => g.featured) || games[0];
  // 最新のゲーム (フィーチャード以外のゲーム、または全体から最大3件)
  const latestGames = games.filter(g => g.id !== featuredGame.id).slice(0, 3);

  const handlePlayFeatured = () => {
    navigate(featuredGame.route);
  };

  return (
    <div className="homepage animate-fade-in">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-bg-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
        </div>
        <div className="container hero-content">
          <h1 className="hero-title">{t('hero.title')}</h1>
          <p className="hero-tagline">{t('hero.tagline')}</p>
          <p className="hero-desc">{t('hero.description')}</p>
          <div className="hero-buttons">
            <button onClick={handlePlayFeatured} className="btn btn-primary">
              {t('hero.playBtn')}
            </button>
            <Link to="/games" className="btn btn-secondary">
              {t('hero.browseBtn')}
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Game */}
      <section className="container">
        <div className="section-header">
          <h2 className="section-title">{t('home.featured')}</h2>
        </div>
        <div className="featured-card" onClick={handlePlayFeatured} style={{ cursor: 'pointer' }}>
          <div className="featured-thumbnail">
            {/* 大きめの宇宙スケールSVGアート */}
            <svg viewBox="0 0 400 225" width="100%" height="100%" style={{ maxHeight: '300px' }}>
              <defs>
                <linearGradient id="featuredUniverseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0B132B" />
                  <stop offset="100%" stopColor="#1C2541" />
                </linearGradient>
              </defs>
              <rect width="100%" height="100%" fill="url(#featuredUniverseGrad)" />
              <circle cx="80" cy="50" r="2" fill="#FFFFFF" opacity="0.8" />
              <circle cx="320" cy="160" r="1.5" fill="#FFFFFF" opacity="0.6" />
              <circle cx="150" cy="180" r="2.5" fill="#FFFFFF" opacity="0.9" />
              <circle cx="280" cy="60" r="2" fill="#FFFFFF" opacity="0.5" />
              <ellipse cx="200" cy="112" rx="50" ry="50" fill="#F4E285" />
              <ellipse cx="200" cy="112" rx="85" ry="18" fill="none" stroke="#BC986A" strokeWidth="8" transform="rotate(-15 200 112)" opacity="0.9" />
              <circle cx="200" cy="112" r="95" fill="none" stroke="#38BDF8" strokeWidth="1.5" strokeDasharray="6 12" opacity="0.3" />
            </svg>
            <span className={`badge badge-${featuredGame.category}`} style={{ position: 'absolute', top: '16px', left: '16px', zIndex: 3 }}>
              {t(`nav.${featuredGame.category}`)}
            </span>
          </div>
          <div className="featured-content">
            <span className="featured-label">{t('home.featured')}</span>
            <h3 className="featured-title">{t(featuredGame.titleKey)}</h3>
            <p className="featured-desc">{t(featuredGame.descKey)}</p>
            
            <div className="featured-meta">
              <div className="featured-meta-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span>{featuredGame.playTime} {t('gameCard.time')}</span>
              </div>
            </div>

            <div className="featured-btn-wrap">
              <span className="btn btn-primary">
                {t('gameCard.play')}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Games */}
      {latestGames.length > 0 && (
        <section className="container">
          <div className="section-header">
            <h2 className="section-title">{t('home.latest')}</h2>
            <Link to="/games" className="text-muted" style={{ fontWeight: 700, fontSize: '0.9rem' }}>
              {t('hero.browseBtn')} &rarr;
            </Link>
          </div>
          <div className="grid grid-3">
            {latestGames.map(game => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </section>
      )}

      {/* Browse by Category */}
      <section className="container">
        <div className="section-header">
          <h2 className="section-title">{t('categories.title')}</h2>
        </div>
        <div className="grid grid-3">
          {categories.map(category => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      {/* About Section */}
      <section className="container">
        <div className="home-about-section">
          <div className="shape shape-1" style={{ opacity: 0.1, width: '150px', height: '150px' }}></div>
          <div className="home-about-content">
            <h2 className="home-about-title">{t('home.aboutTitle')}</h2>
            <p className="home-about-desc">{t('home.aboutDesc')}</p>
            <Link to="/about" className="btn btn-secondary">
              {t('home.learnMore')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
