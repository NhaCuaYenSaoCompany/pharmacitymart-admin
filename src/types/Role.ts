import type { Permission } from "~/apis/AuthApi/dto/res-login";

export interface Role {
  id: number;
  name: string;
  desc: string;
  createdAt: Date;
  updatedAt: Date;
  rolePermissions: [
    {
      permission: Permission[];
    }
  ];
}
