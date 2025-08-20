import React from "react";
import Image from "next/image";

const Logo = ({
  className,
  width = 40,
  height = 40,
  ...props
}: {
  className?: string;
  width?: number;
  height?: number;
}) => {
  return (
    <Image
      src="/logo.svg"
      alt="logo"
      width={width}
      height={height}
      className={className}
      {...props}
    />
  );
};

export default Logo;
