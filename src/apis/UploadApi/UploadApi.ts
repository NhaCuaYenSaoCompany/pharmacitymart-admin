import type { ReqUploadImage } from "~/apis/UploadApi/dto/req-upload-image";
import type { ResUploadImage } from "~/apis/UploadApi/dto/res-upload-Image";
import { axiosClient } from "~/configs/AxiosClient";
import type { ResponseApi } from "~/types/ResponseApi";

const END_POINT = "/cloud";

export const uploadApi = {
  async uploadImage(
    request: ReqUploadImage
  ): Promise<ResponseApi<ResUploadImage>> {
    const formData = new FormData();
    formData.append("file", request.file);

    const result = await axiosClient.post<ResponseApi<ResUploadImage>>(
      `${END_POINT}/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return result;
  },

  async deleteImage(imageId: string): Promise<ResponseApi<void>> {
    const result = await axiosClient.delete<ResponseApi<void>>(
      `${END_POINT}/${imageId}`
    );

    return result;
  },
};
