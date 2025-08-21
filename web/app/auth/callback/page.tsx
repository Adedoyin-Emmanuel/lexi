"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import AuthFailed from "../components/auth-failed";
import AuthSuccess from "../components/auth-success";

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [redirectTo, setRedirectTo] = useState("");

  const error = searchParams.get("error");
  const success = searchParams.get("success");
  const redirectUrl = searchParams.get("redirectUrl");
  const accessToken = searchParams.get("accessToken");
  const hasOnboarded = searchParams.get("isOnboarded");

  const needsOnboarding = hasOnboarded === "false";

  useEffect(() => {
    const isSuccessful = success === "true";

    if (redirectUrl) {
      setRedirectTo(redirectUrl);
    }

    if (!isSuccessful && error) {
      setIsSuccess(false);
    } else {
      setIsSuccess(isSuccessful);
    }

    setIsLoading(false);

    if (isSuccessful && redirectUrl && accessToken && !needsOnboarding) {
      localStorage.setItem("accessToken", accessToken);

      router.push("/dashboard");
    }
  }, [success, error, redirectUrl, accessToken, router, needsOnboarding]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full">
        <Loader2
          className="animate-spin text-primary"
          strokeWidth={1.5}
          size={25}
        />
      </div>
    );
  }

  return isSuccess ? (
    <AuthSuccess redirectUrl={redirectTo} needsOnboarding={needsOnboarding} />
  ) : (
    <AuthFailed />
  );
}

export default function CallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="animate-spin" strokeWidth={1.5} size={25} />
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}
