import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { track } from '@vercel/analytics';
import { useLanguage } from '../../i18n/LanguageContext';
import { universeObjects } from './universeData';
import './universe.css';

export const UniverseGame: React.FC = () => {
  const { t, language } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState<number>(7); // 初期位置は人間 (index: 7, 10^0 m)

  const activeObject = universeObjects[currentIndex];

  const updateIndex = (newIndex: number) => {
    setCurrentIndex(newIndex);
    
    // Analytics: 極端なスケールに達した時のみ追跡
    if (newIndex === 0) {
      track('universe_extreme_zoom', { limit: 'micro' });
    } else if (newIndex === universeObjects.length - 1) {
      track('universe_extreme_zoom', { limit: 'macro' });
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateIndex(parseInt(e.target.value, 10));
  };

  const stepUp = () => {
    if (currentIndex < universeObjects.length - 1) {
      updateIndex(currentIndex + 1);
    }
  };

  const stepDown = () => {
    if (currentIndex > 0) {
      updateIndex(currentIndex - 1);
    }
  };

  // スライダーの進行状況%
  const sliderPercentage = (currentIndex / (universeObjects.length - 1)) * 100;

  return (
    <div className="container universe-game-container ">
      <div className="universe-header">
        <Link to="/" className="back-btn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          {t('konbini.back')}
        </Link>
        <h1 className="page-title">{language === 'ja' ? '宇宙のスケール' : 'Scale of the Universe'}</h1>
      </div>

      {/* Main Viewer Area */}
      <div className="universe-viewer">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeObject.id}
            className="universe-svg-container"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.4, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          >
            {activeObject.renderSvg()}
          </motion.div>
        </AnimatePresence>

        <div className="scale-label-overlay">
          10<sup>{activeObject.exponent}</sup> m
        </div>
      </div>

      {/* Control Slider */}
      <div className="universe-controls">
        <div className="slider-wrapper">
          <div className="slider-header">
            <button 
              className="qty-btn" 
              onClick={stepDown} 
              disabled={currentIndex === 0}
              aria-label="Zoom In"
            >
              -
            </button>
            <span>{language === 'ja' ? 'スライダーを動かしてズーム' : 'Drag to zoom'}</span>
            <button 
              className="qty-btn" 
              onClick={stepUp} 
              disabled={currentIndex === universeObjects.length - 1}
              aria-label="Zoom Out"
            >
              +
            </button>
          </div>

          <input 
            type="range"
            min={0}
            max={universeObjects.length - 1}
            value={currentIndex}
            onChange={handleSliderChange}
            className="universe-slider"
            style={{
              background: `linear-gradient(to right, var(--accent-science) 0%, var(--accent-science) ${sliderPercentage}%, var(--card-border) ${sliderPercentage}%, var(--card-border) 100%)`
            }}
            aria-label="Scale level slider"
          />

          <div className="slider-labels-helper">
            <span>{language === 'ja' ? '極小 (10^-18m)' : 'Micro (10^-18m)'}</span>
            <span>10<sup>0</sup>m</span>
            <span>{language === 'ja' ? '極大 (10^26m)' : 'Macro (10^26m)'}</span>
          </div>
        </div>
      </div>

      {/* Object Details */}
      <div className="object-details-card">
        <div className="details-header">
          <h2 className="details-title">
            {language === 'ja' ? activeObject.nameJa : activeObject.nameEn}
          </h2>
          <span className="details-size">{activeObject.sizeStr}</span>
        </div>
        <p className="details-desc">
          {language === 'ja' ? activeObject.descJa : activeObject.descEn}
        </p>
      </div>
    </div>
  );
};
export default UniverseGame;
