import { SaveOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, message } from "antd";
import { isAxiosError } from "axios";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { ReqUpdateGeneralSystemConfigDto } from "~/apis/SystemConfigApi/dto/ReqUpdateGeneralSystemConfig";
import { systemConfigApi } from "~/apis/SystemConfigApi/SystemConfigApi";
import type { ApiErrorResponse } from "~/types";

export default function SystemConfigSEOManagement() {
  const { t } = useTranslation();
  const [form] = Form.useForm<ReqUpdateGeneralSystemConfigDto>();

  useEffect(() => {
    const fetchSystemConfig = async () => {
      try {
        const res = await systemConfigApi.getAll();

        form.setFieldsValue({
          ...res.data,
        });
      } catch (error) {
        if (isAxiosError<ApiErrorResponse>(error) && error.response) {
          message.error(t(error.response.data.message));
        }
      }
    };

    fetchSystemConfig();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Form form={form} layout="vertical">
      <Card
        title={t("systemConfigManagement.adsConfig")}
        style={{ marginTop: "8px", marginBottom: "8px" }}
        variant="borderless"
      >
        <Form.Item<ReqUpdateGeneralSystemConfigDto>
          label={t("systemConfigManagement.form.adsMetaHeader")}
          name="adsMetaHeader"
        >
          <Input.TextArea
            placeholder={t(
              "systemConfigManagement.form.adsMetaHeaderPlaceholder"
            )}
          />
        </Form.Item>
      </Card>

      <Form.Item>
        <div className="flex justify-end">
          <Button type="primary" icon={<SaveOutlined />}>
            {t("common.actions.save")}
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
}
