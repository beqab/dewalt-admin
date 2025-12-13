export interface Ad {
  id: string
  title: string
  image: string
  link?: string
  position: string
  startDate?: string
  endDate?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateAdDto {
  title: string
  image: string
  link?: string
  position: string
  startDate?: string
  endDate?: string
  isActive: boolean
}

export interface UpdateAdDto {
  title?: string
  image?: string
  link?: string
  position?: string
  startDate?: string
  endDate?: string
  isActive?: boolean
}

