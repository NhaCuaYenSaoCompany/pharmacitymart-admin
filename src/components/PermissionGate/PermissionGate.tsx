import { useAppSelector } from "~/hooks/redux";

export interface PermissionGateProps {
  permissions?: string[];
  children: React.ReactNode;
}

export default function PermissionGate({
  children,
  permissions,
}: PermissionGateProps) {
  const userPermissions = useAppSelector(
    (state) => state.permissions.userPermissions
  );

  const { user } = useAppSelector((state) => state.auth);

  if (user?.username === "root") {
    return <>{children}</>;
  }

  if (!permissions || permissions.length === 0) {
    return <>{children}</>;
  }

  const hasPermission = permissions.every((permission) =>
    userPermissions.includes(permission)
  );

  if (!hasPermission) return null;

  return <>{children}</>;
}
