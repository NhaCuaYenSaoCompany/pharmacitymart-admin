import { axiosClient } from "~/configs/AxiosClient";
import type { PaginationApi, PaginationQuery } from "~/types";
import type { Region } from "~/types/Region";
import type { ResponseApi } from "~/types/ResponseApi";

const END_POINT = "/region/admin";

export const regionApi = {
  getAll: async (q: PaginationQuery) => {
    const res = await axiosClient.get<ResponseApi<PaginationApi<Region[]>>>(
      `${END_POINT}/get-all`,
      { params: q }
    );
    return res;
  },

//   create: async (reqData: ReqCreateProductDto) => {
//     const res = await axiosClient.post<ResponseApi<Region>>(
//       `${END_POINT}/create`,
//       reqData
//     );
//     return res;
//   },

  delete: async (id: number) => {
    const res = await axiosClient.delete<ResponseApi<null>>(
      `${END_POINT}/delete/${id}`
    );
    return res;
  },

  detail: async (id: number) => {
    const res = await axiosClient.get<ResponseApi<Region>>(
      `${END_POINT}/get-detail/${id}`
    );
    return res;
  },

//   edit: async (id: number, reqData: ReqEditProductDto) => {
//     const res = await axiosClient.put<ResponseApi<Region>>(
//       `${END_POINT}/update/${id}`,
//       reqData
//     );
//     return res;
//   },
};
