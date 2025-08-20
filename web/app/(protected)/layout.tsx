import { cookies } from "next/headers";

import { Separator } from "@/components/ui/separator";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebarHeader } from "@/components/app-sidebar-header";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <main className="w-full">
        <div className="p-2 px-4">
          <AppSidebarHeader />
        </div>
        <Separator orientation="horizontal" className="h-4" />
        <div className="p-2 px-4">{children}</div>
      </main>
    </SidebarProvider>
  );
}
