"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Book, LogOut, Settings, ChartSpline, FileSearch } from "lucide-react";

import Logo from "./logo";
import {
  Sidebar,
  SidebarMenu,
  SidebarGroup,
  SidebarFooter,
  SidebarContent,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroupContent,
} from "@/components/ui/sidebar";

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: ChartSpline,
  },
  {
    title: "Analyze",
    url: "/analyze",
    icon: FileSearch,
  },
  {
    title: "Contracts",
    url: "/contracts",
    icon: Book,
  },
];

const footerItems = [
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
  {
    title: "Logout",
    url: "/auth/logout",
    icon: LogOut,
  },
];

export const AppSidebar = () => {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <div className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-[3px] mb-2">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="flex items-center justify-center">
                <Logo
                  width={24}
                  height={24}
                  className="w-6 h-6 group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:h-8"
                />
              </div>
              <span className="text-lg font-bold group-data-[collapsible=icon]:hidden">
                Lexi
              </span>
            </Link>
          </div>

          <br />

          <SidebarGroupContent>
            <SidebarMenu className="space-y-3 mt-4">
              {items.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={item.url}>
                        <item.icon strokeWidth={1.5} width={24} height={24} />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {footerItems.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={item.url}>
                        <item.icon strokeWidth={1.5} width={24} height={24} />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
};
