import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contracts",
  description: "Your contracts",
};

export default function ContractsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
