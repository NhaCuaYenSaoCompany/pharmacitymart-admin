import type { ReactNode } from "react";
import { useAppSelector } from "~/hooks";

interface ActionPermissionProps {
  permission: string;
  children: ReactNode;
}

export default function ActionPermission({
  permission,
  children,
}: ActionPermissionProps) {
  const { userPermissions } = useAppSelector((state) => state.permissions);

  if (!userPermissions.includes(permission)) {
    return null;
  }

  return <>{children}</>;
}
