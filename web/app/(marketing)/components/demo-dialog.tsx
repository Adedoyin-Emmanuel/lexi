"use client";

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
        <div className="aspect-video bg-muted rounded-lg overflow-hidden">
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/SoHnV4Ikkjc?si=5oguHxT0ztPSS4Zk"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DemoDialog;
