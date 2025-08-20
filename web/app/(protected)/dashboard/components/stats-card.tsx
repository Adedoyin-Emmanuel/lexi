"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  label: string;
  delay?: number;
  subtext: string;
  icon: LucideIcon;
  number: string | number;
  trend?: "up" | "down" | "neutral";
}

export const StatsCard = ({
  icon: Icon,
  number,
  label,
  subtext,
  trend = "neutral",
  delay = 0,
}: StatsCardProps) => {
  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return "text-green-600";
      case "down":
        return "text-red-600";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card className="h-full">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{number}</p>
                <p className="text-sm text-muted-foreground">{label}</p>
              </div>
            </div>
          </div>
          <p className={`text-xs mt-2 ${getTrendColor()}`}>{subtext}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
};
