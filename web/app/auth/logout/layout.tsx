import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Logout",
  description: "Logout of your account",
};

const LogoutLayout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default LogoutLayout;
