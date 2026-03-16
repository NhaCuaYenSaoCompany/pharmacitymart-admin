import type { PostStatus } from "~/types/Post";

export interface ReqCreatePostDto {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  thumbnail?: string;
  status?: PostStatus;
  authorId?: number;
}
