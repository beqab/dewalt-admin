export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  image: string
  brand?: string
  category?: string
  inStock: boolean
  stock?: number
  createdAt: string
  updatedAt: string
}

export interface CreateProductDto {
  name: string
  slug: string
  description: string
  price: number
  image: string
  brand?: string
  category?: string
  inStock: boolean
  stock?: number
}

export interface UpdateProductDto {
  name?: string
  slug?: string
  description?: string
  price?: number
  image?: string
  brand?: string
  category?: string
  inStock?: boolean
  stock?: number
}

