import type { BaseEntity } from "~/types/BaseEntity";
import type { MediaFolder } from "~/types/MediaFolder";
import type { SystemUser } from "~/types/SystemUser";

export interface MediaFile extends BaseEntity {
  name: string;

  url: string;

  mimeType: string;

  size: number;

  folderId: number;

  ownerId: number;

  folder: MediaFolder;

  owner: SystemUser;
}
