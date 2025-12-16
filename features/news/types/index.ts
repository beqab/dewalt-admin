// Localized text type matching backend structure
export interface LocalizedText {
  ka: string;
  en: string;
}

// News type matching backend structure
export interface News {
  _id: string;
  imageUrl: string;
  title: LocalizedText;
  summary: LocalizedText;
  content: LocalizedText;
  createdAt: string;
  updatedAt: string;
}

// DTOs for creating and updating news
export interface CreateNewsDto {
  imageUrl: string;
  title: LocalizedText;
  summary: LocalizedText;
  content: LocalizedText;
}

export interface UpdateNewsDto {
  imageUrl?: string;
  title?: LocalizedText;
  summary?: LocalizedText;
  content?: LocalizedText;
}

// Paginated News Response matching backend DTO
export interface PaginatedNewsResponse {
  data: News[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Single News Response
export type NewsResponse = News;
