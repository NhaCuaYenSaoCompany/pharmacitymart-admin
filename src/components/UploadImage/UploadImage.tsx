import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { message, Upload, type UploadProps } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import type { ReqUploadImage } from "~/apis/UploadApi/dto/req-upload-image";
import { uploadApi } from "~/apis/UploadApi/UploadApi";

interface UploadImageProps {
  value?: string;
  onChange?: (url: string | null) => void;
}

export default function UploadImage({ value, onChange }: UploadImageProps) {
  const { t } = useTranslation();
  const [imageUrl, setImageUrl] = useState<string | null>(value || null);
  const [uploadLoading, setUploadLoading] = useState(false);

  // Sync with external value changes
  useEffect(() => {
    setImageUrl(value || null);
  }, [value]);

  const handleImageUrlChange = (url: string | null) => {
    setImageUrl(url);
    onChange?.(url);
  };

  const customRequest: UploadProps["customRequest"] = async ({
    file,
    onSuccess,
    onError,
  }) => {
    setUploadLoading(true);
    try {
      const uploadReq: ReqUploadImage = {
        file: file as File,
      };
      const res = await uploadApi.uploadImage(uploadReq);
      handleImageUrlChange(res.data.url);
      onSuccess?.(res, file);
      message.success(t("common.messages.uploadSuccess"));
    } catch (error) {
      onError?.(error as Error);
      message.error(t("common.messages.uploadError"));
    } finally {
      setUploadLoading(false);
    }
  };

  const uploadButton = (
    <button
      style={{ border: 0, background: "none" }}
      type="button"
      disabled={uploadLoading}
    >
      {uploadLoading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>
        {uploadLoading
          ? t("common.messages.uploading")
          : t("common.messages.upload")}
      </div>
    </button>
  );

  return (
    <Upload
      name="file"
      accept="image/*"
      listType="picture-card"
      showUploadList={false}
      customRequest={customRequest}
      disabled={uploadLoading}
      onChange={(info) => {
        if (info.file.status === "done") {
          message.success(t("common.messages.uploadSuccess"));
        } else if (info.file.status === "error") {
          message.error(t("common.messages.uploadError"));
        }
      }}
    >
      {imageUrl ? (
        <img src={imageUrl} alt="avatar" style={{ width: "100%" }} />
      ) : (
        uploadButton
      )}
    </Upload>
  );
}
