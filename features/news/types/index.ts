export interface News {
  id: string
  title: string
  slug: string
  description: string
  content: string
  image: string
  publishedAt?: string
  createdAt: string
  updatedAt: string
  status: "draft" | "published"
}

export interface CreateNewsDto {
  title: string
  slug: string
  description: string
  content: string
  image: string
  publishedAt?: string
  status: "draft" | "published"
}

export interface UpdateNewsDto {
  title?: string
  slug?: string
  description?: string
  content?: string
  image?: string
  publishedAt?: string
  status?: "draft" | "published"
}

