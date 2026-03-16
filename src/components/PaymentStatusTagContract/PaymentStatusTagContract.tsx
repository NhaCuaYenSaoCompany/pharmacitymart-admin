import { Tag } from "antd";
import { useTranslation } from "react-i18next";

export interface PaymentStatusTagContractProps {
  status: string;
}

export default function PaymentStatusTagContract({
  status,
}: PaymentStatusTagContractProps) {
  const { t } = useTranslation();

  switch (status) {
    case "not_disbursed":
      return (
        <Tag color="gray">
          {t("contractManage.paymentStatus.not_disbursed")}
        </Tag>
      );
    case "disbursed":
      return (
        <Tag color="blue">{t("contractManage.paymentStatus.disbursed")}</Tag>
      );
    case "partial_paid":
      return (
        <Tag color="orange">
          {t("contractManage.paymentStatus.partial_paid")}
        </Tag>
      );
    case "fully_paid":
      return (
        <Tag color="green">{t("contractManage.paymentStatus.fully_paid")}</Tag>
      );
    case "overdue":
      return (
        <Tag color="volcano">{t("contractManage.paymentStatus.overdue")}</Tag>
      );
    case "default":
      return <Tag color="red">{t("contractManage.paymentStatus.default")}</Tag>;
    default:
      return <Tag>{status}</Tag>;
  }
}
