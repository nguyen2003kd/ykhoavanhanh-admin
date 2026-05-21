import { apiClient } from "@/lib/api-client";
import { PaginatedResponse, PaginationParams } from "@/types/api";
import { Article, NewsItem, VideoItem, ContentCategory } from "@/types/content";

export const contentService = {
  // Articles
  getArticles: (params?: Partial<PaginationParams & { status?: string; categoryId?: string; search?: string }>) => {
    const q = new URLSearchParams(params as Record<string, string>).toString();
    return apiClient.get<PaginatedResponse<Article>>(`/api/v1/content/articles${q ? `?${q}` : ""}`);
  },
  getArticleById: (id: string) => apiClient.get<Article>(`/api/v1/content/articles/${id}`),
  createArticle: (data: Partial<Article>) => apiClient.post<Article>("/api/v1/content/articles", data),
  updateArticle: (id: string, data: Partial<Article>) => apiClient.put<Article>(`/api/v1/content/articles/${id}`, data),
  publishArticle: (id: string) => apiClient.patch<Article>(`/api/v1/content/articles/${id}/publish`, {}),
  deleteArticle: (id: string) => apiClient.delete<void>(`/api/v1/content/articles/${id}`),

  // News
  getNews: (params?: Partial<PaginationParams & { status?: string; search?: string }>) => {
    const q = new URLSearchParams(params as Record<string, string>).toString();
    return apiClient.get<PaginatedResponse<NewsItem>>(`/api/v1/content/news${q ? `?${q}` : ""}`);
  },
  getNewsById: (id: string) => apiClient.get<NewsItem>(`/api/v1/content/news/${id}`),
  createNews: (data: Partial<NewsItem>) => apiClient.post<NewsItem>("/api/v1/content/news", data),
  updateNews: (id: string, data: Partial<NewsItem>) => apiClient.put<NewsItem>(`/api/v1/content/news/${id}`, data),
  deleteNews: (id: string) => apiClient.delete<void>(`/api/v1/content/news/${id}`),

  // Videos
  getVideos: (params?: Partial<PaginationParams & { type?: string }>) => {
    const q = new URLSearchParams(params as Record<string, string>).toString();
    return apiClient.get<PaginatedResponse<VideoItem>>(`/api/v1/content/videos${q ? `?${q}` : ""}`);
  },
  createVideo: (data: Partial<VideoItem>) => apiClient.post<VideoItem>("/api/v1/content/videos", data),
  updateVideo: (id: string, data: Partial<VideoItem>) => apiClient.put<VideoItem>(`/api/v1/content/videos/${id}`, data),
  deleteVideo: (id: string) => apiClient.delete<void>(`/api/v1/content/videos/${id}`),

  // Categories
  getCategories: () => apiClient.get<ContentCategory[]>("/api/v1/content/categories"),
};
