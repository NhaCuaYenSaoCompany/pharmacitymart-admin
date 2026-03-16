import { PlusCircleOutlined } from "@ant-design/icons";
import { Button, message } from "antd";
import { isAxiosError } from "axios";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { systemUserApi } from "~/apis/SystemUserApi/SystemUserApi";
import ActionPermission from "~/components/ActionPermission/ActionPermission";
import { PERMISSIONS_KEY } from "~/constant/Permissions";
import { ROUTES } from "~/constant/Routes";
import StaffManageList from "~/pages/StaffManage/components/StaffManageList/StaffManageList";
import type { ApiErrorResponse } from "~/types";
import type { PaginationQuery } from "~/types/PaginationApi";
import type { SystemUser } from "~/types/SystemUser";

export default function StaffManage() {
  const { t } = useTranslation();

  const navigate = useNavigate();
  const [systemUsers, setSystemUsers] = useState<SystemUser[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginationQuery>({
    page: 1,
    limit: 10,
  });
  const [totalList, setTotalList] = useState<number>(0);

  const fetchSystemUsers = useCallback(
    async (paginationQuery: PaginationQuery) => {
      setLoading(true);
      try {
        const res = await systemUserApi.getAllSystemUsers(paginationQuery);
        setSystemUsers(res.data.result);
        setPagination(res.data.meta);
        setTotalList(res.data.meta.total);
      } catch (error) {
        if (isAxiosError<ApiErrorResponse>(error)) {
          if (error.response) {
            message.error(t(error.response.data.message));
          }
        }
      } finally {
        setLoading(false);
      }
    },
    [t]
  );

  useEffect(() => {
    fetchSystemUsers({
      page: 1,
      limit: 10,
    });
  }, [fetchSystemUsers]);

  return (
    <>
      <section className="flex justify-end items-center mb-4">
        <div>
          <ActionPermission
            permission={PERMISSIONS_KEY.system_user.create_system_user.name}
          >
            <Button
              onClick={() => navigate(ROUTES.ADD_STAFF)}
              icon={<PlusCircleOutlined />}
              type="primary"
            >
              {t("common.actions.add")}
            </Button>
          </ActionPermission>
        </div>
      </section>
      <section>
        <StaffManageList
          data={systemUsers}
          pagination={pagination}
          loading={loading}
          total={totalList}
        />
      </section>
    </>
  );
}
