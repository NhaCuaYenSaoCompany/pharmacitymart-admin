import type { ReqCreatePostDto } from "~/apis/PostApi/dto/ReqCreatePostDto";
import type { ReqUpdatePostDto } from "~/apis/PostApi/dto/ReqUpdatePostDto";
import { axiosClient } from "~/configs/AxiosClient";
import type { PaginationApi, PaginationQuery } from "~/types";
import type { Post, PostStatus } from "~/types/Post";
import type { ResponseApi } from "~/types/ResponseApi";

export interface PostQuery extends PaginationQuery {
  status?: PostStatus;
  search?: string;
  authorId?: number;
}

const END_POINT = "/post/admin";

export const postApi = {
  getAll: async (params: PostQuery) => {
    const res = await axiosClient.get<ResponseApi<PaginationApi<Post[]>>>(
      `${END_POINT}/get-all`,
      { params }
    );
    return res;
  },

  create: async (payload: ReqCreatePostDto) => {
    const res = await axiosClient.post<ResponseApi<Post>>(
      `${END_POINT}/create`,
      payload
    );
    return res;
  },

  update: async (id: number, payload: ReqUpdatePostDto) => {
    const res = await axiosClient.put<ResponseApi<Post>>(
      `${END_POINT}/update/${id}`,
      payload
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
    const res = await axiosClient.get<ResponseApi<Post>>(
      `/post/get-detail/${id}`
    );
    return res;
  },
};
