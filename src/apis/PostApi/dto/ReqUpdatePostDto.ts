import type { PostStatus } from "~/types/Post";

export interface ReqUpdatePostDto {
  title?: string;
  slug?: string;
  content?: string;
  excerpt?: string | null;
  thumbnail?: string | null;
  status?: PostStatus;
  authorId?: number | null;
}
