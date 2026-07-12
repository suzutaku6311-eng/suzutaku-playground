import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { categories } from '../data/categories';
import { games } from '../data/games';
import { GameCard } from '../components/GameCard';
import { NotFoundPage } from './NotFoundPage';
import './CategoryPage.css';

export const CategoryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();

  const category = categories.find(c => c.id === id);

  if (!category) {
    return <NotFoundPage />;
  }

  const categoryGames = games.filter(g => g.category === id);

  return (
    <div className="container category-page animate-fade-in" style={{ '--category-color': category.colorVar } as React.CSSProperties}>
      <Link to="/games" className="back-to-all">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        {t('hero.browseBtn')}
      </Link>

      <div className="category-header">
        <h1 className="category-title">{t(category.nameKey)}</h1>
        <p className="category-desc">{t(category.descKey)}</p>
      </div>

      {categoryGames.length > 0 ? (
        <div className="grid grid-3">
          {categoryGames.map(game => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      ) : (
        <div className="no-games-message">
          <p>No games in this category yet. Coming soon!</p>
        </div>
      )}
    </div>
  );
};
