import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import './ElementQuizGame.css';
import { allElements, type ElementQuestion } from './elementData';

interface RoundItem {
  question: ElementQuestion;
  options: ElementQuestion[];
}

export const ElementQuizGame: React.FC = () => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'quiz' | 'directory'>('quiz');

  // Quiz State
  const [rangeMode, setRangeMode] = useState<'all' | '1-20' | '21-56' | '57-118'>('all');
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [rounds, setRounds] = useState<RoundItem[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<ElementQuestion | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // Directory State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [detailElement, setDetailElement] = useState<ElementQuestion | null>(null);

  const startNewGame = (customRange = rangeMode, customCount = questionCount) => {
    let filteredPool = [...allElements];
    if (customRange === '1-20') {
      filteredPool = allElements.filter((e) => e.atomicNumber >= 1 && e.atomicNumber <= 20);
    } else if (customRange === '21-56') {
      filteredPool = allElements.filter((e) => e.atomicNumber >= 21 && e.atomicNumber <= 56);
    } else if (customRange === '57-118') {
      filteredPool = allElements.filter((e) => e.atomicNumber >= 57 && e.atomicNumber <= 118);
    }

    const shuffled = [...filteredPool].sort(() => Math.random() - 0.5);
    const count = Math.min(customCount, shuffled.length);
    const picked = shuffled.slice(0, count);

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
  };

  useEffect(() => {
    startNewGame();
  }, []);

  const handleSelectOption = (opt: ElementQuestion) => {
    if (selectedOpt !== null) return;
    setSelectedOpt(opt);
    if (opt.symbol === rounds[currentIdx].question.symbol) {
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

  // Filter for Directory
  const categoriesJa = [
    'すべて',
    '非金属',
    'アルカリ金属',
    'アルカリ土類金属',
    '遷移金属',
    '半金属',
    '軽金属',
    'ハロゲン',
    '貴ガス',
    'ランタノイド',
    'アクチノイド',
    '超重元素'
  ];

  const filteredDirectory = allElements.filter((elem) => {
    const matchesSearch =
      elem.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      elem.nameJa.includes(searchQuery) ||
      elem.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      elem.atomicNumber.toString().includes(searchQuery);

    if (!matchesSearch) return false;

    if (selectedCategory === 'all' || selectedCategory === 'すべて') return true;
    return elem.categoryJa.includes(selectedCategory) || elem.categoryEn.toLowerCase().includes(selectedCategory.toLowerCase());
  });

  return (
    <div className="element-quiz-container animate-fade-in">
      <div className="element-quiz-header">
        <h1 className="element-quiz-title">
          {language === 'ja' ? '118元素記号 完全マスター' : '118 Chemical Elements Master'}
        </h1>
        <p className="element-quiz-subtitle">
          {language === 'ja'
            ? '1番「水素 (H)」から118番「オガネソン (Og)」まで全118元素を網羅！クイズや図鑑で楽しく学ぼう。'
            : 'Complete with all 118 elements from Hydrogen (H) to Oganesson (Og)! Quiz or explore our encyclopedia.'}
        </p>
      </div>

      {/* Tabs Navigation */}
      <div className="element-tabs-nav">
        <button
          className={`element-tab-btn ${activeTab === 'quiz' ? 'active' : ''}`}
          onClick={() => setActiveTab('quiz')}
        >
          🎮 {language === 'ja' ? 'クイズに挑戦' : 'Play Quiz'}
        </button>
        <button
          className={`element-tab-btn ${activeTab === 'directory' ? 'active' : ''}`}
          onClick={() => setActiveTab('directory')}
        >
          📚 {language === 'ja' ? '全118元素図鑑・周期表' : 'All 118 Elements Directory'}
        </button>
      </div>

      {activeTab === 'quiz' ? (
        <>
          {/* Quiz Settings */}
          <div className="element-settings-card animate-fade-in">
            <div className="element-settings-title">
              ⚙️ {language === 'ja' ? '出題カスタマイズ' : 'Quiz Settings'}
            </div>
            <div className="element-settings-group">
              <span className="element-settings-label">
                🎯 {language === 'ja' ? '出題範囲を選べます:' : 'Select Atomic Number Range:'}
              </span>
              <div className="element-settings-options">
                {[
                  { id: 'all', labelJa: '全118元素 (1〜118番)', labelEn: 'All 118 Elements' },
                  { id: '1-20', labelJa: '基本元素 (1〜20番)', labelEn: 'Basic (1-20)' },
                  { id: '21-56', labelJa: '中級元素 (21〜56番)', labelEn: 'Intermediate (21-56)' },
                  { id: '57-118', labelJa: 'レア・超重元素 (57〜118番)', labelEn: 'Heavy & Rare (57-118)' }
                ].map((item) => (
                  <button
                    key={item.id}
                    className={`element-setting-btn ${rangeMode === item.id ? 'active' : ''}`}
                    onClick={() => {
                      const newRange = item.id as any;
                      setRangeMode(newRange);
                      startNewGame(newRange, questionCount);
                    }}
                  >
                    {language === 'ja' ? item.labelJa : item.labelEn}
                  </button>
                ))}
              </div>
            </div>

            <div className="element-settings-group" style={{ marginBottom: 0 }}>
              <span className="element-settings-label">
                📊 {language === 'ja' ? '問題数を選べます:' : 'Select Question Count:'}
              </span>
              <div className="element-settings-options">
                {[10, 20, 50, 118].map((cnt) => (
                  <button
                    key={cnt}
                    className={`element-setting-btn ${questionCount === cnt ? 'active' : ''}`}
                    onClick={() => {
                      setQuestionCount(cnt);
                      startNewGame(rangeMode, cnt);
                    }}
                  >
                    {cnt === 118
                      ? (language === 'ja' ? '🔥 全118問連続チャレンジ！' : '🔥 All 118 Marathon!')
                      : (language === 'ja' ? `${cnt}問` : `${cnt} Questions`)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {rounds.length > 0 && !isFinished && (
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

              <div className="element-periodic-card">
                <span className="element-atomic-num">{rounds[currentIdx].question.atomicNumber}</span>
                <div className="element-symbol-text">{rounds[currentIdx].question.symbol}</div>
                <span className="element-category-badge">
                  {language === 'ja' ? rounds[currentIdx].question.categoryJa : rounds[currentIdx].question.categoryEn}
                </span>
              </div>

              <div className="element-question-text">
                {language === 'ja'
                  ? `原子番号 ${rounds[currentIdx].question.atomicNumber}番 「${rounds[currentIdx].question.symbol}」 が表す元素名はどれ？`
                  : `Which element corresponds to atomic number ${rounds[currentIdx].question.atomicNumber} (${rounds[currentIdx].question.symbol})?`}
              </div>

              <div className="element-options-grid">
                {rounds[currentIdx].options.map((opt) => {
                  const isSelected = selectedOpt?.symbol === opt.symbol;
                  const isCorrect = opt.symbol === rounds[currentIdx].question.symbol;
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

              {selectedOpt !== null && (
                <div className={`element-reveal-box ${selectedOpt.symbol === rounds[currentIdx].question.symbol ? 'reveal-correct' : 'reveal-wrong'} animate-fade-in`}>
                  <div className="element-reveal-result">
                    {selectedOpt.symbol === rounds[currentIdx].question.symbol
                      ? (language === 'ja' ? '正解！素晴らしい知識です！' : 'CORRECT! Spot on!')
                      : (language === 'ja' ? `残念！正解は「${rounds[currentIdx].question.nameJa}」` : `Wrong! The correct answer is ${rounds[currentIdx].question.nameEn}`)}
                  </div>
                  <div className="element-reveal-trivia">
                    {language === 'ja' ? rounds[currentIdx].question.triviaJa : rounds[currentIdx].question.triviaEn}
                  </div>
                  <button className="element-next-btn" onClick={handleNext}>
                    {currentIdx < rounds.length - 1
                      ? (language === 'ja' ? '次の問題へ' : 'Next Question')
                      : (language === 'ja' ? '結果を見る' : 'See Results')}
                  </button>
                </div>
              )}
            </div>
          )}

          {isFinished && (
            <div className="element-result-screen animate-fade-in">
              <h2>{language === 'ja' ? 'ゲーム終了！最終結果' : 'Quiz Complete! Your Final Score'}</h2>
              <div className="element-result-score">
                {score} / {rounds.length}
              </div>
              <div className="element-result-rank">
                {rounds.length === 118 && score === 118
                  ? (language === 'ja' ? '🏆 「118元素コンプリート・大科学者・周期表マスター」' : '🏆 Supreme 118 Periodic Table Grandmaster')
                  : (score / rounds.length) === 1
                  ? (language === 'ja' ? '✨ 「全問正解！天才ケミスト」' : '✨ Perfect Score Chemist')
                  : (score / rounds.length) >= 0.7
                  ? (language === 'ja' ? '🔥 「理系エリート・化学の達人」' : 'Advanced Science Researcher')
                  : (score / rounds.length) >= 0.4
                  ? (language === 'ja' ? '🧪 「サイエンス学習者・標準レベル」' : 'Science Student')
                  : (language === 'ja' ? '🌱 「化学ビギナー・図鑑で復習しよう」' : 'Chemistry Novice')}
              </div>
              <p className="element-result-desc">
                {language === 'ja'
                  ? '私たちの身体もスマホも地球も宇宙も、すべては周期表の元素からできています！何度でも遊んで、または図鑑で復習して全118元素マスターを目指しましょう！'
                  : 'Everything around us is made of these elements! Explore the Directory or restart to become a master.'}
              </p>
              <button className="element-restart-btn" onClick={() => startNewGame(rangeMode, questionCount)}>
                {language === 'ja' ? 'もう一度挑戦する' : 'Play Again'}
              </button>
            </div>
          )}
        </>
      ) : (
        /* Directory View */
        <div className="element-directory-view animate-fade-in">
          <div className="element-directory-header">
            <input
              type="text"
              className="element-search-input"
              placeholder={
                language === 'ja'
                  ? '🔍 原子番号・元素記号・元素名（水素/Hydrogen等）で検索...'
                  : '🔍 Search by atomic number, symbol, or name...'
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <div className="element-category-filters">
              {categoriesJa.map((cat) => (
                <button
                  key={cat}
                  className={`element-filter-btn ${(selectedCategory === cat || (selectedCategory === 'all' && cat === 'すべて')) ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat === 'すべて' ? 'all' : cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="element-directory-grid">
            {filteredDirectory.map((elem) => (
              <div
                key={elem.atomicNumber}
                className="element-directory-item"
                onClick={() => setDetailElement(elem)}
              >
                <span className="directory-atomic-num">{elem.atomicNumber}</span>
                <div className="directory-symbol">{elem.symbol}</div>
                <div className="directory-name">{language === 'ja' ? elem.nameJa : elem.nameEn}</div>
                <span className="directory-category">
                  {language === 'ja' ? elem.categoryJa : elem.categoryEn}
                </span>
              </div>
            ))}
          </div>

          {filteredDirectory.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: '#94a3b8' }}>
              {language === 'ja' ? '該当する元素が見つかりませんでした。' : 'No matching elements found.'}
            </div>
          )}
        </div>
      )}

      {/* Modal Detail View */}
      {detailElement !== null && (
        <div className="element-modal-overlay" onClick={() => setDetailElement(null)}>
          <div className="element-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="element-modal-close" onClick={() => setDetailElement(null)}>
              ✕
            </button>
            <div className="element-modal-symbol-box">
              <div className="element-modal-num">Atomic Number: {detailElement.atomicNumber}</div>
              <div className="element-modal-sym">{detailElement.symbol}</div>
            </div>
            <div className="element-modal-name">{detailElement.nameJa}</div>
            <div className="element-modal-en">{detailElement.nameEn}</div>
            <div className="element-modal-badge">{detailElement.categoryJa} / {detailElement.categoryEn}</div>
            <div className="element-modal-trivia">
              <strong style={{ color: '#06b6d4', display: 'block', marginBottom: '0.5rem' }}>
                💡 {language === 'ja' ? '豆知識・科学トリビア' : 'Scientific Trivia'}
              </strong>
              {language === 'ja' ? detailElement.triviaJa : detailElement.triviaEn}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
