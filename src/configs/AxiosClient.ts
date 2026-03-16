import axios, { type AxiosRequestConfig, type AxiosResponse } from "axios";
import { jwtDecode } from "jwt-decode";
import { refreshTokenApi } from "~/configs/AxiosJwt";
import type { JwtPayload } from "~/types/JwtPayload";
import { localStoreTokenService } from "~/utils";
import { ENV } from "../constant/Env";
import { getI18n } from "react-i18next";

const request = axios.create({
  baseURL: ENV.API_URL,
  withCredentials: true,
});

export const axiosClient = {
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

request.interceptors.request.use(
  async (config) => {
    try {
      const i18n = getI18n();
      if (i18n && i18n.language) {
        config.headers["Accept-Language"] = i18n.language;
        console.log("Language set to:", i18n.language);
      }

      const accessToken = localStoreTokenService.getAccessToken();
      //   // Thêm token vào header nếu có
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;

        const date = new Date();
        const decoded = jwtDecode<JwtPayload>(accessToken);
        const isExpired = (decoded.exp ?? 0) < date.getTime() / 1000;
        if (isExpired) {
          // Extract user ID from token
          let userId: number;
          if (typeof decoded.sub === "string") {
            userId = Number(decoded.sub);
          } else if (
            decoded.sub &&
            typeof decoded.sub === "object" &&
            "id" in decoded.sub
          ) {
            userId = Number(decoded.sub.id);
          } else {
            throw new Error("Invalid token structure");
          }

          const res = await refreshTokenApi({ userId });
          const resAccessToken = res.data.token.accessToken;
          if (resAccessToken) {
            // Lưu token mới
            localStoreTokenService.setAccessToken(resAccessToken);
            // Cập nhật header với token mới
            config.headers.Authorization = `Bearer ${resAccessToken}`;
          }
        }
      }

      return config;
    } catch (error) {
      // Clear tokens nếu có lỗi
      localStoreTokenService.clearAll();
      window.location.reload();
      return Promise.reject(error);
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);
