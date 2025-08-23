"use client";

import {
  Plus,
  Clock,
  Upload,
  FileText,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import dayjs from "dayjs";
import Link from "next/link";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import relativeTime from "dayjs/plugin/relativeTime";

import { Axios } from "@/app/config/axios";
import { Button } from "@/components/ui/button";
import { DashboardSkeleton } from "./components/loading-skeleton";
import { StatsCard, ContractCard, FloatingActionButton } from "./components";

dayjs.extend(relativeTime);

interface DashboardStats {
  totalContracts: number;
  needsAttention: number;
  inProcessing: number;
  contractsPassed: number;
}

interface RecentContract {
  id: string;
  title: string;
  createdAt: string;
  riskScore: number;
  confidenceScore: number;
}

interface ApiResponse<T> {
  code: number;
  status: string;
  success: boolean;
  message: string;
  data: T;
}

const fetchDashboardStats = async (): Promise<DashboardStats> => {
  const response = await Axios.get<ApiResponse<DashboardStats>>(
    "/metrics/overview"
  );
  return response.data.data;
};

const fetchRecentContracts = async (): Promise<RecentContract[]> => {
  const response = await Axios.get<ApiResponse<RecentContract[]>>(
    "/metrics/recent-contracts"
  );
  return response.data.data;
};

const formatDate = (dateString: string): string => {
  return dayjs(dateString).fromNow();
};

const getStatusFromRiskScore = (
  riskScore: number
): "Safe" | "Risky" | "Processing" | "Needs Review" => {
  if (riskScore >= 65) return "Risky";
  if (riskScore >= 40) return "Needs Review";
  return "Safe";
};

const statsData = [
  {
    icon: FileText,
    key: "totalContracts" as keyof DashboardStats,
    label: "Total Contracts",
    delay: 0.1,
  },
  {
    icon: AlertTriangle,
    key: "needsAttention" as keyof DashboardStats,
    label: "Need Attention",
    delay: 0.2,
  },
  {
    icon: Clock,
    key: "inProcessing" as keyof DashboardStats,
    label: "In Processing",
    delay: 0.3,
  },
  {
    icon: CheckCircle,
    key: "contractsPassed" as keyof DashboardStats,
    label: "Contracts Passed",
    delay: 0.4,
  },
];

export default function Dashboard() {
  const {
    data: dashboardStats,
    isLoading: statsLoading,
    error: statsError,
  } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: fetchDashboardStats,
  });

  const {
    data: recentContracts,
    isLoading: contractsLoading,
    error: contractsError,
  } = useQuery({
    queryKey: ["recent-contracts"],
    queryFn: fetchRecentContracts,
  });

  if (statsLoading || contractsLoading) {
    return <DashboardSkeleton />;
  }

  if (statsError || contractsError) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
          <p className="text-muted-foreground">Failed to load dashboard data</p>
        </div>
      </div>
    );
  }

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

          <Link href="/analyze">
            <Button size="lg" className="gap-2 hidden md:flex cursor-pointer">
              <Plus className="h-4 w-4" strokeWidth={1.5} />
              Analyze New Contract
            </Button>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map((stat, index) => (
            <StatsCard
              key={index}
              icon={stat.icon}
              number={dashboardStats?.[stat.key] || 0}
              label={stat.label}
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
            {recentContracts?.map((contract, index) => (
              <ContractCard
                key={contract.id}
                id={contract.id}
                name={contract.title}
                uploadedAt={formatDate(contract.createdAt)}
                status={getStatusFromRiskScore(contract.riskScore)}
                confidenceScore={contract.confidenceScore}
                delay={0.5 + index * 0.1}
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
