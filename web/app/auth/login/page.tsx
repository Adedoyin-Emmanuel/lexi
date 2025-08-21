"use client";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";

import Logo from "@/components/logo";
import Google from "./components/google";
import { Button } from "@/components/ui/button";

const Login = () => {
  const redirectUrl = "http://localhost:3000/";

  const [isLoading, setIsLoading] = useState(false);

  const handleContinueWithGoogle = async () => {
    try {
      setIsLoading(true);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL as string;

      const urlToRedirectTo = `${apiUrl}/auth/google?redirectUrl=${encodeURIComponent(
        redirectUrl
      )}`;

      window.location.href = urlToRedirectTo;
    } catch (error: unknown) {
      console.log(error);
      setIsLoading(false);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-8 text-center">
        <div className="flex justify-center">
          <Logo />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">Welcome to Lexi</h1>
          <p className="text-gray-600">
            Please sign in to access all of Lexi&apos;s services
          </p>
        </div>

        <Button
          size="lg"
          variant="outline"
          disabled={isLoading}
          onClick={handleContinueWithGoogle}
          className="w-full bg-white border-gray-200 hover:bg-transparent hover:text-black text-black font-medium cursor-pointer"
        >
          {isLoading ? (
            <Loader2 className="animate-spin" strokeWidth={1.5} />
          ) : (
            <Google />
          )}
          Continue with Google
        </Button>
      </div>
    </div>
  );
};

export default Login;
