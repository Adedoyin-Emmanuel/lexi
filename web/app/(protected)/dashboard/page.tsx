"use client";

import {
  Plus,
  Clock,
  Upload,
  FileText,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { StatsCard, ContractCard, FloatingActionButton } from "./components";

const statsData = [
  {
    icon: FileText,
    number: "1,247",
    label: "Total Contracts",
    subtext: "+12 this week",
    trend: "up" as const,
    delay: 0.1,
  },
  {
    icon: AlertTriangle,
    number: "23",
    label: "Need Attention",
    subtext: "+3 this week",
    trend: "up" as const,
    delay: 0.2,
  },
  {
    icon: Clock,
    number: "8",
    label: "In Processing",
    subtext: "-2 this week",
    trend: "down" as const,
    delay: 0.3,
  },
  {
    icon: CheckCircle,
    number: "1,216",
    label: "Contracts Passed",
    subtext: "+15 this week",
    trend: "up" as const,
    delay: 0.4,
  },
];

const recentContracts = [
  {
    id: "1",
    name: "Employment Agreement - John Smith",
    uploadedAt: "5 minutes ago",
    status: "Safe" as const,
    confidenceScore: 95,
    delay: 0.5,
  },
  {
    id: "2",
    name: "Service Contract - TechCorp Inc",
    uploadedAt: "12 minutes ago",
    status: "Processing" as const,
    confidenceScore: 78,
    delay: 0.6,
  },
  {
    id: "3",
    name: "NDA - StartupXYZ",
    uploadedAt: "1 hour ago",
    status: "Needs Review" as const,
    confidenceScore: 45,
    delay: 0.7,
  },
  {
    id: "4",
    name: "Lease Agreement - Office Space",
    uploadedAt: "2 hours ago",
    status: "Risky" as const,
    confidenceScore: 32,
    delay: 0.8,
  },
  {
    id: "5",
    name: "Partnership Agreement - ABC Corp",
    uploadedAt: "3 hours ago",
    status: "Safe" as const,
    confidenceScore: 88,
    delay: 0.9,
  },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen w-full">
      <div className="w-full space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between"
        >
          <div></div>

          <Button size="lg" className="gap-2 hidden md:flex cursor-pointer">
            <Plus className="h-4 w-4" strokeWidth={1.5} />
            Analyze New Contract
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map((stat, index) => (
            <StatsCard
              key={index}
              icon={stat.icon}
              number={stat.number}
              label={stat.label}
              subtext={stat.subtext}
              trend={stat.trend}
              delay={stat.delay}
            />
          ))}
        </div>

        <br />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Recently Uploaded Contracts
            </h2>
            <Link href="/contracts" className="hidden md:block">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 hover:bg-primary border border-gray-200 hover:text-white cursor-pointer"
              >
                <Upload className="h-4 w-4" />
                View All
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {recentContracts.map((contract) => (
              <ContractCard
                key={contract.id}
                id={contract.id}
                name={contract.name}
                uploadedAt={contract.uploadedAt}
                status={contract.status}
                confidenceScore={contract.confidenceScore}
                delay={contract.delay}
              />
            ))}
          </div>
        </motion.div>

        <Link href="/contracts" className="block md:hidden w-full">
          <Button className="w-full">
            <Upload className="h-4 w-4" />
            View All
          </Button>
        </Link>
      </div>

      <br />

      <FloatingActionButton
        className="block md:hidden"
        onClick={() => {
          console.log("Analyze new contract clicked");
        }}
      />
    </div>
  );
}
