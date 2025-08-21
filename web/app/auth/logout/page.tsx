"use client";

import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

import { Axios } from "@/app/config/axios";
import { Button } from "@/components/ui/button";

const Logout = () => {
  const router = useRouter();

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await Axios.post("/auth/logout");
      return response.data;
    },
    onSuccess: () => {
      localStorage.removeItem("accessToken");
      toast.success("Logged out successfully");
      router.push("/auth/login");
    },
    onError: (error) => {
      console.error("Logout failed:", error);
      localStorage.removeItem("accessToken");
      toast.error("Logout failed");
      router.push("/auth/login");
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const handleCancel = () => {
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className=" p-6 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-semibold text-gray-900">
              Sign out of Lexi
            </h1>
            <p className="text-gray-600">
              Are you sure you want to sign out? You&apos;ll need to sign in
              again to access your account.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={logoutMutation.isPending}
              className="flex-1 cursor-pointer hover:bg-gray-100 hover:text-black text-black font-medium"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
              className="flex-1 cursor-pointer"
            >
              {logoutMutation.isPending ? "Signing out..." : "Sign out"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Logout;
