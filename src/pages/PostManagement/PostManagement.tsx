import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Input,
  message,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  type TableProps,
} from "antd";
import dayjs from "dayjs";
import { isAxiosError } from "axios";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { postApi, type PostQuery } from "~/apis/PostApi/PostApi";
import ActionPermission from "~/components/ActionPermission/ActionPermission";
import PermissionGate from "~/components/PermissionGate/PermissionGate";
import { PERMISSIONS_KEY } from "~/constant/Permissions";
import { ROUTES } from "~/constant/Routes";
import type { ApiErrorResponse } from "~/types";
import type { Post } from "~/types/Post";
import { PostStatus } from "~/types/Post";

interface StatusOption {
  value: PostStatus;
  label: string;
  color: string;
}

export default function PostManagement() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Post[]>([]);
  const [query, setQuery] = useState<PostQuery>({
    page: 1,
    limit: 10,
  });
  const [total, setTotal] = useState(0);

  const statusOptions: StatusOption[] = useMemo(
    () => [
      {
        value: PostStatus.Draft,
        label: t("postManagement.status.draft"),
        color: "default",
      },
      {
        value: PostStatus.Published,
        label: t("postManagement.status.published"),
        color: "green",
      },
      {
        value: PostStatus.Archived,
        label: t("postManagement.status.archived"),
        color: "volcano",
      },
    ],
    [t]
  );

  const fetchData = async (params: PostQuery) => {
    setLoading(true);
    try {
      const res = await postApi.getAll(params);
      setData(res.data.result);
      setTotal(res.data.meta.total);
    } catch (error) {
      if (isAxiosError<ApiErrorResponse>(error) && error.response) {
        message.error(t(error.response.data.message));
      } else {
        message.error(t("common.messages.somethingWentWrong"));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const handleDelete = async (id: number) => {
    try {
      await postApi.delete(id);
      message.success(t("common.messages.deleteSuccess"));
      setData((prev) => prev.filter((item) => item.id !== id));
      setTotal((prev) => prev - 1);
    } catch (error) {
      if (isAxiosError<ApiErrorResponse>(error) && error.response) {
        message.error(t(error.response.data.message));
      } else {
        message.error(t("common.messages.somethingWentWrong"));
      }
    }
  };

  const columns: TableProps<Post>["columns"] = [
    {
      title: t("postManagement.table.title"),
      dataIndex: "title",
      key: "title",
    },
    {
      title: t("postManagement.table.status"),
      dataIndex: "status",
      key: "status",
      render: (value) => {
        const option = statusOptions.find((opt) => opt.value === value);
        return (
          <Tag color={option?.color || "default"}>{option?.label || value}</Tag>
        );
      },
    },
    {
      title: t("postManagement.table.author"),
      key: "author",
      render: (_, record) => record.author?.fullName || "-",
    },
    {
      title: t("postManagement.table.publishedAt"),
      dataIndex: "publishedAt",
      key: "publishedAt",
      render: (value) =>
        value ? dayjs(value).format("DD/MM/YYYY HH:mm") : "-",
    },
    {
      title: t("postManagement.table.viewCount"),
      dataIndex: "viewCount",
      key: "viewCount",
    },
    {
      title: t("common.fields.action"),
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <ActionPermission permission={PERMISSIONS_KEY.post.edit_post.name}>
            <Button icon={<EditOutlined />} type="primary" size="small">
              <Link to={ROUTES.POST_EDIT.replace(":id", record.id.toString())}>
                {t("common.actions.edit")}
              </Link>
            </Button>
          </ActionPermission>
          <ActionPermission permission={PERMISSIONS_KEY.post.delete_post.name}>
            <Popconfirm
              title={t("common.actions.deleteConfirm")}
              description={t("common.actions.deleteDescription")}
              onConfirm={() => handleDelete(record.id)}
              cancelText={t("common.actions.cancel")}
              okText={t("common.actions.delete")}
            >
              <Button icon={<DeleteOutlined />} danger size="small">
                {t("common.actions.delete")}
              </Button>
            </Popconfirm>
          </ActionPermission>
        </Space>
      ),
    },
  ];

  return (
    <section>
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <Input.Search
            allowClear
            placeholder={t("postManagement.searchPlaceholder")}
            onSearch={(value) =>
              setQuery((prev) => ({
                ...prev,
                search: value || undefined,
                page: 1,
              }))
            }
            style={{ minWidth: 240 }}
          />
          <Select
            allowClear
            placeholder={t("postManagement.status.placeholder")}
            options={statusOptions.map((option) => ({
              value: option.value,
              label: option.label,
            }))}
            onChange={(value) =>
              setQuery((prev) => ({ ...prev, status: value, page: 1 }))
            }
            style={{ minWidth: 180 }}
          />
        </div>
        <PermissionGate permissions={[PERMISSIONS_KEY.post.create_post.name]}>
          <Button type="primary" icon={<PlusOutlined />}>
            <Link to={ROUTES.POST_CREATE}>
              {t("postManagement.createButton")}
            </Link>
          </Button>
        </PermissionGate>
      </div>
      <Table<Post>
        columns={columns}
        dataSource={data}
        loading={loading}
        rowKey={(record) => record.id}
        pagination={{
          current: query.page,
          pageSize: query.limit,
          total,
          showSizeChanger: true,
          onChange: (page, pageSize) =>
            setQuery((prev) => ({ ...prev, page, limit: pageSize })),
        }}
      />
    </section>
  );
}
