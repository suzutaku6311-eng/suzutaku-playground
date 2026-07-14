import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import './Header.css';

export const Header: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="container header-container">
        <Link to="/" className="logo" onClick={closeMenu}>
          Suzutaku Playground
          <span className="logo-dot"></span>
        </Link>

        <nav className="nav-links">
          <NavLink to="/games" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            {t('nav.games')}
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            {t('nav.about')}
          </NavLink>
        </nav>

        <div className="nav-right">
          {/* Language Switch */}
          <div className="lang-switch">
            <button 
              className={`lang-btn ${language === 'en' ? 'active' : ''}`}
              onClick={() => setLanguage('en')}
              aria-label="Switch to English"
              title="English (UK/US)"
            >
              <svg width="38" height="38" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <clipPath id="ukCircle">
                    <circle cx="50" cy="50" r="49" />
                  </clipPath>
                </defs>
                <circle cx="50" cy="50" r="49" fill="#012169" />
                <g clipPath="url(#ukCircle)">
                  <path d="M0 0 L100 100 M100 0 L0 100" stroke="#FFFFFF" strokeWidth="18" />
                  <path d="M0 0 L100 100 M100 0 L0 100" stroke="#C8102E" strokeWidth="10" />
                  <path d="M50 0 V100 M0 50 H100" stroke="#FFFFFF" strokeWidth="20" />
                  <path d="M50 0 V100 M0 50 H100" stroke="#C8102E" strokeWidth="12" />
                </g>
                <circle cx="50" cy="50" r="49" fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth="2" />
              </svg>
            </button>
            <button 
              className={`lang-btn ${language === 'ja' ? 'active' : ''}`}
              onClick={() => setLanguage('ja')}
              aria-label="日本語に切り替え"
              title="日本語"
            >
              <svg width="38" height="38" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="49" fill="#FFFFFF" stroke="rgba(0,0,0,0.12)" strokeWidth="2" />
                <circle cx="50" cy="50" r="23" fill="#BC002D" />
              </svg>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className={`menu-toggle ${isMenuOpen ? 'open' : ''}`}
            onClick={toggleMenu}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      <nav className={`mobile-nav ${isMenuOpen ? 'open' : ''}`}>
        <NavLink 
          to="/games" 
          className={({ isActive }) => `mobile-link ${isActive ? 'active' : ''}`}
          onClick={closeMenu}
        >
          {t('nav.games')}
        </NavLink>
        <NavLink 
          to="/about" 
          className={({ isActive }) => `mobile-link ${isActive ? 'active' : ''}`}
          onClick={closeMenu}
        >
          {t('nav.about')}
        </NavLink>
      </nav>
    </header>
  );
};
