# Pharmacy Mart Admin - AI Coding Agent Instructions

## Project Overview
React 19 + TypeScript + Vite admin dashboard for a pharmacy e-commerce platform. Built with Ant Design v5, Redux Toolkit, and TailwindCSS 4. Features granular role-based access control (RBAC) with permission-gated routes and components.

## Architecture Patterns

### Permission-Based Access Control
**Core Principle**: Every feature requires explicit permission checks at both route and component levels.

- **Route Protection**: Use `PermissionRoute` wrapper in [src/routes/RouteConfig.tsx](src/routes/RouteConfig.tsx)
  ```tsx
  permissions: [PERMISSIONS_KEY.product.view_products.name]
  ```
- **Component Protection**: Wrap UI elements with `PermissionGate` from [src/components/PermissionGate/PermissionGate.tsx](src/components/PermissionGate/PermissionGate.tsx)
  ```tsx
  <PermissionGate permissions={[PERMISSIONS_KEY.category.create_category.name]}>
    <Button>Create</Button>
  </PermissionGate>
  ```
- **Permission Definitions**: All permissions defined in [src/constant/Permissions.ts](src/constant/Permissions.ts) with structure:
  ```typescript
  {groupName}.{action}_{resource}
  // Example: category.create_category, product.view_products
  ```
- **Special Case**: User `root` bypasses all permission checks

### State Management (Redux Toolkit + Redux Persist)
- **Store Config**: [src/store.ts](src/store.ts) - Two main slices: `auth` and `permissions`
- **Persistence**: Redux state persists to localStorage via `redux-persist`
- **Hook Usage**: Always use typed hooks from [src/hooks/redux.ts](src/hooks/redux.ts):
  ```tsx
  import { useAppSelector, useAppDispatch } from '~/hooks/redux';
  ```
- **Mock Middleware**: `mockPermissionsMiddleware` intercepts permission-related actions (dev/testing only)

### API Communication
- **Axios Wrapper**: [src/configs/AxiosClient.ts](src/configs/AxiosClient.ts) - Use `axiosClient` methods, never raw axios
- **Token Refresh**: Automatic JWT refresh on expiry before request execution
- **Request Interceptors**: 
  - Injects `Authorization: Bearer <token>` header
  - Sets `Accept-Language` header from i18n context
- **API Structure**: Each resource has dedicated folder in `src/apis/` with:
  - Main API file (e.g., `ProductApi.tsx`)
  - `dto/` subfolder for request/response types
  - Example: [src/apis/ProductApi/ProductApi.tsx](src/apis/ProductApi/ProductApi.tsx)
- **Response Format**: All APIs return `ResponseApi<T>` type:
  ```typescript
  { statusCode: number; message: string; data: T }
  ```

### Routing & Menu Integration
- **Route Configuration**: [src/routes/RouteConfig.tsx](src/routes/RouteConfig.tsx) defines all routes with:
  - `permissions`: Array of required permission keys
  - `layout`: Usually `DefaultLayout` or `null` for public routes
  - `menus`: Links to sidebar menu definitions
  - `breadcrumb`: Breadcrumb navigation items
- **Menu Definitions**: [src/constant/MenuRoutes.tsx](src/constant/MenuRoutes.tsx) - Menu items must include:
  - `permission`: Permission key to control visibility
  - `parentActiveKey`: Groups related menu items
  - Translation keys for labels (e.g., `"staffManagement.title"`)

### Internationalization (i18n)
- **Setup**: [src/i18n.ts](src/i18n.ts) - Supports `en`, `vi`, `zh` via i18next
- **Translation Files**: Located in `public/locales/{lang}/translation.json`
- **Usage in Components**:
  ```tsx
  import { useTranslation } from 'react-i18next';
  const { t } = useTranslation();
  t('staffManagement.sidebar.staffList')
  ```
- **API Language**: Automatically sent via `Accept-Language` header in AxiosClient

### Type System Conventions
- **Base Entities**: Most domain models extend `BaseEntity` from [src/types/BaseEntity.ts](src/types/BaseEntity.ts) (includes `id`, `createdAt`, `updatedAt`)
- **Import Alias**: Use `~/` for absolute imports (configured in [vite.config.ts](vite.config.ts))
  ```tsx
  import { Product } from '~/types/Product';
  import { productApi } from '~/apis/ProductApi/ProductApi';
  ```
- **Pagination Types**: Use `PaginationQuery` for requests, `PaginationApi<T>` for responses
- **API DTOs**: Request/response types in `dto/` folders (e.g., `ReqCreateProductDto`, `ReqEditProductDto`)

### Theme System
- **Context**: [src/contexts/ThemeContext.tsx](src/contexts/ThemeContext.tsx) - Supports `light` and `dark` themes
- **Hook**: `useTheme()` from [src/hooks/useTheme.ts](src/hooks/useTheme.ts)
- **TailwindCSS**: Version 4.x with Vite plugin - classes apply dynamically based on theme
- **Ant Design Integration**: Theme tokens configured in theme provider

## Development Workflows

### Running the Application
```bash
npm run start:dev  # Dev server on port 7001
npm run build      # TypeScript compile + Vite build
npm run preview    # Preview production build on port 7001
```

### Environment Variables
Define in `.env` file (see [src/constant/Env.ts](src/constant/Env.ts)):
- `VITE_API_URL`: Backend API base URL
- `VITE_API_EXCHANGERATE_URL`: Exchange rate service URL
- `VITE_API_KEY_TINY_MCE`: TinyMCE editor API key

### Adding New Features
1. **Define Permissions**: Add to [src/constant/Permissions.ts](src/constant/Permissions.ts)
2. **Create API Module**: Follow structure in `src/apis/{ResourceName}/`
   - Main API file with CRUD methods
   - DTOs in `dto/` subfolder
3. **Define Types**: Add interfaces to `src/types/{Resource}.ts`
4. **Create Routes**: Add to [src/routes/RouteConfig.tsx](src/routes/RouteConfig.tsx) with permission arrays
5. **Add Menu Items**: Update [src/constant/MenuRoutes.tsx](src/constant/MenuRoutes.tsx)
6. **Build Pages**: 
   - Create folder in `src/pages/{FeatureName}/`
   - Use Ant Design components for UI
   - Wrap with `PermissionGate` for conditional rendering
   - Implement manual state management with `useState` (no React Query or TanStack Query in this project)
7. **Add Translations**: Update all locale files in `public/locales/`

### Page Component Patterns
Pages typically follow this structure (see [src/pages/StaffManage/StaffManage.tsx](src/pages/StaffManage/StaffManage.tsx)):
```tsx
- useState for local state (loading, data, pagination)
- useCallback for API calls
- useEffect for initial data fetching
- Ant Design Table/Form components
- PermissionGate for action buttons
```

### File Upload Handling
- **Component**: `UploadImage` from [src/components/UploadImage/](src/components/UploadImage/)
- **API**: Use `axiosClient.upload()` method for multipart/form-data
- **Media Management**: Dedicated media library with folder structure (see [src/pages/MediaManagement/](src/pages/MediaManagement/))

## Key Technical Constraints
- **No React Query**: Use manual `useState` + `useCallback` for data fetching
- **Ant Design Forms**: Use `Form.useForm()` hook, not uncontrolled forms
- **Permission Checks**: MUST be explicit - never assume access
- **TypeScript**: Strict mode enabled - all types must be defined
- **Import Paths**: Always use `~/` alias, never relative imports across modules
- **Socket.io**: Available for real-time features (socket.io-client v4.8.1)

## Common Pitfalls
1. **Forgetting Permission Checks**: Always add permissions to routes AND wrap sensitive UI with `PermissionGate`
2. **Direct Axios Usage**: Use `axiosClient` wrapper to ensure interceptors fire
3. **Translation Keys**: Must exist in ALL locale files (`en`, `vi`, `zh`) or fallback to key string
4. **Menu-Route Mismatch**: Menu `path` must exactly match route `path` in RouteConfig
5. **Redux State Mutations**: Use Redux Toolkit slice reducers - never mutate state directly

## Reference Documentation
- **API Spec**: [POST_API_DOCUMENTATION.md](POST_API_DOCUMENTATION.md) - Detailed API endpoint documentation
- **README**: [README.md](README.md) - Basic setup instructions (generic Vite template)
