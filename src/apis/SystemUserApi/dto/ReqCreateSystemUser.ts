export interface ReqCreateSystemUser {
  avatar?: string;

  username: string;

  fullName: string;

  password: string;

  gender: boolean;

  roleId: number;

  regionId: number;
}
