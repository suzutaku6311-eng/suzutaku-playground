import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { track } from '@vercel/analytics';
import { useLanguage } from '../../i18n/LanguageContext';
import { games } from '../../data/games';
import { GameCard } from '../../components/GameCard';
import './button.css';

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  angle: number;
  speed: number;
}

export const InfiniteButton: React.FC = () => {
  const { t, language } = useLanguage();
  const [count, setCount] = useState<number>(0);
  const [isShake, setIsShake] = useState<boolean>(false);
  const [buttonPos, setButtonPos] = useState<{ top: string; left: string }>({ top: '50%', left: '50%' });
  const [isRunawayMode, setIsRunawayMode] = useState<boolean>(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const nextId = useRef<number>(0);

  const triggerShake = () => {
    setIsShake(true);
    setTimeout(() => setIsShake(false), 200);
  };

  // カウント上昇時のイベントハンドラ
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isFinished) return;

    const nextCount = count + 1;
    setCount(nextCount);

    // パーティクル放出
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      spawnParticles(clickX, clickY, 8);
    }

    // 25回以上でシェイク
    if (nextCount >= 25 && nextCount < 50) {
      triggerShake();
    }

    // 100回でゴール
    if (nextCount >= 100) {
      // 祝福の大量パーティクル
      if (containerRef.current) {
        spawnParticles(200, 200, 50);
      }
      setTimeout(() => {
        setIsFinished(true);
      }, 800);
      
      // Analytics
      track('game_complete', { game: 'infinite-button' });
    }
  };

  // パーティクル生成
  const spawnParticles = (startX: number, startY: number, num: number) => {
    const colors = ['#E94B3C', '#008080', '#8A2BE2', '#F59E0B', '#EF4444', '#10B981', '#EC4899'];
    const newParticles: Particle[] = [];
    
    for (let i = 0; i < num; i++) {
      newParticles.push({
        id: nextId.current++,
        x: startX,
        y: startY,
        color: colors[Math.floor(Math.random() * colors.length)],
        angle: Math.random() * Math.PI * 2,
        speed: 2 + Math.random() * 6
      });
    }
    
    setParticles(prev => [...prev, ...newParticles]);
  };

  // パーティクルのお掃除
  useEffect(() => {
    if (particles.length > 0) {
      const timer = setTimeout(() => {
        setParticles([]);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [particles]);

  // カウント状態の監視（50回以上で逃走モード化）
  useEffect(() => {
    if (count >= 50 && count < 100) {
      setIsRunawayMode(true);
    } else {
      setIsRunawayMode(false);
      setButtonPos({ top: 'auto', left: 'auto' }); // 逃走モード以外は中央
    }
  }, [count]);

  // ボタンから逃げる処理 (ホバー時に座標を書き換える)
  const handleButtonHover = () => {
    if (!isRunawayMode || isFinished) return;

    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;

      // コンテナ内の余白を持たせた範囲に移動
      const buttonSize = 100;
      const x = Math.random() * (containerWidth - buttonSize - 40) + 20;
      const y = Math.random() * (containerHeight - buttonSize - 40) + 20;

      setButtonPos({
        top: `${y}px`,
        left: `${x}px`
      });

      // 逃げた時にも少しシェイク
      triggerShake();
    }
  };

  const handleReplay = () => {
    setCount(0);
    setIsFinished(false);
    setButtonPos({ top: 'auto', left: 'auto' });
    
    // Analytics
    track('game_replay', { game: 'infinite-button' });
  };

  const handleShare = () => {
    const text = language === 'ja'
      ? `無限ボタンを100回クリックしました！色んなことが起こりました！\n#SuzutakuPlayground`
      : `I clicked the Infinite Button 100 times and survived the chaos!\n#SuzutakuPlayground`;
    const url = window.location.href;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
  };

  // メッセージの切り替え
  const getGameMessage = () => {
    if (count === 0) return language === 'ja' ? 'ボタンを押してみてください。' : 'Try pressing the button.';
    if (count < 10) return language === 'ja' ? 'いい感じ！' : 'Nice click!';
    if (count < 25) return language === 'ja' ? 'もっと、もっと！' : 'Keep going!';
    if (count < 50) return language === 'ja' ? 'あ、画面が揺れだした…！' : 'Oh, the screen is shaking...!';
    if (count < 80) return language === 'ja' ? 'ボタンが逃げ出した！捕まえて！' : 'The button is running away! Catch it!';
    if (count < 99) return language === 'ja' ? 'あと少し！捕まえて押すんだ！' : 'Almost there! Click it!';
    return language === 'ja' ? 'おめでとう！' : 'Congratulations!';
  };

  // ボタンの文字
  const getButtonText = () => {
    if (count >= 100) return '🎉';
    if (isRunawayMode) return language === 'ja' ? 'マテ！' : 'WAIT!';
    if (count >= 25) return language === 'ja' ? '激突！' : 'SHAKE!';
    if (count >= 10) return language === 'ja' ? '連打！' : 'MORE!';
    return language === 'ja' ? '押す' : 'PUSH';
  };

  // おすすめゲーム (コンビニゲーム)
  const nextGame = games.find(g => g.id === 'konbini-1000');

  return (
    <div className="container button-game-container page-wrapper-anim">
      <div className="universe-header">
        <Link to="/" className="back-btn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          {t('konbini.back')}
        </Link>
        <h1 className="page-title">{language === 'ja' ? '無限ボタン' : 'Infinite Button'}</h1>
      </div>

      {!isFinished ? (
        <>
          <div 
            className={`button-area-wrapper ${isShake ? 'screen-shake' : ''}`}
            ref={containerRef}
          >
            {/* カウンター */}
            <motion.div 
              className="counter-display"
              key={count}
              initial={{ scale: 0.8 }}
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 0.15 }}
            >
              {count}
            </motion.div>

            {/* 巨大ボタン */}
            <button
              className={`giant-button ${count >= 25 ? 'neon' : ''} ${isRunawayMode ? 'runaway' : ''}`}
              onClick={handleClick}
              onMouseEnter={handleButtonHover}
              style={isRunawayMode ? { 
                top: buttonPos.top, 
                left: buttonPos.left,
                transform: 'translate(0, 0)'
              } : undefined}
            >
              {getButtonText()}
            </button>

            {/* パーティクルエミッター */}
            <div className="particle-emitter">
              {particles.map(p => (
                <motion.div
                  key={p.id}
                  style={{
                    position: 'absolute',
                    left: p.x,
                    top: p.y,
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: p.color,
                  }}
                  initial={{ scale: 1, opacity: 1 }}
                  animate={{
                    x: Math.cos(p.angle) * p.speed * 12,
                    y: Math.sin(p.angle) * p.speed * 12,
                    opacity: 0,
                    scale: 0.2
                  }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                />
              ))}
            </div>
          </div>

          <div className="message-bubble">
            {getGameMessage()}
          </div>
        </>
      ) : (
        /* Clear / Finished Screen */
        <div className="clear-screen animate-fade-in">
          <h2 className="page-title" style={{ fontSize: '1.75rem' }}>
            {language === 'ja' ? 'おめでとうございます！' : 'Clear!'}
          </h2>
          <div className="clear-badge">
            {language === 'ja' ? '無限の覇者 🏆' : 'Infinite Conqueror 🏆'}
          </div>
          <p className="result-desc">
            {language === 'ja' 
              ? 'あなたは逃げ惑うボタンに勝利し、見事に1000回…ではなく100回クリックを達成しました！'
              : 'You successfully chased and clicked the runaway button 100 times!'}
          </p>

          <div className="result-actions">
            <button className="btn btn-primary" onClick={handleReplay}>
              {t('konbini.replay')}
            </button>
            <button className="btn btn-secondary" onClick={handleShare}>
              {t('konbini.share')}
            </button>
          </div>

          {nextGame && (
            <div className="next-recommendations" style={{ width: '100%', maxWidth: '360px', marginTop: '20px' }}>
              <h3 className="next-title">{t('konbini.nextGame')}</h3>
              <GameCard game={nextGame} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default InfiniteButton;
