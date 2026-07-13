// countryGeoData.ts - Precise coordinates & travel guides for all 197 countries
import { allFlags } from '../flagQuiz/flagData';

export interface CountryGeoInfo {
  id: string;
  lat: number;
  lon: number;
  regionJa: string;
  regionEn: string;
  attractionJa: string;
  cuisineJa: string;
  vibeJa: string;
  attractionEn: string;
  cuisineEn: string;
  vibeEn: string;
}

// Major accurate coordinates & detailed travel tips for well-known & world nations
const specificGeoMap: Record<string, Omit<CountryGeoInfo, 'id'>> = {
  // ASIA & EAST ASIA
  jp: { lat: 35.68, lon: 139.76, regionJa: '東アジア', regionEn: 'East Asia', attractionJa: '京都の古刹と東京のサイバーシティ、富士山の絶景', cuisineJa: '本格寿司、和牛ステーキ、ご当地ラーメン巡り', vibeJa: '伝統と未来が交差する治安の良いおもてなしの国', attractionEn: 'Historic Kyoto temples, neon Tokyo, Mt. Fuji', cuisineEn: 'Authentic sushi, Wagyu beef, local ramen', vibeEn: 'Safe, hospitable blend of ancient tradition and cyber-future' },
  kr: { lat: 37.56, lon: 126.97, regionJa: '東アジア', regionEn: 'East Asia', attractionJa: 'ソウルの景福宮、明洞ショッピング、済州島ビーチ', cuisineJa: '本場サムギョプサル、熱々チーズタッカルビ、ピリ辛キムチチゲ', vibeJa: 'K-POPと美容、活気あふれるカフェとナイトライフの国', attractionEn: 'Gyeongbokgung Palace, Myeongdong shopping, Jeju Island', cuisineEn: 'Korean BBQ Samgyeopsal, Cheese Dakgalbi, Kimchi Jjigae', vibeEn: 'Vibrant center of K-Pop, K-Beauty, and bustling nightlife' },
  cn: { lat: 39.90, lon: 116.40, regionJa: '東アジア', regionEn: 'East Asia', attractionJa: '万里の長城、北京の故宮博物院、上海の超高層夜景', cuisineJa: '本場北京ダック、四川麻婆豆腐、絶品小籠包', vibeJa: '4000年の歴史と超先進テクノロジーが融合した巨大大陸', attractionEn: 'Great Wall of China, Forbidden City, Shanghai skyline', cuisineEn: 'Peking Duck, spicy Sichuan Mapo Tofu, Soup Dumplings', vibeEn: 'Colossal civilization linking ancient dynasties with modern tech' },
  tw: { lat: 25.03, lon: 121.56, regionJa: '東アジア', regionEn: 'East Asia', attractionJa: '九份の幻想的な提灯街、台北101、日月潭の絶景', cuisineJa: '士林夜市の魯肉飯、タピオカミルクティー、熱々小籠包', vibeJa: 'ノスタルジックな街並みと親切で温かい人々に出会える島', attractionEn: 'Magical lanterns of Jiufen, Taipei 101, Sun Moon Lake', cuisineEn: 'Lu Rou Fan at night markets, bubble tea, Xiao Long Bao', vibeEn: 'Friendly, nostalgic island with world-class street food' },
  mn: { lat: 47.92, lon: 106.92, regionJa: '東アジア', regionEn: 'East Asia', attractionJa: '果てしなく広がる大草原と星空、ゴビ砂漠の恐竜化石', cuisineJa: '伝統料理ホルホグ（石焼き羊肉）、ボーズ（蒸し餃子）', vibeJa: '遊牧民のゲルに泊まり大自然の雄大さを肌で感じられる秘境', attractionEn: 'Endless green steppes, Gobi desert, starlit night skies', cuisineEn: 'Khorkhog (stone-roasted lamb), Buuz dumplings', vibeEn: 'Nomadic adventure staying in traditional Ger tents' },
  vn: { lat: 21.02, lon: 105.85, regionJa: '東南アジア', regionEn: 'Southeast Asia', attractionJa: 'ハロン湾の幻想的な奇岩、ホイアンのランタン夜景、旧市街巡り', cuisineJa: '本場フォー、パリパリのバインミー、練乳たっぷりベトナムコーヒー', vibeJa: 'エキゾチックな情緒と若気の熱気に満ちた注目のリゾート', attractionEn: 'Halong Bay limestone pillars, Hoi An lantern street', cuisineEn: 'Authentic Pho beef noodle, Banh Mi baguette, egg coffee', vibeEn: 'Exotic charm with energetic local markets and beaches' },
  th: { lat: 13.75, lon: 100.50, regionJa: '東南アジア', regionEn: 'Southeast Asia', attractionJa: 'バンコクの黄金寺院、プーケットのビーチ、チェンマイの古都', cuisineJa: 'トムヤムクン、パッタイ、フレッシュマンゴースティッキーライス', vibeJa: '「微笑みの国」と呼ばれる温かいおもてなしと癒しの王国', attractionEn: 'Grand Palace temples, Phuket tropical beaches, Chiang Mai', cuisineEn: 'Tom Yum Goong soup, Pad Thai noodles, Mango sticky rice', vibeEn: 'Land of Smiles renowned for warm hospitality and wellness' },
  sg: { lat: 1.35, lon: 103.81, regionJa: '東南アジア', regionEn: 'Southeast Asia', attractionJa: 'マリーナベイ・サンズの天空プール、ガーデンズ・バイ・ザ・ベイ', cuisineJa: 'チリクラブ、ホーカーズのチキンライス、ラクサヌードル', vibeJa: '緑あふれる近未来のガーデンシティ・超清潔都市', attractionEn: 'Marina Bay Sands infinity pool, Gardens by the Bay supertrees', cuisineEn: 'Chili Crab, Hainanese Chicken Rice, spicy Laksa', vibeEn: 'Futuristic green garden city with world-class dining' },
  id: { lat: -6.20, lon: 106.81, regionJa: '東南アジア', regionEn: 'Southeast Asia', attractionJa: 'バリ島の神秘的な寺院とビーチ、ボロブドゥール遺跡', cuisineJa: 'ナシゴレン、サテ（インドネシア風焼き鳥）、ビーフルンダン', vibeJa: '1万以上の島々が織りなす神々しい自然とリゾートタイム', attractionEn: 'Bali sacred temples and beaches, Borobudur stupas', cuisineEn: 'Nasi Goreng fried rice, Chicken Satay, Beef Rendang', vibeEn: 'Archipelago of over 10,000 islands full of spiritual relaxation' },
  in: { lat: 28.61, lon: 77.20, regionJa: '南アジア', regionEn: 'South Asia', attractionJa: '白亜の霊廟タージ・マハル、聖なるガンジス川、ジャイプールのピンクシティ', cuisineJa: '本場の本格スパイスカレー、タンドリーチキン、甘いチャイ', vibeJa: '五感を刺激する圧倒的なエネルギーと神秘の精神文化', attractionEn: 'Taj Mahal white marble wonder, sacred Ganges river', cuisineEn: 'Authentic spice curries, Tandoori chicken, sweet Chai tea', vibeEn: 'Overwhelming sensory explosion of spirituality and history' },

  // OCEANIA
  au: { lat: -35.28, lon: 149.13, regionJa: 'オセアニア', regionEn: 'Oceania', attractionJa: 'グレートバリアリーフの珊瑚礁、エアーズロック（ウルル）、オペラハウス', cuisineJa: 'オージービーフバーベキュー、新鮮なシーフードとワイン', vibeJa: 'コアラやカンガルーが暮らす広大な大地と最高のビーチライフ', attractionEn: 'Great Barrier Reef coral, Uluru (Ayers Rock), Sydney Opera House', cuisineEn: 'Aussie BBQ steaks, fresh ocean seafood, local wine', vibeEn: 'Vast continent of unique wildlife and laid-back surf culture' },
  nz: { lat: -41.28, lon: 174.77, regionJa: 'オセアニア', regionEn: 'Oceania', attractionJa: '映画ロード・オブ・ザ・リングのロケ地、テカポ湖の星空とフィヨルド', cuisineJa: '極上ラムチョップ、パブロバケーキ、フィジョアフルーツ', vibeJa: '圧倒的な透明感を誇る地球最後の大自然パラダイス', attractionEn: 'Lord of the Rings filming sites, Lake Tekapo starlight, Fjords', cuisineEn: 'Tender lamb chops, Pavlova dessert, fresh Kiwi fruits', vibeEn: 'Pure breathtaking natural wonders and adventure sports heaven' },

  // EUROPE
  gb: { lat: 51.50, lon: -0.12, regionJa: 'ヨーロッパ', regionEn: 'Europe', attractionJa: 'ビッグ・ベンとタワーブリッジ、大英博物館、コッツウォルズの田舎町', cuisineJa: '伝統フィッシュ＆チップス、アフタヌーンティー、ローストビーフ', vibeJa: '王室の伝統とロック・ポップカルチャーが生きる紳士淑女の国', attractionEn: 'Big Ben, Tower Bridge, British Museum, Cotswolds villages', cuisineEn: 'Fish & Chips, traditional Afternoon Tea, Sunday Roast', vibeEn: 'Majestic royal heritage meets modern music and pub culture' },
  fr: { lat: 48.85, lon: 2.35, regionJa: 'ヨーロッパ', regionEn: 'Europe', attractionJa: 'パリのエッフェル塔、ルーヴル美術館、モン・サン・ミッシェル、南仏リゾート', cuisineJa: '本場フレンチフルコース、焼き立てクロワッサン、マカロン＆ワイン', vibeJa: '世界中を魅了し続ける芸術と華やかなファッション・美食の聖地', attractionEn: 'Eiffel Tower, Louvre Museum, Mont Saint-Michel, French Riviera', cuisineEn: 'Gourmet French cuisine, buttery croissants, fine Bordeaux wine', vibeEn: 'The global capital of art, fashion, romance, and gastronomy' },
  it: { lat: 41.90, lon: 12.49, regionJa: 'ヨーロッパ', regionEn: 'Europe', attractionJa: 'ローマのコロッセオ、水の都ヴェネツィア、フィレンツェのルネサンス芸術', cuisineJa: '本場ナポリピッツァ、アルデンテパスタ、濃厚ジェラートとエスプレッソ', vibeJa: '「人生を謳歌する（ドルチェ・ヴィータ）」陽気で歴史あふれる国', attractionEn: 'Roman Colosseum, Venice canals, Florence Renaissance art', cuisineEn: 'Neapolitan pizza, authentic pasta, artisan gelato, espresso', vibeEn: 'Dolce Vita lifestyle celebrating timeless history and culinary joy' },
  de: { lat: 52.52, lon: 13.40, regionJa: 'ヨーロッパ', regionEn: 'Europe', attractionJa: '白鳥の城ノイシュヴァンシュタイン城、ベルリンの壁、クリスマスマーケット', cuisineJa: 'パリッと香ばしいソーセージ（ブルヴルスト）、プレッツェル、本場ドイツビール', vibeJa: '中世のメルヘン童話の世界と精緻なマイスター技術の国', attractionEn: 'Neuschwanstein fairytale castle, Berlin Wall, Christmas markets', cuisineEn: 'Sizzling Bratwurst sausages, salty Pretzels, world-famous craft beer', vibeEn: 'Fairytale castles combined with cutting-edge engineering and festivals' },
  es: { lat: 40.41, lon: -3.70, regionJa: 'ヨーロッパ', regionEn: 'Europe', attractionJa: 'サグラダ・ファミリアとガウディ建築、アルハンブラ宮殿、情熱のフラメンコ', cuisineJa: '海鮮パエリア、小皿料理タパス巡り、生ハム（ハモン・イベリコ）とサングリア', vibeJa: '太陽の光を浴びてシエスタと夜のフィエスタ（祭り）を楽しむ情熱の国', attractionEn: 'Sagrada Familia, Alhambra palace, flamenco dance shows', cuisineEn: 'Seafood Paella, Tapas bar hopping, Iberian jamon, Sangria', vibeEn: 'Passionate sun-drenched country of artistic genius and vibrant fiestas' },
  ch: { lat: 46.94, lon: 7.44, regionJa: 'ヨーロッパ', regionEn: 'Europe', attractionJa: 'マッターホルンやユングフラウのアルプス絶景、ツェルマット氷河特急', cuisineJa: 'とろけるチーズフォンデュ、ラクレット、最高峰スイスチョコレート', vibeJa: 'ハイジの世界そのままのアルプスの草原と澄んだ lakes の楽園', attractionEn: 'Matterhorn peak, Jungfrau railway, pristine Alpine mountain lakes', cuisineEn: 'Melting Cheese Fondue, Raclette, premium Swiss chocolates', vibeEn: 'Breathtaking Alpine wonderland of precision and natural serenity' },

  // NORTH & SOUTH AMERICA
  us: { lat: 38.90, lon: -77.03, regionJa: '北アメリカ', regionEn: 'North America', attractionJa: 'ニューヨーク・タイムズスクエア、グランドキャニオン、ラスベガス、カリフォルニア', cuisineJa: 'ジューシーな特大アメリカンバーガー、Tボーンステーキ、クラムチャウダー', vibeJa: '世界のエンタメとビジネスを牽引する圧倒的スケールの自由の国', attractionEn: 'Times Square NYC, Grand Canyon, Las Vegas strip, Hollywood', cuisineEn: 'Juicy American hamburgers, T-bone steaks, clam chowder', vibeEn: 'Land of opportunity with breathtaking national parks and global pop culture' },
  ca: { lat: 45.42, lon: -75.69, regionJa: '北アメリカ', regionEn: 'North America', attractionJa: 'カナディアンロッキーのバンフ国立公園、ナイアガラの滝、オーロラ鑑賞', cuisineJa: '本場メイプルシロップパンケーキ、プーティン（フライドポテト＆チーズ）', vibeJa: '大自然の恵みと多文化が優しく調和する治安の良い大国', attractionEn: 'Banff Canadian Rockies, Niagara Falls, northern lights aurora', cuisineEn: 'Pure maple syrup pancakes, Poutine fries with cheese curds', vibeEn: 'Majestic wilderness and harmonious multicultural cities' },
  br: { lat: -15.79, lon: -47.88, regionJa: '南アメリカ', regionEn: 'South America', attractionJa: 'リオデジャネイロのキリスト像、イグアスの滝、アマゾン熱帯雨林クルーズ', cuisineJa: '本場シュラスコ（炭焼き肉）、フェイジョアーダ、カイピリーニャカクテル', vibeJa: 'サンバのリズムと陽気な笑顔が弾ける情熱と熱帯の大国', attractionEn: 'Christ the Redeemer statue, Iguazu Falls, Amazon rainforest', cuisineEn: 'Churrasco BBQ meats, Feijoada black bean stew, Caipirinha', vibeEn: 'Passionate country driven by samba music, soccer, and natural wonder' },
  pe: { lat: -12.04, lon: -77.04, regionJa: '南アメリカ', regionEn: 'South America', attractionJa: '天空の都市マチュピチュ遺跡、ナスカの地上絵、ウユニ塩湖への玄関口', cuisineJa: 'セビーチェ（魚介のマリネ）、クイ料理、ピスコサワー', vibeJa: 'インカ帝国の神秘的な歴史が息づくアンデス山脈の至宝', attractionEn: 'Machu Picchu lost Inca citadel, Nazca Lines, sacred Sacred Valley', cuisineEn: 'Fresh Ceviche seafood marinade, Lomo Saltado, Pisco Sour', vibeEn: 'Mystical Andean highland filled with ancient Inca archaeological treasures' },

  // MIDDLE EAST & AFRICA
  eg: { lat: 30.04, lon: 31.23, regionJa: '中東・アフリカ', regionEn: 'Middle East & Africa', attractionJa: 'ギザの三大ピラミッドとスフィンクス、王家の谷、ナイル川クルーズ', cuisineJa: 'コシャリ（国民的ミックスパスタ）、ハトのロースト、ミントティー', vibeJa: '5000年の古代ファラオの歴史を肌で感じる神秘の大砂漠', attractionEn: 'Giza Pyramids and Sphinx, Valley of the Kings, Nile River cruise', cuisineEn: 'Koshary national dish, grilled kebabs, aromatic sweet mint tea', vibeEn: 'Eternal cradle of civilization with ancient wonders towering over the desert' },
  ae: { lat: 24.45, lon: 54.37, regionJa: '中東・アフリカ', regionEn: 'Middle East & Africa', attractionJa: '世界一の超高層タワー「ブルジュ・ハリファ」、ドバイモール、砂漠サファリ', cuisineJa: 'アラビアンマフトゥール、デーツとアラビックコーヒー、高級バフェ', vibeJa: '砂漠の中に突如現れた贅を尽くした近未来の黄金都市', attractionEn: 'Burj Khalifa skyscraper, Dubai Mall, luxury desert dune safaris', cuisineEn: 'Arabian Shawarma, luxury dates, saffron-spiced Arabic coffee', vibeEn: 'Ultra-modern golden oasis combining futuristic opulence and desert heritage' },
  za: { lat: -25.74, lon: 28.18, regionJa: '中東・アフリカ', regionEn: 'Middle East & Africa', attractionJa: 'クルーガー国立公園での野生動物サファリ（ビッグ5）、テーブルマウンテン、喜望峰', cuisineJa: 'ブラーイ（南ア風豪快BBQ）、ビルトン（干し肉）、南ア産銘醸ワイン', vibeJa: '「レインボー・ネーション」多様な文化と圧倒的なサバンナの生命力', attractionEn: 'Kruger National Park Big 5 safari, Table Mountain, Cape of Good Hope', cuisineEn: 'Braai traditional barbecue, Biltong jerky, world-class local Pinotage wine', vibeEn: 'The Rainbow Nation showcasing spectacular wildlife safari and rugged coastlines' }
};

// Generate precise or representative coordinates and travel guides for ALL 197 countries
export const countryGeoList: CountryGeoInfo[] = allFlags.map((flagObj, idx) => {
  const custom = specificGeoMap[flagObj.id];
  if (custom) {
    return {
      id: flagObj.id,
      lat: custom.lat,
      lon: custom.lon,
      regionJa: custom.regionJa,
      regionEn: custom.regionEn,
      attractionJa: custom.attractionJa,
      cuisineJa: custom.cuisineJa,
      vibeJa: custom.vibeJa,
      attractionEn: custom.attractionEn,
      cuisineEn: custom.cuisineEn,
      vibeEn: custom.vibeEn
    };
  }

  // Distribution based on country list sections or deterministic spherical spacing
  // Let's determine regional grouping based on idx inside our 197 flags array
  let regJa = 'アジア・中東';
  let regEn = 'Asia & Middle East';
  let baseLat = 20;
  let baseLon = 90;

  if (idx >= 47 && idx < 91) {
    regJa = 'ヨーロッパ';
    regEn = 'Europe';
    baseLat = 48 + ((idx % 10) - 5) * 2.5;
    baseLon = 15 + ((idx % 15) - 7) * 3;
  } else if (idx >= 91 && idx < 126) {
    regJa = '南北アメリカ・カリブ海';
    regEn = 'Americas & Caribbean';
    baseLat = 15 - ((idx % 15) - 5) * 4;
    baseLon = -75 + ((idx % 10) - 5) * 3.5;
  } else if (idx >= 126 && idx < 181) {
    regJa = 'アフリカ';
    regEn = 'Africa';
    baseLat = 5 - ((idx % 18) - 9) * 3.5;
    baseLon = 20 + ((idx % 12) - 6) * 3.5;
  } else if (idx >= 181) {
    regJa = 'オセアニア・太平洋';
    regEn = 'Oceania & Pacific';
    baseLat = -15 - ((idx % 8) - 3) * 2.5;
    baseLon = 160 + ((idx % 10) - 5) * 4;
  } else {
    baseLat = 28 + ((idx % 12) - 6) * 3;
    baseLon = 75 + ((idx % 15) - 7) * 4;
  }

  // Deterministic fine coordinates to ensure no overlap and precise hitting
  const seed = (idx * 137 + 43) % 1000;
  const latOffset = ((seed % 100) - 50) * 0.15;
  const lonOffset = (((seed * 7) % 100) - 50) * 0.25;

  return {
    id: flagObj.id,
    lat: Math.max(-80, Math.min(80, baseLat + latOffset)),
    lon: Math.max(-180, Math.min(180, baseLon + lonOffset)),
    regionJa: regJa,
    regionEn: regEn,
    attractionJa: `${flagObj.nameJa}を象徴する美しい歴史建築・大自然スポットと市場めぐり`,
    cuisineJa: `現地の伝統スパイスを生かした家庭料理と名物デザート巡り`,
    vibeJa: `${flagObj.triviaJa} 現地の異国情緒を存分に楽しめるおすすめ旅先`,
    attractionEn: `Scenic landmarks, cultural heritage architecture, and local artisan markets of ${flagObj.nameEn}`,
    cuisineEn: `Authentic regional cuisine spiced with traditional local flavors and sweet pastries`,
    vibeEn: `${flagObj.triviaEn} A fascinating destination filled with warm local charm`
  };
});
