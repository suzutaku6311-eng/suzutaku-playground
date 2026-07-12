export interface Game {
  id: string;
  slug: string;
  titleKey: string; // i18nのキー (e.g. konbini.title)
  descKey: string; // i18nのキー (e.g. konbini.subtitle)
  category: "japan" | "science" | "fun";
  status: "play" | "coming_soon" | "prototype" | "updated";
  playTime: string; // プレイ時間 (e.g. '2')
  featured: boolean;
  publishedDate: string;
  route: string;
}

export const games: Game[] = [
  {
    id: "konbini-1000",
    slug: "konbini-1000",
    titleKey: "konbini.title",
    descKey: "konbini.subtitle",
    category: "japan",
    status: "play",
    playTime: "2",
    featured: true,
    publishedDate: "2026-07-12",
    route: "/games/konbini-1000",
  },
  {
    id: "universe-scale",
    slug: "universe-scale",
    titleKey: "categories.science.title", // 後で適切なキーを設定
    descKey: "categories.science.desc",
    category: "science",
    status: "coming_soon",
    playTime: "5",
    featured: false,
    publishedDate: "2026-08-01",
    route: "#",
  },
  {
    id: "infinite-button",
    slug: "infinite-button",
    titleKey: "categories.fun.title", // 後で適切なキーを設定
    descKey: "categories.fun.desc",
    category: "fun",
    status: "coming_soon",
    playTime: "1",
    featured: false,
    publishedDate: "2026-08-10",
    route: "#",
  },
];
