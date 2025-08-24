"use client";

import {
  Clock,
  Upload,
  FileText,
  CheckCircle,
  AlertTriangle,
  Plus,
  RefreshCw,
} from "lucide-react";
import dayjs from "dayjs";
import Link from "next/link";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import relativeTime from "dayjs/plugin/relativeTime";

import { Axios } from "@/app/config/axios";
import { Button } from "@/components/ui/button";
import { DashboardSkeleton } from "./components/loading-skeleton";
import {
  StatsCard,
  ContractCard,
  FloatingActionButton,
  EmptyContractsState,
  EmptyDashboardState,
} from "./components";

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
  status: string;
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
  try {
    const response = await Axios.get<ApiResponse<DashboardStats>>(
      "/metrics/overview"
    );
    return response.data.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.response?.status === 404) {
      return {
        totalContracts: 0,
        needsAttention: 0,
        inProcessing: 0,
        contractsPassed: 0,
      };
    }
    throw error;
  }
};

const fetchRecentContracts = async (): Promise<RecentContract[]> => {
  try {
    const response = await Axios.get<ApiResponse<RecentContract[]>>(
      "/metrics/recent-contracts"
    );
    return response.data.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.response?.status === 404) {
      return [];
    }
    throw error;
  }
};

const formatDate = (dateString: string): string => {
  return dayjs(dateString).fromNow();
};

const getStatusFromRiskScore = (
  riskScore: number,
  status: string | null
): "Safe" | "Risky" | "Processing" | "Needs Review" | "Failed" => {
  console.log(status);

  if (status === "failed") return "Failed";

  if (riskScore === 0 || riskScore === null || riskScore === undefined)
    return "Processing";
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
          <p className="text-muted-foreground mb-4">
            Failed to load dashboard data
          </p>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const hasNoContracts = !recentContracts || recentContracts.length === 0;
  const hasNoStats =
    !dashboardStats ||
    (dashboardStats.totalContracts === 0 &&
      dashboardStats.needsAttention === 0 &&
      dashboardStats.inProcessing === 0 &&
      dashboardStats.contractsPassed === 0);

  if (hasNoContracts && hasNoStats) {
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

          <EmptyDashboardState delay={0.2} />
        </div>

        <FloatingActionButton
          className="block md:hidden"
          onClick={() => {
            console.log("Analyze new contract clicked");
          }}
        />
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

        {dashboardStats &&
          dashboardStats.totalContracts > 0 &&
          dashboardStats.totalContracts <= 3 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-700 rounded-lg p-4"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-800">
                  <FileText
                    className="h-5 w-5 text-gray-600 dark:text-gray-400"
                    strokeWidth={1.5}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    Great start! 🎉
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    You&apos;ve uploaded {dashboardStats.totalContracts}{" "}
                    contract
                    {dashboardStats.totalContracts !== 1 ? "s" : ""}. Keep
                    uploading more contracts to get better insights and track
                    your legal document portfolio.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

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
            {hasNoContracts ? (
              <EmptyContractsState delay={0.5} />
            ) : (
              recentContracts?.map((contract, index) => (
                <ContractCard
                  key={contract.id}
                  id={contract.id}
                  name={contract.title}
                  uploadedAt={formatDate(contract.createdAt)}
                  status={getStatusFromRiskScore(
                    contract.riskScore,
                    contract.status
                  )}
                  confidenceScore={contract.confidenceScore}
                  delay={0.5 + index * 0.1}
                />
              ))
            )}
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
