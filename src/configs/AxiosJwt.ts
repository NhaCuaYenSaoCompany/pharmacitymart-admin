import axios, { type AxiosRequestConfig, type AxiosResponse } from "axios";
import type { ResponseApi } from "~/types";
import { ENV } from "../constant/Env";
import type { SystemUser } from "~/types/SystemUser";

// Define interface for refresh token response
interface ResRefreshToken {
  token: {
    accessToken: string;
    refreshToken: string;
  };
  user: SystemUser;
  // Add other properties as needed based on your API response
}

// Define interface for refresh token request
export interface ReqRefreshToken {
  userId: number;
}

const request = axios.create({
  baseURL: ENV.API_URL,
  withCredentials: true,
});

const axiosJWT = {
  async get<T = any>(path: string, options?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await request.get(path, options);
    return response.data;
  },

  async post<T = any>(
    path: string,
    data?: any,
    options?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse<T> = await request.post(path, data, options);
    return response.data;
  },

  async put<T = any>(
    path: string,
    data?: any,
    options?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse<T> = await request.put(path, data, options);
    return response.data;
  },

  async patch<T = any>(
    path: string,
    data?: any,
    options?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse<T> = await request.patch(path, data, options);
    return response.data;
  },

  async delete<T = any>(
    path: string,
    options?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse<T> = await request.delete(path, options);
    return response.data;
  },

  async upload<T = any>(
    path: string,
    data: FormData,
    options?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse<T> = await request.post(path, data, {
      ...options,
      headers: {
        "Content-Type": "multipart/form-data",
        ...options?.headers,
      },
    });
    return response.data;
  },
};

export const refreshTokenApi = async (
  reqBody: ReqRefreshToken
): Promise<ResponseApi<ResRefreshToken>> => {
  const res = await axiosJWT.post<ResponseApi<ResRefreshToken>>(
    "/auth/refresh-system",
    reqBody
  );

  return res;
};
