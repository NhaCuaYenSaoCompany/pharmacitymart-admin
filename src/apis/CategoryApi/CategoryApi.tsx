import type { ReqCreateCategoryDto } from "~/apis/CategoryApi/dto/ReqCreateCategory";
import type { ReqEditCategoryDto } from "~/apis/CategoryApi/dto/ReqEditCategory";
import { axiosClient } from "~/configs/AxiosClient";
import type { PaginationApi, PaginationQuery } from "~/types";
import type { Category } from "~/types/Category";
import type { ResponseApi } from "~/types/ResponseApi";

const END_POINT = "/category/admin";

export const categoryApi = {
  async getAll(q: PaginationQuery) {
    const res = await axiosClient.get<ResponseApi<PaginationApi<Category[]>>>(
      `${END_POINT}/get-all`,
      { params: q }
    );
    return res;
  },

  async create(reqData: ReqCreateCategoryDto) {
    const res = await axiosClient.post<ResponseApi<Category>>(
      `${END_POINT}/create`,
      reqData
    );
    return res;
  },

  async delete(id: number) {
    const res = await axiosClient.delete<ResponseApi<null>>(
      `${END_POINT}/delete/${id}`
    );
    return res;
  },

  detail: async (id: number) => {
    const res = await axiosClient.get<ResponseApi<Category>>(
      `${END_POINT}/get-detail/${id}`
    );
    return res;
  },

  edit: async (id: number, reqData: ReqEditCategoryDto) => {
    const res = await axiosClient.put<ResponseApi<Category>>(
      `${END_POINT}/update/${id}`,
      reqData
    );
    return res;
  },
};
