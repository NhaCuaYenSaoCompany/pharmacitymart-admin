import { axiosClient } from "~/configs/AxiosClient";
import type { PaginationApi, PaginationQuery } from "~/types";
import type { Order } from "~/types/Order";
import type { ResponseApi } from "~/types/ResponseApi";

const END_POINT = "/order/admin";

export const orderApi = {
  getAll: async (q: PaginationQuery) => {
    const res = await axiosClient.get<ResponseApi<PaginationApi<Order[]>>>(
      `${END_POINT}/get-all`,
      { params: q }
    );
    return res;
  },

  detail: async (id: number) => {
    const res = await axiosClient.get<ResponseApi<Order>>(
      `${END_POINT}/get-detail/${id}`
    );
    return res;
  },

  delete: async (id: number) => {
    const res = await axiosClient.delete<ResponseApi<null>>(
      `${END_POINT}/delete/${id}`
    );
    return res;
  },

  updateStatus: async (id: number, status: string) => {
    const res = await axiosClient.put<ResponseApi<Order>>(
      `${END_POINT}/update-status-order/${id}`,
      { status }
    );
    return res;
  },
};
