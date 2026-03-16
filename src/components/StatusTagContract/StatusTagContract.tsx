import { Tag } from "antd";
import { useTranslation } from "react-i18next";

export interface StatusTagContractProps {
  status: string;
}

export default function StatusTagContract({ status }: StatusTagContractProps) {
  const { t } = useTranslation();

  switch (status) {
    case "pending":
      return <Tag color="gold">{t("contractManage.status.pending")}</Tag>;
    case "under_verification":
      return (
        <Tag color="blue">{t("contractManage.status.under_verification")}</Tag>
      );
    case "approved":
      return <Tag color="green">{t("contractManage.status.approved")}</Tag>;
    case "rejected":
      return <Tag color="red">{t("contractManage.status.rejected")}</Tag>;
    case "cancelled":
      return <Tag color="gray">{t("contractManage.status.cancelled")}</Tag>;
    case "completed":
      return <Tag color="purple">{t("contractManage.status.completed")}</Tag>;
    default:
      return <Tag>{status}</Tag>;
  }
}
