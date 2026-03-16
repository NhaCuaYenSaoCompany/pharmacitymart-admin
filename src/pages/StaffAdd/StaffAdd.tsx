import { SaveFilled } from "@ant-design/icons";
import { Button, Form, Input, Select, message } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { roleApi } from "~/apis/RoleApi/RoleApi";
import type { ReqCreateSystemUser } from "~/apis/SystemUserApi/dto/ReqCreateSystemUser";
import { systemUserApi } from "~/apis/SystemUserApi/SystemUserApi";
import UploadImage from "~/components/UploadImage/UploadImage";
import type { Role } from "~/types/Role";

export default function StaffAdd() {
  const { t } = useTranslation();
  const [form] = Form.useForm<ReqCreateSystemUser>();
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [roles, setRoles] = useState<Role[]>([]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await roleApi.getAllRoles({
          page: 1,
          limit: 100000,
        });
        setRoles(res.result);
        form.setFieldsValue({
          roleId: res.result[0]?.id,
        });
      } catch (error) {
        console.error("Error fetching roles:", error);
        message.error(
          t("common.error.fetch", {
            entity: t("staffManagement.fields.role"),
          })
        );
      }
    };

    fetchRoles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (values: ReqCreateSystemUser) => {
    setLoading(true);
    try {
      if (values.avatar) {
        values.avatar = avatarUrl; // Use the avatar URL from state
      }

      await systemUserApi.createSystemUser(values);
      message.success(t("staffManagement.messages.createSuccess"));
      form.resetFields();
      setAvatarUrl(""); // Reset avatar
    } catch (error) {
      console.error("Error creating staff:", error);
      message.error(t("staffManagement.messages.createError"));
    } finally {
      setLoading(false);
    }
  };

  const validateUsername = (_: any, value: string) => {
    if (!value) {
      return Promise.resolve();
    }
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameRegex.test(value)) {
      return Promise.reject(
        new Error(t("staffManagement.validation.usernameInvalid"))
      );
    }
    return Promise.resolve();
  };

  return (
    <>
      <Form
        form={form}
        name="create-staff-user"
        layout="vertical"
        autoComplete="off"
        onFinish={handleSubmit}
        initialValues={{
          gender: true,
        }}
      >
        <Form.Item<ReqCreateSystemUser>
          label={t("staffManagement.fields.avatar")}
          name="avatar"
        >
          <UploadImage
            value={avatarUrl}
            onChange={(url) => {
              if (url) {
                setAvatarUrl(url);
              }
            }}
          />
        </Form.Item>

        <Form.Item<ReqCreateSystemUser>
          label={t("staffManagement.fields.role")}
          name="roleId"
          rules={[
            {
              required: true,
              message: t("common.validation.required", {
                field: t("staffManagement.fields.role"),
              }),
            },
          ]}
        >
          <Select
            options={roles.map((role) => ({
              value: role.id,
              label: role.name,
            }))}
          />
        </Form.Item>

        <Form.Item<ReqCreateSystemUser>
          label={t("staffManagement.fields.username")}
          name="username"
          rules={[
            {
              required: true,
              message: t("common.validation.required", {
                field: t("staffManagement.fields.username"),
              }),
            },
            {
              validator: validateUsername,
            },
          ]}
        >
          <Input placeholder={t("staffManagement.placeholders.username")} />
        </Form.Item>

        <Form.Item<ReqCreateSystemUser>
          label={t("staffManagement.fields.password")}
          name="password"
          rules={[
            {
              required: true,
              message: t("common.validation.required", {
                field: t("staffManagement.fields.password"),
              }),
            },
            {
              min: 6,
              message: t("common.validation.minLength", {
                field: t("staffManagement.fields.password"),
                length: 6,
              }),
            },
          ]}
        >
          <Input.Password
            placeholder={t("staffManagement.placeholders.password")}
          />
        </Form.Item>
        
        <Form.Item<ReqCreateSystemUser>
          label={t("staffManagement.fields.fullname")}
          name="fullName"
          rules={[
            {
              required: true,
              message: t("common.validation.required", {
                field: t("staffManagement.fields.fullname"),
              }),
            },
          ]}
        >
          <Input placeholder={t("staffManagement.placeholders.fullname")} />
        </Form.Item>

        <Form.Item<ReqCreateSystemUser>
          label={t("staffManagement.fields.gender")}
          name="gender"
          rules={[
            {
              required: true,
              message: t("common.validation.required", {
                field: t("staffManagement.fields.gender"),
              }),
            },
          ]}
        >
          <Select
            options={[
              {
                value: true,
                label: t("common.male"),
              },
              {
                value: false,
                label: t("common.female"),
              },
            ]}
          />
        </Form.Item>

        <Form.Item label={null}>
          <div className="flex justify-end">
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              icon={<SaveFilled />}
              iconPosition="end"
            >
              {t("common.actions.submit")}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </>
  );
}
