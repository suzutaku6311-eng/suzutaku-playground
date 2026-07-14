import React from 'react';

export interface UniverseObject {
  id: string;
  exponent: number; // 10^exponent メートル
  sizeStr: string;  // わかりやすいサイズ表記
  nameEn: string;
  nameJa: string;
  categoryEn: string;
  categoryJa: string;
  themeColor: string;
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
    categoryEn: "Subatomic & Quantum Realm",
    categoryJa: "🔬 素粒子・量子領域",
    themeColor: "#ec4899",
    descEn: "One of the fundamental constituents of matter. Extremely tiny, quarks make up protons and neutrons with intense color charges.",
    descJa: "物質を構成する最も基本的な素粒子の一つ。強い相互作用を持ち、クォークが3つ結合して陽子や中性子を形作っています。",
    renderSvg: () => (
      <img src="/universe/quark.png" alt="クォーク" className="universe-photo-img" />
    )
  },
  {
    id: "proton",
    exponent: -15,
    sizeStr: "0.8 fm (10^-15 m)",
    nameEn: "Proton",
    nameJa: "陽子",
    categoryEn: "Subatomic & Quantum Realm",
    categoryJa: "🔬 素粒子・量子領域",
    themeColor: "#8b5cf6",
    descEn: "A subatomic particle found in the nucleus of every atom. It is composed of three quarks bound by gluons.",
    descJa: "あらゆる原子の原子核に含まれる強い正の電荷を持つ粒子。3つのクォークがグルーオンによって強固に結合されています。",
    renderSvg: () => (
      <img src="/universe/proton.png" alt="陽子" className="universe-photo-img" />
    )
  },
  {
    id: "atom",
    exponent: -10,
    sizeStr: "0.1 nm (10^-10 m)",
    nameEn: "Hydrogen Atom",
    nameJa: "水素原子",
    categoryEn: "Subatomic & Quantum Realm",
    categoryJa: "🔬 素粒子・量子領域",
    themeColor: "#38bdf8",
    descEn: "The simplest and most abundant chemical element in the universe, consisting of a single central proton and an electron cloud.",
    descJa: "宇宙で最も単純かつ最も豊富に存在する化学元素。中心の1つの陽子の周りを、電子が確率の雲（オービタル）として覆っています。",
    renderSvg: () => (
      <img src="/universe/atom.png" alt="水素原子" className="universe-photo-img" />
    )
  },
  {
    id: "dna",
    exponent: -9,
    sizeStr: "2.5 nm (10^-9 m)",
    nameEn: "DNA Double Helix",
    nameJa: "DNA二重らせん",
    categoryEn: "Microbiology & Molecules",
    categoryJa: "🧬 分子・細胞・生命領域",
    themeColor: "#06b6d4",
    descEn: "The molecule that carries genetic instructions for the development and functioning of all known living organisms.",
    descJa: "すべての生命の設計図である遺伝情報を記録する究極の生体高分子。アデニン、チミン、グアニン、シトシンの塩基対が美しく螺旋を描きます。",
    renderSvg: () => (
      <img src="/universe/dna.png" alt="DNA二重らせん" className="universe-photo-img" />
    )
  },
  {
    id: "redbloodcell",
    exponent: -6,
    sizeStr: "8 μm (10^-6 m)",
    nameEn: "Red Blood Cell",
    nameJa: "赤血球",
    categoryEn: "Microbiology & Molecules",
    categoryJa: "🧬 分子・細胞・生命領域",
    themeColor: "#f43f5e",
    descEn: "The most common type of blood cell in vertebrates, delivering oxygen to body tissues via blood flow.",
    descJa: "脊椎動物の血液中を巡り、全身の細胞へと酸素を届ける重要な血液細胞。効率的にガス交換を行うため独特の円盤状になっています。",
    renderSvg: () => (
      <img src="/universe/redbloodcell.png" alt="赤血球" className="universe-photo-img" />
    )
  },
  {
    id: "hair",
    exponent: -4,
    sizeStr: "100 μm (10^-4 m)",
    nameEn: "Human Hair Strand",
    nameJa: "髪の毛の太さ",
    categoryEn: "Microbiology & Molecules",
    categoryJa: "🧬 分子・細胞・生命領域",
    themeColor: "#eab308",
    descEn: "Roughly the limit of what the naked human eye can see without magnification, coated in microscopicキューティクル scales.",
    descJa: "肉眼で識別できる限界サイズに近い日常的なスケール。電子顕微鏡で見ると表面は繊細なキューティクルの層で覆われています。",
    renderSvg: () => (
      <img src="/universe/hair.png" alt="髪の毛の太さ" className="universe-photo-img" />
    )
  },
  {
    id: "ant",
    exponent: -3,
    sizeStr: "5 mm (10^-3 m)",
    nameEn: "Common Ant",
    nameJa: "アリ",
    categoryEn: "Everyday Nature",
    categoryJa: "🌱 日常・生態系スケール",
    themeColor: "#84cc16",
    descEn: "A social insect known for astonishing organizational strength and lifting capabilities far exceeding its own body weight.",
    descJa: "驚異的な社会性と協調性を持つ昆虫。自重の何十倍もの物体を持ち上げる強靭な筋肉と精密な外骨格構造を備えています。",
    renderSvg: () => (
      <img src="/universe/ant.png" alt="アリ" className="universe-photo-img" />
    )
  },
  {
    id: "human",
    exponent: 0,
    sizeStr: "1.7 m (10^0 m)",
    nameEn: "Human Being",
    nameJa: "人間",
    categoryEn: "Everyday Nature",
    categoryJa: "🌱 日常・生態系スケール",
    themeColor: "#10b981",
    descEn: "Our baseline scale in the universe. Composed of approximately 37 trillion cells working in extraordinary harmony.",
    descJa: "私たちの基準となるスケール。約37兆個もの細胞が完璧な調和をもって躍動し、この広大な宇宙を認識し思考する生命体です。",
    renderSvg: () => (
      <img src="/universe/human.png" alt="人間" className="universe-photo-img" />
    )
  },
  {
    id: "fuji",
    exponent: 3,
    sizeStr: "3.7 km (10^3 m)",
    nameEn: "Mount Fuji",
    nameJa: "富士山",
    categoryEn: "Geological & Planetary",
    categoryJa: "🏔️ 地球規模・惑星地形",
    themeColor: "#3b82f6",
    descEn: "The highest mountain in Japan and a majestic stratovolcano famous worldwide for its exceptionally symmetrical cone.",
    descJa: "日本最高峰を誇る美しい成層火山。地球の地殻変動とマグマが何十万年もの歳月をかけて造り上げた荘厳な自然の芸術です。",
    renderSvg: () => (
      <img src="/universe/fuji.png" alt="富士山" className="universe-photo-img" />
    )
  },
  {
    id: "earth",
    exponent: 7,
    sizeStr: "12,740 km (10^7 m)",
    nameEn: "Planet Earth",
    nameJa: "地球",
    categoryEn: "Geological & Planetary",
    categoryJa: "🌍 惑星・天体領域",
    themeColor: "#0284c7",
    descEn: "Our cradle and the only known astronomical object to harbor life, orbiting the Sun at roughly 108,000 km/h.",
    descJa: "私たちが暮らす生命の揺り籠。豊かな海洋と大気層に守られ、時速約10万8千kmというものすごい速度で太陽の周りを公転しています。",
    renderSvg: () => (
      <img src="/universe/earth.png" alt="地球" className="universe-photo-img" />
    )
  },
  {
    id: "sun",
    exponent: 9,
    sizeStr: "1,390,000 km (10^9 m)",
    nameEn: "The Sun",
    nameJa: "太陽",
    categoryEn: "Stars & Solar Systems",
    categoryJa: "☀️ 恒星・太陽系領域",
    themeColor: "#f97316",
    descEn: "The star at the center of our Solar System. Its immense nuclear fusion core generates all the energy enabling life on Earth.",
    descJa: "太陽系中心の巨大なG型主系列星。毎秒数億トンの水素をヘリウムに変える核融合反応で、地球上の全生命を支える莫大な光と熱を放ち続けています。",
    renderSvg: () => (
      <img src="/universe/sun.png" alt="太陽" className="universe-photo-img" />
    )
  },
  {
    id: "solarsystem",
    exponent: 13,
    sizeStr: "15,000,000,000 km (10^13 m)",
    nameEn: "Solar System",
    nameJa: "太陽系",
    categoryEn: "Stars & Solar Systems",
    categoryJa: "☀️ 恒星・太陽系領域",
    themeColor: "#a855f7",
    descEn: "The gravitationally bound system of the Sun and the objects orbiting it, extending out past Neptune to the Kuiper Belt.",
    descJa: "太陽の重力によって結びつけられた惑星、衛星、小惑星、彗星が巡る広大な空間。その領域は冥王星の遥か外側の海王星外天体帯にまで及びます。",
    renderSvg: () => (
      <img src="/universe/solarsystem.png" alt="太陽系" className="universe-photo-img" />
    )
  },
  {
    id: "milkyway",
    exponent: 21,
    sizeStr: "1,000,000,000,000,000,000 km (10^21 m)",
    nameEn: "Milky Way Galaxy",
    nameJa: "天の川銀河 (銀河系)",
    categoryEn: "Galaxies & Deep Space",
    categoryJa: "✨ 銀河・大宇宙スケール",
    themeColor: "#6366f1",
    descEn: "Our home barred spiral galaxy containing over 200 billion stars, swirling nebulae, and a supermassive black hole at its center.",
    descJa: "太陽系が属する巨大な棒渦巻銀河。約2,000億～4,000億個もの恒星と星雲が美しく渦を巻いており、中心には巨大ブラックホール（サジタリウスA*）が存在します。",
    renderSvg: () => (
      <img src="/universe/milkyway.png" alt="天の川銀河" className="universe-photo-img" />
    )
  },
  {
    id: "observableuniverse",
    exponent: 26,
    sizeStr: "8.8 × 10^26 m (93 billion light years)",
    nameEn: "Observable Universe",
    nameJa: "観測可能な宇宙",
    categoryEn: "Galaxies & Deep Space",
    categoryJa: "✨ 銀河・大宇宙スケール",
    themeColor: "#d946ef",
    descEn: "The ultimate cosmic boundary containing at least two trillion galaxies inside a vast, interconnected cosmic web.",
    descJa: "現在の科学で観測できる極限領域（直径約930億光年）。2兆個以上の銀河とダークマターが網の目状の「宇宙の大規模構造」を形成しています。",
    renderSvg: () => (
      <img src="/universe/observableuniverse.png" alt="観測可能な宇宙" className="universe-photo-img" />
    )
  }
];
