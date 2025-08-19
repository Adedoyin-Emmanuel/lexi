"use client";

import { Play } from "lucide-react";
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
} from "@/components/ui/dialog";

interface DemoDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const DemoDialog = ({ isOpen, onOpenChange }: DemoDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Watch Lexi Demo</span>
          </DialogTitle>
        </DialogHeader>
        <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
          <div className="text-center">
            <Play className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              My demo video will be embedded here
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              I will be back soon with a demo video
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DemoDialog;
