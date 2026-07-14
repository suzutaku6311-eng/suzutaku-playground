import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { track } from '@vercel/analytics';
import { useLanguage } from '../../i18n/LanguageContext';
import { universeObjects } from './universeData';
import './universe.css';

const renderFormattedSize = (str: string) => {
  const parts = str.split(/(10\^[0-9-]+)/g);
  return parts.map((part, index) => {
    const match = part.match(/10\^([0-9-]+)/);
    if (match) {
      return (
        <React.Fragment key={index}>
          10<sup>{match[1]}</sup>
        </React.Fragment>
      );
    }
    return part;
  });
};

export const UniverseGame: React.FC = () => {
  const { language } = useLanguage();
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
    <div 
      className="container universe-game-container"
      style={{
        background: `radial-gradient(circle at 50% 25%, ${activeObject.themeColor}18 0%, rgba(5,8,16,0) 65%)`
      }}
    >
      <div className="universe-header">
        <h1 className="page-title">{language === 'ja' ? '宇宙のスケール' : 'Scale of the Universe'}</h1>
      </div>

      {/* Side-by-Side Compact Stage */}
      <div className="universe-grid-stage">
        {/* Left Side: Widescreen Viewer */}
        <div className="universe-viewer" style={{ borderColor: `${activeObject.themeColor}44` }}>
          <div className="universe-category-badge" style={{ borderColor: `${activeObject.themeColor}88`, color: activeObject.themeColor }}>
            {language === 'ja' ? activeObject.categoryJa : activeObject.categoryEn}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeObject.id}
              className="universe-svg-container"
              initial={{ scale: 0.75, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.2, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              {activeObject.renderSvg()}
            </motion.div>
          </AnimatePresence>

          <div className="scale-label-overlay" style={{ borderColor: `${activeObject.themeColor}66` }}>
            10<sup>{activeObject.exponent}</sup> m
          </div>
        </div>

        {/* Right Side: Slider Deck + Details Panel */}
        <div className="universe-side-panel">
          {/* Control Slider */}
          <div className="universe-controls" style={{ borderColor: `${activeObject.themeColor}33` }}>
            <div className="slider-wrapper">
              <div className="slider-header">
                <button 
                  className="qty-btn" 
                  onClick={stepDown} 
                  disabled={currentIndex === 0}
                  aria-label="Zoom In"
                  title="縮小ズーム (-)"
                >
                  -
                </button>
                <input 
                  type="range"
                  min={0}
                  max={universeObjects.length - 1}
                  value={currentIndex}
                  onChange={handleSliderChange}
                  className="universe-slider"
                  style={{
                    background: `linear-gradient(to right, ${activeObject.themeColor} 0%, ${activeObject.themeColor} ${sliderPercentage}%, rgba(255,255,255,0.12) ${sliderPercentage}%, rgba(255,255,255,0.12) 100%)`
                  }}
                  aria-label="Scale level slider"
                />
                <button 
                  className="qty-btn" 
                  onClick={stepUp} 
                  disabled={currentIndex === universeObjects.length - 1}
                  aria-label="Zoom Out"
                  title="拡大ズーム (+)"
                >
                  +
                </button>
              </div>

              <div className="slider-labels-helper">
                <span>{language === 'ja' ? <>極小 (10<sup>-18</sup>m)</> : <>Micro (10<sup>-18</sup>m)</>}</span>
                <span>10<sup>0</sup>m</span>
                <span>{language === 'ja' ? <>極大 (10<sup>26</sup>m)</> : <>Macro (10<sup>26</sup>m)</>}</span>
              </div>
            </div>
          </div>

          {/* Object Rich Details Card */}
          <div className="object-details-card" style={{ borderColor: `${activeObject.themeColor}33` }}>
            <div className="details-header" style={{ borderBottomColor: activeObject.themeColor }}>
              <h2 className="details-title">
                {language === 'ja' ? activeObject.nameJa : activeObject.nameEn}
              </h2>
              <span className="details-size" style={{ color: activeObject.themeColor }}>
                {renderFormattedSize(activeObject.sizeStr)}
              </span>
            </div>
            <p className="details-desc">
              {language === 'ja' ? activeObject.descJa : activeObject.descEn}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default UniverseGame;
