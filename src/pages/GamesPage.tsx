import React from 'react';
import { useParams, NavLink } from 'react-router-dom';
import { games } from '../data/games';
import { GameCard } from '../components/GameCard';
import { EggWidget } from '../components/EggWidget';
import './GamesPage.css';

type FilterType = 'all' | 'japan' | 'science' | 'fun';

export const GamesPage: React.FC = () => {
  const { category } = useParams<{ category?: FilterType }>();
  const activeFilter = category ?? 'all';

  const filteredGames = games.filter(game => {
    if (activeFilter === 'all') return true;
    return game.category === activeFilter;
  });

  return (
    <div className="container games-page animate-fade-in">
      <div className="page-header">
        <nav className="sub-nav">
          <NavLink to="/games" className={({ isActive }) => `sub-link ${isActive ? 'active' : ''}`}>All</NavLink>
          <NavLink to="/games/japan" className={({ isActive }) => `sub-link ${isActive ? 'active' : ''}`}>Japan</NavLink>
          <NavLink to="/games/science" className={({ isActive }) => `sub-link ${isActive ? 'active' : ''}`}>Science</NavLink>
          <NavLink to="/games/fun" className={({ isActive }) => `sub-link ${isActive ? 'active' : ''}`}>Fun</NavLink>
        </nav>
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

      <EggWidget />
    </div>
  );
};
