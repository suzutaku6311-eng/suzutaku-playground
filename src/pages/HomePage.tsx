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
            {/* 大きめのコンビニSVGアート */}
            <svg viewBox="0 0 400 225" width="100%" height="100%" style={{ maxHeight: '300px' }}>
              <defs>
                <linearGradient id="featuredGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#E94B3C" />
                  <stop offset="100%" stopColor="#FF8A7A" />
                </linearGradient>
              </defs>
              <rect width="100%" height="100%" fill="url(#featuredGrad)" />
              {/* おにぎりの影 */}
              <polygon points="200,60 120,180 280,180" fill="rgba(28, 28, 28, 0.1)" transform="translate(6, 6)" />
              {/* おにぎり本体 */}
              <polygon points="200,60 120,180 280,180" fill="#FFFFFF" />
              {/* のり */}
              <rect x="175" y="140" width="50" height="40" fill="#1C1C1C" rx="4" />
              {/* コイン (100) */}
              <circle cx="290" cy="100" r="24" fill="#D1D5DB" stroke="#9CA3AF" strokeWidth="2.5" />
              <text x="290" y="107" fill="#4B5563" fontSize="15" fontWeight="900" textAnchor="middle">100</text>
              {/* コイン (500) */}
              <circle cx="100" cy="110" r="30" fill="#FBBF24" stroke="#F59E0B" strokeWidth="2.5" />
              <text x="100" y="118" fill="#78350F" fontSize="18" fontWeight="900" textAnchor="middle">500</text>
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
