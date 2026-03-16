import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, message } from "antd";
import { isAxiosError } from "axios";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { authApi } from "~/apis/AuthApi/AuthApi";
import type { ReqLogin } from "~/apis/AuthApi/dto/req-login";
import { ROUTES } from "~/constant/Routes";
import {
  loginFailure,
  loginStart,
  loginSuccess,
} from "~/features/auth/authSlice";
import {
  setUserPermissions,
  setUserRoles,
} from "~/features/permission/permissionSlice";
import { useAppDispatch } from "~/hooks/redux";
import type { ApiErrorResponse } from "~/types/ApiErrorResponse";

export default function Login() {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const navigator = useNavigate();
  const { t } = useTranslation();

  const onFinish = async (values: ReqLogin) => {
    dispatch(loginStart());
    setLoading(true);
    try {
      const result = await authApi.login(values);
      const { token, info } = result.data;
      message.success(result.message);
      if (info.permissions !== null && info.permissions.length > 0) {
        const newPermissions = info.permissions.map((permission) => {
          return permission.name;
        });

        dispatch(setUserPermissions(newPermissions));
      }

      dispatch(loginSuccess({ user: info.user, token: token.accessToken }));
      dispatch(
        setUserRoles(
          result.data.info.roles.length > 0
            ? result.data.info.roles
            : [
                {
                  name: "ROOT",
                  desc: "ROOT",
                  id: 1,
                },
              ]
        )
      );
      navigator(ROUTES.DASHBOARD);
    } catch (e) {
      if (isAxiosError<ApiErrorResponse>(e)) {
        if (e.response) {
          message.error(e.response.data.message);
        }
      }
      dispatch(loginFailure());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="relative w-full max-w-md p-8 bg-white shadow-2xl rounded-lg overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-30 transform -rotate-12 translate-x-20 animate-glare" />
        </div>
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-700">
          {t("login.title")}
        </h2>
        <Form name="loginForm" onFinish={onFinish} layout="vertical" noValidate>
          <Form.Item
            name="username"
            label={t("login.username")}
            rules={[{ required: true, message: t("login.usernameRequired") }]}
          >
            <Input
              size="large"
              prefix={<UserOutlined className="text-gray-500" />}
              placeholder={t("login.usernamePlaceholder")}
            />
          </Form.Item>
          <Form.Item
            name="password"
            label={t("login.password")}
            rules={[{ required: true, message: t("login.passwordRequired") }]}
          >
            <Input.Password
              size="large"
              prefix={<LockOutlined className="text-gray-500" />}
              placeholder={t("login.passwordPlaceholder")}
            />
          </Form.Item>
          <Form.Item>
            <Button
              loading={loading}
              type="primary"
              htmlType="submit"
              block
              size="large"
            >
              {t("common.actions.submit")}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
