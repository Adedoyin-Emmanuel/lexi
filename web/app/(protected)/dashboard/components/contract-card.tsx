"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MoreVertical, Download, Eye } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { downloadContract } from "@/lib/download-contract";
import { CircularConfidence } from "../../components/circular-confidence";

interface ContractCardProps {
  id: string;
  name: string;
  delay?: number;
  uploadedAt: string;
  confidenceScore: number;
  status: "Safe" | "Risky" | "Processing" | "Needs Review";
}

export const ContractCard = ({
  id,
  name,
  status,
  delay = 0,
  uploadedAt,
  confidenceScore,
}: ContractCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Safe":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "Risky":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      case "Processing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "Needs Review":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card className="h-24 relative" id={id}>
        <CardContent className="p-4 h-full flex items-center justify-between">
          <div className="flex-1 min-w-0 pr-3">
            <h3 className="font-semibold text-sm truncate mb-1">{name}</h3>
            <p className="text-xs text-muted-foreground mb-1">{uploadedAt}</p>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                status
              )}`}
            >
              {status}
            </span>
          </div>
          <div className="flex items-center mt-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="cursor-help">
                  <CircularConfidence score={confidenceScore} />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Contract confidence score</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </CardContent>

        <div className="absolute top-2 right-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                aria-label="More options"
                className="h-6 w-6 p-0 hover:bg-white cursor-pointer hover:text-black"
              >
                <MoreVertical className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href={`/contracts/${id}`}>
                  <Eye className="mr-2 h-4 w-4 hover:text-white" />
                  View
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => downloadContract(id)}
              >
                <Download className="mr-2 h-4 w-4 hover:text-white" />
                Download
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Card>
    </motion.div>
  );
};
