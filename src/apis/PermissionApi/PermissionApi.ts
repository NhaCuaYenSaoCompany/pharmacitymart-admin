import type { ResGetAllPermission } from "~/apis/PermissionApi/dto/res/ResGetAllPermission";
import type { ResponseApi } from "../../types/ResponseApi";
import { axiosClient } from "~/configs/AxiosClient";

const END_POINT = "/permission";

export const permissionApi = {
  async getAllPermissions(): Promise<ResGetAllPermission[]> {
    const res = await axiosClient.get<ResponseApi<ResGetAllPermission[]>>(
      `${END_POINT}/get-all-permissions`
    );
    return res.data;
  },

  async refreshPermission(): Promise<ResponseApi<ResGetAllPermission[]>> {
    const res = await axiosClient.get<ResponseApi<ResGetAllPermission[]>>(
      `${END_POINT}/refresh-permissions`
    );
    return res;
  },
};
