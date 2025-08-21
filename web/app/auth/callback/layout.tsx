import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Auth Callback",
  description: "Lexi Auth Callback",
};

const AuthCallbackLayout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default AuthCallbackLayout;
