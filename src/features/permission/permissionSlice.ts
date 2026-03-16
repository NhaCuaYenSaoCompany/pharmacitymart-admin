import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Role } from "~/apis/AuthApi/dto/res-login";
import type { PermissionState } from "~/features/permission/type";

const initialState: PermissionState = {
  roles: [], // roles của hệ thống
  permissions: [], // permissions của hệ thống
  userRoles: [], // roles của user hiện tại
  userPermissions: [], // permissions của user hiện tại
};

const permissionSlice = createSlice({
  name: "permissions",
  initialState,
  reducers: {
    setRoles: (state, action: PayloadAction<Role[]>) => {
      state.roles = action.payload;
    },
    setPermissions: (state, action: PayloadAction<string[]>) => {
      state.permissions = action.payload;
    },
    setUserRoles: (state, action: PayloadAction<Role[]>) => {
      state.userRoles = action.payload;
    },
    setUserPermissions: (state, action: PayloadAction<string[]>) => {
      state.userPermissions = action.payload;
    },
    setEmptyPermissions: (state) => {
      state.userPermissions = [];
      state.userRoles = [];
      state.permissions = [];
      state.roles = [];
    },
  },
});

export const { setRoles, setPermissions, setUserRoles, setUserPermissions, setEmptyPermissions } =
  permissionSlice.actions;
export default permissionSlice.reducer;
