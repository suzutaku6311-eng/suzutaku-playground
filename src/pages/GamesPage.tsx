import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { games } from '../data/games';
import { GameCard } from '../components/GameCard';
import './GamesPage.css';

type FilterType = 'all' | 'japan' | 'science' | 'fun';

export const GamesPage: React.FC = () => {
  const { t } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const filteredGames = games.filter(game => {
    if (activeFilter === 'all') return true;
    return game.category === activeFilter;
  });

  return (
    <div className="container games-page animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">{t('nav.games')}</h1>
        <p className="page-subtitle">{t('hero.description')}</p>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        <button 
          className={`filter-tab ${activeFilter === 'all' ? 'active' : ''}`}
          onClick={() => setActiveFilter('all')}
        >
          All
        </button>
        <button 
          className={`filter-tab tab-japan ${activeFilter === 'japan' ? 'active' : ''}`}
          onClick={() => setActiveFilter('japan')}
        >
          {t('nav.japan')}
        </button>
        <button 
          className={`filter-tab tab-science ${activeFilter === 'science' ? 'active' : ''}`}
          onClick={() => setActiveFilter('science')}
        >
          {t('nav.science')}
        </button>
        <button 
          className={`filter-tab tab-fun ${activeFilter === 'fun' ? 'active' : ''}`}
          onClick={() => setActiveFilter('fun')}
        >
          {t('nav.fun')}
        </button>
      </div>

      {/* Games Grid */}
      {filteredGames.length > 0 ? (
        <div className="grid grid-3">
          {filteredGames.map(game => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      ) : (
        <div className="no-games-message">
          <p>No games found in this category.</p>
        </div>
      )}
    </div>
  );
};
