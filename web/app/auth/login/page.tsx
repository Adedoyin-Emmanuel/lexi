import React from "react";
import Logo from "@/components/logo";
import Google from "./components/google";
import { Button } from "@/components/ui/button";

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <Logo />
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your account to continue
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-3 py-3"
            onClick={() => {
              // TODO: Implement Google OAuth
              console.log("Google login clicked");
            }}
          >
            <Google />
            Continue with Google
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
