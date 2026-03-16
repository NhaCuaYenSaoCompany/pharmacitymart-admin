import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Space, Table, Tag, type TableProps } from "antd";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { systemUserApi } from "~/apis/SystemUserApi/SystemUserApi";
import ActionPermission from "~/components/ActionPermission/ActionPermission";
import { PERMISSIONS_KEY } from "~/constant/Permissions";
import { ROUTES } from "~/constant/Routes";
import { useAppSelector } from "~/hooks/redux";
import type { PaginationQuery } from "~/types/PaginationApi";
import type { SystemUser } from "~/types/SystemUser";

interface StaffManageListProps {
  data: SystemUser[];
  pagination: PaginationQuery;
  total: number;
  loading: boolean;
}

export default function StaffManageList({
  data,
  pagination,
  loading,
  total,
}: StaffManageListProps) {
  const { t } = useTranslation();
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const columns: TableProps<SystemUser>["columns"] = [
    {
      title: t("staffManagement.table.columns.fullname"),
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: t("staffManagement.table.columns.username"),
      dataIndex: "username",
      key: "username",
    },
    {
      title: t("staffManagement.table.columns.roleName"),
      key: "roleName",
      render: (_, record) => {
        if (record.userRoles.length <= 0) {
          return (
            <Tag color="red">
              <b>ROOT</b>
            </Tag>
          );
        }
        return (
          <Tag color="green">
            <b>{record.userRoles[0]?.role.name.toUpperCase()}</b>
          </Tag>
        );
      },
    },
    {
      title: t("common.fields.action"),
      key: "action",
      render: (_, record) => {
        return (
          <Space>
            <ActionPermission
              permission={
                PERMISSIONS_KEY.system_user.view_detail_system_user.name
              }
            >
              <Button
                icon={<EditOutlined />}
                color="blue"
                variant="solid"
                disabled={
                  record.username.toUpperCase() === "ROOT" ||
                  record.username === user?.username
                }
                size="small"
                onClick={() => {
                  navigate(
                    ROUTES.EDIT_STAFF.replace(":id", record.id.toString())
                  );
                }}
              >
                {t("common.actions.edit")}
              </Button>
            </ActionPermission>
            <ActionPermission
              permission={PERMISSIONS_KEY.system_user.delete_system_user.name}
            >
              <Button
                disabled={
                  record.username.toUpperCase() === "ROOT" ||
                  record.username === user?.username
                }
                icon={<DeleteOutlined />}
                color="danger"
                variant="solid"
                onClick={async () => {
                  await systemUserApi.deleteSystemUser(record.id);
                }}
                size="small"
              >
                {t("common.actions.delete")}
              </Button>
            </ActionPermission>
          </Space>
        );
      },
    },
  ];

  return (
    <>
      <Table<SystemUser>
        rowKey={"id"}
        columns={columns}
        dataSource={data}
        pagination={{
          current: pagination.page,
          pageSize: pagination.limit,
          total: total,
        }}
        loading={loading}
      />
    </>
  );
}
