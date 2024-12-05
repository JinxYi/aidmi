import Avatar from "@/components/user-avatar";
import { useTheme } from "@/hooks";
import { Patient } from "@/domain";
import EditProfileForm from "@/pages/patients/edit";
import {
  EditOutlined,
  LogoutOutlined,
  MoonOutlined,
  SunOutlined,
} from "@ant-design/icons";
import { useLogout } from "@refinedev/core";
import { Divider, Drawer, Flex, Popover, Switch, Typography } from "antd";
import { useState } from "react";
const { Text } = Typography;
type HeaderProps = {
  patient: Patient;
};
const ProfileMenu = ({ patient }: HeaderProps) => {
  const { mutate: logout } = useLogout();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const { state: themeState, dispatch } = useTheme();

  const handleOpenChange = (newOpen: boolean) => {
    setIsPopoverOpen(newOpen);
  };

  const showDrawer = () => {
    hidePopover();
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const hidePopover = () => {
    setIsPopoverOpen(false);
  };

  const onThemeToggle = (checked: boolean) => {
    dispatch({ type: checked ? "DARKMODE_OFF" : "DARKMODE_ON" });
  };

  const content = (
    <Flex vertical className="profile-menu">
      <Flex
        gap="small"
        className="profile-menu-item hover:bg-opacity-60"
        onClick={showDrawer}
      >
        <EditOutlined />
        <span>Edit Profile</span>
      </Flex>
      <Flex gap="small" className="profile-menu-item" onClick={() => logout()}>
        <LogoutOutlined />
        <span>Logout</span>
      </Flex>
      <Divider style={{ margin: 0 }}></Divider>
      <Flex gap="small" justify="end" className="profile-menu-item">
        <Text>Theme</Text>
        <Switch
          checkedChildren={<SunOutlined />}
          unCheckedChildren={<MoonOutlined />}
          onChange={onThemeToggle}
          defaultChecked={!themeState.darkMode}
        />
      </Flex>
    </Flex>
  );

  return (
    <>
      <Popover
        open={isPopoverOpen}
        placement="bottomRight"
        overlayInnerStyle={{
          padding: 0,
          paddingTop: "0.4rem",
          paddingBottom: "0.4rem",
        }}
        content={content}
        trigger="click"
        onOpenChange={handleOpenChange}
      >
        {/* <Button type="text" shape="circle" icon={<EllipsisOutlined />} /> */}
        <Avatar
          style={{ cursor: "pointer" }}
          display_name={`${patient?.first_name} ${patient?.last_name}`}
        ></Avatar>
      </Popover>
      <Drawer title="Edit Profile" onClose={onClose} open={open}>
        {patient && <EditProfileForm data={patient} />}
      </Drawer>
    </>
  );
};

export default ProfileMenu;
