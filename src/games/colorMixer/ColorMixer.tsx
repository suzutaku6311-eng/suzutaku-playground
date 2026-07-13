import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import './ColorMixer.css';

const PRIMARY_COLORS = [
  { hex: '#EF4444', name: 'Red' },
  { hex: '#3B82F6', name: 'Blue' },
  { hex: '#FDE047', name: 'Yellow' },
  { hex: '#10B981', name: 'Green' },
  { hex: '#A855F7', name: 'Purple' },
  { hex: '#F97316', name: 'Orange' },
  { hex: '#FFFFFF', name: 'White' },
  { hex: '#1C1C1C', name: 'Black' }
];

// Helper: Hex to RGB array
const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : [255, 255, 255];
};

// Helper: RGB array to Hex
const rgbToHex = (r: number, g: number, b: number) => {
  return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1).toUpperCase();
};

// Generate a fun procedural name based on RGB
const getColorName = (r: number, g: number, b: number, language: string) => {
  // Simple heuristic based on dominant colors
  if (r > 240 && g > 240 && b > 240) return language === 'ja' ? 'ピュアホワイト' : 'Pure White';
  if (r < 20 && g < 20 && b < 20) return language === 'ja' ? 'ピッチブラック' : 'Pitch Black';
  
  if (r > 200 && g < 100 && b < 100) return language === 'ja' ? 'スパイシートマト' : 'Spicy Tomato';
  if (r < 100 && g > 200 && b < 100) return language === 'ja' ? 'エイリアンスライム' : 'Alien Slime';
  if (r < 100 && g < 100 && b > 200) return language === 'ja' ? 'ディープオーシャン' : 'Deep Ocean';
  
  if (r > 200 && g > 200 && b < 100) return language === 'ja' ? 'エレクトリックレモン' : 'Electric Lemon';
  if (r > 200 && g < 100 && b > 200) return language === 'ja' ? 'ネオンマゼンタ' : 'Neon Magenta';
  if (r < 100 && g > 200 && b > 200) return language === 'ja' ? 'トロピカルシアン' : 'Tropical Cyan';

  // Gray area
  if (Math.abs(r - g) < 20 && Math.abs(g - b) < 20) {
    if (r > 128) return language === 'ja' ? 'クラウドシルバー' : 'Cloud Silver';
    return language === 'ja' ? 'ミステリアスアッシュ' : 'Mysterious Ash';
  }

  // Browns / Muds
  if (r > g && g > b && r < 200) return language === 'ja' ? 'スイートチョコレート' : 'Sweet Chocolate';
  
  return language === 'ja' ? '未知の液体' : 'Unknown Liquid';
};

export const ColorMixer: React.FC = () => {
  const { t, language } = useLanguage();
  
  // Vat state
  const [vatColor, setVatColor] = useState<number[]>([255, 255, 255]); // starts white
  const [droplets, setDroplets] = useState<{id: number, color: string}[]>([]);
  const [mixCount, setMixCount] = useState(0);

  const handleAddColor = (hex: string) => {
    const newRgb = hexToRgb(hex);
    
    // Mix using a weighted average. 
    // If it's the first color (white vat), replace it immediately instead of mixing with white.
    let nextRgb;
    if (mixCount === 0) {
      nextRgb = newRgb;
    } else {
      nextRgb = [
        Math.round((vatColor[0] + newRgb[0]) / 2),
        Math.round((vatColor[1] + newRgb[1]) / 2),
        Math.round((vatColor[2] + newRgb[2]) / 2),
      ];
    }
    
    setVatColor(nextRgb);
    setMixCount(prev => prev + 1);

    // Add droplet animation
    const id = Date.now();
    setDroplets(prev => [...prev, { id, color: hex }]);
    
    // Remove droplet after animation (500ms)
    setTimeout(() => {
      setDroplets(prev => prev.filter(d => d.id !== id));
    }, 500);
  };

  const handleReset = () => {
    setVatColor([255, 255, 255]);
    setMixCount(0);
  };

  const currentHex = rgbToHex(vatColor[0], vatColor[1], vatColor[2]);
  const currentName = mixCount === 0 
    ? (language === 'ja' ? '空っぽのフラスコ' : 'Empty Flask')
    : getColorName(vatColor[0], vatColor[1], vatColor[2], language);

  return (
    <div className="container animate-fade-in">
      <div className="color-mixer-container">
        <div className="mixer-header">
          <h1 className="mixer-title">{t('colorMixer.title')}</h1>
          <p>{t('colorMixer.subtitle')}</p>
        </div>

        <div className="mixer-content">
          
          {/* Vat Area */}
          <div className="vat-container">
            <div className="vat-liquid" style={{ backgroundColor: currentHex }}></div>
            
            {/* Render dropping droplets */}
            {droplets.map(drop => (
              <div 
                key={drop.id} 
                className="droplet" 
                style={{ backgroundColor: drop.color }}
              ></div>
            ))}
          </div>

          {/* Result Area */}
          <div className="result-info">
            <div className="result-hex" style={{ color: mixCount > 0 ? currentHex : 'var(--text-color)' }}>
              {mixCount > 0 ? currentHex : '---'}
            </div>
            <div className="result-name">{currentName}</div>
          </div>

          {/* Palette */}
          <div className="palette">
            {PRIMARY_COLORS.map(color => (
              <button
                key={color.hex}
                className="color-btn"
                style={{ backgroundColor: color.hex }}
                onClick={() => handleAddColor(color.hex)}
                title={color.name}
                aria-label={`Add ${color.name}`}
              />
            ))}
          </div>

          <div className="mixer-actions">
            <button className="btn-reset" onClick={handleReset}>
              {language === 'ja' ? 'リセット' : 'Reset'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
