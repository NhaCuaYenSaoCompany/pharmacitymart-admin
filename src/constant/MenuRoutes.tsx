import {
  AppstoreAddOutlined,
  AppstoreOutlined,
  CloudServerOutlined,
  ClusterOutlined,
  DeploymentUnitOutlined,
  FolderOutlined,
  ForkOutlined,
  LinkOutlined,
  ReadOutlined,
  UserAddOutlined,
  UsergroupAddOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { PERMISSIONS_KEY } from "~/constant/Permissions";
import type { Menu } from "../routes/RouteConfig";
import { ROUTES } from "./Routes";

export const STAFF_MANAGEMENT_MENU: Menu[] = [
  {
    parentActiveKey: "staff_management",
    key: "GROUP_STAFF_MANAGEMENT",
    label: "staffManagement.title",
    path: "#",
    icon: <UsergroupAddOutlined />,
    permission: PERMISSIONS_KEY.system_user.view_system_users.name,
    children: [
      {
        parentActiveKey: "staff_management",
        key: ROUTES.STAFF_MANAGEMENT,
        label: "staffManagement.sidebar.staffList",
        path: ROUTES.STAFF_MANAGEMENT,
        icon: <UserOutlined />,
        permission: PERMISSIONS_KEY.system_user.view_system_users.name,
      },
      {
        parentActiveKey: "staff_management",
        key: ROUTES.ADD_STAFF,
        label: "staffManagement.sidebar.addStaff",
        path: ROUTES.ADD_STAFF,
        icon: <UserAddOutlined />,
        permission: PERMISSIONS_KEY.system_user.create_system_user.name,
      },
    ],
  },
  {
    parentActiveKey: "staff_management",
    key: "GROUP_STAFF_POSITION",
    label: "staffManagement.sidebar.staffPositionTitle",
    path: "#",
    icon: <ClusterOutlined />,
    permission: PERMISSIONS_KEY.role.view_roles.name,
    children: [
      {
        parentActiveKey: "staff_management",
        key: ROUTES.STAFF_POSITION,
        label: "staffManagement.sidebar.staffPositionList",
        path: ROUTES.STAFF_POSITION,
        icon: <ForkOutlined />,
        permission: PERMISSIONS_KEY.role.view_roles.name,
      },
      {
        parentActiveKey: "staff_management",
        key: ROUTES.PERMISSION_MANAGEMENT,
        label: "staffManagement.sidebar.permissionManage",
        path: ROUTES.PERMISSION_MANAGEMENT.replace(":roleId", "-1"),
        icon: <ForkOutlined />,
        permission: PERMISSIONS_KEY.permission.view_permissions.name,
      },
    ],
  },
];

export const CATEGORY_MANAGEMENT_MENU: Menu[] = [
  {
    parentActiveKey: "category_management",
    key: "GROUP_CATEGORY_MANAGEMENT",
    label: "categoryManagement.title",
    path: "#",
    icon: <AppstoreAddOutlined />,
    permission: PERMISSIONS_KEY.system_user.view_system_users.name,
    children: [
      {
        parentActiveKey: "category_management",
        key: ROUTES.CATEGORY_MANAGEMENT,
        label: "categoryManagement.sidebar.categoryList",
        path: ROUTES.CATEGORY_MANAGEMENT,
        icon: <AppstoreOutlined />,
        permission: PERMISSIONS_KEY.category.view_categories.name,
      },
      {
        parentActiveKey: "category_management",
        key: ROUTES.CATEGORY_CREATE,
        label: "categoryManagement.sidebar.categoryCreate",
        path: ROUTES.CATEGORY_CREATE,
        icon: <AppstoreOutlined />,
        permission: PERMISSIONS_KEY.category.create_category.name,
      },
    ],
  },
];

export const PRODUCT_MANAGEMENT_MENU: Menu[] = [
  {
    parentActiveKey: "product_management",
    key: "GROUP_PRODUCT_MANAGEMENT",
    label: "productManagement.title",
    path: "#",
    icon: <AppstoreAddOutlined />,
    permission: PERMISSIONS_KEY.product.view_products.name,
    children: [
      {
        parentActiveKey: "product_management",
        key: ROUTES.PRODUCT_MANAGEMENT,
        label: "productManagement.sidebar.productList",
        path: ROUTES.PRODUCT_MANAGEMENT,
        icon: <AppstoreOutlined />,
        permission: PERMISSIONS_KEY.product.view_products.name,
      },
      {
        parentActiveKey: "product_management",
        key: ROUTES.PRODUCT_CREATE,
        label: "productManagement.sidebar.productCreate",
        path: ROUTES.PRODUCT_CREATE,
        icon: <AppstoreOutlined />,
        permission: PERMISSIONS_KEY.product.create_product.name,
      },
    ],
  },
];

export const POST_MANAGEMENT_MENU: Menu[] = [
  {
    parentActiveKey: "post_management",
    key: "GROUP_POST_MANAGEMENT",
    label: "postManagement.title",
    path: "#",
    icon: <ReadOutlined />,
    permission: PERMISSIONS_KEY.post.view_posts.name,
    children: [
      {
        parentActiveKey: "post_management",
        key: ROUTES.POST_MANAGEMENT,
        label: "postManagement.sidebar.postList",
        path: ROUTES.POST_MANAGEMENT,
        icon: <ReadOutlined />,
        permission: PERMISSIONS_KEY.post.view_posts.name,
      },
      {
        parentActiveKey: "post_management",
        key: ROUTES.POST_CREATE,
        label: "postManagement.sidebar.postCreate",
        path: ROUTES.POST_CREATE,
        icon: <ReadOutlined />,
        permission: PERMISSIONS_KEY.post.create_post.name,
      },
    ],
  },
];

export const ORDER_MANAGEMENT_MENU: Menu[] = [
  {
    parentActiveKey: "order_management",
    key: "GROUP_ORDER_MANAGEMENT",
    label: "orderManagement.title",
    path: "#",
    icon: <AppstoreAddOutlined />,
    permission: PERMISSIONS_KEY.order.view_orders.name,
    children: [
      {
        parentActiveKey: "order_management",
        key: ROUTES.ORDER_MANAGEMENT,
        label: "orderManagement.sidebar.orderList",
        path: ROUTES.ORDER_MANAGEMENT,
        icon: <AppstoreOutlined />,
        permission: PERMISSIONS_KEY.order.view_orders.name,
      },
      // {
      //   parentActiveKey: "order_management",
      //   key: ROUTES.PRODUCT_CREATE,
      //   label: "productManagement.sidebar.productCreate",
      //   path: ROUTES.PRODUCT_CREATE,
      //   icon: <AppstoreOutlined />,
      //   permission: PERMISSIONS_KEY.product.create_product.name,
      // },
    ],
  },
];

export const SYSTEM_CONFIG_MANAGEMENT_MENU: Menu[] = [
  {
    parentActiveKey: "system_config_management",
    key: "GROUP_SYSTEM_CONFIG_MANAGEMENT",
    label: "systemConfigManagement.title",
    path: "#",
    icon: <LinkOutlined />,
    permission: PERMISSIONS_KEY.system_config.view_system_configs.name,
    children: [
      {
        parentActiveKey: "system_config_management",
        key: ROUTES.SYSTEM_CONFIG_MANAGEMENT,
        label: "systemConfigManagement.sidebar.systemConfigList",
        path: ROUTES.SYSTEM_CONFIG_MANAGEMENT,
        icon: <DeploymentUnitOutlined />,
        permission: PERMISSIONS_KEY.system_config.view_system_configs.name,
      },
      {
        parentActiveKey: "system_config_management",
        key: ROUTES.SYSTEM_CONFIG_AFFILIATE_MANAGEMENT,
        label: "systemConfigManagement.sidebar.systemConfigAffiliateList",
        path: ROUTES.SYSTEM_CONFIG_AFFILIATE_MANAGEMENT,
        icon: <DeploymentUnitOutlined />,
        permission: PERMISSIONS_KEY.system_config.view_system_configs.name,
      },
      {
        parentActiveKey: "system_config_management",
        key: ROUTES.SYSTEM_CONFIG_SEO_MANAGEMENT,
        label: "systemConfigManagement.sidebar.systemConfigSEOList",
        path: ROUTES.SYSTEM_CONFIG_SEO_MANAGEMENT,
        icon: <DeploymentUnitOutlined />,
        permission: PERMISSIONS_KEY.system_config.view_system_configs.name,
      },
    ],
  },
];

export const MEDIA_MANAGEMENT_MENU: Menu[] = [
  {
    parentActiveKey: "media_management",
    key: "GROUP_MEDIA_MANAGEMENT",
    label: "mediaManagement.title",
    path: "#",
    icon: <CloudServerOutlined />,
    permission: PERMISSIONS_KEY.system_config.view_system_configs.name,
    children: [
      {
        parentActiveKey: "media_management",
        key: ROUTES.MEDIA_MANAGEMENT,
        label: "mediaManagement.sidebar.mediaManagement",
        path: ROUTES.MEDIA_MANAGEMENT,
        icon: <FolderOutlined />,
        permission: PERMISSIONS_KEY.system_config.view_system_configs.name,
      },
    ],
  },
];
