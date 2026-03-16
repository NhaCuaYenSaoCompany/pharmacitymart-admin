import type { Middleware } from "@reduxjs/toolkit";
// import { ENV } from "~/constant/Env";
// import { MOCK_PERMISSIONS, MOCK_ROLES } from "~/mocks/mocks-data-user-login";

export const mockPermissionsMiddleware: Middleware = 
  () => (next) => (action) => {
    // Chỉ apply mock data trong development
    // if (ENV.VITE_NODE_ENV === "development") {
    //   if (action.type === "auth/loginSuccess") {
    //     store.dispatch({
    //       type: "permissions/setUserPermissions",
    //       payload: MOCK_PERMISSIONS,
    //     });
    //     store.dispatch({
    //       type: "permissions/setUserRoles",
    //       payload: MOCK_ROLES,
    //     });
    //   }
    // }
    return next(action);
  };
