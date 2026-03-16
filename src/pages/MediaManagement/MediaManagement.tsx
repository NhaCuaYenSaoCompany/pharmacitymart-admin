import {
  FolderOpenOutlined,
  FolderOutlined,
  InboxOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import {
  Breadcrumb,
  Card,
  Dropdown,
  Empty,
  Image,
  Input,
  message,
  Modal,
  type MenuProps,
  type UploadProps,
} from "antd";
import Dragger from "antd/es/upload/Dragger";
import { isAxiosError } from "axios";
import { useCallback, useEffect, useState } from "react";
import type { ReqCreateMediaFile } from "~/apis/MediaApi/dto/ReqCreateMediaFile";
import type { ReqCreateMediaFolderDto } from "~/apis/MediaApi/dto/ReqCreateMediaFolder";
import { mediaApi } from "~/apis/MediaApi/MediaApi";
import { ROUTES } from "~/constant/Routes";
import type { ApiErrorResponse } from "~/types";
import type { ContextMenuState } from "~/types/contextMenu";
import type { MediaFile } from "~/types/MediaFile";
import type { MediaFolder } from "~/types/MediaFolder";

const getMenuItems = (
  type: "empty" | "folder" | "file"
): MenuProps["items"] => {
  switch (type) {
    case "empty":
      return [
        { key: "newFolder", label: "Thêm thư mục" },
        { key: "newFile", label: "Thêm file" },
      ];
    case "folder":
      return [
        { key: "addFileToFolder", label: "Thêm file vào thư mục" },
        { key: "addFolderToFolder", label: "Thêm thư mục con" },
        { key: "deleteFolder", label: "Xóa thư mục" },
      ];
    case "file":
      return [{ key: "deleteFile", label: "Xóa file" }];
  }
};

export default function MediaManagement() {
  const [currentFolderId, setCurrentFolderId] = useState<number>(1);

  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
  const [folders, setFolders] = useState<MediaFolder[]>([]);
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [breadcrumbStack, setBreadcrumbStack] = useState<
    { id: number; name: string }[]
  >([]);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openModalFile, setOpenModalFile] = useState<boolean>(false);
  const [newFolderName, setNewFolderName] = useState<string | undefined>(
    undefined
  );

  const getContentsMedia = useCallback(async (folderId: number) => {
    try {
      const res = await mediaApi.getContentsMedia(folderId);

      setFolders(res.data.folders);
      setFiles(res.data.files);
    } catch (error) {
      if (isAxiosError<ApiErrorResponse>(error) && error.response) {
        message.error(error.response.data.message);
      }
    }
  }, []);

  useEffect(() => {
    getContentsMedia(1);
    setBreadcrumbStack([{ id: 1, name: "Drive" }]);
  }, [getContentsMedia]);

  const handleChangeFolder = useCallback(
    async (folder: MediaFolder) => {
      setBreadcrumbStack((prev) => [
        ...prev,
        { id: folder.id, name: folder.name },
      ]);
      getContentsMedia(folder.id);
      setCurrentFolderId(folder.id);
    },
    [getContentsMedia]
  );

  const handleClickBreadcrumb = useCallback(
    (index: number) => {
      const clickedFolder = breadcrumbStack[index];
      if (clickedFolder) {
        setBreadcrumbStack((prev) => prev.slice(0, index + 1));
        getContentsMedia(clickedFolder.id);
        setCurrentFolderId(clickedFolder.id);
      }
    },
    [breadcrumbStack, getContentsMedia]
  );

  const handleContextMenu = (
    e: React.MouseEvent,
    type: "empty" | "folder" | "file",
    id?: number
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      type,
      data: id,
    });
  };

  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  const props: UploadProps = {
    name: "file",
    // multiple: true,
    // onChange(info) {

    // },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
    async customRequest(options) {
      const reqBody: ReqCreateMediaFile = {
        file: options.file as File,
        folderId: currentFolderId,
      };

      try {
        const res = await mediaApi.uploadFile(reqBody);
        setFiles((prev) => [...prev, res.data]);
        options.onSuccess?.(res.data, options.file);
      } catch (error) {
        options.onError?.(error as Error);
        if (isAxiosError<ApiErrorResponse>(error) && error.response) {
          message.error(error.response.data.message);
        }
      }
    },
  };

  const handleCreateFolder = async (reqBody: ReqCreateMediaFolderDto) => {
    try {
      const res = await mediaApi.createFolder(reqBody);
      setFolders((prev) => [...prev, res.data]);
    } catch (error) {
      if (isAxiosError<ApiErrorResponse>(error) && error.response) {
        message.error(error.response.data.message);
      }
    }
  };

  const handleDeleteFile = async (fileId: number) => {
    try {
      await mediaApi.deleteFile(fileId);

      setFiles((prev) => [...prev.filter((i) => i.id !== fileId)]);
    } catch (error) {
      if (isAxiosError<ApiErrorResponse>(error) && error.response) {
        message.error(error.response.data.message);
      }
    }
  };

  const handleDeleteFolder = async (folderId: number) => {
    try {
      await mediaApi.deleteFolder(folderId);

      setFolders((prev) => [...prev.filter((i) => i.id !== folderId)]);
    } catch (error) {
      if (isAxiosError<ApiErrorResponse>(error) && error.response) {
        message.error(error.response.data.message);
      }
    }
  };

  return (
    <>
      <section>
        <Card>
          <Breadcrumb
            items={[
              {
                href: ROUTES.MEDIA_MANAGEMENT,
                title: <FolderOpenOutlined />,
              },
              ...breadcrumbStack.map((item, index) => ({
                title: item.name,
                onClick: () => handleClickBreadcrumb(index),
              })),
            ]}
          />
        </Card>
      </section>

      <section className="mt-4">
        <Card
          title="Drive của bạn"
          onContextMenu={(e) => handleContextMenu(e, "empty", currentFolderId)}
        >
          {folders.length === 0 && files.length === 0 ? (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          ) : (
            <>
              <div className="flex flex-wrap gap-x-2 gap-y-2 max-h-[500px] overflow-y-auto ">
                {folders.map((f) => (
                  <div
                    key={f.id}
                    className="flex gap-2 items-center justify-between bg-gray-100 hover:bg-gray-200 p-2 rounded transition-all w-[160px]"
                    onContextMenu={(e) => handleContextMenu(e, "folder", f.id)}
                  >
                    <button
                      className="flex gap-x-2 items-center w-full"
                      onClick={() => {
                        handleChangeFolder(f);
                      }}
                    >
                      <FolderOutlined className="text-[16px]" />
                      <span className="font-semibold">{f.name}</span>
                    </button>

                    <button>
                      <MoreOutlined style={{ cursor: "pointer" }} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="w-full mt-4 flex flex-wrap gap-x-2 gap-y-2 max-h-[500px] overflow-y-auto">
                {files.map((f) => (
                  <Card
                    key={f.id}
                    title={f.name}
                    extra={<MoreOutlined style={{ cursor: "pointer" }} />}
                    style={{ width: 200 }}
                    onContextMenu={(e) => handleContextMenu(e, "file", f.id)}
                  >
                    {f.mimeType.startsWith("image") && (
                      <div className="text-center">
                        <Image
                          src={f.url}
                          style={{
                            width: "200px",
                            height: "114px",
                            objectFit: "cover",
                            borderRadius: "4px",
                          }}
                        ></Image>
                      </div>
                    )}

                    {f.mimeType.startsWith("video") && (
                      <div className="text-center">
                        <Image
                          style={{
                            width: "200px",
                            height: "114px",
                            objectFit: "cover",
                            borderRadius: "4px",
                          }}
                          preview={{
                            destroyOnHidden: true,
                            imageRender: () => (
                              <video
                                muted
                                width="100%"
                                controls
                                src={f.url}
                                autoPlay
                                loop
                                className="w-[960px]"
                              />
                            ),
                            toolbarRender: () => null,
                          }}
                          src="/logo.jpg"
                        ></Image>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </>
          )}
        </Card>
      </section>
      {contextMenu && (
        <Dropdown
          open
          trigger={[]}
          menu={{
            items: getMenuItems(contextMenu.type),
            onClick: async ({ key }) => {
              switch (key) {
                case "newFolder": {
                  setOpenModal(true);
                  break;
                }
                case "deleteFolder": {
                  await handleDeleteFolder(Number(contextMenu.data));
                  break;
                }
                case "newFile": {
                  setOpenModalFile(true);
                  break;
                }
                case "deleteFile": {
                  await handleDeleteFile(Number(contextMenu.data));
                  break;
                }
                default:
                  break;
              }
              setContextMenu(null);
            },
          }}
          overlayStyle={{
            position: "fixed",
            left: contextMenu.x,
            top: contextMenu.y,
          }}
        />
      )}

      <Modal
        title="Thêm thư mục"
        open={openModal}
        onOk={() => {
          if (newFolderName) {
            handleCreateFolder({
              name: newFolderName,
              parentId: currentFolderId,
            });
          }
          setOpenModal(false);
          setNewFolderName(undefined);
        }}
        onCancel={() => {
          setOpenModal(false);
          setNewFolderName(undefined);
        }}
      >
        <Input
          placeholder="Nhập tên thư mục"
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
        />
      </Modal>

      <Modal
        title="Thêm file"
        open={openModalFile}
        onOk={() => {
          setOpenModalFile(false);
        }}
        onCancel={() => {
          setOpenModalFile(false);
        }}
      >
        <Dragger {...props}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Chọn file hoặc kéo file muốn tải lên vào ô
          </p>
          <p className="ant-upload-hint">
            Hỗ trợ tải lên một hoặc nhiều file cùng lúc.
          </p>
        </Dragger>
      </Modal>
    </>
  );
}
