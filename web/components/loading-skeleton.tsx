import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  width?: string;
  height?: string;
  className?: string;
}

export const LoadingSkeleton = ({
  className,
  width = "w-full",
  height = "h-4",
}: LoadingSkeletonProps) => {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-gray-200 dark:bg-gray-700",
        width,
        height,
        className
      )}
    />
  );
};

export const ContractCardSkeleton = () => {
  return (
    <div className="space-y-4 p-6 border rounded-lg border-gray-200">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0 pr-4">
          <div className="flex items-center gap-2 mb-3">
            <LoadingSkeleton className="w-4 h-4 rounded" />
            <LoadingSkeleton className="w-3/4 h-4" />
          </div>

          <div className="flex items-center gap-2 mb-3">
            <LoadingSkeleton className="w-3 h-3 rounded" />
            <LoadingSkeleton className="w-1/2 h-3" />
          </div>

          <div className="flex items-center gap-2 mb-4">
            <LoadingSkeleton className="w-16 h-6 rounded" />
            <LoadingSkeleton className="w-20 h-6 rounded" />
            <LoadingSkeleton className="w-24 h-6 rounded" />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <LoadingSkeleton className="w-12 h-12 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export const ContractDetailSkeleton = () => {
  return (
    <div className="space-y-8">
      <div className="animate-pulse">
        <LoadingSkeleton className="w-1/3 h-8 mb-4" />
        <LoadingSkeleton className="w-1/2 h-4" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-4 p-6 border rounded-lg border-gray-200">
            <LoadingSkeleton className="w-1/4 h-6" />
            <LoadingSkeleton className="w-3/4 h-4" />
            <LoadingSkeleton className="w-1/2 h-4" />
          </div>

          <div className="space-y-4 p-6 border rounded-lg border-gray-200">
            <LoadingSkeleton className="w-1/3 h-6" />
            <LoadingSkeleton className="w-full h-4" />
            <LoadingSkeleton className="w-2/3 h-4" />
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-4 p-6 border rounded-lg border-gray-200">
            <LoadingSkeleton className="w-1/2 h-6" />
            <LoadingSkeleton className="w-3/4 h-4" />
            <LoadingSkeleton className="w-1/2 h-4" />
          </div>

          <div className="space-y-4 p-6 border rounded-lg border-gray-200">
            <LoadingSkeleton className="w-1/3 h-6" />
            <LoadingSkeleton className="w-full h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};
