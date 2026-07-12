import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import './NotFoundPage.css';

export const NotFoundPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="container notfound-page animate-fade-in">
      <div className="notfound-code" aria-hidden="true">404</div>
      <h1 className="notfound-title">{t('notFound.title')}</h1>
      <p className="notfound-desc">{t('notFound.desc')}</p>
      <Link to="/" className="btn btn-primary">
        {t('notFound.backHome')}
      </Link>
    </div>
  );
};
