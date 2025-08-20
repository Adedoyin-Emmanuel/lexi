import React from "react";
import Image from "next/image";

const Logo = ({
  className,
  width = 100,
  height = 100,
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
