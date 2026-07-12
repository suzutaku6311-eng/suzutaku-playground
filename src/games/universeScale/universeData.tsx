import React from 'react';

export interface UniverseObject {
  id: string;
  exponent: number; // 10^exponent メートル
  sizeStr: string;  // わかりやすいサイズ表記 (e.g., "1.7 m", "100 μm")
  nameEn: string;
  nameJa: string;
  descEn: string;
  descJa: string;
  renderSvg: () => React.ReactNode;
}

export const universeObjects: UniverseObject[] = [
  {
    id: "quark",
    exponent: -18,
    sizeStr: "0.1 am (10^-18 m)",
    nameEn: "Quark",
    nameJa: "クォーク",
    descEn: "One of the fundamental constituents of matter. Extremely tiny, quarks make up protons and neutrons.",
    descJa: "物質を構成する最も基本的な素粒子の一つ。陽子や中性子を形作っています。",
    renderSvg: () => (
      <svg viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="12" fill="#E94B3C" opacity="0.8" />
        <circle cx="50" cy="50" r="4" fill="#FFFFFF" />
        <circle cx="50" cy="50" r="25" fill="none" stroke="#E94B3C" strokeWidth="2" strokeDasharray="4 4" />
      </svg>
    )
  },
  {
    id: "proton",
    exponent: -15,
    sizeStr: "0.8 fm (10^-15 m)",
    nameEn: "Proton",
    nameJa: "陽子",
    descEn: "A subatomic particle found in the nucleus of every atom. It is composed of three quarks.",
    descJa: "あらゆる原子の原子核に含まれる亜原子粒子。3つのクォークで構成されています。",
    renderSvg: () => (
      <svg viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="20" fill="#008080" />
        {/* 内包する3つのクォーク表現 */}
        <circle cx="42" cy="45" r="5" fill="#FFFFFF" />
        <circle cx="58" cy="42" r="5" fill="#FFFFFF" />
        <circle cx="50" cy="58" r="5" fill="#FFFFFF" />
        <text x="50" y="53" fill="#1C1C1C" fontSize="10" fontWeight="900" textAnchor="middle">+</text>
      </svg>
    )
  },
  {
    id: "atom",
    exponent: -10,
    sizeStr: "0.1 nm (10^-10 m)",
    nameEn: "Hydrogen Atom",
    nameJa: "水素原子",
    descEn: "The simplest and most abundant chemical element in the universe, consisting of a single proton and electron.",
    descJa: "宇宙で最も単純かつ最も豊富に存在する化学元素。1つの陽子と1つの電子から構成されています。",
    renderSvg: () => (
      <svg viewBox="0 0 100 100" fill="none">
        {/* 電子軌道 */}
        <circle cx="50" cy="50" r="35" fill="none" stroke="#8A2BE2" strokeWidth="2" strokeDasharray="3 3" />
        {/* 原子核 (陽子) */}
        <circle cx="50" cy="50" r="8" fill="#008080" />
        {/* 電子 */}
        <circle cx="85" cy="50" r="4" fill="#8A2BE2" />
      </svg>
    )
  },
  {
    id: "dna",
    exponent: -9,
    sizeStr: "2.5 nm (10^-9 m)",
    nameEn: "DNA Helix",
    nameJa: "DNA二重らせん",
    descEn: "The molecule that carries genetic instructions for the development and functioning of all living organisms.",
    descJa: "すべての生物の成長や機能に関する遺伝情報を担う高分子化合物。",
    renderSvg: () => (
      <svg viewBox="0 0 100 100" fill="none">
        {/* 二重らせん */}
        <path d="M20,30 C40,30 30,70 50,70 C70,70 60,30 80,30" stroke="#E94B3C" strokeWidth="4" strokeLinecap="round" />
        <path d="M20,70 C40,70 30,30 50,30 C70,30 60,70 80,70" stroke="#008080" strokeWidth="4" strokeLinecap="round" />
        {/* 結合ハシゴ */}
        <line x1="35" y1="42" x2="35" y2="58" stroke="#1C1C1C" strokeWidth="2" />
        <line x1="50" y1="30" x2="50" y2="70" stroke="#1C1C1C" strokeWidth="2" />
        <line x1="65" y1="42" x2="65" y2="58" stroke="#1C1C1C" strokeWidth="2" />
      </svg>
    )
  },
  {
    id: "redbloodcell",
    exponent: -6,
    sizeStr: "8 μm (10^-6 m)",
    nameEn: "Red Blood Cell",
    nameJa: "赤血球",
    descEn: "The most common type of blood cell, responsible for delivering oxygen to body tissues.",
    descJa: "血液中で最も一般的な細胞。体中の組織へ酸素を運ぶ役割を担っています。",
    renderSvg: () => (
      <svg viewBox="0 0 100 100" fill="none">
        {/* ドーナツ中央が凹んだ形状 */}
        <circle cx="50" cy="50" r="35" fill="#EF4444" stroke="#B91C1C" strokeWidth="3" />
        <circle cx="50" cy="50" r="18" fill="#FCA5A5" stroke="#B91C1C" strokeWidth="2" />
      </svg>
    )
  },
  {
    id: "hair",
    exponent: -4,
    sizeStr: "100 μm (10^-4 m)",
    nameEn: "Human Hair (width)",
    nameJa: "髪の毛の太さ",
    descEn: "A typical human hair diameter. Just barely visible to the naked human eye.",
    descJa: "一般的な人間の髪の毛の直径。人間の裸眼でかろうじて認識できる細さです。",
    renderSvg: () => (
      <svg viewBox="0 0 100 100" fill="none">
        <rect x="0" y="0" width="100" height="100" fill="rgba(28,28,28,0.03)" />
        {/* 巨大な繊維の横断 */}
        <path d="M0,50 Q25,60 50,50 T100,50" stroke="#1C1C1C" strokeWidth="22" strokeLinecap="round" />
        <path d="M0,50 Q25,60 50,50 T100,50" stroke="#4B5563" strokeWidth="16" strokeLinecap="round" />
      </svg>
    )
  },
  {
    id: "ant",
    exponent: -3,
    sizeStr: "5 mm (10^-3 m)",
    nameEn: "Ant",
    nameJa: "アリ",
    descEn: "A common small insect known for its highly structured social colonies.",
    descJa: "高度な社会組織（コロニー）を作って生活するおなじみの昆虫。",
    renderSvg: () => (
      <svg viewBox="0 0 100 100" fill="none">
        {/* 頭・胸・腹 */}
        <ellipse cx="28" cy="50" rx="8" ry="7" fill="#1C1C1C" />
        <ellipse cx="45" cy="50" rx="10" ry="6" fill="#1C1C1C" />
        <ellipse cx="68" cy="50" rx="14" ry="10" fill="#1C1C1C" />
        {/* 触角 */}
        <path d="M22,46 Q12,42 16,30" stroke="#1C1C1C" strokeWidth="2" strokeLinecap="round" fill="none" />
        {/* 脚 */}
        <path d="M42,50 Q35,68 30,72" stroke="#1C1C1C" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M45,50 Q45,68 48,72" stroke="#1C1C1C" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M48,50 Q55,68 62,72" stroke="#1C1C1C" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M42,50 Q35,32 30,28" stroke="#1C1C1C" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M45,50 Q45,32 48,28" stroke="#1C1C1C" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M48,50 Q55,32 62,28" stroke="#1C1C1C" strokeWidth="2" strokeLinecap="round" fill="none" />
      </svg>
    )
  },
  {
    id: "human",
    exponent: 0,
    sizeStr: "1.7 m (10^0 m)",
    nameEn: "Human",
    nameJa: "人間",
    descEn: "The average height of an adult human. A scale we interact with daily.",
    descJa: "成人男性・女性の平均的な身長。私たちが日常的に捉えているスケールです。",
    renderSvg: () => (
      <svg viewBox="0 0 100 100" fill="none">
        {/* ピクトグラム風人型 */}
        <circle cx="50" cy="22" r="10" fill="#1C1C1C" />
        <rect x="38" y="36" width="24" height="34" rx="6" fill="#1C1C1C" />
        <rect x="40" y="65" width="8" height="25" rx="3" fill="#1C1C1C" />
        <rect x="52" y="65" width="8" height="25" rx="3" fill="#1C1C1C" />
        {/* 腕 */}
        <rect x="28" y="36" width="8" height="25" rx="3" fill="#1C1C1C" />
        <rect x="64" y="36" width="8" height="25" rx="3" fill="#1C1C1C" />
      </svg>
    )
  },
  {
    id: "fuji",
    exponent: 3,
    sizeStr: "3.7 km (10^3 m)",
    nameEn: "Mount Fuji",
    nameJa: "富士山",
    descEn: "The highest mountain in Japan, standing at 3,776 meters. An iconic active stratovolcano.",
    descJa: "日本で最も高い山（標高3,776m）。象徴的な美しい円錐形をした活火山です。",
    renderSvg: () => (
      <svg viewBox="0 0 100 100" fill="none">
        {/* 山の形状 */}
        <polygon points="50,20 10,85 90,85" fill="#1C2541" />
        {/* 雪化粧 */}
        <polygon points="50,20 38,45 44,42 50,48 56,42 62,45" fill="#FFFFFF" />
        {/* 太陽 */}
        <circle cx="80" cy="35" r="8" fill="#E94B3C" />
      </svg>
    )
  },
  {
    id: "earth",
    exponent: 7,
    sizeStr: "12,740 km (10^7 m)",
    nameEn: "Earth",
    nameJa: "地球",
    descEn: "Our home planet. The only astronomical object known to harbor life.",
    descJa: "私たちが暮らす惑星。現在生命の存在が確認されている唯一 of 天体です。",
    renderSvg: () => (
      <svg viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="38" fill="#3B82F6" stroke="#1C1C1C" strokeWidth="2" />
        {/* 陸地表現 */}
        <path d="M35,30 Q45,28 42,40 T30,55 T38,75 Q52,80 50,70 T65,55 T55,30 Z" fill="#10B981" opacity="0.9" />
        <path d="M68,28 Q75,35 72,42 T62,48 Z" fill="#10B981" opacity="0.9" />
        {/* 雲 */}
        <path d="M25,45 Q40,35 60,42 T80,48" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
      </svg>
    )
  },
  {
    id: "sun",
    exponent: 9,
    sizeStr: "1,390,000 km (10^9 m)",
    nameEn: "The Sun",
    nameJa: "太陽",
    descEn: "The star at the center of the Solar System. It accounts for 99.8% of the system's total mass.",
    descJa: "太陽系の中心にある恒星。太陽系全体の質量の99.8%を占めています。",
    renderSvg: () => (
      <svg viewBox="0 0 100 100" fill="none">
        {/* コロナ光線 */}
        <circle cx="50" cy="50" r="42" fill="none" stroke="#FBBF24" strokeWidth="4" strokeDasharray="6 4" />
        <circle cx="50" cy="50" r="35" fill="#F59E0B" />
        <circle cx="50" cy="50" r="28" fill="#EF4444" />
      </svg>
    )
  },
  {
    id: "solarsystem",
    exponent: 13,
    sizeStr: "15,000,000,000 km (10^13 m)",
    nameEn: "The Solar System",
    nameJa: "太陽系",
    descEn: "The gravitationally bound system of the Sun and the objects that orbit it.",
    descJa: "太陽と、その重力によって周囲を公転する天体（惑星・小惑星等）からなる天体システム。",
    renderSvg: () => (
      <svg viewBox="0 0 100 100" fill="none">
        {/* 太陽 */}
        <circle cx="50" cy="50" r="6" fill="#F59E0B" />
        {/* 軌道 */}
        <circle cx="50" cy="50" r="16" fill="none" stroke="#4B5563" strokeWidth="1" opacity="0.5" />
        <circle cx="50" cy="50" r="26" fill="none" stroke="#4B5563" strokeWidth="1" opacity="0.5" />
        <circle cx="50" cy="50" r="38" fill="none" stroke="#4B5563" strokeWidth="1" opacity="0.5" />
        {/* 惑星たち */}
        <circle cx="66" cy="50" r="3" fill="#D1D5DB" />
        <circle cx="50" cy="76" r="4.5" fill="#3B82F6" />
        <circle cx="22" cy="30" r="4" fill="#F59E0B" />
      </svg>
    )
  },
  {
    id: "milkyway",
    exponent: 21,
    sizeStr: "1,000,000,000,000,000,000 km (10^21 m)",
    nameEn: "Milky Way Galaxy",
    nameJa: "天の川銀河 (銀河系)",
    descEn: "The barred spiral galaxy that contains our Solar System, consisting of billions of stars.",
    descJa: "私たちの太陽系が属する棒渦巻銀河。数千億個もの恒星が集まっています。",
    renderSvg: () => (
      <svg viewBox="0 0 100 100" fill="none">
        {/* 銀河の渦 */}
        <defs>
          <radialGradient id="galaxyCenter" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="60%" stopColor="#8A2BE2" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
        <rect x="0" y="0" width="100" height="100" fill="#0B132B" rx="10" />
        <circle cx="50" cy="50" r="30" fill="url(#galaxyCenter)" />
        {/* スパイラルアーム */}
        <path d="M50,50 Q60,35 80,45 Q90,55 75,70 Q60,80 50,50" stroke="#C71585" strokeWidth="3" fill="none" opacity="0.8" />
        <path d="M50,50 Q40,65 20,55 Q10,45 25,30 Q40,20 50,50" stroke="#38BDF8" strokeWidth="3" fill="none" opacity="0.8" />
      </svg>
    )
  },
  {
    id: "observableuniverse",
    exponent: 26,
    sizeStr: "8.8 × 10^26 m (93 billion light years)",
    nameEn: "Observable Universe",
    nameJa: "観測可能な宇宙",
    descEn: "The portion of the universe that can be seen from Earth. It contains trillions of galaxies.",
    descJa: "地球から観測できる全宇宙の領域。ここには数兆個もの銀河が含まれています。",
    renderSvg: () => (
      <svg viewBox="0 0 100 100" fill="none">
        <rect x="0" y="0" width="100" height="100" fill="#020617" rx="10" />
        <circle cx="50" cy="50" r="42" fill="none" stroke="#38BDF8" strokeWidth="2" strokeDasharray="3 3" />
        {/* 無数の光のドット (銀河集団) */}
        <circle cx="50" cy="50" r="2" fill="#FFFFFF" />
        <circle cx="35" cy="40" r="1" fill="#8A2BE2" />
        <circle cx="65" cy="60" r="1.5" fill="#38BDF8" />
        <circle cx="70" cy="30" r="1" fill="#C71585" />
        <circle cx="30" cy="70" r="1.2" fill="#FBBF24" />
        <circle cx="50" cy="25" r="1" fill="#FFFFFF" />
      </svg>
    )
  }
];
