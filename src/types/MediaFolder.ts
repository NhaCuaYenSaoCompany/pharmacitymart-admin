import type { BaseEntity } from "~/types/BaseEntity";
import type { MediaFile } from "~/types/MediaFile";
import type { SystemUser } from "~/types/SystemUser";

export interface MediaFolder extends BaseEntity {
  name: string;

  parentId: number | null;

  ownerId: number;

  owner: SystemUser;

  children: MediaFolder[];

  parent: MediaFolder | null;

  files: MediaFile[];
}
