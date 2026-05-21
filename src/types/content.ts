export type ArticleStatus = "draft" | "pending" | "published" | "archived";

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImageUrl?: string;
  categoryId: string;
  categoryName: string;
  tags: string[];
  authorId: string;
  authorName: string;
  status: ArticleStatus;
  isFeatured: boolean;
  viewCount: number;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NewsItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImageUrl?: string;
  source?: string;
  authorId: string;
  authorName: string;
  status: ArticleStatus;
  isFeatured: boolean;
  viewCount: number;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VideoItem {
  id: string;
  title: string;
  description: string;
  thumbnailUrl?: string;
  videoUrl: string;
  platform: "youtube" | "facebook" | "tiktok" | "internal";
  type: "video" | "livestream";
  scheduledAt?: string; // cho livestream
  viewCount: number;
  isPublished: boolean;
  publishedAt?: string;
  createdAt: string;
}

export interface ContentCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  articleCount: number;
}
