import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { CheckCircle, Sparkles } from "lucide-react";

import {
  Card,
  CardTitle,
  CardHeader,
  CardFooter,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface AuthSuccessProps {
  redirectUrl?: string;
  needsOnboarding?: boolean;
}

const AuthSuccess = ({
  redirectUrl,
  needsOnboarding = false,
}: AuthSuccessProps) => {
  const router = useRouter();

  const handleContinue = () => {
    if (needsOnboarding) {
      router.push("/onboarding");
    } else {
      router.push(redirectUrl as string);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-4">
            <motion.div
              className="flex items-center justify-center text-green-500"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              {needsOnboarding ? (
                <Sparkles className="h-8 w-8" strokeWidth={1.5} />
              ) : (
                <CheckCircle className="h-8 w-8" strokeWidth={1.5} />
              )}
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <CardTitle className="text-center text-2xl font-bold">
                {needsOnboarding
                  ? "Welcome to Lexi!"
                  : "Authentication Successful"}
              </CardTitle>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <CardDescription className="text-center">
                {needsOnboarding
                  ? "Your Google sign-in was successful. Let's personalize Lexi to match your profession and needs."
                  : "Your Google sign-in was successful. You may now return to the app."}
              </CardDescription>
            </motion.div>
          </CardHeader>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <CardContent className="text-center text-sm text-gray-500">
              <p>
                {needsOnboarding
                  ? "This will help Lexi provide more relevant and accurate contract analysis."
                  : redirectUrl
                  ? "You will be redirected automatically in a moment."
                  : "You can safely close this window or continue to your dashboard."}
              </p>
            </CardContent>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <CardFooter className="flex justify-center pb-6 pt-2">
              <Button onClick={handleContinue} className="w-full">
                {needsOnboarding ? "Start Onboarding" : "Continue"}
              </Button>
            </CardFooter>
          </motion.div>
        </Card>
      </motion.div>
    </div>
  );
};

export default AuthSuccess;
