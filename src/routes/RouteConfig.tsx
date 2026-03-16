import type { ReactNode } from "react";
import {
  CATEGORY_MANAGEMENT_MENU,
  MEDIA_MANAGEMENT_MENU,
  ORDER_MANAGEMENT_MENU,
  POST_MANAGEMENT_MENU,
  PRODUCT_MANAGEMENT_MENU,
  STAFF_MANAGEMENT_MENU,
} from "~/constant/MenuRoutes";
import { PERMISSIONS_KEY } from "~/constant/Permissions";
import { ROUTES } from "~/constant/Routes";
import DefaultLayout from "~/layouts/DefaultLayout/DefaultLayout";
import CategoryCreate from "~/pages/CategoryCreate/CategoryCreate";
import CategoryEdit from "~/pages/CategoryEdit/CategoryEdit";
import CategoryManagement from "~/pages/CategoryManagement/CategoryManagement";
import Dashboard from "~/pages/Dashboard/Dashboard";
import Login from "~/pages/Login/Login";
import MediaManagement from "~/pages/MediaManagement/MediaManagement";
import Notfound from "~/pages/Notfound/Notfound";
import OrderManagement from "~/pages/OrderManagement/OrderManagement";
import PermissionManage from "~/pages/PermissionManage/PermissionManage";
import PostCreate from "~/pages/PostCreate/PostCreate";
import PostEdit from "~/pages/PostEdit/PostEdit";
import PostManagement from "~/pages/PostManagement/PostManagement";
import ProductCreate from "~/pages/ProductCreate/ProductCreate";
import ProductEdit from "~/pages/ProductEdit/ProductEdit";
import ProductManagement from "~/pages/ProductManagement/ProductManagement";
import StaffAdd from "~/pages/StaffAdd/StaffAdd";
import StaffEdit from "~/pages/StaffEdit/StaffEdit";
import StaffManage from "~/pages/StaffManage/StaffManage";
import StaffPosition from "~/pages/StaffPosition/StaffPosition";
import Unauthorized from "~/pages/Unauthorized/Unauthorized";

export interface Menu {
  parentActiveKey: string;
  key: string;
  label: string;
  icon: ReactNode;
  path: string;
  permission?: string;
  children?: Menu[];
}

export interface Breadcrumb {
  title: string;
  path?: string;
}

export interface RouteConfig {
  path: string;
  name: string;
  title: string;
  component: any;
  private: boolean;
  layout: any | null;

  group?: string;
  permissions?: string[];
  menus?: Menu[];
  breadcrumb?: Breadcrumb[];
}

const publicRoutes: RouteConfig[] = [
  {
    path: ROUTES.LOGIN,
    name: "login",
    title: "login",
    component: Login,
    private: false,
    layout: null,
  },
  {
    path: ROUTES.UNAUTHORIZED,
    name: "unauthorized",
    title: "Unauthorized",
    component: Unauthorized,
    private: true,
    layout: DefaultLayout,
  },
  {
    path: ROUTES.NOT_FOUND,
    name: "notFound",
    title: "Not Found",
    component: Notfound,
    private: false,
    layout: DefaultLayout,
  },
  {
    path: ROUTES.DASHBOARD,
    name: "dashboard",
    title: "Dashboard",
    component: Dashboard,
    private: true,
    layout: DefaultLayout,
    group: "dashboard",
  },
];

const staffRoutes: RouteConfig[] = [
  {
    path: ROUTES.STAFF_MANAGEMENT,
    name: "staff_management",
    title: "Staff Management",
    component: StaffManage,
    private: true,
    layout: DefaultLayout,
    group: "staff_management",
    menus: STAFF_MANAGEMENT_MENU,
    permissions: [PERMISSIONS_KEY.system_user.view_system_users.name],
  },
  {
    path: ROUTES.ADD_STAFF,
    name: "add_staff",
    title: "Add Staff",
    component: StaffAdd,
    private: true,
    layout: DefaultLayout,
    group: "staff_management",
    menus: STAFF_MANAGEMENT_MENU,
    permissions: [PERMISSIONS_KEY.system_user.create_system_user.name],
  },
  {
    path: ROUTES.EDIT_STAFF,
    name: "edit_staff",
    title: "Edit Staff",
    component: StaffEdit,
    private: true,
    layout: DefaultLayout,
    group: "staff_management",
    menus: STAFF_MANAGEMENT_MENU,
    permissions: [PERMISSIONS_KEY.system_user.view_detail_system_user.name],
  },
  {
    path: ROUTES.STAFF_POSITION,
    name: "staff_position",
    title: "Staff Position",
    component: StaffPosition,
    private: true,
    layout: DefaultLayout,
    group: "staff_management",
    menus: STAFF_MANAGEMENT_MENU,
    permissions: [PERMISSIONS_KEY.role.view_roles.name],
  },
  {
    path: ROUTES.PERMISSION_MANAGEMENT,
    name: "permission_management",
    title: "Permission Management",
    component: PermissionManage,
    private: true,
    layout: DefaultLayout,
    group: "staff_management",
    menus: STAFF_MANAGEMENT_MENU,
    permissions: [PERMISSIONS_KEY.permission.view_permissions.name],
  },
];

const categoryRoutes: RouteConfig[] = [
  {
    path: ROUTES.CATEGORY_MANAGEMENT,
    name: "category_management",
    title: "Category Management",
    component: CategoryManagement,
    private: true,
    layout: DefaultLayout,
    group: "category_management",
    menus: CATEGORY_MANAGEMENT_MENU,
    permissions: [PERMISSIONS_KEY.category.view_categories.name],
  },
  {
    path: ROUTES.CATEGORY_CREATE,
    name: "category_create",
    title: "Category Create",
    component: CategoryCreate,
    private: true,
    layout: DefaultLayout,
    group: "category_management",
    menus: CATEGORY_MANAGEMENT_MENU,
    permissions: [PERMISSIONS_KEY.category.create_category.name],
  },
  {
    path: ROUTES.CATEGORY_EDIT,
    name: "category_edit",
    title: "Category Edit",
    component: CategoryEdit,
    private: true,
    layout: DefaultLayout,
    group: "category_management",
    menus: CATEGORY_MANAGEMENT_MENU,
    permissions: [PERMISSIONS_KEY.category.edit_category.name],
  },
];

const productRoutes: RouteConfig[] = [
  {
    path: ROUTES.PRODUCT_MANAGEMENT,
    name: "product_management",
    title: "Product Management",
    component: ProductManagement,
    private: true,
    layout: DefaultLayout,
    group: "product_management",
    menus: PRODUCT_MANAGEMENT_MENU,
    permissions: [PERMISSIONS_KEY.product.view_products.name],
  },
  {
    path: ROUTES.PRODUCT_CREATE,
    name: "product_create",
    title: "Product Create",
    component: ProductCreate,
    private: true,
    layout: DefaultLayout,
    group: "product_management",
    menus: PRODUCT_MANAGEMENT_MENU,
    permissions: [PERMISSIONS_KEY.product.create_product.name],
  },
  {
    path: ROUTES.PRODUCT_EDIT,
    name: "product_edit",
    title: "Product Edit",
    component: ProductEdit,
    private: true,
    layout: DefaultLayout,
    group: "product_management",
    menus: PRODUCT_MANAGEMENT_MENU,
    permissions: [PERMISSIONS_KEY.product.edit_product.name],
  },
];

const postRoutes: RouteConfig[] = [
  {
    path: ROUTES.POST_MANAGEMENT,
    name: "post_management",
    title: "Post Management",
    component: PostManagement,
    private: true,
    layout: DefaultLayout,
    group: "post_management",
    menus: POST_MANAGEMENT_MENU,
    permissions: [PERMISSIONS_KEY.post.view_posts.name],
  },
  {
    path: ROUTES.POST_CREATE,
    name: "post_create",
    title: "Post Create",
    component: PostCreate,
    private: true,
    layout: DefaultLayout,
    group: "post_management",
    menus: POST_MANAGEMENT_MENU,
    permissions: [PERMISSIONS_KEY.post.create_post.name],
  },
  {
    path: ROUTES.POST_EDIT,
    name: "post_edit",
    title: "Post Edit",
    component: PostEdit,
    private: true,
    layout: DefaultLayout,
    group: "post_management",
    menus: POST_MANAGEMENT_MENU,
    permissions: [PERMISSIONS_KEY.post.edit_post.name],
  },
];

const orderManagement: RouteConfig[] = [
  {
    path: ROUTES.ORDER_MANAGEMENT,
    name: "order_management",
    title: "Order Management",
    component: OrderManagement,
    private: true,
    layout: DefaultLayout,
    group: "order_management",
    menus: ORDER_MANAGEMENT_MENU,
    permissions: [PERMISSIONS_KEY.order.view_orders.name],
  },
];

const mediaRoutes: RouteConfig[] = [
  {
    path: ROUTES.MEDIA_MANAGEMENT,
    name: "media_management",
    title: "Media Management",
    component: MediaManagement,
    private: true,
    layout: DefaultLayout,
    group: "media_management",
    menus: MEDIA_MANAGEMENT_MENU,
  },
];

const privateRoutes: RouteConfig[] = [
  ...categoryRoutes,
  ...productRoutes,
  ...postRoutes,
  ...orderManagement,

  ...staffRoutes,
  ...mediaRoutes,
];

export const routesConfig: RouteConfig[] = [...publicRoutes, ...privateRoutes];
