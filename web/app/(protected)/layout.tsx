import { Separator } from "@/components/ui/separator";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebarHeader } from "@/components/app-sidebar-header";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <div className="p-2 px-4">
          <AppSidebarHeader />
        </div>
        <Separator orientation="horizontal" className="h-4" />
        <div className="p-3">{children}</div>
      </main>
    </SidebarProvider>
  );
}
