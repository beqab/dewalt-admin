export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  isVerified?: boolean;
}

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
}
