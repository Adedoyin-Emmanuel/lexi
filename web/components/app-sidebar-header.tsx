"use client";

import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { Axios } from "@/app/config/axios";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

const pageConfig = {
  "/dashboard": {
    title: "Dashboard",
    description: "Overview of your legal analytics",
  },
  "/analyze": {
    title: "Analyze",
    description: "Analyze your legal documents",
  },
  "/contracts": {
    title: "Contracts",
    description: "Manage your legal contracts",
  },
  "/settings": {
    title: "Settings",
    description: "Configure your account preferences",
  },
};

interface UserData {
  name: string;
  avatar: string;
  displayName: string;
  hasOnboarded: boolean;
}

export const AppSidebarHeader = () => {
  const pathname = usePathname();
  const { isMobile, toggleSidebar } = useSidebar();

  const { data: userData, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: async (): Promise<UserData> => {
      const response = await Axios.get("/user/me");
      return response.data.data;
    },
  });

  const currentPage = pageConfig[pathname as keyof typeof pageConfig] || {
    title: "Page",
    description: "Page description",
  };

  return (
    <header className="flex items-center justify-between py-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-3">
        {isMobile ? (
          <>
            {isLoading ? (
              <Skeleton className="h-9 w-9 rounded-full" />
            ) : (
              <Avatar className="h-9 w-9">
                <AvatarImage
                  src={userData?.avatar}
                  alt={userData?.name || "User"}
                />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {userData?.displayName?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
            )}

            <div className="flex-1 min-w-0">
              <h1 className="text-sm font-semibold text-foreground truncate">
                {currentPage.title}
              </h1>
              <p className="text-xs text-muted-foreground truncate">
                {currentPage.description}
              </p>
            </div>
          </>
        ) : (
          <div className="flex-1 min-w-0">
            <h1 className="text-[17px] font-semibold text-foreground">
              {currentPage.title}
            </h1>
            <p className="text-xs text-muted-foreground">
              {currentPage.description}
            </p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {isMobile ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="h-8 w-8 p-0"
          >
            <Menu className="h-4 w-4" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>
        ) : (
          <>
            {isLoading ? (
              <Skeleton className="h-9 w-9 rounded-full" />
            ) : (
              <Avatar className="h-9 w-9">
                <AvatarImage
                  src={userData?.avatar}
                  alt={userData?.name || "User"}
                />

                <AvatarFallback className=" text-primary">
                  {userData?.displayName?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
            )}
          </>
        )}
      </div>
    </header>
  );
};
