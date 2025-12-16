import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { getSession, signOut } from "next-auth/react";

export interface ErrorResponse<T> {
  data: T;
  message?: string;
  statusCode?: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  statusCode?: number;
}

// Add proper error response interface
export interface ApiErrorResponse {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

export type IApiError = AxiosError<ApiErrorResponse>;

export const API_CONFIG = {
  development: "http://localhost:3000/",
  production: process.env.NEXT_PUBLIC_API_URL,
} as const;

// Create axios instance with environment-based configuration

export const axiosInstance = axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? API_CONFIG.production
      : API_CONFIG.development,
  timeout: 100000, // 100 seconds
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Send cookies with requests
});

export const authHeader = "authorization";

type QueryParams = Record<string, string | number | boolean | null | undefined>;

// Type for session with accessToken from module augmentation
interface SessionWithAccessToken {
  user?: {
    accessToken?: string;
  };
}

// Add interceptor to handle authorization tokens
axiosInstance.interceptors.request.use(
  async (config) => {
    // Only try to get session on client side
    if (typeof window !== "undefined") {
      const session = await getSession();
      // The accessToken is added via module augmentation in lib/types/next-auth.d.ts
      // Type assertion needed because module augmentation types may not be fully inferred
      const token = (session as SessionWithAccessToken | null)?.user
        ?.accessToken;
      if (token && typeof token === "string" && config.headers) {
        config.headers[authHeader] = token;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

class APIClient<TResponse = unknown> {
  private endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  //  get method with optional params and config
  async get<TData = TResponse>(
    params?: Record<string, string | number | boolean | null | undefined>,
    id = "",
    config?: AxiosRequestConfig
  ): Promise<TData> {
    try {
      const url = id ? `${this.endpoint}/${id}` : this.endpoint;
      const response = await axiosInstance.get<TData>(url, {
        params: {
          ...params,
        },
        ...config,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw this.handleApiError(error as IApiError);
      }
      throw error;
    }
  }

  //  getAll method with pagination support
  async getAll<TData = TResponse[]>(
    page = 1,
    limit = 10,
    params?: Record<string, QueryParams>
  ): Promise<ApiResponse<TData>> {
    try {
      const response = await axiosInstance.get<ApiResponse<TData>>(
        this.endpoint,
        {
          params: {
            page,
            limit,
            ...params,
          },
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw this.handleApiError(error as IApiError);
      }
      throw error;
    }
  }

  async post<TRequest = unknown, TData = TResponse>(
    data: TRequest,
    config?: AxiosRequestConfig,
    options?: { url?: string }
  ): Promise<TData> {
    try {
      const url = options?.url || this.endpoint;
      const response = await axiosInstance.post<TData>(url, data, config);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw this.handleApiError(error as IApiError);
      }
      throw error;
    }
  }

  //put method
  async put<TRequest = unknown, TData = TResponse>(
    id: string | number = "",
    data: TRequest,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<TData>> {
    try {
      const response = await axiosInstance.put<ApiResponse<TData>>(
        `${this.endpoint}/${id}`,
        data,
        config
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw this.handleApiError(error as IApiError);
      }
      throw error;
    }
  }

  //delete method
  async delete<TData = void>(id: string | number): Promise<ApiResponse<TData>> {
    try {
      const response = await axiosInstance.delete<ApiResponse<TData>>(
        `${this.endpoint}/${id}`
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw this.handleApiError(error as IApiError);
      }
      throw error;
    }
  }

  //patch method
  async patch<TRequest = unknown, TData = TResponse>(
    data: TRequest,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<TData>> {
    try {
      const response = await axiosInstance.patch<ApiResponse<TData>>(
        this.endpoint,
        data,
        config
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw this.handleApiError(error as IApiError);
      }
      throw error;
    }
  }

  //patch method with id
  async patchById<TRequest = unknown, TData = TResponse>(
    id: string | number,
    data: TRequest,
    config?: AxiosRequestConfig
  ): Promise<TData> {
    try {
      const response = await axiosInstance.patch<TData>(
        `${this.endpoint}/${id}`,
        data,
        config
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw this.handleApiError(error as IApiError);
      }
      throw error;
    }
  }

  // Error handling helper
  private handleApiError(error: IApiError): ApiErrorResponse {
    console.log(error.response?.data.statusCode, "rrr");
    console.log(error.response, "message");
    if (error.response?.data.statusCode === 401) {
      signOut();
      return error.response.data;
    }

    if (error.response) {
      return error.response.data;
    }

    // Network error or other non-response error - convert to consistent format
    return {
      message: error.message || "An unexpected error occurred",
      statusCode: 500,
    };
  }
}

export default APIClient;

// Usage example:
export const createApiClient = <T>(endpoint: string) =>
  new APIClient<T>(endpoint);
