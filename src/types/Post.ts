import type { BaseEntity } from "~/types/BaseEntity";
import type { SystemUser } from "~/types/SystemUser";

export enum PostStatus {
  Draft = "draft",
  Published = "published",
  Archived = "archived",
}

export interface Post extends BaseEntity {
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  thumbnail: string | null;
  status: PostStatus;
  authorId: number | null;
  publishedAt: string | null;
  viewCount: number;
  isRemoved: boolean;
  removedDate: string | null;
  modifiedBy: string | null;
  author?: SystemUser;
}
