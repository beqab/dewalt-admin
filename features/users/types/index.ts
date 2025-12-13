export interface User {
  id: string
  name: string
  email: string
  role: string
  createdAt: string
  updatedAt: string
  status?: "active" | "inactive" | "banned"
}

export interface CreateUserDto {
  name: string
  email: string
  password: string
  role: string
}

export interface UpdateUserDto {
  name?: string
  email?: string
  role?: string
  status?: "active" | "inactive" | "banned"
}

