import { FolderOpenOutlined, FolderOutlined } from "@ant-design/icons";
import { Breadcrumb, Card, Empty, Image, message } from "antd";
import { isAxiosError } from "axios";
import { useCallback, useEffect, useState } from "react";
import { mediaApi } from "~/apis/MediaApi/MediaApi";
import type { ApiErrorResponse } from "~/types";
import type { MediaFile } from "~/types/MediaFile";
import type { MediaFolder } from "~/types/MediaFolder";

interface MediaManagerTabProps {
  onSelectMedia?: (media: MediaFile) => void;
  selectedMediaId?: number;
  accept?: "image" | "video" | "all";
  refreshTrigger?: number; // Trigger để refresh dữ liệu khi có media mới
}

export default function MediaManagerTab({
  onSelectMedia,
  selectedMediaId,
  accept = "all",
  refreshTrigger,
}: MediaManagerTabProps) {
  const [folders, setFolders] = useState<MediaFolder[]>([]);
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [breadcrumbStack, setBreadcrumbStack] = useState<
    { id: number; name: string }[]
  >([]);

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

  // Refresh dữ liệu khi refreshTrigger thay đổi
  useEffect(() => {
    if (refreshTrigger && refreshTrigger > 0) {
      // Lấy folder hiện tại từ breadcrumb stack
      const currentFolder = breadcrumbStack[breadcrumbStack.length - 1];
      if (currentFolder) {
        getContentsMedia(currentFolder.id);
      }
    }
  }, [refreshTrigger, breadcrumbStack, getContentsMedia]);

  const handleChangeFolder = useCallback(
    async (folder: MediaFolder) => {
      setBreadcrumbStack((prev) => [
        ...prev,
        { id: folder.id, name: folder.name },
      ]);
      getContentsMedia(folder.id);
    },
    [getContentsMedia]
  );

  const handleClickBreadcrumb = useCallback(
    (index: number) => {
      const clickedFolder = breadcrumbStack[index];
      if (clickedFolder) {
        setBreadcrumbStack((prev) => prev.slice(0, index + 1));
        getContentsMedia(clickedFolder.id);
      }
    },
    [breadcrumbStack, getContentsMedia]
  );

  return (
    <>
      <section>
        <Breadcrumb
          items={[
            {
              href: "#",
              title: <FolderOpenOutlined />,
            },
            ...breadcrumbStack.map((item, index) => ({
              title: item.name,
              onClick: () => handleClickBreadcrumb(index),
            })),
          ]}
        />
      </section>

      <section className="mt-4">
        {folders.length === 0 && files.length === 0 ? (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        ) : (
          <>
            <div className="flex flex-wrap gap-x-2 gap-y-2 max-h-[500px] overflow-y-auto ">
              {folders.map((f) => (
                <div
                  key={f.id}
                  className="flex gap-2 items-center justify-between bg-gray-100 hover:bg-gray-200 p-2 rounded transition-all w-[160px]"
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
                </div>
              ))}
            </div>

            <div className="w-full mt-4 flex flex-wrap gap-x-2 gap-y-2 max-h-[500px] overflow-y-auto">
              {files
                .filter((f) => {
                  if (accept === "all") return true;
                  if (accept === "image") return f.mimeType.startsWith("image");
                  if (accept === "video") return f.mimeType.startsWith("video");
                  return true;
                })
                .map((f) => (
                  <Card
                    key={f.id}
                    title={f.name}
                    style={{
                      width: 200,
                      cursor: "pointer",
                      border:
                        selectedMediaId === f.id
                          ? "3px solid #1055C9"
                          : "1px solid #d9d9d9",
                    }}
                    onClick={() => onSelectMedia?.(f)}
                    hoverable
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
                          preview={false}
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
                          src="/images/logo.svg"
                        ></Image>
                      </div>
                    )}
                  </Card>
                ))}
            </div>
          </>
        )}
      </section>
    </>
  );
}
