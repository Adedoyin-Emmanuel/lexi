import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings",
  description: "Your settings",
};

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
