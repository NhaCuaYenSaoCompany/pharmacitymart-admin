import type { ResGetAllSystemUser } from "~/apis/SystemUserApi/dto/res-get-all-system-user";
import type { PaginationApi, PaginationQuery } from "~/types/PaginationApi";
import type { ResponseApi } from "../../types/ResponseApi";
import type { ReqCreateSystemUser } from "~/apis/SystemUserApi/dto/ReqCreateSystemUser";
import { axiosClient } from "~/configs/AxiosClient";
import type { SystemUser } from "~/types/SystemUser";

const END_POINT = "/system-user";

export const systemUserApi = {
  async getAllSystemUsers(
    query: PaginationQuery
  ): Promise<ResponseApi<PaginationApi<ResGetAllSystemUser[]>>> {
    const res = await axiosClient.get<
      ResponseApi<PaginationApi<ResGetAllSystemUser[]>>
    >(`${END_POINT}`, { params: query });
    return res;
  },

  async createSystemUser(reqBody: ReqCreateSystemUser): Promise<SystemUser> {
    const res = await axiosClient.post<ResponseApi<SystemUser>>(
      `${END_POINT}/create`,
      reqBody
    );
    return res.data;
  },

  async deleteSystemUser(id: number): Promise<void> {
    await axiosClient.delete<ResponseApi<void>>(`${END_POINT}/delete/${id}`);
  },

  async getDetail(id: number): Promise<ResponseApi<SystemUser>> {
    const res = await axiosClient.get<ResponseApi<SystemUser>>(
      `${END_POINT}/detail/${id}`
    );
    return res;
  },
};
