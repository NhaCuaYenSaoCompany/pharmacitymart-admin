import type { ReqCreateRole } from "~/apis/RoleApi/dto/req/ReqCreateRole";
import type { ReqUpdateRolePermission } from "~/apis/RoleApi/dto/req/ReqUpdateRolePermission";
import { axiosClient } from "~/configs/AxiosClient";
import type { PaginationApi, PaginationQuery } from "~/types/PaginationApi";
import type { ResponseApi } from "~/types/ResponseApi";
import type { Role } from "~/types/Role";

const END_POINT = "/role";

export const roleApi = {
  async getAllRoles(query: PaginationQuery): Promise<PaginationApi<Role[]>> {
    const res = await axiosClient.get<ResponseApi<PaginationApi<Role[]>>>(
      `${END_POINT}/get-all-roles`,
      {
        params: query,
      }
    );
    return res.data;
  },

  async getRoleById(roleId: number): Promise<Role> {
    const res = await axiosClient.get<ResponseApi<Role>>(
      `${END_POINT}/get-detail-role/${roleId}`
    );
    return res.data;
  },

  async createRole(reqBody: ReqCreateRole): Promise<Role> {
    const res = await axiosClient.post<ResponseApi<Role>>(
      `${END_POINT}/create`,
      reqBody
    );
    return res.data;
  },

  async updateRole(roleId: number, reqBody: ReqCreateRole): Promise<Role> {
    const res = await axiosClient.put<ResponseApi<Role>>(
      `${END_POINT}/update/${roleId}`,
      reqBody
    );
    return res.data;
  },

  async updateRolePermission(
    roleId: number,
    permissionIds: number[]
  ): Promise<Role> {
    const res = await axiosClient.put<ResponseApi<Role>>(
      `${END_POINT}/update-role-permission/${roleId}`,
      {
        permissionIds,
      }
    );
    return res.data;
  },

  async deleteRole(roleId: number): Promise<void> {
    await axiosClient.delete(`${END_POINT}/delete/${roleId}`);
  },

  async updateRolePermissions(
    roleId: number,
    reqBody: ReqUpdateRolePermission
  ): Promise<Role> {
    const res = await axiosClient.put<ResponseApi<Role>>(
      `${END_POINT}/update-role-permission/${roleId}`,
      reqBody
    );
    return res.data;
  },
};
