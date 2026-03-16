import { useEffect, type ReactNode } from "react";
import {
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from "react-router-dom";
import DefaultLayout from "../layouts/DefaultLayout/DefaultLayout";
import PermissionRoute from "./PermissionRoute";
import PrivateRoute from "./PrivateRoute";
import { routesConfig, type RouteConfig } from "./RouteConfig";
import { useAppSelector } from "~/hooks/redux";

export default function AppRoute() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  // const { isAuthenticated } = { isAuthenticated: true };
  const appName = "Pharmacy Mart Admin";
  const renderRoutes = (routes: RouteConfig[]) => {
    return routes.map(
      ({
        path,
        layout: Layout,
        component,
        title,
        name,
        private: isPrivate,
        menus,
        breadcrumb,
        permissions,
      }) => {
        const Element = component;
        const ContentWithLayout = () => {
          if (Layout === null) {
            return <Element />;
          }

          const LayoutComponent = Layout || DefaultLayout;

          return (
            <LayoutComponent menus={menus} breadcrumb={breadcrumb}>
              <Element />
            </LayoutComponent>
          );
        };

        return (
          <Route
            key={name}
            path={path}
            element={
              isPrivate ? (
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  <PermissionRoute permissions={permissions}>
                    <RouteWithTitle title={title} appName={appName}>
                      <ContentWithLayout />
                    </RouteWithTitle>
                  </PermissionRoute>
                </PrivateRoute>
              ) : (
                <RouteWithTitle title={title} appName={appName}>
                  <ContentWithLayout />
                </RouteWithTitle>
              )
            }
          />
        );
      }
    );
  };

  return (
    <Router>
      <Routes>{renderRoutes(routesConfig)}</Routes>
    </Router>
  );
}

interface RouteWithTitleProps {
  title: string;
  appName: string;
  children: ReactNode;
}
// Component để cập nhật title của trang
const RouteWithTitle = ({ title, appName, children }: RouteWithTitleProps) => {
  const location = useLocation();

  useEffect(() => {
    // Cập nhật document.title khi location thay đổi
    document.title = `${appName} - ${title}`;
  }, [appName, location, title]);

  return <>{children}</>;
};
