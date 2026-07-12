export interface Category {
  id: string;
  nameKey: string; // i18nのキー (e.g. categories.japan.title)
  descKey: string; // i18nのキー
  colorVar: string; // CSS変数名 (--accent-japan等)
  count: number;
}

export const categories: Category[] = [
  {
    id: "japan",
    nameKey: "categories.japan.title",
    descKey: "categories.japan.desc",
    colorVar: "var(--accent-japan)",
    count: 1,
  },
  {
    id: "science",
    nameKey: "categories.science.title",
    descKey: "categories.science.desc",
    colorVar: "var(--accent-science)",
    count: 0,
  },
  {
    id: "fun",
    nameKey: "categories.fun.title",
    descKey: "categories.fun.desc",
    colorVar: "var(--accent-fun)",
    count: 0,
  },
];
