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

        {/* Desktop Navigation */}
        <nav className="nav-links">
          <NavLink to="/games" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            {t('nav.games')}
          </NavLink>
          <NavLink to="/category/japan" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            {t('nav.japan')}
          </NavLink>
          <NavLink to="/category/science" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            {t('nav.science')}
          </NavLink>
          <NavLink to="/category/fun" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            {t('nav.fun')}
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
            >
              EN
            </button>
            <button 
              className={`lang-btn ${language === 'ja' ? 'active' : ''}`}
              onClick={() => setLanguage('ja')}
              aria-label="日本語に切り替え"
            >
              日本語
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
          to="/category/japan" 
          className={({ isActive }) => `mobile-link ${isActive ? 'active' : ''}`}
          onClick={closeMenu}
        >
          {t('nav.japan')}
        </NavLink>
        <NavLink 
          to="/category/science" 
          className={({ isActive }) => `mobile-link ${isActive ? 'active' : ''}`}
          onClick={closeMenu}
        >
          {t('nav.science')}
        </NavLink>
        <NavLink 
          to="/category/fun" 
          className={({ isActive }) => `mobile-link ${isActive ? 'active' : ''}`}
          onClick={closeMenu}
        >
          {t('nav.fun')}
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
