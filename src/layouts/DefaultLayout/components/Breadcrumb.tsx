import { HomeOutlined } from "@ant-design/icons";
import { Breadcrumb as BreadcrumbANTD } from "antd";
import { ROUTES } from "~/constant/Routes";

export interface BreadcrumbProps {
  items?: { href?: string; title: React.ReactNode }[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <BreadcrumbANTD
      items={[
        {
          href: ROUTES.DASHBOARD,
          title: <HomeOutlined />,
        },
        ...(items || []),
      ]}
    />
  );
}
