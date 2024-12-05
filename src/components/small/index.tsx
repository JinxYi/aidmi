import { Typography, TypographyProps } from "antd";
import React from "react";
interface SmallProps extends React.PropsWithChildren {
  className?: string;
};
const Small: React.ForwardRefRenderFunction<TypographyProps, SmallProps> = ({
  children,
  className,
  ...props
}: SmallProps) => {
  return <Typography.Text {...props} className={`text-sm opacity-65 ${className}`}>{children}</Typography.Text>;
};

export default Small;
