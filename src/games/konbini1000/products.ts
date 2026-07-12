export interface Product {
  id: string;
  nameEn: string;
  nameJa: string;
  price: number;
  category: 'food' | 'drink' | 'dessert' | 'snack';
}

export const products: Product[] = [
  {
    id: "onigiri",
    nameEn: "Rice Ball (Onigiri)",
    nameJa: "おにぎり",
    price: 150,
    category: "food"
  },
  {
    id: "tea",
    nameEn: "Green Tea",
    nameJa: "お茶",
    price: 130,
    category: "drink"
  },
  {
    id: "sandwich",
    nameEn: "Egg Sandwich",
    nameJa: "たまごサンド",
    price: 280,
    category: "food"
  },
  {
    id: "pudding",
    nameEn: "Custard Pudding",
    nameJa: "プリン",
    price: 200,
    category: "dessert"
  },
  {
    id: "chicken",
    nameEn: "Fried Chicken (Karaage)",
    nameJa: "からあげ",
    price: 240,
    category: "food"
  },
  {
    id: "ramen",
    nameEn: "Instant Ramen",
    nameJa: "カップラーメン",
    price: 220,
    category: "food"
  },
  {
    id: "icecream",
    nameEn: "Vanilla Ice Cream",
    nameJa: "アイスクリーム",
    price: 180,
    category: "dessert"
  },
  {
    id: "bento",
    nameEn: "Premium Bento Box",
    nameJa: "幕の内弁当",
    price: 550,
    category: "food"
  },
  {
    id: "coffee",
    nameEn: "Canned Coffee",
    nameJa: "缶コーヒー",
    price: 120,
    category: "drink"
  },
  {
    id: "chips",
    nameEn: "Potato Chips",
    nameJa: "ポテトチップス",
    price: 160,
    category: "snack"
  }
];
