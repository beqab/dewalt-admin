import { createApiClient } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import { IAdmin } from "@/lib/types/serviceTypes";

const login = createApiClient<{
  admin: IAdmin;
  token: string;
}>(API_ROUTES.LOGIN);

export const authService = {
  login,
};
