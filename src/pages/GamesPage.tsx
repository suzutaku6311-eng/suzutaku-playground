import React from 'react';
import { useParams } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { games } from '../data/games';
import { GameCard } from '../components/GameCard';
import './GamesPage.css';

type FilterType = 'all' | 'japan' | 'science' | 'fun';

export const GamesPage: React.FC = () => {
  const { t } = useLanguage();
  const { category } = useParams<{ category?: FilterType }>();
  const activeFilter = category ?? 'all';

  const filteredGames = games.filter(game => {
    if (activeFilter === 'all') return true;
    return game.category === activeFilter;
  });

  return (
    <div className="container games-page animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">{t('nav.games')}</h1>
        <p className="games-subtitle">All Japan Science Fun</p>
      </div>

      {/* Category line */}
      <p className="games-categories">All Japan Science Fun</p>

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
