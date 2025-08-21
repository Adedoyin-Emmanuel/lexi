"use client";

import React, { useCallback, useState } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import { Upload, FileText, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

interface UploadZoneProps {
  onUpload: (file: File) => void;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ onUpload }) => {
  const [error, setError] = useState<string | null>(null);
  const isMobile = useIsMobile();

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      setError(null);

      if (rejectedFiles.length > 0) {
        setError("Please upload a valid PDF or text file.");
        return;
      }

      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        const validTypes = [
          "text/plain",
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ];

        if (!validTypes.includes(file.type)) {
          setError("Please upload a PDF, Word document, or text file.");
          return;
        }

        onUpload(file);
      }
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/plain": [".txt"],
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
    },
    multiple: false,
  });

  return (
    <div className="w-full max-w-2xl">
      <Card
        className={`border-2 border-dashed transition-all duration-200 ${
          isDragActive
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 bg-background"
        }`}
      >
        <CardContent className={`${isMobile ? "p-6" : "p-8 sm:p-12"}`}>
          <div {...getRootProps()} className="text-center cursor-pointer">
            <input {...getInputProps()} />

            <div className="flex flex-col items-center space-y-6">
              <div
                className={`border border-dashed border-gray-200 rounded-full flex items-center justify-center ${
                  isMobile ? "w-12 h-12" : "w-16 h-16"
                }`}
              >
                {isDragActive ? (
                  <Upload
                    className={`text-primary ${
                      isMobile ? "w-6 h-6" : "w-8 h-8"
                    }`}
                    strokeWidth={1.5}
                  />
                ) : (
                  <FileText
                    className={`text-muted-foreground ${
                      isMobile ? "w-6 h-6" : "w-8 h-8"
                    }`}
                    strokeWidth={1.5}
                  />
                )}
              </div>

              <div className="space-y-1">
                <h3
                  className={`font-medium text-foreground capitalize ${
                    isMobile ? "text-lg" : "text-xl"
                  }`}
                >
                  {isDragActive
                    ? "Drop your contract here"
                    : "Upload your contract"}
                </h3>

                <p
                  className={`text-muted-foreground ${
                    isMobile ? "text-xs" : "text-xs"
                  }`}
                >
                  Drag and drop or click to browse (pdf, docx, txt)
                </p>
              </div>

              <Button
                variant="outline"
                className={`hover:bg-primary cursor-pointer border border-gray-300 ${
                  isMobile ? "w-full" : "w-4/6"
                }`}
              >
                Choose File
              </Button>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-1 bg-destructive/10 border border-destructive/20 rounded-md flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0" />
              <span className="text-sm text-destructive">{error}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
