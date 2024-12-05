import { MediaApi } from "@/api/media/media-api";
import {
  FileExcelOutlined,
  FileImageOutlined,
  FileOutlined,
  FilePdfOutlined,
  FileWordOutlined,
} from "@ant-design/icons";
import { useNotification } from "@refinedev/core";
import { Space } from "antd";
import { Link } from "react-router-dom";

type DownloadableLinkProps = {
  name: string;
  url: string;
  showIcon?: boolean;
};

const getFileIcon = (fileName: string) => {
  const extension = fileName.split(".").pop()?.toLowerCase();
  switch (extension) {
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
      return <FileImageOutlined />;
    case "pdf":
      return <FilePdfOutlined />;
    case "doc":
    case "docx":
      return <FileWordOutlined />;
    case "xls":
    case "xlsx":
      return <FileExcelOutlined />;
    default:
      return <FileOutlined />;
  }
};

const DownloadableLink = ({
  name,
  url,
  showIcon = false,
}: DownloadableLinkProps) => {
  const { open, close } = useNotification();

  const getMediaBlob = async () => {
    try {
      const blob = await MediaApi.downloadMedia(url);
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");

      // Set link's href to point to the Blob URL
      link.href = blobUrl;
      link.download = name;
      // Append link to the body
      document.body.appendChild(link);

      // Dispatch click event on the link
      // This is necessary as link.click() does not work on the latest firefox
      link.dispatchEvent(
        new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
          view: window,
        })
      );

      // Remove link from body
      document.body.removeChild(link);
    } catch (error) {
      open?.({
        type: "error",
        message: "Could not get download media",
        description: "An error occured while trying to get downloadable media.",
        key: "download-media-error-notification-key",
      });
    }
  };
  return (
    <Link type="link" className="link" onClick={getMediaBlob} to={""}>
      <Space>
        {showIcon && getFileIcon(name)} {name}
      </Space>
    </Link>
  );
};

export default DownloadableLink;
