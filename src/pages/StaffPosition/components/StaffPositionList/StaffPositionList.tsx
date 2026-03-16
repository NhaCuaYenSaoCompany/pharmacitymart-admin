import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import {
  Button,
  Popconfirm,
  Table,
  Tooltip,
  type PopconfirmProps,
  type TableProps,
} from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import ActionPermission from "~/components/ActionPermission/ActionPermission";
import { PERMISSIONS_KEY } from "~/constant/Permissions";
import { ROUTES } from "~/constant/Routes";
import type { Role } from "~/types/Role";

export interface StaffPositionListProps {
  data: Role[];
  loading: boolean;
  onDelete?: (roleId: number) => Promise<void>;
  onEdit?: (role: Role) => void;
}

export default function StaffPositionList({
  data,
  loading,
  onDelete,
  onEdit,
}: StaffPositionListProps) {
  const { t } = useTranslation();
  const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set());
  const navigate = useNavigate();

  const confirmDelete = async (record: Role) => {
    if (onDelete) {
      setDeletingIds((prev) => new Set(prev).add(record.id));
      try {
        await onDelete(record.id);
      } finally {
        setDeletingIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(record.id);
          return newSet;
        });
      }
    }
  };

  const cancelDelete: PopconfirmProps["onCancel"] = () => {};

  const columns: TableProps<Role>["columns"] = [
    {
      title: t("staffManagement.fields.name"),
      dataIndex: "name",
      key: "name",
    },
    {
      title: t("staffManagement.fields.desc"),
      dataIndex: "desc",
      key: "desc",
    },
    {
      title: t("common.fields.createdAt"),
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => {
        return dayjs(text).format("YYYY-MM-DD HH:mm:ss");
      },
    },
    {
      title: t("common.fields.updatedAt"),
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (text) => {
        return dayjs(text).format("YYYY-MM-DD HH:mm:ss");
      },
    },
    {
      title: t("common.fields.action"),
      key: "action",
      render: (_, record) => {
        return (
          <div className="flex items-center gap-2">
            <ActionPermission
              permission={PERMISSIONS_KEY.role.view_detail_role.name}
            >
              <Tooltip title={t("common.actions.edit")}>
                <Button
                  icon={<EditOutlined />}
                  type="primary"
                  disabled={deletingIds.has(record.id)}
                  onClick={() => onEdit?.(record)}
                ></Button>
              </Tooltip>
            </ActionPermission>

            <ActionPermission permission={"chua_co"}>
              <Tooltip title={t("common.actions.delete")}>
                <Popconfirm
                  title={t("staffPosition.messages.confirm.delete.title")}
                  description={t(
                    "staffPosition.messages.confirm.delete.content"
                  )}
                  onConfirm={() => {
                    confirmDelete(record);
                  }}
                  onCancel={cancelDelete}
                  okText={t("common.button.yes")}
                  cancelText={t("common.button.no")}
                >
                  <Button
                    icon={<DeleteOutlined />}
                    type="primary"
                    danger
                    loading={deletingIds.has(record.id)}
                    disabled={deletingIds.has(record.id)}
                  ></Button>
                </Popconfirm>
              </Tooltip>
            </ActionPermission>

            <ActionPermission
              permission={PERMISSIONS_KEY.permission.view_permissions.name}
            >
              <Tooltip title={t("staffPosition.button.editPermissions")}>
                <Button
                  icon={<EyeOutlined />}
                  type="default"
                  onClick={() => {
                    navigate(
                      ROUTES.PERMISSION_MANAGEMENT.replace(
                        ":roleId",
                        record.id.toString()
                      )
                    );
                  }}
                ></Button>
              </Tooltip>
            </ActionPermission>
          </div>
        );
      },
    },
  ];

  return (
    <Table<Role> columns={columns} dataSource={data} loading={loading}></Table>
  );
}
