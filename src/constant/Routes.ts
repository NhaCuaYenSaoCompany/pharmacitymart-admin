const PRIVATE_ROUTE = {
  DASHBOARD: "/",

  // GROUP CATEGORY MANAGEMENT
  CATEGORY_MANAGEMENT: "/category-management",
  CATEGORY_CREATE: "/category-create",
  CATEGORY_EDIT: "/category-edit/:id",

  // GROUP PRODUCT MANAGEMENT
  PRODUCT_MANAGEMENT: "/product-management",
  PRODUCT_CREATE: "/product-create",
  PRODUCT_EDIT: "/product-edit/:id",

  // GROUP POST MANAGEMENT
  POST_MANAGEMENT: "/post-management",
  POST_CREATE: "/post-create",
  POST_EDIT: "/post-edit/:id",

  // GROUP ORDER MANAGEMENT
  ORDER_MANAGEMENT: "/order-management",
  ORDER_DETAIL: "/order-detail/:id",
  

  // GROUP SYSTEM CONFIG MANAGEMENT
  SYSTEM_CONFIG_MANAGEMENT: "/system-config-management",
  SYSTEM_CONFIG_AFFILIATE_MANAGEMENT: "/system-config-affiliate-management",
  SYSTEM_CONFIG_SEO_MANAGEMENT: "/system-config-seo-management",
  SYSTEM_CONFIG_CREATE: "/system-config-create",

  // GROUP MEDIA MANAGEMENT
  MEDIA_MANAGEMENT: "/media-management",

  // GROUP STAFF MANAGEMENT
  STAFF_MANAGEMENT: "/staff-management",
  ADD_STAFF: "/add-staff",
  EDIT_STAFF: "/edit-staff/:id",
  STAFF_POSITION: "/staff-position",
  PERMISSION_MANAGEMENT: "/permission-management/:roleId",

  UNAUTHORIZED: "/unauthorized",
};

const PUBLIC_ROUTE = {
  LOGIN: "/login",
  NOT_FOUND: "*",
};

export const ROUTES = { ...PRIVATE_ROUTE, ...PUBLIC_ROUTE };
