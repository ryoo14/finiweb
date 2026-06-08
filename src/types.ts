export type Category = "security" | "cloud" | "oss" | "infra" | "dev" | "news";

export type Article = {
  id: string;
  title: string;
  url: string;
  source: string;
  category: Category;
  publishedAt: string;
  collectedAt: string;
  cvssScore?: number;
  isNotified: boolean;
};

export type SourceConfig = {
  id: string;
  name: string;
  category: Category;
  type: "rss" | "hn" | "github-trending" | "nvd";
  url?: string;
  limit?: number;
};
