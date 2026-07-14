import React, { useState } from 'react';
import { track } from '@vercel/analytics';
import { useLanguage } from '../../i18n/LanguageContext';
import { products } from './products';
import type { Product } from './products';
import { games } from '../../data/games';
import { GameCard } from '../../components/GameCard';
import './konbini.css';

interface BasketItem {
  product: Product;
  quantity: number;
}

// 商品固有のSVGイラストを描画するヘルパー
const renderProductArtwork = (id: string) => {
  switch (id) {
    case 'onigiri':
      return (
        <svg viewBox="0 0 100 100" fill="none">
          <polygon points="50,15 15,80 85,80" fill="#FFFFFF" stroke="#1C1C1C" strokeWidth="4" strokeLinejoin="round" />
          <rect x="38" y="60" width="24" height="20" fill="#1C1C1C" rx="2" />
        </svg>
      );
    case 'tea':
      return (
        <svg viewBox="0 0 100 100" fill="none">
          <rect x="35" y="10" width="30" height="12" rx="2" fill="#10B981" stroke="#1C1C1C" strokeWidth="4" />
          <rect x="25" y="22" width="50" height="68" rx="8" fill="#A7F3D0" stroke="#1C1C1C" strokeWidth="4" />
          <rect x="25" y="40" width="50" height="25" fill="#34D399" />
          <line x1="35" y1="52" x2="65" y2="52" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );
    case 'sandwich':
      return (
        <svg viewBox="0 0 100 100" fill="none">
          <polygon points="15,80 85,80 85,15" fill="#FEE2E2" stroke="#1C1C1C" strokeWidth="4" strokeLinejoin="round" />
          {/* 具材 (たまご) */}
          <polygon points="25,75 80,75 80,25" fill="#FBBF24" />
          <circle cx="50" cy="55" r="8" fill="#F59E0B" />
        </svg>
      );
    case 'pudding':
      return (
        <svg viewBox="0 0 100 100" fill="none">
          {/* プリン本体 */}
          <path d="M25,65 L32,30 L68,30 L75,65 Z" fill="#FCD34D" stroke="#1C1C1C" strokeWidth="4" strokeLinejoin="round" />
          {/* カラメル */}
          <path d="M32,30 C40,24, 60,24, 68,30 L65,40 C55,36, 45,36, 35,40 Z" fill="#78350F" stroke="#1C1C1C" strokeWidth="3" strokeLinejoin="round" />
          {/* 器 */}
          <path d="M15,65 C15,85, 85,85, 85,65" stroke="#1C1C1C" strokeWidth="4" fill="none" strokeLinecap="round" />
        </svg>
      );
    case 'chicken':
      return (
        <svg viewBox="0 0 100 100" fill="none">
          {/* パッケージ */}
          <rect x="20" y="45" width="60" height="45" rx="4" fill="#EF4444" stroke="#1C1C1C" strokeWidth="4" />
          <path d="M20,65 L80,65" stroke="#FFFFFF" strokeWidth="6" />
          {/* チキン */}
          <path d="M30,50 C30,20, 50,10, 65,30 C75,40, 70,55, 60,50 C50,45, 45,55, 30,50 Z" fill="#D97706" stroke="#1C1C1C" strokeWidth="4" strokeLinejoin="round" />
        </svg>
      );
    case 'ramen':
      return (
        <svg viewBox="0 0 100 100" fill="none">
          <path d="M15,20 L85,20 L75,80 L25,80 Z" fill="#FFFFFF" stroke="#1C1C1C" strokeWidth="4" strokeLinejoin="round" />
          <ellipse cx="50" cy="20" rx="35" ry="8" fill="#E5E7EB" stroke="#1C1C1C" strokeWidth="4" />
          {/* ナルト・具材 */}
          <circle cx="45" cy="20" r="5" fill="#EC4899" />
          <circle cx="55" cy="20" r="4" fill="#FBBF24" />
        </svg>
      );
    case 'icecream':
      return (
        <svg viewBox="0 0 100 100" fill="none">
          {/* コーン */}
          <polygon points="50,90 32,50 68,50" fill="#D97706" stroke="#1C1C1C" strokeWidth="4" strokeLinejoin="round" />
          {/* アイス */}
          <circle cx="50" cy="40" r="22" fill="#FEF3C7" stroke="#1C1C1C" strokeWidth="4" />
          <circle cx="42" cy="32" r="18" fill="#FEE2E2" />
        </svg>
      );
    case 'bento':
      return (
        <svg viewBox="0 0 100 100" fill="none">
          {/* 容器 */}
          <rect x="15" y="15" width="70" height="70" rx="6" fill="#1C1C1C" stroke="#1C1C1C" strokeWidth="4" />
          <rect x="20" y="20" width="60" height="60" rx="4" fill="#FFFFFF" />
          {/* ご飯のごまとうめぼし */}
          <circle cx="35" cy="50" r="5" fill="#EF4444" />
          <line x1="30" y1="42" x2="31" y2="42" stroke="#1C1C1C" strokeWidth="2" />
          <line x1="39" y1="58" x2="40" y2="58" stroke="#1C1C1C" strokeWidth="2" />
          {/* おかず */}
          <rect x="52" y="25" width="22" height="22" rx="3" fill="#FBBF24" /> {/* 卵焼き */}
          <path d="M52,65 C52,50, 75,50, 75,65 Z" fill="#EF4444" /> {/* ウィンナー */}
        </svg>
      );
    case 'coffee':
      return (
        <svg viewBox="0 0 100 100" fill="none">
          <rect x="32" y="15" width="36" height="70" rx="6" fill="#78350F" stroke="#1C1C1C" strokeWidth="4" />
          <rect x="32" y="35" width="36" height="20" fill="#F59E0B" />
          <circle cx="50" cy="45" r="6" fill="#FFFFFF" />
        </svg>
      );
    case 'chips':
      return (
        <svg viewBox="0 0 100 100" fill="none">
          {/* 袋 */}
          <polygon points="20,15 80,15 75,85 25,85" fill="#3B82F6" stroke="#1C1C1C" strokeWidth="4" strokeLinejoin="round" />
          <rect x="30" y="35" width="40" height="25" fill="#FBBF24" rx="2" />
          <circle cx="50" cy="47" r="6" fill="#D97706" />
        </svg>
      );
    default:
      return null;
  }
};

export const KonbiniGame: React.FC = () => {
  const { t, language } = useLanguage();
  const [basket, setBasket] = useState<BasketItem[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [resultRating, setResultRating] = useState<string>('');

  const BUDGET = 1000;

  // 合計金額
  const totalAmount = basket.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const remainingBudget = BUDGET - totalAmount;

  const handleAddItem = (product: Product) => {
    setBasket(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleRemoveItem = (product: Product) => {
    setBasket(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing && existing.quantity > 1) {
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }
      return prev.filter(item => item.product.id !== product.id);
    });
  };

  const getProductQty = (productId: string) => {
    const item = basket.find(i => i.product.id === productId);
    return item ? item.quantity : 0;
  };

  // お会計結果の判定
  const evaluateBasket = () => {
    if (totalAmount === BUDGET) {
      return 'budgetGenius';
    }
    
    if (totalAmount < 300) {
      return 'vergeOfStarvation';
    }

    const categoriesInBasket = basket.map(i => i.product.category);
    const uniqueCategories = new Set(categoriesInBasket);

    // デザート/スナックのみ
    if (uniqueCategories.size === 1 && (categoriesInBasket.includes('dessert') || categoriesInBasket.includes('snack'))) {
      return 'dessertSpecialist';
    }

    // 夜食 (おにぎり・唐揚げ・カップ麺などのみで、金額が多め)
    const hasNightSnackVibe = basket.some(i => ['onigiri', 'chicken', 'ramen'].includes(i.product.id));
    if (hasNightSnackVibe && totalAmount >= 600) {
      // デザートやスナックが適度に入っていると夜食っぽい
      return 'midnightSnack';
    }

    // バランスが良い (food, drink, dessert/snackが全部ある)
    const hasFood = basket.some(i => i.product.category === 'food');
    const hasDrink = basket.some(i => i.product.category === 'drink');
    const hasDessertOrSnack = basket.some(i => ['dessert', 'snack'].includes(i.product.category));
    if (hasFood && hasDrink && hasDessertOrSnack) {
      return 'balancedShopper';
    }

    return 'justHungry';
  };

  const handleCheckout = () => {
    if (basket.length === 0 || totalAmount > BUDGET) return;
    
    const rating = evaluateBasket();
    setResultRating(rating);
    setIsFinished(true);
    
    // Analytics
    track('game_complete', { 
      game: 'konbini-1000', 
      rating: rating, 
      total: totalAmount 
    });
  };

  const handleReplay = () => {
    setBasket([]);
    setIsFinished(false);
    setResultRating('');

    // Analytics
    track('game_replay', { game: 'konbini-1000' });
  };

  const handleShare = () => {
    const text = language === 'ja' 
      ? `コンビニで1000円使おうゲームをプレイしました！\nお会計合計: ¥${totalAmount}（残高: ¥${remainingBudget}）\n私の買い物称号: 【${t(`konbini.rating.${resultRating}`)}】\n#SuzutakuPlayground`
      : `I played "Spend ¥1000 at a Konbini"!\nTotal spent: ¥${totalAmount} (Remaining: ¥${remainingBudget})\nMy Shopping Badge: 【${t(`konbini.rating.${resultRating}`)}】\n#SuzutakuPlayground`;
    
    const url = window.location.href;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
  };

  // 他のComing Soonゲームのレコメンド
  const nextGames = games.filter(g => g.id !== 'konbini-1000').slice(0, 2);

  return (
    <div className="container konbini-game-container animate-fade-in">
      <div className="konbini-header">
        <h1 className="page-title">{t('konbini.title')}</h1>
      </div>

      {!isFinished ? (
        <>
          {/* Dashboard */}
          <div className="konbini-dashboard">
            <div className="dashboard-stat">
              <span className="stat-label">{t('konbini.budget')}</span>
              <span className="stat-value">¥{BUDGET}</span>
            </div>
            <div className="dashboard-stat">
              <span className="stat-label">{t('konbini.total')}</span>
              <span className="stat-value" style={{ color: totalAmount > BUDGET ? 'var(--accent-color)' : 'inherit' }}>
                ¥{totalAmount}
              </span>
            </div>
            <div className="dashboard-stat">
              <span className="stat-label">{t('konbini.remaining')}</span>
              <span className={`stat-value remaining ${remainingBudget < 150 ? 'danger' : remainingBudget < 400 ? 'warning' : ''}`}>
                ¥{remainingBudget}
              </span>
            </div>
          </div>

          <div className="konbini-layout">
            {/* Products list */}
            <div>
              <div className="products-grid">
                {products.map(product => {
                  const qty = getProductQty(product.id);
                  return (
                    <div className="product-item" key={product.id}>
                      <div className="product-artwork">
                        {renderProductArtwork(product.id)}
                      </div>
                      <div className="product-info">
                        <span className="product-name">
                          {language === 'ja' ? product.nameJa : product.nameEn}
                        </span>
                        <span className="product-price">¥{product.price}</span>
                        
                        <div className="product-controls">
                          <button 
                            className="qty-btn" 
                            onClick={() => handleRemoveItem(product)}
                            disabled={qty === 0}
                            aria-label={`Remove one ${language === 'ja' ? product.nameJa : product.nameEn}`}
                          >
                            -
                          </button>
                          <span className="qty-count">{qty}</span>
                          <button 
                            className="qty-btn" 
                            onClick={() => handleAddItem(product)}
                            disabled={totalAmount + product.price > BUDGET + 500} // あまりに予算オーバーさせないリミット
                            aria-label={`Add one ${language === 'ja' ? product.nameJa : product.nameEn}`}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Basket Sidebar */}
            <div className="basket-sidebar">
              <h2 className="basket-title">Shopping Basket</h2>
              
              {basket.length > 0 ? (
                <div className="basket-list">
                  {basket.map(item => (
                    <div className="basket-item" key={item.product.id}>
                      <div className="basket-item-info">
                        <span>{language === 'ja' ? item.product.nameJa : item.product.nameEn}</span>
                        <span className="basket-item-qty">x{item.quantity}</span>
                      </div>
                      <span className="basket-item-price">¥{item.product.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="basket-empty">
                  {t('konbini.emptyBasket')}
                </div>
              )}

              <div className="basket-footer">
                {totalAmount > BUDGET && (
                  <div className="error-banner">
                    {t('konbini.overBudget')}
                  </div>
                )}
                
                <button 
                  className="checkout-btn"
                  disabled={basket.length === 0 || totalAmount > BUDGET}
                  onClick={handleCheckout}
                >
                  {t('konbini.checkout')}
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Result Screen */
        <div className="result-screen animate-fade-in">
          <h2 className="page-title" style={{ fontSize: '1.75rem' }}>{t('konbini.resultTitle')}</h2>
          
          <div className="result-badge">
            {t(`konbini.rating.${resultRating}`)}
          </div>
          
          <div className="result-summary">
            {t('konbini.total')}: ¥{totalAmount} / ¥{BUDGET}
          </div>
          
          <p className="result-desc">
            {t(`konbini.ratingDesc.${resultRating}`)}
          </p>

          <div className="result-actions">
            <button className="btn btn-primary" onClick={handleReplay}>
              {t('konbini.replay')}
            </button>
            <button className="btn btn-secondary" onClick={handleShare}>
              {t('konbini.share')}
            </button>
          </div>

          {/* Next Game recommendations */}
          <div className="next-recommendations">
            <h3 className="next-title">{t('konbini.nextGame')}</h3>
            <div className="next-grid">
              {nextGames.map(game => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
