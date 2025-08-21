import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

const AuthFailed = () => {
  const router = useRouter();

  return (
    <div className="w-full flex items-center justify-center min-h-screen p-4">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="w-full max-w-md shadow-none border-none">
          <div className="space-y-4">
            <motion.div
              className="flex items-center justify-center text-red-500"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                delay: 0.2,
                duration: 0.6,
                type: "spring",
                stiffness: 200,
              }}
            >
              <AlertCircle className="h-8 w-8" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <h2 className="text-center text-2xl font-bold">Oh Sugar</h2>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <div className="text-center">
                We encountered an error while processing your Google sign-in
                request. This might be due to network issues or expired
                credentials.
              </div>
            </motion.div>
          </div>

          <div className="w-full flex justify-center pt-2 mt-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full"
            >
              <Button
                arial-label="Try again"
                className="w-full cursor-pointer"
                onClick={() => router.push("/auth/login")}
              >
                Try Again
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthFailed;
