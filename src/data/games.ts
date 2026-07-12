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
    titleKey: "universe.title",
    descKey: "universe.subtitle",
    category: "science",
    status: "play",
    playTime: "3",
    featured: false,
    publishedDate: "2026-07-12",
    route: "/games/universe-scale",
  },
  {
    id: "infinite-button",
    slug: "infinite-button",
    titleKey: "button.title",
    descKey: "button.subtitle",
    category: "fun",
    status: "play",
    playTime: "1",
    featured: false,
    publishedDate: "2026-07-12",
    route: "/games/infinite-button",
  },
];
