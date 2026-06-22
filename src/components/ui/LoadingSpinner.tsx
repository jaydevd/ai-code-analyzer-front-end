import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  fullPage?: boolean;
}

const sizeMap = {
  sm: "h-4 w-4",
  md: "h-8 w-8",
  lg: "h-12 w-12",
};

function LoadingSpinner({
  size = "md",
  className = "",
  fullPage = false,
}: LoadingSpinnerProps) {
  if (fullPage) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#020617]">
        <Loader2
          className={`animate-spin text-sky-400 ${sizeMap[size]} ${className}`}
        />
      </div>
    );
  }

  return (
    <Loader2
      className={`animate-spin text-sky-400 ${sizeMap[size]} ${className}`}
    />
  );
}

interface SkeletonProps {
  className?: string;
}

function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-white/10 ${className}`}
    />
  );
}

export { LoadingSpinner, Skeleton };
