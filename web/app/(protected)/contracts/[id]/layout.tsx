import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contract Details",
  description: "View contract details and analysis",
};

export default function ContractDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
