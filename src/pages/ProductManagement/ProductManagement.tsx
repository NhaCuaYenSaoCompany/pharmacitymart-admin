import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import {
  Button,
  Image,
  message,
  Popconfirm,
  Space,
  Table,
  type TableProps,
} from "antd";
import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { productApi } from "~/apis/ProductApi/ProductApi";
import ActionPermission from "~/components/ActionPermission/ActionPermission";
import { PERMISSIONS_KEY } from "~/constant/Permissions";
import { ROUTES } from "~/constant/Routes";
import type { ApiErrorResponse, PaginationQuery } from "~/types";
import type { Product } from "~/types/Product";

export default function ProductManagement() {
  const { t } = useTranslation();
  const [fetching, setFetching] = useState(false);
  const [data, setData] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<PaginationQuery>({
    page: 1,
    limit: 10,
  });
  const [total, setTotal] = useState(0);

  const fetchData = async (params: PaginationQuery) => {
    setFetching(true);

    try {
      const res = await productApi.getAll(params);
      setData(res.data.result);
      setTotal(res.data.meta.total);
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        message.error(error.response.data.message);
      }
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchData(pagination);
  }, [pagination]);

  const handleDelete = async (id: number) => {
    try {
      await productApi.delete(id);
      message.success(t("common.messages.deleteSuccess"));
      setData((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      if (isAxiosError<ApiErrorResponse>(error) && error.response) {
        message.error(t(error.response.data.message));
      }
    }
  };

  const columns: TableProps<Product>["columns"] = [
    {
      title: t("productManagement.table.name"),
      dataIndex: "name",
      key: "name",
    },
    {
      title: t("productManagement.table.shortDescription"),
      dataIndex: "shortDescription",
      key: "shortDescription",
    },
    {
      title: t("productManagement.table.thumbnail"),
      dataIndex: "thumbnailUrl",
      key: "thumbnailUrl",
      render: (text: string) => (
        <Image
          alt="thumbnail"
          src={text}
          width={50}
          height={50}
          style={{ objectFit: "cover" }}
        />
      ),
    },
    {
      title: t("productManagement.table.price"),
      dataIndex: "price",
      key: "price",
    },
    {
      title: t("productManagement.table.stock"),
      dataIndex: "stock",
      key: "stock",
    },
    {
      title: t("common.fields.action"),
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <ActionPermission
            permission={PERMISSIONS_KEY.category.view_detail_category.name}
          >
            <Button icon={<EditOutlined />} type="primary" size="small">
              <Link
                to={ROUTES.PRODUCT_EDIT.replace(":id", record.id.toString())}
              >
                {t("common.actions.edit")}
              </Link>
            </Button>
          </ActionPermission>
          <ActionPermission
            permission={PERMISSIONS_KEY.category.delete_category.name}
          >
            <Popconfirm
              title={t("common.actions.deleteConfirm")}
              description={t("common.actions.deleteDescription")}
              onConfirm={() => {
                handleDelete(record.id);
              }}
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
      <div className="mb-4">
        <div className="flex items-center justify-end">
          <Button type="primary">
            <Link to={ROUTES.PRODUCT_CREATE}>{t("common.actions.add")}</Link>
          </Button>
        </div>
      </div>
      <div>
        <Table<Product>
          columns={columns}
          dataSource={data}
          loading={fetching}
          pagination={{
            current: pagination.page,
            pageSize: pagination.limit,
            total: total,
            showSizeChanger: true,
            onChange(page, pageSize) {
              setPagination({ page, limit: pageSize });
            },
          }}
          rowKey={(record) => record.id}
        />
      </div>
    </section>
  );
}
