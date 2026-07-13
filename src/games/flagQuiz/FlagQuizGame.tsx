import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { allFlags, type FlagQuestion } from './flagData';
import './FlagQuizGame.css';

interface RoundItem {
  question: FlagQuestion;
  options: FlagQuestion[];
}

export const FlagQuizGame: React.FC = () => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'quiz' | 'directory'>('quiz');

  // Quiz State
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [rounds, setRounds] = useState<RoundItem[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<FlagQuestion | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // Directory State
  const [searchQuery, setSearchQuery] = useState('');
  const [detailFlag, setDetailFlag] = useState<FlagQuestion | null>(null);

  const startNewGame = (customCount = questionCount) => {
    const shuffled = [...allFlags].sort(() => Math.random() - 0.5);
    const count = Math.min(customCount, shuffled.length);
    const picked = shuffled.slice(0, count);

    const roundData: RoundItem[] = picked.map((qFlag) => {
      const others = allFlags.filter((f) => f.id !== qFlag.id);
      const distractors = others.sort(() => Math.random() - 0.5).slice(0, 3);
      const options = [qFlag, ...distractors].sort(() => Math.random() - 0.5);
      return { question: qFlag, options };
    });

    setRounds(roundData);
    setCurrentIdx(0);
    setSelectedOpt(null);
    setScore(0);
    setIsFinished(false);
  };

  useEffect(() => {
    startNewGame();
  }, []);

  const handleSelectOption = (opt: FlagQuestion) => {
    if (selectedOpt !== null) return;
    setSelectedOpt(opt);
    if (opt.id === rounds[currentIdx].question.id) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx < rounds.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOpt(null);
    } else {
      setIsFinished(true);
    }
  };

  const filteredDirectory = allFlags.filter((f) => {
    if (!searchQuery) return true;
    return (
      f.nameJa.includes(searchQuery) ||
      f.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="flag-quiz-container animate-fade-in">
      <div className="flag-quiz-header">
        <h1 className="flag-quiz-title">
          {language === 'ja' ? '世界197カ国 国旗完全マスター' : 'World 197 Flags Master'}
        </h1>
        <p className="flag-quiz-subtitle">
          {language === 'ja'
            ? '世界197カ国・すべての国旗と文化・歴史トリビアを完全網羅！クイズや図鑑で楽しく世界一周しよう。'
            : 'Explore all 197 world country flags, history, and cultural trivia! Test yourself or browse the atlas.'}
        </p>
      </div>

      {/* Tabs Navigation */}
      <div className="flag-tabs-nav">
        <button
          className={`flag-tab-btn ${activeTab === 'quiz' ? 'active' : ''}`}
          onClick={() => setActiveTab('quiz')}
        >
          🎮 {language === 'ja' ? 'クイズに挑戦' : 'Play Quiz'}
        </button>
        <button
          className={`flag-tab-btn ${activeTab === 'directory' ? 'active' : ''}`}
          onClick={() => setActiveTab('directory')}
        >
          📚 {language === 'ja' ? '全197カ国 国旗図鑑' : 'All 197 Flags Directory'}
        </button>
      </div>

      {activeTab === 'quiz' ? (
        <>
          {/* Quiz Settings */}
          <div className="flag-settings-card animate-fade-in">
            <div className="flag-settings-title">
              ⚙️ {language === 'ja' ? '問題数の設定' : 'Quiz Question Count'}
            </div>
            <div className="flag-settings-group" style={{ marginBottom: 0 }}>
              <div className="flag-settings-options" style={{ justifyContent: 'center' }}>
                {[10, 20, 50, 197].map((cnt) => (
                  <button
                    key={cnt}
                    className={`flag-setting-btn ${questionCount === cnt ? 'active' : ''}`}
                    onClick={() => {
                      setQuestionCount(cnt);
                      startNewGame(cnt);
                    }}
                  >
                    {cnt === 197
                      ? (language === 'ja' ? '🔥 全197カ国連続チャレンジ！' : '🔥 All 197 World Tour!')
                      : (language === 'ja' ? `${cnt}問チャレンジ` : `${cnt} Questions`)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {rounds.length > 0 && !isFinished && (
            <div className="flag-quiz-card animate-fade-in">
              <div className="flag-progress-bar-wrapper">
                <span>
                  {language === 'ja' ? `問題 ${currentIdx + 1} / ${rounds.length}` : `Question ${currentIdx + 1} of ${rounds.length}`}
                </span>
                <div className="flag-progress-track">
                  <div
                    className="flag-progress-fill"
                    style={{ width: `${((currentIdx + 1) / rounds.length) * 100}%` }}
                  />
                </div>
                <span>
                  {language === 'ja' ? `スコア: ${score}` : `Score: ${score}`}
                </span>
              </div>

              <div className="flag-display-box">
                {rounds[currentIdx].question.flag}
              </div>

              <div className="flag-question-text">
                {language === 'ja' ? 'この国旗の国名はどれ？' : 'Which country does this flag belong to?'}
              </div>

              <div className="flag-options-grid">
                {rounds[currentIdx].options.map((opt) => {
                  const isSelected = selectedOpt?.id === opt.id;
                  const isCorrect = opt.id === rounds[currentIdx].question.id;
                  let btnClass = 'flag-option-btn';
                  if (selectedOpt !== null) {
                    if (isCorrect) btnClass += ' correct';
                    else if (isSelected && !isCorrect) btnClass += ' wrong';
                  }

                  return (
                    <button
                      key={opt.id}
                      className={btnClass}
                      onClick={() => handleSelectOption(opt)}
                      disabled={selectedOpt !== null}
                    >
                      {language === 'ja' ? opt.nameJa : opt.nameEn}
                    </button>
                  );
                })}
              </div>

              {selectedOpt !== null && (
                <div className={`flag-reveal-box ${selectedOpt.id === rounds[currentIdx].question.id ? 'reveal-correct' : 'reveal-wrong'} animate-fade-in`}>
                  <div className="flag-reveal-result">
                    {selectedOpt.id === rounds[currentIdx].question.id
                      ? (language === 'ja' ? '正解！素晴らしい！' : 'CORRECT! Excellent!')
                      : (language === 'ja' ? `残念！正解は「${rounds[currentIdx].question.nameJa}」` : `Wrong! The correct answer is ${rounds[currentIdx].question.nameEn}`)}
                  </div>
                  <div className="flag-reveal-trivia">
                    {language === 'ja' ? rounds[currentIdx].question.triviaJa : rounds[currentIdx].question.triviaEn}
                  </div>
                  <button className="flag-next-btn" onClick={handleNext}>
                    {currentIdx < rounds.length - 1
                      ? (language === 'ja' ? '次の国旗へ' : 'Next Flag')
                      : (language === 'ja' ? '結果を見る' : 'See Results')}
                  </button>
                </div>
              )}
            </div>
          )}

          {isFinished && (
            <div className="flag-result-screen animate-fade-in">
              <h2>{language === 'ja' ? 'ゲーム終了！最終結果' : 'Quiz Complete! Your Final Score'}</h2>
              <div className="flag-result-score">
                {score} / {rounds.length}
              </div>
              <div className="flag-result-rank">
                {rounds.length === 197 && score === 197
                  ? (language === 'ja' ? '🏆 「世界197カ国コンプリート・国際外交最高大使」' : '🏆 Supreme Global Diplomat & 197 Flags Master')
                  : (score / rounds.length) === 1
                  ? (language === 'ja' ? '✨ 「全問正解！国旗マスター」' : '✨ Perfect Score Diplomat')
                  : (score / rounds.length) >= 0.7
                  ? (language === 'ja' ? '✈️ 「世界旅行エキサイター・国旗の達人」' : 'World Traveler & Flag Enthusiast')
                  : (score / rounds.length) >= 0.4
                  ? (language === 'ja' ? '🌍 「地理学習者・スタンダードレベル」' : 'Standard Tourist')
                  : (language === 'ja' ? '🎒 「地理初心者・図鑑で世界を知ろう」' : 'Novice Explorer')}
              </div>
              <p className="flag-result-desc">
                {language === 'ja'
                  ? '世界の国旗には歴史・情熱・文化を物語る素晴らしい意味がたくさん隠されています！また挑戦したり図鑑をめくって全197カ国完全マスターを目指しましょう。'
                  : 'Every world flag carries rich history and cultural heritage. Explore our directory or play again!'}
              </p>
              <button className="flag-restart-btn" onClick={() => startNewGame(questionCount)}>
                {language === 'ja' ? 'もう一度挑戦する' : 'Play Again'}
              </button>
            </div>
          )}
        </>
      ) : (
        /* Directory View */
        <div className="flag-directory-view animate-fade-in">
          <div className="flag-directory-header">
            <input
              type="text"
              className="flag-search-input"
              placeholder={
                language === 'ja'
                  ? '🔍 国名や英語名で全197カ国から検索（例: 日本 / France / ブラジル）...'
                  : '🔍 Search all 197 countries by name...'
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flag-directory-grid">
            {filteredDirectory.map((f) => (
              <div
                key={f.id}
                className="flag-directory-item"
                onClick={() => setDetailFlag(f)}
              >
                <div className="flag-directory-emoji">{f.flag}</div>
                <div className="flag-directory-name">{language === 'ja' ? f.nameJa : f.nameEn}</div>
              </div>
            ))}
          </div>

          {filteredDirectory.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: '#94a3b8' }}>
              {language === 'ja' ? '該当する国が見つかりませんでした。' : 'No matching countries found.'}
            </div>
          )}
        </div>
      )}

      {/* Modal Detail View */}
      {detailFlag !== null && (
        <div className="flag-modal-overlay" onClick={() => setDetailFlag(null)}>
          <div className="flag-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="flag-modal-close" onClick={() => setDetailFlag(null)}>
              ✕
            </button>
            <div className="flag-modal-emoji">{detailFlag.flag}</div>
            <div className="flag-modal-name">{detailFlag.nameJa}</div>
            <div className="flag-modal-en">{detailFlag.nameEn}</div>
            <div className="flag-modal-trivia">
              <strong style={{ color: '#818cf8', display: 'block', marginBottom: '0.5rem' }}>
                💡 {language === 'ja' ? '国旗の由来・歴史トリビア' : 'Flag History & Trivia'}
              </strong>
              {language === 'ja' ? detailFlag.triviaJa : detailFlag.triviaEn}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
