import type { Role } from "~/types/Role";

export interface SystemUser {
  id: number;
  createdAt: string;
  updatedAt: string;
  username: string;
  password: string;
  thumbnail: string | null;
  fullName: string | null;
  roomName: string | null;
  gender: boolean;
  address: string | null;
  refreshToken: string | null;
  isOnline: boolean;
  lastActiveAt: string | null;
  userRoles: [
    {
      role: Role;
    }
  ];
}
