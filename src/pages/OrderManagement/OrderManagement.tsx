import { EyeOutlined, PrinterOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Descriptions,
  Drawer,
  message,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  type TableProps,
} from "antd";
import { isAxiosError } from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { orderApi } from "~/apis/OrderApi";
import type { PaginationQuery } from "~/types";
import { InvoiceStatus } from "~/types/Invoice";
import type { Order } from "~/types/Order";
import { OrderStatus } from "~/types/Order";
import type { OrderItem } from "~/types/OrderItem";
import { PaymentMethod, PaymentStatus } from "~/types/Payment";

const { Text } = Typography;

export default function OrderManagement() {
  const { t } = useTranslation();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [data, setData] = useState<Order[]>([]);
  const [pagination, setPagination] = useState<PaginationQuery>({
    page: 1,
    limit: 10,
  });
  const [total, setTotal] = useState(0);

  const fetchData = async (params: PaginationQuery) => {
    setFetching(true);

    try {
      const res = await orderApi.getAll(params);
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

  const getOrderStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return "orange";
      case OrderStatus.CONFIRMED:
        return "blue";
      case OrderStatus.PREPARING:
        return "cyan";
      case OrderStatus.SHIPPING:
        return "purple";
      case OrderStatus.DELIVERED:
        return "green";
      case OrderStatus.CANCELLED:
        return "red";
      default:
        return "default";
    }
  };

  const getPaymentStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.PENDING:
        return "orange";
      case PaymentStatus.COMPLETED:
        return "green";
      case PaymentStatus.FAILED:
        return "red";
      case PaymentStatus.REFUNDED:
        return "purple";
      default:
        return "default";
    }
  };

  const getInvoiceStatusColor = (status: InvoiceStatus) => {
    switch (status) {
      case InvoiceStatus.UNPAID:
        return "red";
      case InvoiceStatus.PAID:
        return "green";
      case InvoiceStatus.CANCELLED:
        return "orange";
      default:
        return "default";
    }
  };

  const handleViewDetail = async (order: Order) => {
    setDetailDrawerOpen(true);
    setDetailLoading(true);
    setSelectedOrder(null);

    try {
      const res = await orderApi.detail(order.id);
      setSelectedOrder(res.data);
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        message.error(error.response.data.message);
      }
      setDetailDrawerOpen(false);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleStatusChange = async (
    orderId: number,
    newStatus: OrderStatus
  ) => {
    try {
      await orderApi.updateStatus(orderId, newStatus);
      message.success(t("orderManagement.messages.updateStatusSuccess"));
      fetchData(pagination);
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        message.error(error.response.data.message);
      } else {
        message.error(t("orderManagement.messages.error"));
      }
    }
  };

  const columns: TableProps<Order>["columns"] = [
    {
      title: t("orderManagement.columns.orderNumber"),
      dataIndex: "orderNumber",
      key: "orderNumber",
      fixed: "left",
      width: 150,
      render: (text: string) => (
        <Text strong className="text-blue-600">
          {text}
        </Text>
      ),
    },
    {
      title: t("orderManagement.columns.customer"),
      key: "customer",
      width: 200,
      render: (_, record) => (
        <div>
          <div className="font-medium">{record.customerInfo.fullName}</div>
          <div className="text-gray-500 text-sm">
            {record.customerInfo.phone}
          </div>
          {record.customerInfo.email && (
            <div className="text-gray-500 text-sm">
              {record.customerInfo.email}
            </div>
          )}
        </div>
      ),
    },
    {
      title: t("orderManagement.columns.totalAmount"),
      dataIndex: "totalAmount",
      key: "totalAmount",
      width: 120,
      render: (amount: number) => (
        <Text strong className="text-green-600">
          {amount.toLocaleString()}
        </Text>
      ),
    },
    {
      title: t("orderManagement.columns.status"),
      dataIndex: "status",
      key: "status",
      width: 180,
      render: (status: OrderStatus, record) => (
        <Select
          value={status}
          style={{ width: 150 }}
          onChange={(value) => handleStatusChange(record.id, value)}
          options={Object.values(OrderStatus).map((s) => ({
            value: s,
            label: (
              <Tag color={getOrderStatusColor(s)}>
                {t(`orderManagement.status.${s}`)}
              </Tag>
            ),
          }))}
        />
      ),
    },
    {
      title: t("orderManagement.columns.createdAt"),
      dataIndex: "createdAt",
      key: "createdAt",
      width: 150,
      render: (date: Date) => dayjs(date).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: t("orderManagement.columns.action"),
      key: "action",
      fixed: "right",
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Button
            icon={<EyeOutlined />}
            size="small"
            onClick={() => handleViewDetail(record)}
          >
            {t("orderManagement.actions.view")}
          </Button>
        </Space>
      ),
    },
  ];

  const renderOrderItems = (items: OrderItem[]) => {
    const itemColumns = [
      {
        title: t("orderManagement.items.product"),
        key: "product",
        render: (_: any, item: OrderItem) => (
          <div className="flex gap-3">
            <img
              src={item.product.thumbnailUrl}
              alt={item.productName}
              className="w-12 h-12 object-cover rounded"
            />
            <div>
              <div className="font-medium">{item.productName}</div>
              <div className="text-gray-500 text-sm">
                {item.product.brandName} - {item.product.manufacturer}
              </div>
            </div>
          </div>
        ),
      },
      {
        title: t("orderManagement.items.quantity"),
        dataIndex: "quantity",
        key: "quantity",
        width: 80,
      },
      {
        title: t("orderManagement.items.unitPrice"),
        dataIndex: "unitPrice",
        key: "unitPrice",
        width: 120,
        render: (price: number) => price.toLocaleString(),
      },
      {
        title: t("orderManagement.items.totalPrice"),
        dataIndex: "totalPrice",
        key: "totalPrice",
        width: 120,
        render: (price: number) => <Text strong>{price.toLocaleString()}</Text>,
      },
    ];

    return (
      <Table
        columns={itemColumns}
        dataSource={items}
        pagination={false}
        size="small"
        rowKey="id"
      />
    );
  };

  return (
    <section className="p-6">
      <Table<Order>
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={fetching}
        scroll={{ x: 1200 }}
        pagination={{
          current: pagination.page,
          pageSize: pagination.limit,
          total: total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} ${t(
              "orderManagement.pagination.of"
            )} ${total} ${t("orderManagement.pagination.orders")}`,
          onChange: (page, pageSize) => {
            setPagination({ page, limit: pageSize });
          },
        }}
      />

      <Drawer
        title={`${t("orderManagement.detail.title")}: ${
          selectedOrder?.orderNumber || ""
        }`}
        width={800}
        onClose={() => setDetailDrawerOpen(false)}
        open={detailDrawerOpen}
        loading={detailLoading}
        extra={
          <Space>
            <Button icon={<PrinterOutlined />}>
              {t("orderManagement.detail.printInvoice")}
            </Button>
          </Space>
        }
      >
        {selectedOrder && (
          <div className="flex flex-col gap-2 space-y-8">
            {/* Thông tin đơn hàng */}
            <Card title={t("orderManagement.detail.orderInfo")} size="small">
              <Descriptions column={2} size="small">
                <Descriptions.Item
                  label={t("orderManagement.columns.orderNumber")}
                >
                  <Text strong>{selectedOrder.orderNumber}</Text>
                </Descriptions.Item>
                <Descriptions.Item label={t("orderManagement.detail.title")}>
                  <Tag color={getOrderStatusColor(selectedOrder.status)}>
                    {t(`orderManagement.status.${selectedOrder.status}`)}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item
                  label={t("orderManagement.columns.createdAt")}
                >
                  {dayjs(selectedOrder.createdAt).format("DD/MM/YYYY HH:mm")}
                </Descriptions.Item>
                <Descriptions.Item
                  label={t("orderManagement.detail.lastUpdated")}
                >
                  {dayjs(selectedOrder.updatedAt).format("DD/MM/YYYY HH:mm")}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* Thông tin khách hàng */}
            <Card title={t("orderManagement.detail.customerInfo")} size="small">
              <Descriptions column={2} size="small">
                <Descriptions.Item label={t("orderManagement.detail.fullName")}>
                  {selectedOrder.customerInfo.fullName}
                </Descriptions.Item>
                <Descriptions.Item label={t("orderManagement.detail.phone")}>
                  {selectedOrder.customerInfo.phone}
                </Descriptions.Item>
                <Descriptions.Item label={t("orderManagement.detail.email")}>
                  {selectedOrder.customerInfo.email ||
                    t("orderManagement.messages.noEmail")}
                </Descriptions.Item>
                <Descriptions.Item label={t("orderManagement.detail.note")}>
                  {selectedOrder.customerInfo.note ||
                    t("orderManagement.messages.noNote")}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* Địa chỉ giao hàng */}
            <Card
              title={t("orderManagement.detail.shippingAddress")}
              size="small"
            >
              <Text>
                {selectedOrder.shippingAddress.street},{" "}
                {selectedOrder.shippingAddress.ward},{" "}
                {selectedOrder.shippingAddress.district},{" "}
              </Text>
            </Card>

            {/* Sản phẩm */}
            <Card title={t("orderManagement.detail.productList")} size="small">
              {renderOrderItems(selectedOrder.items)}
            </Card>

            {/* Thông tin thanh toán */}
            <Card title={t("orderManagement.detail.paymentInfo")} size="small">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Text>{t("orderManagement.detail.subtotal")}:</Text>
                  <Text>{selectedOrder.subtotal.toLocaleString()}</Text>
                </div>
                <div className="flex justify-between">
                  <Text>{t("orderManagement.detail.shippingFee")}:</Text>
                  <Text>{selectedOrder.shippingFee.toLocaleString()}</Text>
                </div>
                <div className="flex justify-between">
                  <Text>{t("orderManagement.detail.discount")}:</Text>
                  <Text className="text-red-500">
                    -{selectedOrder.discountAmount.toLocaleString()}
                  </Text>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <Text strong className="text-lg">
                      {t("orderManagement.detail.total")}:
                    </Text>
                    <Text strong className="text-lg text-green-600">
                      {selectedOrder.totalAmount.toLocaleString()}
                    </Text>
                  </div>
                </div>
                {selectedOrder.payments &&
                  selectedOrder.payments.length > 0 && (
                    <div className="mt-4">
                      <Descriptions column={1} size="small">
                        <Descriptions.Item
                          label={t("orderManagement.columns.paymentMethod")}
                        >
                          <Tag>
                            {selectedOrder.payments[0].method ===
                            PaymentMethod.COD
                              ? t("orderManagement.paymentMethod.cod")
                              : t(
                                  "orderManagement.paymentMethod.bank_transfer"
                                )}
                          </Tag>
                        </Descriptions.Item>
                        <Descriptions.Item
                          label={t("orderManagement.columns.paymentStatus")}
                        >
                          <Tag
                            color={getPaymentStatusColor(
                              selectedOrder.payments[0].status
                            )}
                          >
                            {selectedOrder.payments[0].status.toUpperCase()}
                          </Tag>
                        </Descriptions.Item>
                        {selectedOrder.payments[0].transactionId && (
                          <Descriptions.Item
                            label={t("orderManagement.detail.transactionId")}
                          >
                            {selectedOrder.payments[0].transactionId}
                          </Descriptions.Item>
                        )}
                      </Descriptions>
                    </div>
                  )}
              </div>
            </Card>

            {/* Thông tin hóa đơn */}
            {selectedOrder.invoice && (
              <Card
                title={t("orderManagement.detail.invoiceInfo")}
                size="small"
              >
                <Descriptions column={2} size="small">
                  <Descriptions.Item
                    label={t("orderManagement.detail.invoiceNumber")}
                  >
                    {selectedOrder.invoice.invoiceNumber}
                  </Descriptions.Item>
                  <Descriptions.Item label={t("orderManagement.detail.title")}>
                    <Tag
                      color={getInvoiceStatusColor(
                        selectedOrder.invoice.status
                      )}
                    >
                      {selectedOrder.invoice.status.toUpperCase()}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={t("orderManagement.detail.issueDate")}
                  >
                    {dayjs(selectedOrder.invoice.issueDate).format(
                      "DD/MM/YYYY"
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label={t("orderManagement.detail.total")}>
                    <Text strong>
                      {selectedOrder.invoice.totalAmount.toLocaleString()}
                    </Text>
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            )}
          </div>
        )}
      </Drawer>
    </section>
  );
}
