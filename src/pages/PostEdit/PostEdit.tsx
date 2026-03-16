import { Button, Form, Input, message, Select, Spin } from "antd";
import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { postApi } from "~/apis/PostApi/PostApi";
import type { ReqUpdatePostDto } from "~/apis/PostApi/dto/ReqUpdatePostDto";
import PermissionGate from "~/components/PermissionGate/PermissionGate";
import TinyMCEWrapper from "~/components/TinyMCEWrapper/TinyMCEWrapper";
import UploadMedia from "~/components/UploadMedia/UploadMedia";
import { PERMISSIONS_KEY } from "~/constant/Permissions";
import { ROUTES } from "~/constant/Routes";
import { ENV } from "~/constant/Env";
import type { Post } from "~/types/Post";
import { PostStatus } from "~/types/Post";
import { generateSlug } from "~/utils/generateSlug";

export default function PostEdit() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm<ReqUpdatePostDto>();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(true);

  const statusOptions = [
    { label: t("postManagement.status.draft"), value: PostStatus.Draft },
    { label: t("postManagement.status.published"), value: PostStatus.Published },
    { label: t("postManagement.status.archived"), value: PostStatus.Archived },
  ];

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return;
      try {
        const res = await postApi.detail(Number(id));
        const data: Post = res.data;
        form.setFieldsValue({
          title: data.title,
          slug: data.slug,
          content: data.content,
          excerpt: data.excerpt || undefined,
          thumbnail: data.thumbnail || undefined,
          status: data.status,
          authorId: data.authorId || undefined,
        });
      } catch (error) {
        if (isAxiosError(error) && error.response) {
          message.error(t(error.response.data.message));
        } else {
          message.error(t("common.messages.somethingWentWrong"));
        }
      } finally {
        setSlugManuallyEdited(true);
        setLoading(false);
      }
    };

    fetchDetail();
  }, [form, id, t]);

  const handleSubmit = async (values: ReqUpdatePostDto) => {
    if (!id) return;
    setSubmitting(true);
    try {
      await postApi.update(Number(id), values);
      message.success(t("postManagement.form.updateSuccess"));
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

  if (loading) {
    return (
      <div className="flex justify-center p-10">
        <Spin />
      </div>
    );
  }

  return (
    <PermissionGate permissions={[PERMISSIONS_KEY.post.edit_post.name]}>
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
          rules={[{ required: true }]}
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
            {t("common.actions.update")}
          </Button>
        </div>
      </Form>
    </PermissionGate>
  );
}
