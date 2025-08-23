"use client";

import { motion } from "framer-motion";
import { Settings as SettingsIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function SettingsHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center">
          <SettingsIcon
            className="h-5 w-5 text-primary-foreground"
            strokeWidth={1.5}
          />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account preferences
          </p>
        </div>
      </div>
      <Separator />
    </motion.div>
  );
}
