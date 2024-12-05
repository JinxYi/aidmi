import { Avatar as AntdAvatar, AvatarProps } from "antd";

interface CustomAvatarProps extends AvatarProps {
  display_name?: string;
}

const Avatar: React.ForwardRefRenderFunction<
  AvatarProps,
  CustomAvatarProps
> = ({ display_name: full_name, children, ...props }: CustomAvatarProps) => {
  const initials = full_name
    ? full_name
        .split(" ")
        .map((name) => name[0])
        .join("")
    : null;
  return (
    <AntdAvatar size="default" {...props}>
      {children || initials}
    </AntdAvatar>
  );
};

export default Avatar;
