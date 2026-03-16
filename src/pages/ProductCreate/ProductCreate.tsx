import {
  Button,
  Form,
  Input,
  InputNumber,
  message,
  Select,
  Switch,
} from "antd";
import { isAxiosError } from "axios";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { categoryApi } from "~/apis/CategoryApi/CategoryApi";
import type { ReqCreateProductDto } from "~/apis/ProductApi/dto/ReqCreateProductDto";
import { productApi } from "~/apis/ProductApi/ProductApi";
import { regionApi } from "~/apis/RegionApi/RegionApi";
import WorkingSlugInput from "~/components/SlugInput/WorkingSlugInput";
import TinyMCEWrapper from "~/components/TinyMCEWrapper/TinyMCEWrapper";
import UploadMedia from "~/components/UploadMedia/UploadMedia";
import { ENV } from "~/constant/Env";
import type { ApiErrorResponse } from "~/types";
import type { Category } from "~/types/Category";
import type { Region } from "~/types/Region";

export default function ProductCreate() {
  const { t } = useTranslation();
  const [form] = Form.useForm<ReqCreateProductDto>();
  const [submitting, setSubmitting] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);

  const fetchRegions = useCallback(async () => {
    try {
      const res = await regionApi.getAll({
        page: 1,
        limit: 100,
      });
      form.setFieldsValue({
        regionId: res.data.result[0].id,
      });
      setRegions(res.data.result);
    } catch (error) {
      if (isAxiosError<ApiErrorResponse>(error) && error.response) {
        message.error(t(error.response.data.message));
      }
    }
  }, [form, t]);

  useEffect(() => {
    fetchRegions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (values: ReqCreateProductDto) => {
    setSubmitting(true);
    try {
      const res = await productApi.create(values);
      message.success(t(res.message));
      // Reset form và force re-render component
      form.resetFields();
      form.setFieldsValue({
        name: "",
        slug: "",
        price: undefined,
        stock: undefined,
      });
      setResetKey((prev) => prev + 1);
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

  //handle fetching data categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryApi.getAll({
          page: 1,
          limit: 10000,
        });
        setCategories(res.data.result);
        form.setFieldsValue({ categoryId: res.data.result[0]?.id });
      } catch (error) {
        if (isAxiosError(error) && error.response) {
          message.error(error.response.data.message);
        }
      }
    };
    fetchCategories();
  }, [form]);

  return (
    <div>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          requiresPrescription: false,
          isActive: true,
        }}
      >
        <Form.Item<ReqCreateProductDto>
          label={t("productManagement.form.region")}
          name="regionId"
          rules={[
            {
              required: true,
              message: t("common.validation.required", {
                field: t("productManagement.form.region"),
              }),
            },
          ]}
        >
          <Select
            options={regions.map((region) => ({
              value: region.id,
              label: t(region.code),
            }))}
          />
        </Form.Item>

        <Form.Item<ReqCreateProductDto>
          label={t("productManagement.form.categoryLabel")}
          name="categoryId"
          rules={[
            {
              required: true,
              message: t("productManagement.form.categoryRequired"),
            },
          ]}
        >
          <Select
            options={categories.map((category) => ({
              value: category.id,
              label: t(category.title),
            }))}
          />
        </Form.Item>

        <Form.Item<ReqCreateProductDto>
          label={t("productManagement.form.thumbnailUrl")}
          name="thumbnailUrl"
          rules={[{ required: true, message: t("common.validation.required") }]}
        >
          <UploadMedia />
        </Form.Item>

        <Form.Item<ReqCreateProductDto>
          label={t("productManagement.form.nameLabel")}
          name="name"
          rules={[
            {
              required: true,
              message: t("productManagement.form.nameRequired"),
            },
          ]}
        >
          <Input placeholder={t("productManagement.form.namePlaceholder")} />
        </Form.Item>

        <Form.Item<ReqCreateProductDto>
          label={t("productManagement.form.dosageLabel")}
          name="dosage"
          rules={[
            {
              required: true,
              message: t("productManagement.form.dosageRequired"),
            },
          ]}
        >
          <InputNumber
            min={0}
            style={{ width: "100%" }}
            placeholder={t("productManagement.form.dosagePlaceholder")}
          />
        </Form.Item>

        <WorkingSlugInput
          key={resetKey}
          form={form}
          sourceField="name"
          targetField="slug"
          label={t("productManagement.form.slugLabel", "Slug")}
          placeholder={t(
            "productManagement.form.slugPlaceholder",
            "Enter slug"
          )}
          required={true}
        />

        <Form.Item<ReqCreateProductDto>
          label={t("productManagement.form.shortDescriptionLabel")}
          name="shortDescription"
          rules={[
            {
              required: true,
              message: t("productManagement.form.shortDescriptionRequired"),
            },
          ]}
        >
          <Input
            placeholder={t(
              "productManagement.form.shortDescriptionPlaceholder"
            )}
          />
        </Form.Item>

        <Form.Item<ReqCreateProductDto>
          label={t("productManagement.form.priceLabel")}
          name="price"
          rules={[
            {
              required: true,
              message: t("productManagement.form.priceRequired"),
            },
          ]}
        >
          <InputNumber
            min={0}
            style={{ width: "100%" }}
            placeholder={t("productManagement.form.pricePlaceholder")}
          />
        </Form.Item>

        <Form.Item<ReqCreateProductDto>
          label={t("productManagement.form.stockLabel")}
          name="stock"
          rules={[
            {
              required: true,
              message: t("productManagement.form.stockRequired"),
            },
          ]}
        >
          <InputNumber
            min={0}
            style={{ width: "100%" }}
            placeholder={t("productManagement.form.stockPlaceholder")}
          />
        </Form.Item>

        <Form.Item<ReqCreateProductDto>
          label={t("productManagement.form.genericNameLabel")}
          name="genericName"
          rules={[
            {
              required: true,
              message: t("productManagement.form.genericNameRequired"),
            },
          ]}
        >
          <Input
            placeholder={t("productManagement.form.genericNamePlaceholder")}
          />
        </Form.Item>

        <Form.Item<ReqCreateProductDto>
          label={t("productManagement.form.brandNameLabel")}
          name="brandName"
          rules={[
            {
              required: true,
              message: t("productManagement.form.brandNameRequired"),
            },
          ]}
        >
          <Input
            placeholder={t("productManagement.form.brandNamePlaceholder")}
          />
        </Form.Item>

        <Form.Item<ReqCreateProductDto>
          label={t("productManagement.form.manufacturerLabel")}
          name="manufacturer"
          rules={[
            {
              required: true,
              message: t("productManagement.form.manufacturerRequired"),
            },
          ]}
        >
          <Input
            placeholder={t("productManagement.form.manufacturerPlaceholder")}
          />
        </Form.Item>

        <Form.Item<ReqCreateProductDto>
          label={t("productManagement.form.requiresPrescriptionLabel")}
          name="requiresPrescription"
          rules={[
            {
              required: true,
              message: t("productManagement.form.requiresPrescriptionRequired"),
            },
          ]}
        >
          <Switch />
        </Form.Item>

        <Form.Item<ReqCreateProductDto>
          label={t("productManagement.form.descriptionLabel")}
          name="description"
          rules={[
            {
              required: true,
              message: t("productManagement.form.descriptionRequired"),
            },
          ]}
        >
          <TinyMCEWrapper
            apiKey={ENV.API_KEY_TINY_MCE}
            init={{
              height: 300,
              menubar: false,
              plugins: [
                "advlist",
                "autolink",
                "lists",
                "link",
                "image",
                "charmap",
                "preview",
                "anchor",
                "searchreplace",
                "visualblocks",
                "code",
                "fullscreen",
                "insertdatetime",
                "media",
                "table",
                "code",
                "help",
                "wordcount",
              ],
              toolbar:
                "undo redo | blocks | " +
                "bold italic forecolor | alignleft aligncenter " +
                "alignright alignjustify | bullist numlist outdent indent | " +
                "removeformat | help",
              entity_encoding: "raw",
              content_style:
                "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
            }}
          />
        </Form.Item>

        <Form.Item<ReqCreateProductDto>
          label={t("productManagement.form.storageInstructionLabel")}
          name="storageInstruction"
          rules={[
            {
              required: true,
              message: t("productManagement.form.storageInstructionRequired"),
            },
          ]}
        >
          <TinyMCEWrapper
            apiKey={ENV.API_KEY_TINY_MCE}
            init={{
              height: 300,
              menubar: false,
              plugins: [
                "advlist",
                "autolink",
                "lists",
                "link",
                "image",
                "charmap",
                "preview",
                "anchor",
                "searchreplace",
                "visualblocks",
                "code",
                "fullscreen",
                "insertdatetime",
                "media",
                "table",
                "code",
                "help",
                "wordcount",
              ],
              toolbar:
                "undo redo | blocks | " +
                "bold italic forecolor | alignleft aligncenter " +
                "alignright alignjustify | bullist numlist outdent indent | " +
                "removeformat | help",
              entity_encoding: "raw",
              content_style:
                "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
            }}
          />
        </Form.Item>

        <Form.Item<ReqCreateProductDto>
          label={t("productManagement.form.generalWarningLabel")}
          name="generalWarning"
          rules={[
            {
              required: true,
              message: t("productManagement.form.generalWarningRequired"),
            },
          ]}
        >
          <TinyMCEWrapper
            apiKey={ENV.API_KEY_TINY_MCE}
            init={{
              height: 300,
              menubar: false,
              plugins: [
                "advlist",
                "autolink",
                "lists",
                "link",
                "image",
                "charmap",
                "preview",
                "anchor",
                "searchreplace",
                "visualblocks",
                "code",
                "fullscreen",
                "insertdatetime",
                "media",
                "table",
                "code",
                "help",
                "wordcount",
              ],
              toolbar:
                "undo redo | blocks | " +
                "bold italic forecolor | alignleft aligncenter " +
                "alignright alignjustify | bullist numlist outdent indent | " +
                "removeformat | help",
              entity_encoding: "raw",
              content_style:
                "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
            }}
          />
        </Form.Item>

        <Form.Item<ReqCreateProductDto>
          label={t("productManagement.form.isActiveLabel")}
          name="isActive"
          rules={[
            {
              required: true,
              message: t("productManagement.form.isActiveRequired"),
            },
          ]}
        >
          <Switch />
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
