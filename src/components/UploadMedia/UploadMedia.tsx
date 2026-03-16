import { DeleteOutlined, PlusOutlined, PlayCircleOutlined } from "@ant-design/icons";
import { Button, Modal, Tabs, type TabsProps } from "antd";
import { useState } from "react";
import MediaManagerTab from "~/components/UploadMedia/components/MediaManagerTab/MediaManagerTab";
import UploadMediaTab from "~/components/UploadMedia/components/UploadMediaTab/UploadMediaTab";
import type { MediaFile } from "~/types/MediaFile";

interface UploadMediaProps {
  value?: string; // URL của media đã chọn (cho Ant Design Form)
  onChange?: (url: string | undefined) => void; // Callback khi thay đổi (cho Ant Design Form)
  width?: number; // Chiều rộng của preview box
  height?: number; // Chiều cao của preview box
  accept?: "image" | "video" | "all"; // Loại media cho phép
  folderId?: number; // ID của folder để upload vào
}

export default function UploadMedia({
  value,
  onChange,
  width = 120,
  height = 120,
  accept = "all",
  folderId = 1,
}: UploadMediaProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<MediaFile | null>(null);
  const [tempSelectedMedia, setTempSelectedMedia] = useState<MediaFile | null>(
    null
  );
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Tải media của bạn lên",
      children: (
        <UploadMediaTab
          onMediaUploaded={(media) => {
            setTempSelectedMedia(media);
            // Trigger refresh cho MediaManagerTab
            setRefreshTrigger(prev => prev + 1);
          }}
          accept={accept}
          folderId={folderId}
        />
      ),
    },
    {
      key: "2",
      label: "Lựa chọn media trong thư viện",
      children: (
        <MediaManagerTab
          onSelectMedia={(media) => {
            setTempSelectedMedia(media);
          }}
          selectedMediaId={tempSelectedMedia?.id}
          accept={accept}
          refreshTrigger={refreshTrigger}
        />
      ),
    },
  ];

  const handleOpenMediaManager = () => {
    setTempSelectedMedia(selectedMedia);
    setIsModalOpen(true);
  };

  const handleOk = () => {
    if (tempSelectedMedia) {
      setSelectedMedia(tempSelectedMedia);
      onChange?.(tempSelectedMedia.url);
    }
    setIsModalOpen(false);
    setTempSelectedMedia(null);
  };

  const handleCancel = () => {
    setTempSelectedMedia(null);
    setIsModalOpen(false);
  };

  const handleRemoveMedia = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedMedia(null);
    onChange?.(undefined);
  };

  // Sử dụng value từ Form nếu có, không thì dùng selectedMedia
  const displayUrl = value || selectedMedia?.url;
  const displayMedia = selectedMedia;
  const isVideo = displayMedia?.mimeType?.startsWith("video");

  return (
    <>
      <div
        className="bg-gray-50 rounded-[8px] border-dashed border-1 border-gray-300 hover:border-blue-400 overflow-hidden transition-all relative group"
        style={{
          maxWidth: `${width}px`,
          maxHeight: `${height}px`,
          width: `${width}px`,
          height: `${height}px`,
        }}
      >
        <button
          type="button"
          className="w-full h-full"
          onClick={handleOpenMediaManager}
        >
          {!displayUrl ? (
            <div className="flex flex-col gap-y-2 justify-center items-center text-center">
              <PlusOutlined />
              <span className="text-[14px] text-gray-500">Upload</span>
            </div>
          ) : (
            <div className="relative w-full h-full">
              {isVideo ? (
                <>
                  <video
                    src={displayUrl}
                    className="w-full h-full object-cover"
                    muted
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                    <PlayCircleOutlined className="text-white text-4xl" />
                  </div>
                </>
              ) : (
                <img
                  src={displayUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          )}
        </button>

        {displayUrl && (
          <button
            type="button"
            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 z-10"
            onClick={handleRemoveMedia}
          >
            <DeleteOutlined className="text-[12px]" />
          </button>
        )}
      </div>

      <Modal
        title="Media Manager"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width={800}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Hủy
          </Button>,
          <Button
            key="ok"
            type="primary"
            onClick={handleOk}
            disabled={!tempSelectedMedia}
          >
            Chọn
          </Button>,
        ]}
      >
        <Tabs defaultActiveKey="2" items={items} />
      </Modal>
    </>
  );
}
