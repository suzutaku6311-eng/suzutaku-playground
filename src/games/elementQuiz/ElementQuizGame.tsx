import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import './ElementQuizGame.css';
import { allElements, type ElementQuestion } from './elementData';

interface RoundItem {
  question: ElementQuestion;
  options: ElementQuestion[];
}

export const ElementQuizGame: React.FC = () => {
  const { language } = useLanguage();

  // Quiz State
  const [rounds, setRounds] = useState<RoundItem[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<ElementQuestion | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [autoNextSeconds, setAutoNextSeconds] = useState<number | null>(null);

  const timerRef = useRef<number | null>(null);

  const clearAutoTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleNext = useCallback(() => {
    clearAutoTimer();
    setAutoNextSeconds(null);

    if (currentIdx < rounds.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOpt(null);
    } else {
      setIsFinished(true);
    }
  }, [currentIdx, rounds.length]);

  const startNewGame = useCallback(() => {
    clearAutoTimer();
    setAutoNextSeconds(null);

    const shuffled = [...allElements].sort(() => Math.random() - 0.5);
    const picked = shuffled.slice(0, 10);

    const roundData: RoundItem[] = picked.map((qElem) => {
      const others = allElements.filter((e) => e.symbol !== qElem.symbol);
      const distractors = others.sort(() => Math.random() - 0.5).slice(0, 3);
      const options = [qElem, ...distractors].sort(() => Math.random() - 0.5);
      return { question: qElem, options };
    });

    setRounds(roundData);
    setCurrentIdx(0);
    setSelectedOpt(null);
    setScore(0);
    setIsFinished(false);
  }, []);

  useEffect(() => {
    startNewGame();
    return () => clearAutoTimer();
  }, [startNewGame]);

  const handleSelectOption = (opt: ElementQuestion) => {
    if (selectedOpt !== null) return;
    setSelectedOpt(opt);

    if (opt.symbol === rounds[currentIdx].question.symbol) {
      setScore((prev) => prev + 1);
    }

    // Start 5-second auto-next timer
    clearAutoTimer();
    setAutoNextSeconds(5);

    timerRef.current = window.setInterval(() => {
      setAutoNextSeconds((prev) => {
        if (prev === null || prev <= 1) {
          clearAutoTimer();
          setTimeout(() => {
            handleNext();
          }, 0);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  if (rounds.length === 0) {
    return <div className="element-quiz-container">Loading...</div>;
  }

  const currentRound = rounds[currentIdx];

  return (
    <div className="element-quiz-container animate-fade-in">
      <div className="element-quiz-header">
        <h1 className="element-quiz-title">
          {language === 'ja' ? '118元素記号 完全マスター' : '118 Chemical Elements Master'}
        </h1>
      </div>

      {!isFinished ? (
        <div className="element-quiz-card animate-fade-in">
          <div className="element-progress-bar-wrapper">
            <span>
              {language === 'ja' ? `問題 ${currentIdx + 1} / ${rounds.length}` : `Question ${currentIdx + 1} of ${rounds.length}`}
            </span>
            <div className="element-progress-track">
              <div
                className="element-progress-fill"
                style={{ width: `${((currentIdx + 1) / rounds.length) * 100}%` }}
              />
            </div>
            <span>
              {language === 'ja' ? `スコア: ${score}` : `Score: ${score}`}
            </span>
          </div>

          {/* Main Stage: Centers card normally, or sits side-by-side with Explanation when answered */}
          <div className={`element-main-stage ${selectedOpt !== null ? 'answered' : ''}`}>
            <div className="element-periodic-card">
              <span className="element-atomic-num">{currentRound.question.atomicNumber}</span>
              <div className="element-symbol-text">{currentRound.question.symbol}</div>
              <span className="element-category-badge">
                {language === 'ja' ? currentRound.question.categoryJa : currentRound.question.categoryEn}
              </span>
            </div>

            {selectedOpt !== null && (
              <div
                className={`element-reveal-box ${
                  selectedOpt.symbol === currentRound.question.symbol ? 'reveal-correct' : 'reveal-wrong'
                } animate-fade-in`}
              >
                <div className="element-reveal-header-row">
                  <span className="element-reveal-result">
                    {selectedOpt.symbol === currentRound.question.symbol
                      ? (language === 'ja' ? '🎉 正解！Spot on!' : '🎉 CORRECT! Spot on!')
                      : (language === 'ja'
                          ? `❌ 残念！正解は「${currentRound.question.nameJa}」`
                          : `❌ Wrong! Correct: ${currentRound.question.nameEn}`)}
                  </span>
                  {autoNextSeconds !== null && (
                    <span className="auto-next-badge">
                      ⏳ {language === 'ja' ? `あと${autoNextSeconds}秒で次へ...` : `Auto next in ${autoNextSeconds}s`}
                    </span>
                  )}
                </div>

                <div className="element-reveal-trivia">
                  {language === 'ja' ? currentRound.question.triviaJa : currentRound.question.triviaEn}
                </div>

                <div className="element-reveal-actions">
                  <button className="element-next-btn" onClick={handleNext}>
                    {currentIdx < rounds.length - 1
                      ? (language === 'ja' ? '次の問題へ進む ⏩' : 'Next Question ⏩')
                      : (language === 'ja' ? '結果を見る 🏆' : 'See Results 🏆')}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="element-options-grid">
            {currentRound.options.map((opt) => {
              const isSelected = selectedOpt?.symbol === opt.symbol;
              const isCorrect = opt.symbol === currentRound.question.symbol;
              let btnClass = 'element-option-btn';
              if (selectedOpt !== null) {
                if (isCorrect) btnClass += ' correct';
                else if (isSelected && !isCorrect) btnClass += ' wrong';
              }

              return (
                <button
                  key={opt.symbol}
                  className={btnClass}
                  onClick={() => handleSelectOption(opt)}
                  disabled={selectedOpt !== null}
                >
                  {language === 'ja' ? opt.nameJa : opt.nameEn}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="element-result-screen animate-fade-in">
          <h2>{language === 'ja' ? 'ゲーム終了！最終結果' : 'Quiz Complete! Your Final Score'}</h2>
          <div className="element-result-score">
            {score} / {rounds.length}
          </div>
          <div className="element-result-rank">
            {(score / rounds.length) === 1
              ? (language === 'ja' ? '✨ 「全問正解！天才ケミスト」' : '✨ Perfect Score Chemist')
              : (score / rounds.length) >= 0.7
              ? (language === 'ja' ? '🔥 「理系エリート・化学の達人」' : 'Advanced Science Researcher')
              : (score / rounds.length) >= 0.4
              ? (language === 'ja' ? '🧪 「サイエンス学習者・標準レベル」' : 'Science Student')
              : (language === 'ja' ? '🌱 「化学ビギナー・もう一度挑戦しよう」' : 'Chemistry Novice')}
          </div>
          <p className="element-result-desc">
            {language === 'ja'
              ? '私たちの身体もスマホも地球も宇宙も、すべては周期表の元素からできています！何度でも遊んで全118元素マスターを目指しましょう！'
              : 'Everything around us is made of these elements! Play again to sharpen your chemistry skills.'}
          </p>
          <button className="element-restart-btn" onClick={startNewGame}>
            🔄 {language === 'ja' ? 'もう一度挑戦する' : 'Play Again'}
          </button>
        </div>
      )}
    </div>
  );
};
