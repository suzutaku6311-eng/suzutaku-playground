// sushiWordsData.ts - English Typing Words & Phrases for Sushi Typing Game
export interface SushiWordItem {
  id: string;
  word: string;         // English string to type (all uppercase or standardized)
  displayEn: string;    // Display title/meaning in English
  displayJa: string;    // Display title/meaning in Japanese
  price: number;        // Price in USD (e.g., 3.00, 5.00, 10.00, 15.00)
  plateColor: 'green' | 'red' | 'gold' | 'black';
  emoji: string;
}

export const lightCourseWords: SushiWordItem[] = [
  { id: 'l1', word: 'TUNA', displayEn: 'Tuna (Maguro)', displayJa: 'まぐろ', price: 3.00, plateColor: 'green', emoji: '🍣' },
  { id: 'l2', word: 'RICE', displayEn: 'Sushi Rice (Shari)', displayJa: 'シャリ（すし飯）', price: 2.50, plateColor: 'green', emoji: '🍚' },
  { id: 'l3', word: 'EGG', displayEn: 'Sweet Egg (Tamago)', displayJa: '玉子焼き', price: 2.50, plateColor: 'green', emoji: '🍳' },
  { id: 'l4', word: 'TEA', displayEn: 'Green Tea (Agari)', displayJa: 'あがり（緑茶）', price: 2.00, plateColor: 'green', emoji: '🍵' },
  { id: 'l5', word: 'CRAB', displayEn: 'Snow Crab (Kani)', displayJa: 'ズワイガニ', price: 4.00, plateColor: 'green', emoji: '🦀' },
  { id: 'l6', word: 'SOY', displayEn: 'Soy Sauce (Shoyu)', displayJa: '醤油（むらさき）', price: 2.00, plateColor: 'green', emoji: '🥢' },
  { id: 'l7', word: 'CHEF', displayEn: 'Sushi Master (Taisho)', displayJa: '寿司職人・大将', price: 4.50, plateColor: 'green', emoji: '👨‍🍳' },
  { id: 'l8', word: 'MISO', displayEn: 'Miso Soup', displayJa: 'お味噌汁', price: 3.00, plateColor: 'green', emoji: '🥣' },
  { id: 'l9', word: 'SQUID', displayEn: 'Fresh Squid (Ika)', displayJa: 'いか', price: 3.50, plateColor: 'green', emoji: '🦑' },
  { id: 'l10', word: 'EEL', displayEn: 'Grilled Eel (Unagi)', displayJa: 'うなぎ蒲焼き', price: 4.50, plateColor: 'green', emoji: '🍱' },
  { id: 'l11', word: 'PRAWN', displayEn: 'Boiled Shrimp (Ebi)', displayJa: '蒸しえび', price: 3.50, plateColor: 'green', emoji: '🦐' },
  { id: 'l12', word: 'CLAM', displayEn: 'Surf Clam (Hokkigai)', displayJa: 'ホッキ貝', price: 4.00, plateColor: 'green', emoji: '🦪' },
  { id: 'l13', word: 'ROLL', displayEn: 'Seaweed Roll (Norimaki)', displayJa: '海苔巻きロール', price: 3.00, plateColor: 'green', emoji: '🍙' },
  { id: 'l14', word: 'MENU', displayEn: 'Today\'s Menu', displayJa: '本日のメニュー', price: 2.50, plateColor: 'green', emoji: '📋' },
  { id: 'l15', word: 'FISH', displayEn: 'Fresh Catch', displayJa: 'とれたて鮮魚', price: 3.50, plateColor: 'green', emoji: '🐟' }
];

export const standardCourseWords: SushiWordItem[] = [
  { id: 's1', word: 'SALMON ROLL', displayEn: 'Fresh Salmon Roll', displayJa: 'サーモンロール', price: 6.00, plateColor: 'red', emoji: '🍣' },
  { id: 's2', word: 'SPICY TUNA', displayEn: 'Spicy Tuna Gunkan', displayJa: 'スパイシーネギトロ軍艦', price: 7.00, plateColor: 'red', emoji: '🔥' },
  { id: 's3', word: 'SOY SAUCE', displayEn: 'Special Brewed Soy Sauce', displayJa: '特製仕込み醤油', price: 5.00, plateColor: 'red', emoji: '🥢' },
  { id: 's4', word: 'GREEN TEA', displayEn: 'Roasted Matcha Green Tea', displayJa: '宇治抹茶・緑茶', price: 5.00, plateColor: 'red', emoji: '🍵' },
  { id: 's5', word: 'FRESH WASABI', displayEn: 'Freshly Grated Wasabi', displayJa: '本わさび（生すりおろし）', price: 6.50, plateColor: 'red', emoji: '🌿' },
  { id: 's6', word: 'FATTY TUNA', displayEn: 'Medium Fatty Tuna (Chutoro)', displayJa: '中トロ', price: 8.00, plateColor: 'red', emoji: '🐟' },
  { id: 's7', word: 'SALMON ROE', displayEn: 'Salmon Roe (Ikura)', displayJa: 'いくら軍艦', price: 8.50, plateColor: 'red', emoji: '🟠' },
  { id: 's8', word: 'SEA URCHIN', displayEn: 'Rich Sea Urchin (Uni)', displayJa: '最高級うに軍艦', price: 9.00, plateColor: 'red', emoji: '🌟' },
  { id: 's9', word: 'SHRIMP TEMPURA', displayEn: 'Crispy Shrimp Tempura', displayJa: 'サクサクえび天ロール', price: 7.50, plateColor: 'red', emoji: '🍤' },
  { id: 's10', word: 'SWEET SHRIMP', displayEn: 'Sweet Northern Shrimp (Amaebi)', displayJa: '甘えび', price: 6.50, plateColor: 'red', emoji: '🦐' },
  { id: 's11', word: 'PICKLED GINGER', displayEn: 'Pickled Sweet Ginger (Gari)', displayJa: 'ガリ（甘酢生姜）', price: 5.00, plateColor: 'red', emoji: '🌸' },
  { id: 's12', word: 'CALIFORNIA ROLL', displayEn: 'California Avocado Roll', displayJa: 'カリフォルニアロール', price: 7.50, plateColor: 'red', emoji: '🥑' },
  { id: 's13', word: 'ROASTED SALMON', displayEn: 'Seared Salmon with Mayo', displayJa: '炙りマヨサーモン', price: 7.00, plateColor: 'red', emoji: '🍱' },
  { id: 's14', word: 'YELLOWTAIL', displayEn: 'Fresh Yellowtail (Hamachi)', displayJa: '新鮮ハマチ・ブリ', price: 8.00, plateColor: 'red', emoji: '🐟' },
  { id: 's15', word: 'CONVEYOR BELT', displayEn: 'Conveyor Belt Sushi Lane', displayJa: '回転寿司レーン', price: 6.00, plateColor: 'red', emoji: '🔄' }
];

export const luxuryCourseWords: SushiWordItem[] = [
  { id: 'x1', word: 'ALL YOU CAN EAT SUSHI BANQUET', displayEn: 'All-You-Can-Eat Supreme Sushi Banquet', displayJa: '極上お寿司食べ放題バンケットコース', price: 18.00, plateColor: 'gold', emoji: '👑' },
  { id: 'x2', word: 'PREMIUM FATTY TUNA OTORO', displayEn: 'Supreme Melt-in-Mouth Otoro Tuna', displayJa: '最高峰とろける大トロ一本握り', price: 16.00, plateColor: 'gold', emoji: '✨' },
  { id: 'x3', word: 'EXTRA WASABI ON THE SIDE PLEASE', displayEn: 'Please Give Me Extra Wasabi on the Side', displayJa: 'わさび多めで別皿にお願いします', price: 14.00, plateColor: 'gold', emoji: '🌿' },
  { id: 'x4', word: 'CONVEYOR BELT BRINGS HAPPINESS', displayEn: 'The Conveyor Belt Brings Endless Happiness', displayJa: '回転寿司レーンが運んでくる無限の幸せ', price: 15.00, plateColor: 'gold', emoji: '🎉' },
  { id: 'x5', word: 'CHEF SPECIAL OMAKASE PLATTER', displayEn: 'Chef\'s Special Omakase 10-Piece Platter', displayJa: '大将特選おまかせ10貫スペシャル盛り', price: 20.00, plateColor: 'gold', emoji: '👨‍🍳' },
  { id: 'x6', word: 'GRILLED WAGYU BEEF WITH PONZU', displayEn: 'Seared A5 Wagyu Beef Sushi with Ponzu', displayJa: 'A5黒毛和牛の炙りポン酢ジュレ握り', price: 18.00, plateColor: 'gold', emoji: '🥩' },
  { id: 'x7', word: 'HOKKAIDO SEA URCHIN AND IKURA', displayEn: 'Double Hokkaido Sea Urchin and Salmon Roe Bowl', displayJa: '北海道産うに＆いくら盛りこぼし軍艦', price: 19.00, plateColor: 'gold', emoji: '🟠' },
  { id: 'x8', word: 'FRESHLY BAKED TAMAGO WITH HONEY', displayEn: 'Freshly Baked Artisanal Tamago with Honey', displayJa: '職人仕込みのはちみつ入り焼き立て厚焼き玉子', price: 14.00, plateColor: 'gold', emoji: '🍳' },
  { id: 'x9', word: 'THANK YOU FOR THE DELICIOUS MEAL', displayEn: 'Thank You Very Much for the Delicious Meal', displayJa: '本当に美味しいお寿司をごちそうさまでした', price: 16.00, plateColor: 'gold', emoji: '🙏' },
  { id: 'x10', word: 'JAPANESE SOUL FOOD LOVED WORLDWIDE', displayEn: 'Japanese Authentic Soul Food Loved Worldwide', displayJa: '世界中から愛される日本の最高峰ソウルフード', price: 17.00, plateColor: 'gold', emoji: '🌏' },
  { id: 'x11', word: 'DRAGON ROLL WITH CRISPY PRAWN', displayEn: 'Special Dragon Roll with Crispy King Prawn', displayJa: '特大エビ天入りスペシャルドラゴンロール', price: 16.50, plateColor: 'gold', emoji: '🐉' },
  { id: 'x12', word: 'ROASTED GREEN TEA AND MISO SOUP', displayEn: 'Hot Roasted Hojicha Green Tea and Rich Miso Soup', displayJa: 'アツアツほうじ茶と旨味たっぷり魚介お味噌汁', price: 15.00, plateColor: 'gold', emoji: '🍵' }
];

export interface CourseConfig {
  id: 'light' | 'standard' | 'luxury';
  titleJa: string;
  titleEn: string;
  descJa: string;
  descEn: string;
  cost: number;         // Course price (e.g. $30, $50, $100)
  timeSeconds: number;  // Game duration
  wordsPool: SushiWordItem[];
  basePlateSpeed: number; // Pixels per second along conveyor
  badgeIcon: string;
}

export const coursesConfig: Record<'light' | 'standard' | 'luxury', CourseConfig> = {
  light: {
    id: 'light',
    titleJa: 'お手軽 $30.00 コース (60秒)',
    titleEn: 'Light $30.00 Course (60s)',
    descJa: '短い英単語（4〜5文字）中心！タイピング初心者や手慣らしにピッタリ。',
    descEn: 'Short 4-5 letter English words! Great for quick warm-ups and beginners.',
    cost: 30.00,
    timeSeconds: 60,
    wordsPool: lightCourseWords,
    basePlateSpeed: 160,
    badgeIcon: '🍵'
  },
  standard: {
    id: 'standard',
    titleJa: 'お勧め $50.00 コース (90秒)',
    titleEn: 'Standard $50.00 Course (90s)',
    descJa: '人気の英語お寿司メニューや2語フレーズ！スピードと正確性の王道勝負。',
    descEn: 'Popular English sushi names & 2-word phrases! The classic typing speed battle.',
    cost: 50.00,
    timeSeconds: 90,
    wordsPool: standardCourseWords,
    basePlateSpeed: 185,
    badgeIcon: '🍣'
  },
  luxury: {
    id: 'luxury',
    titleJa: '高級おまかせ $100.00 コース (120秒)',
    titleEn: 'Omakase Luxury $100.00 Course (120s)',
    descJa: '長い英語センテンスと極上メニュー！高速打鍵で大得を狙う最高難度コース。',
    descEn: 'Long English sentences & gourmet platters! Ultimate challenge for typing pros.',
    cost: 100.00,
    timeSeconds: 120,
    wordsPool: luxuryCourseWords,
    basePlateSpeed: 210,
    badgeIcon: '👑'
  }
};
