export interface IAdmin {
  _id: string;
  username: string;
  refreshToken: string;
}

export interface LoginAdminDto {
  username: string;
  password: string;
}

export interface LoginAdminResponse {
  admin: IAdmin;
  token: string;
}
