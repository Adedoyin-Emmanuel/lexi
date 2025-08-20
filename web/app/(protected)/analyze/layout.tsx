import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analyze",
  description: "Let Lexi analyze your contract",
};

export default function AnalyzeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
