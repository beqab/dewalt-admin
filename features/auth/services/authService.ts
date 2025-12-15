import { createApiClient } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import { LoginAdminDto, LoginAdminResponse } from "@/lib/types/serviceTypes";

const login = createApiClient<LoginAdminResponse>(API_ROUTES.LOGIN);

export const authService = {
  login: {
    post: (data: LoginAdminDto) =>
      login.post<LoginAdminDto, LoginAdminResponse>(data),
  },
};
