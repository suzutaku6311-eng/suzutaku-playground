import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { coursesConfig, type CourseConfig, type SushiWordItem } from './sushiWordsData';
import './SushiTypingGame.css';

export const SushiTypingGame: React.FC = () => {
  const { language } = useLanguage();

  // Game States
  const [gameState, setGameState] = useState<'select' | 'playing' | 'result'>('select');
  const [selectedCourseId, setSelectedCourseId] = useState<'light' | 'standard' | 'luxury'>('standard');
  const [timeLeft, setTimeLeft] = useState<number>(90);

  // Gameplay States
  const [currentWord, setCurrentWord] = useState<SushiWordItem | null>(null);
  const [typedText, setTypedText] = useState<string>('');
  const [platePos, setPlatePos] = useState<number>(0); // 0 to 100 (% along conveyor)

  // Statistics & Score
  const [totalEarned, setTotalEarned] = useState<number>(0);
  const [clearedCount, setClearedCount] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(0);
  const [totalTypedChars, setTotalTypedChars] = useState<number>(0);
  const [totalKeystrokes, setTotalKeystrokes] = useState<number>(0);
  const [popupMsg, setPopupMsg] = useState<string | null>(null);

  const activeCourse: CourseConfig = coursesConfig[selectedCourseId];
  const lastFrameTimeRef = useRef<number>(0);
  const animFrameIdRef = useRef<number | null>(null);

  // Pick random next word from active course pool
  const pickNextWord = useCallback(() => {
    const pool = activeCourse.wordsPool;
    const randomItem = pool[Math.floor(Math.random() * pool.length)];
    setCurrentWord(randomItem);
    setTypedText('');
    setPlatePos(0);
  }, [activeCourse]);

  // Start Game
  const startCourse = (courseId: 'light' | 'standard' | 'luxury') => {
    setSelectedCourseId(courseId);
    const config = coursesConfig[courseId];
    setTimeLeft(config.timeSeconds);
    setTotalEarned(0);
    setClearedCount(0);
    setCombo(0);
    setMaxCombo(0);
    setTotalTypedChars(0);
    setTotalKeystrokes(0);
    setPopupMsg(null);
    setGameState('playing');

    const pool = config.wordsPool;
    const firstWord = pool[Math.floor(Math.random() * pool.length)];
    setCurrentWord(firstWord);
    setTypedText('');
    setPlatePos(0);
    lastFrameTimeRef.current = performance.now();
  };

  // Timer Countdown loop (1 second interval)
  useEffect(() => {
    if (gameState !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameState('result');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState]);

  // Conveyor Belt sliding animation loop
  useEffect(() => {
    if (gameState !== 'playing') {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      return;
    }

    const updateConveyor = (now: number) => {
      if (!lastFrameTimeRef.current) lastFrameTimeRef.current = now;
      const deltaSeconds = (now - lastFrameTimeRef.current) / 1000;
      lastFrameTimeRef.current = now;

      // Speed in percentage along conveyor (e.g., crossing 100% across 6-9 seconds depending on speed)
      const speedPctPerSec = activeCourse.basePlateSpeed / 14;

      setPlatePos((prev) => {
        const nextPos = prev + deltaSeconds * speedPctPerSec;
        if (nextPos >= 105) {
          // Plate fell off! Reset combo and spawn new plate
          setCombo(0);
          setTypedText('');
          const pool = activeCourse.wordsPool;
          const randomItem = pool[Math.floor(Math.random() * pool.length)];
          setCurrentWord(randomItem);
          return 0;
        }
        return nextPos;
      });

      animFrameIdRef.current = requestAnimationFrame(updateConveyor);
    };

    lastFrameTimeRef.current = performance.now();
    animFrameIdRef.current = requestAnimationFrame(updateConveyor);

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [gameState, activeCourse]);

  // Keyboard Typing Event Listener
  useEffect(() => {
    if (gameState !== 'playing' || !currentWord) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore meta keys, ctrl, alt, arrows, tab
      if (e.metaKey || e.ctrlKey || e.altKey || e.key.length > 1) return;

      const expectedChar = currentWord.word[typedText.length];
      if (!expectedChar) return;

      const inputChar = e.key.toUpperCase();
      setTotalKeystrokes((prev) => prev + 1);

      if (inputChar === expectedChar) {
        // Correct key pressed!
        const nextTyped = typedText + expectedChar;
        setTypedText(nextTyped);
        setTotalTypedChars((prev) => prev + 1);

        // Check if full word completed
        if (nextTyped.length === currentWord.word.length) {
          // Plate cleared!
          const earned = currentWord.price;
          setTotalEarned((prev) => prev + earned);
          setClearedCount((prev) => prev + 1);
          setCombo((prev) => {
            const nextCombo = prev + 1;
            if (nextCombo > maxCombo) setMaxCombo(nextCombo);
            return nextCombo;
          });

          // Show popup effect
          setPopupMsg(`+$${earned.toFixed(2)} GET! 🍣`);
          setTimeout(() => setPopupMsg(null), 700);

          // Immediately slide in next plate
          pickNextWord();
        }
      } else {
        // Incorrect key
        setCombo(0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, currentWord, typedText, maxCombo, pickNextWord]);

  // Calculate results
  const profit = totalEarned - activeCourse.cost;
  const accuracy = totalKeystrokes > 0 ? ((totalTypedChars / totalKeystrokes) * 100).toFixed(1) : '100.0';
  const wpm = Math.round((totalTypedChars / 5) / (activeCourse.timeSeconds / 60));

  // Determine Chef Evaluation Title
  const getChefEvaluation = () => {
    if (profit >= activeCourse.cost * 1.5) return language === 'ja' ? '🏆 寿司マスター英語豪傑 (伝説級)' : '🏆 Sushi Master Legend';
    if (profit >= 0) return language === 'ja' ? '🎉 お得獲得エースタイパー' : '🎉 Value Champion Typer';
    if (totalEarned >= activeCourse.cost * 0.7) return language === 'ja' ? '🍣 常連の腕利き挑戦者' : '🍣 Skilled Regular';
    return language === 'ja' ? '🌱 見習い寿司タイパー' : '🌱 Apprentice Typer';
  };

  return (
    <div className="sushi-typing-container animate-fade-in">
      <div className="sushi-header">
        <h1 className="sushi-title">
          {language === 'ja' ? '回転寿司タイピング英語 (Sushi-Da English)' : 'Sushi Typing English'}
        </h1>
        <p className="sushi-subtitle">
          {language === 'ja'
            ? 'レーンを流れるお皿の英語テキストをタイピングで撃破しよう！コース代金以上のお寿司を食べて「お得」を目指す爽快タイピングゲーム。'
            : 'Type the English sushi dishes and phrases before the plates scroll off the conveyor belt! Beat the course cost to profit.'}
        </p>
      </div>

      {gameState === 'select' && (
        <div className="course-select-grid animate-fade-in">
          {(Object.keys(coursesConfig) as Array<'light' | 'standard' | 'luxury'>).map((key) => {
            const course = coursesConfig[key];
            return (
              <div key={key} className="course-card" onClick={() => startCourse(key)}>
                <div>
                  <div className="course-card-header">
                    <span className="course-icon">{course.badgeIcon}</span>
                    <span className="course-cost-badge">${course.cost.toFixed(2)}</span>
                  </div>
                  <h3 className="course-title">{language === 'ja' ? course.titleJa : course.titleEn}</h3>
                  <p className="course-desc">{language === 'ja' ? course.descJa : course.descEn}</p>
                </div>
                <button className="course-start-btn">
                  {language === 'ja' ? '🍣 このコースに挑戦スタート！' : '🍣 Start Course!'}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {gameState === 'playing' && currentWord && (
        <div className="sushi-gameplay-area animate-fade-in">
          {/* HUD Top Bar */}
          <div className="hud-top-bar">
            <div className="hud-item">
              <span className="hud-label">{language === 'ja' ? '獲得金額 (現在)' : 'TOTAL EARNED'}</span>
              <span className="hud-value">${totalEarned.toFixed(2)}</span>
            </div>

            <div className="hud-item">
              <span className="hud-label">{language === 'ja' ? 'コース代金' : 'COURSE COST'}</span>
              <span className="hud-value" style={{ color: '#cbd5e1' }}>${activeCourse.cost.toFixed(2)}</span>
            </div>

            <div className="hud-item">
              <span className="hud-label">{language === 'ja' ? 'お得度判定' : 'PROFIT/LOSS'}</span>
              <span className={`hud-value ${profit >= 0 ? 'profit' : 'loss'}`}>
                {profit >= 0 ? `+$${profit.toFixed(2)}` : `-$${Math.abs(profit).toFixed(2)}`}
              </span>
            </div>

            <div className="hud-item">
              <span className="hud-label">{language === 'ja' ? '残り時間' : 'TIME LEFT'}</span>
              <span className="hud-timer">{timeLeft}s</span>
            </div>

            {combo >= 2 && (
              <div className="hud-combo">
                🔥 {combo} {language === 'ja' ? '連続コンボ！' : 'COMBO!'}
              </div>
            )}
          </div>

          {/* Profit Meter Bar */}
          <div className="meter-container">
            <div
              className="meter-bar"
              style={{ width: `${Math.min(100, (totalEarned / (activeCourse.cost * 1.5)) * 100)}%` }}
            />
            <div
              className="meter-target-line"
              style={{ left: `${(1.0 / 1.5) * 100}%` }}
              title={language === 'ja' ? 'コース元取りライン' : 'Course Target Line'}
            />
          </div>

          {/* Conveyor Belt Stage */}
          <div className="conveyor-stage">
            {popupMsg && <div className="plate-cleared-popup">{popupMsg}</div>}

            <div className="sushi-plate-container" style={{ left: `${Math.min(88, platePos)}%` }}>
              <div className={`sushi-plate ${currentWord.plateColor}`}>
                <div className="sushi-dish-emoji">{currentWord.emoji}</div>
                <div className="sushi-plate-price">${currentWord.price.toFixed(2)}</div>
              </div>
            </div>
          </div>

          {/* Typing Target Display Box */}
          <div className="typing-target-box">
            <div className="sushi-meaning">
              {language === 'ja' ? currentWord.displayJa : currentWord.displayEn} ({currentWord.displayEn})
            </div>
            <div className="word-display">
              <span className="typed-char">{currentWord.word.substring(0, typedText.length)}</span>
              <span className="untyped-char">{currentWord.word.substring(typedText.length)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Modal at Game Over */}
      {gameState === 'result' && (
        <div className="receipt-modal-overlay">
          <div className="receipt-card animate-fade-in">
            <div className="receipt-header">
              <div className="receipt-store-title">🍣 SUSHITAKU DINING</div>
              <div>{language === 'ja' ? 'お会計レシート・成績発表' : 'OFFICIAL RECEIPT & STATS'}</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>
                COURSE: {language === 'ja' ? activeCourse.titleJa : activeCourse.titleEn}
              </div>
            </div>

            <div className="receipt-row">
              <span>{language === 'ja' ? 'コース基本代金' : 'COURSE COST'}:</span>
              <span>${activeCourse.cost.toFixed(2)}</span>
            </div>

            <div className="receipt-row">
              <span>{language === 'ja' ? `完食したお皿 (${clearedCount}皿)` : `SUSHIS CLEARED (${clearedCount})`}:</span>
              <span>${totalEarned.toFixed(2)}</span>
            </div>

            <div className="receipt-total-box">
              <div style={{ fontSize: '0.95rem', color: '#64748b' }}>
                {language === 'ja' ? 'お得度・収支判定' : 'FINAL RESULT'}
              </div>
              <div className={`result-profit-text ${profit >= 0 ? 'win' : 'lose'}`}>
                {profit >= 0
                  ? (language === 'ja' ? `+$${profit.toFixed(2)} お得！ 🎉` : `+$${profit.toFixed(2)} PROFIT! 🎉`)
                  : (language === 'ja' ? `-$${Math.abs(profit).toFixed(2)} 損… 💦` : `-$${Math.abs(profit).toFixed(2)} LOSS 💦`)}
              </div>
            </div>

            <div className="receipt-stats-grid">
              <div className="stat-box">
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{language === 'ja' ? 'タイピング速度' : 'WPM'}</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 900 }}>{wpm} WPM</div>
              </div>
              <div className="stat-box">
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{language === 'ja' ? '正確率' : 'ACCURACY'}</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 900 }}>{accuracy}%</div>
              </div>
              <div className="stat-box">
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{language === 'ja' ? '最大コンボ' : 'MAX COMBO'}</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 900 }}>{maxCombo} 🔥</div>
              </div>
              <div className="stat-box">
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{language === 'ja' ? '大将からの評価' : 'EVALUATION'}</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#0f172a' }}>{getChefEvaluation()}</div>
              </div>
            </div>

            <div className="receipt-actions">
              <button className="receipt-retry-btn" onClick={() => setGameState('select')}>
                🔄 {language === 'ja' ? '別のコースで再挑戦！' : 'Try Again'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
