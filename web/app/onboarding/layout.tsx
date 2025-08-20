import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Onboarding",
  description: "Onboarding to your account",
};

const OnboardingLayout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default OnboardingLayout;
