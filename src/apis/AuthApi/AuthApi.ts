import { axiosClient } from "~/configs/AxiosClient";
import type { ResponseApi } from "../../types/ResponseApi";
import type { ReqLogin } from "./dto/req-login";
import type { ResLogin } from "./dto/res-login";

const END_POINT = "/auth";

export const authApi = {
  async login(reqBody: ReqLogin): Promise<ResponseApi<ResLogin>> {
    const res = await axiosClient.post<ResponseApi<ResLogin>>(
      `${END_POINT}/system-login`,
      reqBody
    );
    return res;
  },

  async logout(): Promise<ResponseApi<void>> {
    const res = await axiosClient.post<ResponseApi<void>>(
      `${END_POINT}/system-logout`
    );
    return res;
  },
};
