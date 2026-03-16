import { Menu } from "antd";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "~/hooks";
import type { Menu as MenuConfigRoute } from "../../../routes/RouteConfig";
import { isRouteMatch } from "../../../utils/routeUtils";

interface SidebarProps {
  menus: MenuConfigRoute[];
}

export default function Sidebar({ menus }: SidebarProps) {
  const { t } = useTranslation();
  const nav = useNavigate();
  const location = useLocation();
  const { userPermissions } = useAppSelector((state) => state.permissions);

  const handleNavigate = (path?: string) => {
    if (path) {
      nav(path);
    }
  };

  if (!menus) {
    return <></>;
  }

  // Tìm selected key dựa trên current path
  const findSelectedKey = () => {
    for (const menuItem of menus) {
      if (menuItem.children) {
        const child = menuItem.children.find((child) =>
          isRouteMatch(child.path, location.pathname)
        );
        if (child) {
          return child.key;
        }
      } else if (isRouteMatch(menuItem.path, location.pathname)) {
        return menuItem.key;
      }
    }
    return undefined;
  };

  // Tìm open key dựa trên selected key
  const findOpenKey = () => {
    for (const menuItem of menus) {
      if (
        menuItem.children?.some((child) =>
          isRouteMatch(child.path, location.pathname)
        )
      ) {
        return menuItem.key;
      }
    }
    return undefined;
  };

  // Map menu items with translation
  const translatedMenu = menus
    .filter((item) => {
      if (item.permission) {
        return userPermissions.includes(item.permission);
      }
      return true;
    })
    .map((item) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { parentActiveKey, ...itemWithoutParentActiveKey } = item;
      return {
        ...itemWithoutParentActiveKey,
        label: t(item.label),
        children: item.children
          ?.filter((child) => {
            if (child.permission) {
              return userPermissions.includes(child.permission);
            }
            return true;
          })
          .map((child) => {
            const { ...childWithoutParentActiveKey } = child;
            return {
              ...childWithoutParentActiveKey,
              label: t(child.label),
            };
          }),
      };
    });

  return (
    <div
      className="w-[15%] p-4 rounded-tr-lg"
      style={{ backgroundColor: "var(--sidebar-bg)" }}
    >
      <Menu
        className="border-0"
        style={{ backgroundColor: "var(--sidebar-bg)" }}
        key={menus.map((item) => item.key).join("")}
        defaultSelectedKeys={[findSelectedKey() || ""]}
        defaultOpenKeys={[findOpenKey() || ""]}
        items={translatedMenu}
        mode="inline"
        onClick={(e) => {
          const item = menus
            .flatMap((item) => [item, ...(item.children || [])])
            .find((item) => item.key === e.key);
          handleNavigate(item?.path);
        }}
      />
    </div>
  );
}
