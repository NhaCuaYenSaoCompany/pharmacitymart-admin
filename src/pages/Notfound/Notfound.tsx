import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "~/constant/Routes";

export default function Notfound() {
  const navigate = useNavigate();

  return (
    <Result
      status="404"
      title="404"
      subTitle={"Trang bạn tìm kiếm không tồn tại."}
      extra={
        <Button type="primary" onClick={() => navigate(ROUTES.DASHBOARD)}>
          Quay về trang chủ
        </Button>
      }
    />
  );
}
