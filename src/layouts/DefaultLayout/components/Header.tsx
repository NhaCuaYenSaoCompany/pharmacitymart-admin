import { LeftOutlined, LogoutOutlined, RightOutlined } from "@ant-design/icons";
import { Avatar, Dropdown, message, Space, type MenuProps } from "antd";
import { isAxiosError } from "axios";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, NavLink, useLocation } from "react-router-dom";
import { authApi } from "~/apis/AuthApi/AuthApi";
import LanguageSwitcher from "~/components/LanguageSwitcher/LanguageSwitcher";
import { PERMISSIONS_KEY } from "~/constant/Permissions";
import { logout } from "~/features/auth/authSlice";
import { setEmptyPermissions } from "~/features/permission/permissionSlice";
import { useAppDispatch, useAppSelector } from "~/hooks/redux";
import type { ApiErrorResponse } from "~/types";
import { localStoreTokenService } from "~/utils";
import PermissionGate from "../../../components/PermissionGate/PermissionGate";
import { ThemeToggle } from "../../../components/ThemeToggle/ThemeToggle";
import { ROUTES } from "../../../constant/Routes";
import { routesConfig } from "../../../routes/RouteConfig";
import { isRouteMatch } from "../../../utils/routeUtils";

// Định nghĩa kiểu NavItem cho headerNav
interface NavItem {
  id: number;
  title: string;
  url: string;
  group: string;
  permission?: string[];
}

// Định nghĩa mảng options với kiểu ItemType[]
const options: MenuProps["items"] = [
  {
    key: "1",
    label: "myAccount",
    disabled: true,
  },
  {
    type: "divider",
  },
  {
    key: "log-out",
    label: "logout",
    icon: <LogoutOutlined />,
  },
];

// Định nghĩa mảng headerNav với kiểu NavItem[]
const headerNav: NavItem[] = [
  {
    id: 1,
    title: "header.dashboard.title",
    url: ROUTES.DASHBOARD,
    group: "dashboard",
  },
  {
    id: 2,
    title: "categoryManagement.title",
    url: ROUTES.CATEGORY_MANAGEMENT,
    group: "category_management",
    permission: [PERMISSIONS_KEY.category.view_categories.name],
  },
  {
    id: 2,
    title: "productManagement.title",
    url: ROUTES.PRODUCT_MANAGEMENT,
    group: "product_management",
    permission: [PERMISSIONS_KEY.product.view_products.name],
  },
  {
    id: 7,
    title: "postManagement.title",
    url: ROUTES.POST_MANAGEMENT,
    group: "post_management",
    permission: [PERMISSIONS_KEY.post.view_posts.name],
  },
  {
    id: 3,
    title: "orderManagement.title",
    url: ROUTES.ORDER_MANAGEMENT,
    group: "order_management",
    permission: [PERMISSIONS_KEY.order.view_orders.name],
  },
  {
    id: 6,
    title: "mediaManagement.title",
    url: ROUTES.MEDIA_MANAGEMENT,
    group: "media_management",
    permission: [PERMISSIONS_KEY.system_config.view_system_configs.name],
  },
  {
    id: 999,
    title: "staffManagement.title",
    url: ROUTES.STAFF_MANAGEMENT,
    group: "staff_management",
    permission: [PERMISSIONS_KEY.system_user.view_system_users.name],
  },
];

export default function Header() {
  const location = useLocation(); // Lấy đường dẫn hiện tại
  const navRef = useRef<HTMLUListElement>(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { t } = useTranslation();

  // Tìm route hiện tại và lấy group của nó
  const currentRoute = routesConfig.find((route) =>
    isRouteMatch(route.path, location.pathname)
  );
  const currentGroup = currentRoute ? currentRoute.group : null;

  // Helper function để check active state
  const isNavActive = (nav: NavItem): boolean => {
    // Check exact URL match
    if (location.pathname === nav.url) {
      return true;
    }

    // Check group match
    if (currentGroup === nav.group) {
      return true;
    }

    return false;
  };

  // Kiểm tra khả năng scroll
  const checkScroll = () => {
    if (navRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = navRef.current;
      setShowLeftButton(scrollLeft > 0);
      setShowRightButton(scrollLeft < scrollWidth - clientWidth);
    }
  };

  // Scroll function
  const scroll = (direction: "left" | "right") => {
    if (navRef.current) {
      const scrollAmount = 200;
      navRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Effect để check scroll khi component mount và resize
  useEffect(() => {
    checkScroll();
    const handleResize = () => checkScroll();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Dịch các label trong options
  const translatedOptions: MenuProps["items"] = options?.map((item) => {
    if ("label" in item! && item.label) {
      return { ...item, label: item.label };
    }
    return item;
  });

  // Xử lý sự kiện click menu
  const handleMenuClick = async (e: { key: string }) => {
    try {
      if (e.key === "log-out") {
        await authApi.logout();
        localStoreTokenService.clearAll();
        dispatch(logout());
        dispatch(setEmptyPermissions());
        window.location.reload();
      }
    } catch (error) {
      if (isAxiosError<ApiErrorResponse>(error)) {
        if (error.response) {
          message.error(t("error.response.data.message"));
        }
      }
    }
  };

  // Định nghĩa optionsList với kiểu MenuProps
  const optionsList: MenuProps = {
    items: translatedOptions,
    onClick: handleMenuClick,
  };

  return (
    <header
      className="flex shadow-md w-full px-4 items-center"
      style={{ backgroundColor: "var(--header-bg)" }}
    >
      <section className="w-[15%] p-2">
        <Link to="/">
          <img className="w-[200px]" src="/images/logo.svg" alt="ncys" />
        </Link>
      </section>

      <nav className="w-[85%] flex justify-between items-center">
        <div
          className="flex-1 overflow-hidden relative nav-container"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Left scroll button */}
          {showLeftButton && isHovered && (
            <button
              onClick={() => scroll("left")}
              className="nav-scroll-button nav-scroll-button-left hover:scale-110"
              style={{
                backgroundColor: "var(--card-bg)",
                color: "var(--text-color)",
              }}
            >
              <LeftOutlined className="text-sm" />
            </button>
          )}

          {/* Navigation list */}
          <ul
            ref={navRef}
            className="flex w-full overflow-x-auto nav-scroll-container scroll-smooth whitespace-nowrap pb-1"
            onScroll={checkScroll}
          >
            {headerNav.map((nav) => (
              <PermissionGate permissions={nav.permission} key={nav.id}>
                <li>
                  <NavLink
                    to={nav.url}
                    className={({ isActive }) =>
                      `p-4 block whitespace-nowrap transition-colors duration-200 ${
                        isActive || isNavActive(nav)
                          ? "text-blue-600 font-medium"
                          : "hover:text-blue-500"
                      }`
                    }
                    style={({ isActive }) => ({
                      color:
                        isActive || isNavActive(nav)
                          ? "#1890ff"
                          : "var(--text-color)",
                    })}
                  >
                    {t(nav.title)}
                  </NavLink>
                </li>
              </PermissionGate>
            ))}
          </ul>

          {/* Right scroll button */}
          {showRightButton && isHovered && (
            <button
              onClick={() => scroll("right")}
              className="nav-scroll-button nav-scroll-button-right hover:scale-110"
              style={{
                backgroundColor: "var(--card-bg)",
                color: "var(--text-color)",
              }}
            >
              <RightOutlined className="text-sm" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <ThemeToggle />
          {/* <NotificationDropdown notifications={notices} /> */}
          <Dropdown menu={optionsList}>
            <Space>
              <Avatar
                size="large"
                alt="User Avatar"
                // src={`https://ui-avatars.com/api/?name=${username}&size=40`}
                src={
                  user?.avatar ||
                  `https://ui-avatars.com/api/?name=${user?.username}&size=40`
                }
                style={{ cursor: "pointer" }}
              ></Avatar>
            </Space>
          </Dropdown>
        </div>
      </nav>
    </header>
  );
}
