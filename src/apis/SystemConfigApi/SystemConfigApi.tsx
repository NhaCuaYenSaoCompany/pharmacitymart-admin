import { axiosClient } from "~/configs/AxiosClient";
import type { SystemConfig } from "~/types";
import type { ResponseApi } from "~/types/ResponseApi";

const END_POINT = "/system-config/admin";

export const systemConfigApi = {
  async getAll() {
    const res = await axiosClient.get<ResponseApi<SystemConfig>>(
      `${END_POINT}/get-all-formatted`
    );
    return res;
  },
};
