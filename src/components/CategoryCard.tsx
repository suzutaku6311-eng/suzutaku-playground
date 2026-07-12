import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import type { Category } from '../data/categories';
import './CategoryCard.css';

interface CategoryCardProps {
  category: Category;
}

const renderCategoryIcon = (id: string) => {
  switch (id) {
    case 'japan':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {/* 日の丸風円 */}
          <circle cx="12" cy="12" r="6" fill="currentColor" stroke="none" opacity="0.15" />
          <circle cx="12" cy="12" r="8" />
          <path d="M12 2v2M12 20v2M2 12h2M20 12h2" />
        </svg>
      );
    case 'science':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {/* フラスコ */}
          <path d="M6 3h12" />
          <path d="M9 3v4.5A4.5 4.5 0 0 0 4.5 12h0a4.5 4.5 0 0 0 4.5 4.5h6a4.5 4.5 0 0 0 4.5-4.5h0A4.5 4.5 0 0 0 15 7.5V3" />
          <path d="M6.5 12h11" />
        </svg>
      );
    case 'fun':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {/* スマイル、またはビックリ箱 */}
          <circle cx="12" cy="12" r="10" />
          <path d="M8 14s1.5 2 4 2 4-2 4-2" />
          <line x1="9" y1="9" x2="9.01" y2="9" />
          <line x1="15" y1="15" x2="15.01" y2="15" stroke="none" /> {/* ダミー */}
          <line x1="15" y1="9" x2="15.01" y2="9" />
        </svg>
      );
    default:
      return null;
  }
};

export const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/category/${category.id}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <article 
      className="category-card"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      style={{ '--category-color': category.colorVar } as React.CSSProperties}
    >
      <div className="category-icon-wrapper">
        {renderCategoryIcon(category.id)}
      </div>

      <h3 className="category-card-title">{t(category.nameKey)}</h3>
      <p className="category-card-desc">{t(category.descKey)}</p>

      <div className="category-card-footer">
        <span>{t('home.learnMore')}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </div>
    </article>
  );
};
