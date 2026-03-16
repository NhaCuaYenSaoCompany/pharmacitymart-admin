import type { ReqCreateProductDto } from "~/apis/ProductApi/dto/ReqCreateProductDto";
import type { ReqEditProductDto } from "~/apis/ProductApi/dto/ReqEditProductDto";
import { axiosClient } from "~/configs/AxiosClient";
import type { PaginationApi, PaginationQuery } from "~/types";
import type { Product } from "~/types/Product";
import type { ResponseApi } from "~/types/ResponseApi";

const END_POINT = "/product/admin";

export const productApi = {
  getAll: async (q: PaginationQuery) => {
    const res = await axiosClient.get<ResponseApi<PaginationApi<Product[]>>>(
      `${END_POINT}/get-all`,
      { params: q }
    );
    return res;
  },

  create: async (reqData: ReqCreateProductDto) => {
    const res = await axiosClient.post<ResponseApi<Product>>(
      `${END_POINT}/create`,
      reqData
    );
    return res;
  },

  delete: async (id: number) => {
    const res = await axiosClient.delete<ResponseApi<null>>(
      `${END_POINT}/delete/${id}`
    );
    return res;
  },

  detail: async (id: number) => {
    const res = await axiosClient.get<ResponseApi<Product>>(
      `${END_POINT}/get-detail/${id}`
    );
    return res;
  },

  edit: async (id: number, reqData: ReqEditProductDto) => {
    const res = await axiosClient.put<ResponseApi<Product>>(
      `${END_POINT}/update/${id}`,
      reqData
    );
    return res;
  },
};
