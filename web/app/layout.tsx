import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";

import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dmsans",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "700"],
  
});

export const metadata: Metadata = {
  title: "Lexi",
  description:
    "AI-powered contract analyzer. Identify risks and highlight clauses in your contract before signing",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.className} antialiased`}>{children}</body>
    </html>
  );
}
