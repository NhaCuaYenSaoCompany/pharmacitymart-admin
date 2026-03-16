import { Button, Form, Input, InputNumber, message } from "antd";
import { isAxiosError } from "axios";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { categoryApi } from "~/apis/CategoryApi/CategoryApi";
import type { ReqCreateCategoryDto } from "~/apis/CategoryApi/dto/ReqCreateCategory";
import WorkingSlugInput from "~/components/SlugInput/WorkingSlugInput";

export default function CategoryCreate() {
  const { t } = useTranslation();
  const [form] = Form.useForm<ReqCreateCategoryDto>();
  const [submitting, setSubmitting] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  const handleSubmit = async (values: ReqCreateCategoryDto) => {
    console.log("CategoryCreate form values:", values);
    setSubmitting(true);
    try {
      const res = await categoryApi.create(values);
      message.success(t(res.message));
      // Reset form và force re-render component
      form.resetFields();
      form.setFieldsValue({ title: "", slug: "", order: undefined });
      setResetKey(prev => prev + 1);
    } catch (error) {
      console.error("CategoryCreate error:", error);
      if (isAxiosError(error) && error.response) {
        message.error(error.response.data.message);
      } else {
        message.error("Có lỗi xảy ra khi tạo category");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item<ReqCreateCategoryDto>
          label={t("categoryManagement.form.nameLabel")}
          name="title"
          rules={[
            {
              required: true,
              message: t("categoryManagement.form.nameRequired"),
            },
          ]}
        >
          <Input placeholder={t("categoryManagement.form.namePlaceholder")} />
        </Form.Item>

        <WorkingSlugInput
          key={resetKey}
          form={form}
          sourceField="title"
          targetField="slug"
          label={t("categoryManagement.form.slugLabel", "Slug")}
          placeholder={t(
            "categoryManagement.form.slugPlaceholder",
            "Enter slug"
          )}
          required={true}
        />

        <Form.Item<ReqCreateCategoryDto>
          label={t("categoryManagement.form.orderLabel")}
          name="order"
          rules={[
            {
              required: true,
              message: t("categoryManagement.form.orderRequired"),
            },
          ]}
        >
          <InputNumber
            type="number"
            placeholder={t("categoryManagement.form.orderPlaceholder")}
          />
        </Form.Item>
        <Form.Item name={null}>
          <div className="flex justify-end">
            <Button loading={submitting} type="primary" htmlType="submit">
              {t("common.actions.create")}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
}
