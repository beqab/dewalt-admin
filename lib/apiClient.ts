import axios, { AxiosError, AxiosRequestConfig } from "axios";

import { getSession } from "next-auth/react";

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
  timeout: 100000, // 10 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

export const authHeader = "authorization";

export interface ApiResponse<T> {
  data: T;
  message?: string;
  statusCode?: number;
}

type QueryParams = Record<string, string | number | boolean | null | undefined>;

// Add interceptor to handle authorization tokens
axiosInstance.interceptors.request.use(
  async (config) => {
    // Only try to get session on client side
    if (typeof window !== "undefined") {
      const session = await getSession();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const token = (session as any)?.user?.accessToken;
      if (token && config.headers) {
        config.headers[authHeader] = token;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

class APIClient<T> {
  private endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  //  get method with optional params and config
  async get<R = T>(
    params?: Record<string, string | number | boolean | null | undefined>,
    id = "",
    config?: AxiosRequestConfig
  ) {
    try {
      const url = id ? `${this.endpoint}/${id}` : this.endpoint;
      console.log("params++++++", params);
      const response = await axiosInstance.get<R>(url, {
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
  async getAll(page = 1, limit = 10, params?: Record<string, QueryParams>) {
    const response = await axiosInstance.get<ApiResponse<T[]>>(this.endpoint, {
      params: {
        page,
        limit,
        ...params,
      },
    });
    return response.data;
  }

  async post<R = T>(data: Partial<T>, config?: AxiosRequestConfig) {
    try {
      const response = await axiosInstance.post<R>(this.endpoint, data, config);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw this.handleApiError(error as IApiError);
      }
      throw error;
    }
  }

  //put method
  async put<R = T>(id = "", data: Partial<T>, config?: AxiosRequestConfig) {
    const response = await axiosInstance.put<ApiResponse<R>>(
      `${this.endpoint}/${id}`,
      data,
      config
    );
    return response.data;
  }

  //delete method
  async delete(id: string | number) {
    const response = await axiosInstance.delete<ApiResponse<void>>(
      `${this.endpoint}/${id}`
    );
    return response.data;
  }

  //patch method
  async patch<R = T>(data: Partial<T>, config?: AxiosRequestConfig) {
    const response = await axiosInstance.patch<ApiResponse<R>>(
      this.endpoint,
      data,
      config
    );
    return response.data;
  }

  // Error handling helper
  private handleApiError(error: IApiError) {
    if (error.response) {
      return error.response.data;
    }
    return error;
  }
}

export default APIClient;

// Usage example:
export const createApiClient = <T>(endpoint: string) =>
  new APIClient<T>(endpoint);
