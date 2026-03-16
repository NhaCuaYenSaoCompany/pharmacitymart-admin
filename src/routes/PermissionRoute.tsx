import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { ROUTES } from "~/constant/Routes";
import { useAppSelector } from "~/hooks/redux";

interface PermissionRouteProps {
  permissions?: string[];
  children: ReactNode;
}

export default function PermissionRoute({
  permissions = [],
  children,
}: PermissionRouteProps) {
  const userPermissions = useAppSelector(
    (state) => state.permissions.userPermissions
  );

  const hasPermission = permissions.every((permission) =>
    userPermissions.includes(permission)
  );

  if (!hasPermission) {
    return <Navigate to={ROUTES.UNAUTHORIZED} />;
  }

  return children;
}
