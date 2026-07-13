export interface Destination {
  nameJa: string;
  nameEn: string;
  distanceKm: number; // approximate distance from Tokyo Station in km
  lat: number;
  lon: number;
}

export const TOKYO_STATION = { lat: 35.6812, lon: 139.7671 };

// A curated list of landmarks and cities ordered roughly by distance from Tokyo Station
export const destinations: Destination[] = [
  { nameJa: "品川", nameEn: "Shinagawa", distanceKm: 7, lat: 35.6284, lon: 139.7387 },
  { nameJa: "新宿", nameEn: "Shinjuku", distanceKm: 8, lat: 35.6909, lon: 139.7002 },
  { nameJa: "川崎", nameEn: "Kawasaki", distanceKm: 20, lat: 35.5308, lon: 139.7029 },
  { nameJa: "横浜", nameEn: "Yokohama", distanceKm: 30, lat: 35.4657, lon: 139.6223 },
  { nameJa: "八王子", nameEn: "Hachioji", distanceKm: 40, lat: 35.6556, lon: 139.3241 },
  { nameJa: "鎌倉", nameEn: "Kamakura", distanceKm: 50, lat: 35.3192, lon: 139.5502 },
  { nameJa: "成田空港", nameEn: "Narita Airport", distanceKm: 70, lat: 35.7719, lon: 140.3928 },
  { nameJa: "箱根", nameEn: "Hakone", distanceKm: 90, lat: 35.2323, lon: 139.1069 },
  { nameJa: "富士山", nameEn: "Mt. Fuji", distanceKm: 100, lat: 35.3606, lon: 138.7273 },
  { nameJa: "宇都宮", nameEn: "Utsunomiya", distanceKm: 110, lat: 36.5551, lon: 139.8826 },
  { nameJa: "水戸", nameEn: "Mito", distanceKm: 120, lat: 36.3659, lon: 140.4711 },
  { nameJa: "軽井沢", nameEn: "Karuizawa", distanceKm: 150, lat: 36.3429, lon: 138.6360 },
  { nameJa: "静岡", nameEn: "Shizuoka", distanceKm: 170, lat: 34.9755, lon: 138.3827 },
  { nameJa: "浜松", nameEn: "Hamamatsu", distanceKm: 250, lat: 34.7108, lon: 137.7261 },
  { nameJa: "名古屋", nameEn: "Nagoya", distanceKm: 350, lat: 35.1814, lon: 136.9063 },
  { nameJa: "仙台", nameEn: "Sendai", distanceKm: 350, lat: 38.2682, lon: 140.8694 },
  { nameJa: "金沢", nameEn: "Kanazawa", distanceKm: 450, lat: 36.5613, lon: 136.6562 },
  { nameJa: "京都", nameEn: "Kyoto", distanceKm: 470, lat: 35.0116, lon: 135.7681 },
  { nameJa: "新大阪", nameEn: "Shin-Osaka", distanceKm: 500, lat: 34.7333, lon: 135.5002 },
  { nameJa: "盛岡", nameEn: "Morioka", distanceKm: 500, lat: 39.7020, lon: 141.1544 },
  { nameJa: "神戸", nameEn: "Kobe", distanceKm: 530, lat: 34.6900, lon: 135.1955 },
  { nameJa: "姫路", nameEn: "Himeji", distanceKm: 580, lat: 34.8151, lon: 134.6853 },
  { nameJa: "岡山", nameEn: "Okayama", distanceKm: 650, lat: 34.6551, lon: 133.9195 },
  { nameJa: "青森", nameEn: "Aomori", distanceKm: 700, lat: 40.8244, lon: 140.7400 },
  { nameJa: "広島", nameEn: "Hiroshima", distanceKm: 800, lat: 34.3852, lon: 132.4552 },
  { nameJa: "函館", nameEn: "Hakodate", distanceKm: 850, lat: 41.7687, lon: 140.7288 },
  { nameJa: "山口", nameEn: "Yamaguchi", distanceKm: 900, lat: 34.1782, lon: 131.4738 },
  { nameJa: "福岡", nameEn: "Fukuoka", distanceKm: 1100, lat: 33.5902, lon: 130.4017 },
  { nameJa: "札幌", nameEn: "Sapporo", distanceKm: 1100, lat: 43.0618, lon: 141.3545 },
  { nameJa: "熊本", nameEn: "Kumamoto", distanceKm: 1200, lat: 32.8031, lon: 130.7078 },
  { nameJa: "鹿児島", nameEn: "Kagoshima", distanceKm: 1400, lat: 31.5965, lon: 130.5571 },
  { nameJa: "知床", nameEn: "Shiretoko", distanceKm: 1400, lat: 44.0628, lon: 145.1437 },
  { nameJa: "那覇 (沖縄)", nameEn: "Naha (Okinawa)", distanceKm: 1600, lat: 26.2124, lon: 127.6809 },
  
  // International roughly distances from Tokyo
  { nameJa: "ソウル (韓国)", nameEn: "Seoul (South Korea)", distanceKm: 1200, lat: 37.5665, lon: 126.9780 },
  { nameJa: "台北 (台湾)", nameEn: "Taipei (Taiwan)", distanceKm: 2100, lat: 25.0330, lon: 121.5654 },
  { nameJa: "グアム", nameEn: "Guam", distanceKm: 2600, lat: 13.4443, lon: 144.7937 },
  { nameJa: "マニラ (フィリピン)", nameEn: "Manila (Philippines)", distanceKm: 3000, lat: 14.5995, lon: 120.9842 },
  { nameJa: "ハノイ (ベトナム)", nameEn: "Hanoi (Vietnam)", distanceKm: 3700, lat: 21.0285, lon: 105.8542 },
  { nameJa: "バンコク (タイ)", nameEn: "Bangkok (Thailand)", distanceKm: 4600, lat: 13.7563, lon: 100.5018 },
  { nameJa: "シンガポール", nameEn: "Singapore", distanceKm: 5300, lat: 1.3521, lon: 103.8198 },
  { nameJa: "ハワイ (ホノルル)", nameEn: "Hawaii (Honolulu)", distanceKm: 6200, lat: 21.3069, lon: -157.8583 },
  { nameJa: "シドニー (オーストラリア)", nameEn: "Sydney (Australia)", distanceKm: 7800, lat: -33.8688, lon: 151.2093 },
  { nameJa: "ロサンゼルス (アメリカ)", nameEn: "Los Angeles (USA)", distanceKm: 8800, lat: 34.0522, lon: -118.2437 },
  { nameJa: "ロンドン (イギリス)", nameEn: "London (UK)", distanceKm: 9500, lat: 51.5074, lon: -0.1278 },
  { nameJa: "パリ (フランス)", nameEn: "Paris (France)", distanceKm: 9700, lat: 48.8566, lon: 2.3522 },
  { nameJa: "ニューヨーク (アメリカ)", nameEn: "New York (USA)", distanceKm: 10800, lat: 40.7128, lon: -74.0060 },
  { nameJa: "ケープタウン (南アフリカ)", nameEn: "Cape Town (South Africa)", distanceKm: 14700, lat: -33.9249, lon: 18.4241 },
  { nameJa: "ブエノスアイレス (アルゼンチン)", nameEn: "Buenos Aires (Argentina)", distanceKm: 18000, lat: -34.6037, lon: -58.3816 },
  { nameJa: "地球の裏側 (ブラジル・サンパウロ付近)", nameEn: "Other side of the Earth", distanceKm: 18500, lat: -23.5505, lon: -46.6333 }
];
