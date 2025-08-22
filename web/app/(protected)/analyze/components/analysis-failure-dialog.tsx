import { AlertCircle, RefreshCw, X } from "lucide-react";

import {
  Dialog,
  DialogTitle,
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogDescription,
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
  failureReason,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 my-2">
            Analysis Failed
          </DialogTitle>
          <DialogDescription>
            The document analysis process encountered an error. Please upload a
            different document.
          </DialogDescription>
        </DialogHeader>

        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" strokeWidth={1.5} />
          <AlertDescription className="text-red-800">
            {failureReason}
          </AlertDescription>
        </Alert>

        <DialogFooter className="w-full flex gap-2 items-center">
          <DialogClose>
            <Button
              variant="outline"
              onClick={onClose}
              className="flex items-center gap-2 cursor-pointer hover:bg-red-400 hover:border-red-400"
            >
              <X className="h-4 w-4" strokeWidth={1.5} />
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={onClose}
            className="flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className="h-4 w-4" strokeWidth={1.5} />
            Retry Analysis
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
