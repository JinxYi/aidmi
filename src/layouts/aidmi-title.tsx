import {  BulbOutlined, MenuOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { ThemedTitleV2 } from "@refinedev/antd";

interface AidMiTitleProps {
  collapsed: boolean; // Add a type annotation for the collapsed parameter
}
const AidMiTitle: React.FC<AidMiTitleProps> = ({ collapsed }) => {
  return (<ThemedTitleV2
    // collapsed is a boolean value that indicates whether the <Sidebar> is collapsed or not
    collapsed={collapsed}
    icon={ <BulbOutlined /> }
    text="AidMi"
  />
  )
};

export default AidMiTitle;