"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsCardProps {
  label: string;
  delay?: number;
  icon: LucideIcon;
  number: string | number;
}

export const StatsCard = ({
  icon: Icon,
  number,
  label,
  delay = 0,
}: StatsCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{label}</CardTitle>
          <Icon className="w-5 h-5 text-muted-foreground" strokeWidth={1.5} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{number}</div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
