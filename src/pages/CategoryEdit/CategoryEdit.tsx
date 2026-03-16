import { Button, Form, Input, InputNumber, message } from "antd";
import { useForm } from "antd/es/form/Form";
import { isAxiosError } from "axios";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { categoryApi } from "~/apis/CategoryApi/CategoryApi";
import type { ReqCreateCategoryDto } from "~/apis/CategoryApi/dto/ReqCreateCategory";
import type { ReqEditCategoryDto } from "~/apis/CategoryApi/dto/ReqEditCategory";
import WorkingSlugInput from "~/components/SlugInput/WorkingSlugInput";
import type { ApiErrorResponse } from "~/types";

export default function CategoryEdit() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();

  const [loading, setLoading] = useState(false);

  const [form] = useForm<ReqEditCategoryDto>();

  const fetchDetail = useCallback(
    async (id: number) => {
      try {
        const res = await categoryApi.detail(id);
        form.setFieldsValue(res.data);
      } catch (error) {
        if (isAxiosError<ApiErrorResponse>(error) && error.response) {
          message.error(t(error.response.data.message));
        }
      }
    },
    [form, t]
  );

  useEffect(() => {
    fetchDetail(Number(id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleSubmit = async (values: ReqEditCategoryDto) => {
    setLoading(true);
    try {
      const res = await categoryApi.edit(Number(id), values);
      message.success(t(res.message));
    } catch (error) {
      if (isAxiosError<ApiErrorResponse>(error) && error.response) {
        message.error(t(error.response.data.message));
      }
    } finally {
      setLoading(false);
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
          key={id}
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
            <Button loading={loading} type="primary" htmlType="submit">
              {t("common.actions.update")}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
}
