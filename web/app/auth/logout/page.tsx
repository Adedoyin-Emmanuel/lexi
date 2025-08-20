"use client";

import { Button } from "@/components/ui/button";

const Logout = () => {
  const handleLogout = () => {
    console.log("Logging out...");
  };

  const handleCancel = () => {
    console.log("Cancelled logout");
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
              className="flex-1 cursor-pointer hover:bg-gray-100 hover:text-black text-black font-medium"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleLogout}
              className="flex-1 cursor-pointer"
            >
              Sign out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Logout;
