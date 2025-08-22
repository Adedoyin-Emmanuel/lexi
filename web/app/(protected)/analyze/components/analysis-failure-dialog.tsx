"use client";

import { AlertCircle, RefreshCw, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AnalysisFailureDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onRetry: () => void;
  failureReason: string;
}

export const AnalysisFailureDialog: React.FC<AnalysisFailureDialogProps> = ({
  isOpen,
  onClose,
  onRetry,
  failureReason,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            Analysis Failed
          </DialogTitle>
          <DialogDescription>
            The document analysis process encountered an error. You can retry
            the analysis or cancel and upload a different document.
          </DialogDescription>
        </DialogHeader>

        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {failureReason}
          </AlertDescription>
        </Alert>

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Cancel
          </Button>
          <Button onClick={onRetry} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Retry Analysis
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
