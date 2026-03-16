import { Navigate } from "react-router-dom";
import { ROUTES } from "../constant/Routes";
import type { ReactNode } from "react";

interface PrivateRouteProps {
  isAuthenticated: boolean;
  children: ReactNode;
}

export default function PrivateRoute({
  isAuthenticated,
  children,
}: PrivateRouteProps) {
  return isAuthenticated ? children : <Navigate to={ROUTES.LOGIN} />;
}
