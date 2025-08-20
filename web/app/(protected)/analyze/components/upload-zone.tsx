"use client";

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface UploadZoneProps {
  onUpload: (file: File) => void;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ onUpload }) => {
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setError(null);
    
    if (rejectedFiles.length > 0) {
      setError("Please upload a valid PDF or text file.");
      return;
    }

    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const validTypes = [
        "application/pdf",
        "text/plain",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ];
      
      if (!validTypes.includes(file.type)) {
        setError("Please upload a PDF, Word document, or text file.");
        return;
      }

      onUpload(file);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    multiple: false
  });

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="border-2 border-dashed border-gray-300 hover:border-indigo-500 transition-colors">
        <CardContent className="p-12">
          <div
            {...getRootProps()}
            className={`text-center cursor-pointer transition-all ${
              isDragActive ? "scale-105" : ""
            }`}
          >
            <input {...getInputProps()} />
            
            <div className="mb-6">
              <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                {isDragActive ? (
                  <Upload className="w-8 h-8 text-indigo-600" />
                ) : (
                  <FileText className="w-8 h-8 text-indigo-600" />
                )}
              </div>
              
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                {isDragActive ? "Drop your contract here" : "Upload your contract"}
              </h2>
              
              <p className="text-gray-600 mb-6">
                Drag and drop your contract file here, or click to browse
              </p>
              
              <Button variant="outline" className="mb-4">
                Choose File
              </Button>
              
              <div className="text-sm text-gray-500">
                Supports PDF, Word documents, and text files
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-700">{error}</span>
            </div>
          )}

          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              What Lexi will analyze:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                Key contract clauses and terms
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                Potential risks and red flags
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                Your obligations and deadlines
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                Negotiation suggestions
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
