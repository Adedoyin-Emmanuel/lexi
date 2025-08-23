"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FileText, Upload, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface EmptyStateProps {
  title: string;
  delay?: number;
  actionText: string;
  actionHref: string;
  description: string;
  icon?: React.ComponentType<{ className?: string; strokeWidth?: number }>;
}

export const EmptyState = ({
  title,
  description,
  actionText,
  actionHref,
  icon: Icon = FileText,
  delay = 0,
}: EmptyStateProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card className="border-dashed border-2 border-gray-200 dark:border-gray-700">
        <CardContent className="flex flex-col items-center justify-center py-12 px-6 text-center">
          <div className="mb-4 p-3 rounded-full bg-gray-100 dark:bg-gray-800">
            <Icon
              className="h-8 w-8 text-gray-500 dark:text-gray-400"
              strokeWidth={1.5}
            />
          </div>
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className="text-muted-foreground mb-6 max-w-sm">{description}</p>
          <Link href={actionHref}>
            <Button className="gap-2 cursor-pointer">
              <Plus className="h-4 w-4" strokeWidth={1.5} />
              {actionText}
            </Button>
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export const EmptyContractsState = ({ delay = 0 }: { delay?: number }) => (
  <EmptyState
    title="No contracts yet"
    description="Start by uploading your first contract to analyze it and get insights."
    actionText="Analyze New Contract"
    actionHref="/analyze"
    icon={Upload}
    delay={delay}
  />
);

export const EmptyDashboardState = ({ delay = 0 }: { delay?: number }) => (
  <EmptyState
    title="Welcome to Lexi!"
    description="Get started by uploading your first contract to begin analyzing and managing your legal documents."
    actionText="Upload First Contract"
    actionHref="/analyze"
    icon={FileText}
    delay={delay}
  />
);
