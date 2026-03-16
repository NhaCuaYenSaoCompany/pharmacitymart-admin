import { ReloadOutlined, SaveFilled } from "@ant-design/icons";
import { Button, message, Select, type TransferProps } from "antd";
import { isAxiosError } from "axios";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import type { Permission } from "~/apis/AuthApi/dto/res-login";
import { permissionApi } from "~/apis/PermissionApi/PermissionApi";
import { roleApi } from "~/apis/RoleApi/RoleApi";
import ActionPermission from "~/components/ActionPermission/ActionPermission";
import { PERMISSIONS_KEY } from "~/constant/Permissions";
import PermissionList from "~/pages/PermissionManage/components/PermissionList/PermissionList";
import type { ApiErrorResponse } from "~/types";
import type { Role } from "~/types/Role";

export default function PermissionManage() {
  const { t } = useTranslation();

  const { roleId } = useParams<{ roleId: string }>();
  const navigate = useNavigate();
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [rolePermissions, setRolePermissions] = useState<Permission[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [targetKeys, setTargetKeys] = useState<TransferProps["targetKeys"]>([]);
  const [role, setRole] = useState<Role | null>(null);
  const [permissionFetching, setPermissionFetching] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const getAllPermissions = useCallback(async () => {
    setPermissionFetching(true);
    try {
      const res = await permissionApi.getAllPermissions();
      setPermissions(res as Permission[]);
    } catch (error) {
      if (isAxiosError<ApiErrorResponse>(error)) {
        if (error.response) {
          message.error(t(error.response.data.message));
        }
      }
    } finally {
      setPermissionFetching(false);
    }
  }, [t]);

  useEffect(() => {
    getAllPermissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getDetailRole = useCallback(
    async (roleId: number) => {
      try {
        const res = await roleApi.getRoleById(Number(roleId));
        const initialPermissions = res.rolePermissions
          .map((rp) => rp.permission)
          .flat();
        setRolePermissions(initialPermissions);
        setRole(res);
      } catch (error) {
        if (isAxiosError<ApiErrorResponse>(error)) {
          if (error.response) {
            message.error(t(error.response.data.message));
          }
        }
      }
    },
    [t]
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await permissionApi.refreshPermission();
      getAllPermissions();
    } catch (error) {
      if (isAxiosError<ApiErrorResponse>(error)) {
        if (error.response) {
          message.error(t(error.response.data.message));
        }
      }
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (Number(roleId) !== -1 && roleId) {
      getDetailRole(Number(roleId));
    } else {
      // Clear role permissions when no role is selected or roleId is -1
      setRolePermissions([]);
    }
  }, [getDetailRole, roleId]);

  useEffect(() => {
    const getAllRoles = async () => {
      try {
        const res = await roleApi.getAllRoles({
          limit: 10000,
          page: 1,
        });
        setRoles(res.result);
      } catch (error) {
        if (isAxiosError<ApiErrorResponse>(error)) {
          if (error.response) {
            message.error(t(error.response.data.message));
          }
        }
      }
    };
    getAllRoles();
  }, [t]);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await roleApi.updateRolePermissions(Number(roleId), {
        name: role?.name || "",
        desc: role?.desc || "",
        permissionIds: targetKeys as number[],
      });

      message.success(t("permissionManagement.updateSuccess"));
    } catch (error) {
      if (isAxiosError<ApiErrorResponse>(error)) {
        if (error.response) {
          message.error(t(error.response.data.message));
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <section className="mb-4">
        <div className="flex justify-between gap-1">
          <Select
            value={
              Number(roleId) === -1
                ? undefined
                : roleId
                ? Number(roleId)
                : undefined
            }
            style={{ width: 200 }}
            showSearch
            allowClear
            optionFilterProp="label"
            placeholder={t("permissionManagement.selectRole")}
            options={roles.map((role) => ({
              value: role.id,
              label: role.name,
            }))}
            onChange={(value) => {
              if (value) {
                navigate(`/permission-management/${value}`);
              } else {
                navigate("/permission-management/-1");
              }
            }}
            onClear={() => {
              // Clear selection and navigate to base page
              navigate("/permission-management/-1");
            }}
          ></Select>

          <ActionPermission
            permission={PERMISSIONS_KEY.permission.refresh_permissions.name}
          >
            <Button
              type="primary"
              icon={<ReloadOutlined />}
              onClick={handleRefresh}
              loading={refreshing}
            >
              {t("common.actions.refresh")}
            </Button>
          </ActionPermission>
        </div>
      </section>
      <section className="mb-4">
        <PermissionList
          loading={permissionFetching}
          data={permissions}
          initSelected={rolePermissions}
          targetKeys={targetKeys}
          setTargetKeys={setTargetKeys}
        />
      </section>
      <section>
        <div className="flex justify-end">
          <ActionPermission
            permission={PERMISSIONS_KEY.role.update_role_permission.name}
          >
            <Button
              loading={submitting}
              type="primary"
              onClick={() => {
                handleSubmit();
              }}
              icon={<SaveFilled />}
            >
              {t("common.actions.save")}
            </Button>
          </ActionPermission>
        </div>
      </section>
    </>
  );
}
