export interface BannerSlide {
  id: string
  title: string
  description?: string
  image: string
  link?: string
  order: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateBannerSlideDto {
  title: string
  description?: string
  image: string
  link?: string
  order: number
  isActive: boolean
}

export interface UpdateBannerSlideDto {
  title?: string
  description?: string
  image?: string
  link?: string
  order?: number
  isActive?: boolean
}

