import { Button, Form, Input, message, Select } from "antd";
import { isAxiosError } from "axios";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { postApi } from "~/apis/PostApi/PostApi";
import type { ReqCreatePostDto } from "~/apis/PostApi/dto/ReqCreatePostDto";
import UploadMedia from "~/components/UploadMedia/UploadMedia";
import TinyMCEWrapper from "~/components/TinyMCEWrapper/TinyMCEWrapper";
import { PERMISSIONS_KEY } from "~/constant/Permissions";
import { ROUTES } from "~/constant/Routes";
import { ENV } from "~/constant/Env";
import { PostStatus } from "~/types/Post";
import PermissionGate from "~/components/PermissionGate/PermissionGate";
import { generateSlug } from "~/utils/generateSlug";

export default function PostCreate() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [form] = Form.useForm<ReqCreatePostDto>();
  const [submitting, setSubmitting] = useState(false);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  const statusOptions = [
    { label: t("postManagement.status.draft"), value: PostStatus.Draft },
    { label: t("postManagement.status.published"), value: PostStatus.Published },
    { label: t("postManagement.status.archived"), value: PostStatus.Archived },
  ];

  const handleSubmit = async (values: ReqCreatePostDto) => {
    setSubmitting(true);
    try {
      await postApi.create(values);
      message.success(t("postManagement.form.createSuccess"));
      navigate(ROUTES.POST_MANAGEMENT);
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        message.error(t(error.response.data.message));
      } else {
        message.error(t("common.messages.somethingWentWrong"));
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PermissionGate permissions={[PERMISSIONS_KEY.post.create_post.name]}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        onValuesChange={(changedValues) => {
          if (changedValues.title && !slugManuallyEdited) {
            form.setFieldsValue({ slug: generateSlug(changedValues.title) });
          }
        }}
      >
        <Form.Item
          label={t("postManagement.form.titleLabel")}
          name="title"
          rules={[
            {
              required: true,
              message: t("postManagement.form.titleRequired"),
            },
          ]}
        >
          <Input placeholder={t("postManagement.form.titlePlaceholder")} />
        </Form.Item>

        <Form.Item
          label={t("postManagement.form.slugLabel")}
          name="slug"
          rules={[
            {
              required: true,
              message: t("postManagement.form.slugRequired"),
            },
          ]}
        >
          <Input
            placeholder={t("postManagement.form.slugPlaceholder")}
            onChange={() => setSlugManuallyEdited(true)}
          />
        </Form.Item>

        <Form.Item
          label={t("postManagement.form.excerptLabel")}
          name="excerpt"
        >
          <Input.TextArea
            placeholder={t("postManagement.form.excerptPlaceholder")}
            rows={3}
          />
        </Form.Item>

        <Form.Item
          label={t("postManagement.form.thumbnailLabel")}
          name="thumbnail"
          valuePropName="value"
        >
          <UploadMedia
            accept="image"
            onChange={(url) => form.setFieldsValue({ thumbnail: url })}
          />
        </Form.Item>

        <Form.Item
          label={t("postManagement.form.statusLabel")}
          name="status"
          initialValue={PostStatus.Published}
        >
          <Select options={statusOptions} />
        </Form.Item>

        <Form.Item
          label={t("postManagement.form.contentLabel")}
          name="content"
          rules={[
            {
              required: true,
              message: t("postManagement.form.contentRequired"),
            },
          ]}
        >
          <TinyMCEWrapper
            apiKey={ENV.API_KEY_TINY_MCE}
            init={{
              height: 400,
              menubar: true,
              plugins:
                "advlist autolink lists link image charmap preview anchor searchreplace visualblocks code fullscreen insertdatetime media table code help wordcount",
              toolbar:
                "undo redo | blocks | bold italic underline forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | code | fullscreen",
            }}
          />
        </Form.Item>

        <div className="flex justify-end">
          <Button loading={submitting} type="primary" htmlType="submit">
            {t("common.actions.create")}
          </Button>
        </div>
      </Form>
    </PermissionGate>
  );
}
