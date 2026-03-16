import type { ReqCreateMediaFile } from "~/apis/MediaApi/dto/ReqCreateMediaFile";
import type { ReqCreateMediaFolderDto } from "~/apis/MediaApi/dto/ReqCreateMediaFolder";
import type { ResFolderTreeDto } from "~/apis/MediaApi/dto/ResFolderTreeDto";
import { axiosClient } from "~/configs/AxiosClient";
import type { MediaFile } from "~/types/MediaFile";
import type { MediaFolder } from "~/types/MediaFolder";
import type { ResponseApi } from "~/types/ResponseApi";

const END_POINT = "/media/admin";

export const mediaApi = {
  async getContentsMedia(folderId: number) {
    const res = await axiosClient.get<
      ResponseApi<{
        folders: MediaFolder[];
        files: MediaFile[];
      }>
    >(`${END_POINT}/get-contents/${folderId}`);
    return res;
  },

  async createFolder(reqBody: ReqCreateMediaFolderDto) {
    const res = await axiosClient.post<ResponseApi<MediaFolder>>(
      `${END_POINT}/create-folder`,
      reqBody
    );

    return res;
  },

  async uploadFile(reqBody: ReqCreateMediaFile) {
    const formData = new FormData();
    formData.append("file", reqBody.file);

    const result = await axiosClient.post<ResponseApi<MediaFile>>(
      `${END_POINT}/upload/${reqBody.folderId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return result;
  },

  async deleteFile(fileId: number) {
    const res = await axiosClient.delete<ResponseApi<MediaFile>>(
      `${END_POINT}/delete-file/${fileId}`
    );

    return res;
  },

  async deleteFolder(folderId: number) {
    const res = await axiosClient.delete<ResponseApi<MediaFolder>>(
      `${END_POINT}/delete-folder/${folderId}`
    );

    return res;
  },

  getFoldersRecursive: async () => {
    const res = await axiosClient.get<ResponseApi<ResFolderTreeDto[]>>(
      `${END_POINT}/get-folders-recursive`
    );
    return res;
  },
};
