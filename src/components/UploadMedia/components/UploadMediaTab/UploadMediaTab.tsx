import { Upload, message, TreeSelect } from "antd";
import { InboxOutlined, FolderOutlined } from "@ant-design/icons";
import type { UploadFile, UploadProps } from "antd";
import { useEffect, useState } from "react";
import { mediaApi } from "~/apis/MediaApi/MediaApi";
import type { MediaFile } from "~/types/MediaFile";
import type { ResFolderTreeDto } from "~/apis/MediaApi/dto/ResFolderTreeDto";
import { isAxiosError } from "axios";
import type { ApiErrorResponse } from "~/types";

interface UploadMediaTabProps {
  onMediaUploaded?: (media: MediaFile) => void;
  accept?: "image" | "video" | "all";
  folderId?: number; // ID của folder để upload vào
}

export default function UploadMediaTab({
  onMediaUploaded,
  accept = "all",
  folderId = 1, // Mặc định upload vào folder root (id=1)
}: UploadMediaTabProps) {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState<number>(folderId);
  const [folderTree, setFolderTree] = useState<ResFolderTreeDto[]>([]);

  useEffect(() => {
    // Load folder tree từ API getFoldersRecursive
    const loadFolders = async () => {
      try {
        const res = await mediaApi.getFoldersRecursive();
        setFolderTree(res.data);
      } catch (error) {
        if (isAxiosError<ApiErrorResponse>(error) && error.response) {
          message.error(error.response.data.message);
        }
      }
    };

    loadFolders();
  }, []);

  const getAcceptType = () => {
    if (accept === "image") return "image/*";
    if (accept === "video") return "video/*";
    return "image/*,video/*";
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const res = await mediaApi.uploadFile({
        file: file,
        folderId: selectedFolderId,
      });

      message.success(`${file.name} đã được tải lên thành công.`);
      
      // Gọi callback với MediaFile đã upload
      if (onMediaUploaded && res.data) {
        onMediaUploaded(res.data);
      }

      // Clear file list sau khi upload thành công
      setFileList([]);
      return true;
    } catch (error) {
      if (isAxiosError<ApiErrorResponse>(error) && error.response) {
        message.error(error.response.data.message || "Tải lên thất bại");
      } else {
        message.error(`${file.name} tải lên thất bại.`);
      }
      return false;
    } finally {
      setUploading(false);
    }
  };

  const uploadProps: UploadProps = {
    name: "file",
    multiple: false,
    accept: getAcceptType(),
    fileList: fileList,
    beforeUpload: (file) => {
      // Validate file type
      const isValidType = accept === "all" || 
        (accept === "image" && file.type.startsWith("image/")) ||
        (accept === "video" && file.type.startsWith("video/"));

      if (!isValidType) {
        message.error(`Chỉ cho phép tải lên ${accept === "image" ? "ảnh" : accept === "video" ? "video" : "ảnh hoặc video"}!`);
        return Upload.LIST_IGNORE;
      }

      // Validate file size (max 100MB)
      const isLt100M = file.size / 1024 / 1024 < 100;
      if (!isLt100M) {
        message.error("File phải nhỏ hơn 100MB!");
        return Upload.LIST_IGNORE;
      }

      setFileList([file]);
      
      // Upload ngay lập tức
      handleUpload(file);
      
      return false; // Prevent default upload behavior
    },
    onRemove: () => {
      setFileList([]);
    },
  };

  // Build tree data cho TreeSelect từ ResFolderTreeDto
  const buildTreeData = (folders: ResFolderTreeDto[]): any[] => {
    return folders.map((folder) => ({
      title: folder.name,
      value: folder.id,
      icon: <FolderOutlined />,
      children: folder.children.length > 0 ? buildTreeData(folder.children) : [],
    }));
  };

  const treeData = buildTreeData(folderTree);

  return (
    <div className="py-4">
      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium">
          Chọn thư mục để tải lên:
        </label>
        <TreeSelect
          style={{ width: "100%" }}
          value={selectedFolderId}
          dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
          treeData={treeData}
          placeholder="Chọn thư mục"
          treeDefaultExpandAll
          onChange={(value) => setSelectedFolderId(value)}
          disabled={uploading}
        />
      </div>

      <Upload.Dragger {...uploadProps} disabled={uploading}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          {uploading ? "Đang tải lên..." : "Nhấp hoặc kéo thả file vào đây để tải lên"}
        </p>
        <p className="ant-upload-hint">
          {accept === "image" && "Chỉ hỗ trợ file ảnh (JPG, PNG, GIF, ...). Tối đa 100MB."}
          {accept === "video" && "Chỉ hỗ trợ file video (MP4, AVI, MOV, ...). Tối đa 100MB."}
          {accept === "all" && "Hỗ trợ file ảnh và video. Tối đa 100MB."}
        </p>
      </Upload.Dragger>
    </div>
  );
}
