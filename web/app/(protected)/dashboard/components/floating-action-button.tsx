"use client";

import { Plus } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";

interface FloatingActionButtonProps {
  onClick?: () => void;
  className?: string;
}

export const FloatingActionButton = ({
  onClick,
  className = "",
}: FloatingActionButtonProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: 1 }}
      className={`fixed bottom-6 right-6 z-50 ${className}`}
    >
      <Button
        size="lg"
        onClick={onClick}
        className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-shadow"
      >
        <Plus className="h-6 w-6" />
      </Button>
    </motion.div>
  );
};
