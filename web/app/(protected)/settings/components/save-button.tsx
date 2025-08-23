"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Save, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SaveButtonProps {
  isFormValid: boolean;
  isSaving: boolean;
  showSuccess: boolean;
  onSave: () => void;
}

export function SaveButton({
  isFormValid,
  isSaving,
  showSuccess,
  onSave,
}: SaveButtonProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="pt-6 border-t"
    >
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          {!isFormValid && (
            <span>Please complete all required fields to save</span>
          )}
        </div>
        <Button
          onClick={onSave}
          disabled={!isFormValid || isSaving}
          className="min-w-[140px]"
        >
          <AnimatePresence mode="wait">
            {isSaving ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center"
              >
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                Saving...
              </motion.div>
            ) : showSuccess ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center"
              >
                <Check className="h-4 w-4 mr-2" />
                Saved!
              </motion.div>
            ) : (
              <motion.div
                key="default"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </div>
    </motion.div>
  );
}
