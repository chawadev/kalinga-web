"use client";

import { AlertCircle, CheckCircle2, ChevronRight } from "lucide-react";
import { useState } from "react";

interface ActivityVerificationCardProps {
  merchant: string;
  amount: string;
  date: string;
  status: "verified" | "pending" | "flagged";
}

export default function ActivityVerificationCard({
  merchant,
  amount,
  date,
  status: initialStatus,
}: ActivityVerificationCardProps) {
  const [status, setStatus] = useState<"verified" | "pending" | "flagged">(initialStatus);

  const handleConfirm = () => {
    setStatus("verified");
  };

  const handleFlag = () => {
    setStatus("flagged");
  };

  const getStatusConfig = () => {
    switch (status) {
      case "verified":
        return {
          icon: CheckCircle2,
          color: "text-emerald-500",
          bgColor: "bg-emerald-500/10",
          borderColor: "border-emerald-500/20",
          label: "Verified Regular Merchant",
        };
      case "flagged":
        return {
          icon: AlertCircle,
          color: "text-destructive",
          bgColor: "bg-destructive/10",
          borderColor: "border-destructive/20",
          label: "Flagged for Review",
        };
      default:
        return {
          icon: AlertCircle,
          color: "text-amber-500",
          bgColor: "bg-amber-500/10",
          borderColor: "border-amber-500/20",
          label: "Pending Confirmation",
        };
    }
  };

  const config = getStatusConfig();
  const StatusIcon = config.icon;

  return (
    <div className="w-full max-w-md rounded-2xl glass-strong p-6 border border-glass-border">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`h-10 w-10 rounded-full ${config.bgColor} ${config.color} grid place-items-center`}>
            <StatusIcon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{merchant}</h3>
            <p className="text-sm text-muted-foreground">{date}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-foreground">{amount}</p>
        </div>
      </div>

      {/* Verification Status */}
      <div className={`flex items-center gap-2 mb-4 p-3 rounded-lg ${config.bgColor} ${config.borderColor} border`}>
        <StatusIcon className={`h-4 w-4 ${config.color}`} />
        <span className="text-sm font-medium text-foreground">{config.label}</span>
      </div>

      {/* Actions */}
      {status === "pending" && (
        <div className="flex gap-3">
          <button
            onClick={handleConfirm}
            className="flex-1 py-2.5 px-4 rounded-full bg-primary text-primary-foreground font-medium hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="h-4 w-4" />
            Confirm Transaction
          </button>
          <button
            onClick={handleFlag}
            className="flex-1 py-2.5 px-4 rounded-full glass hover:bg-destructive/10 hover:text-destructive font-medium transition-all duration-200 flex items-center justify-center gap-2"
          >
            <AlertCircle className="h-4 w-4" />
            Flag for Review
          </button>
        </div>
      )}

      {status === "verified" && (
        <button className="w-full py-2.5 px-4 rounded-full glass hover:bg-primary/10 text-muted-foreground hover:text-foreground font-medium transition-all duration-200 flex items-center justify-center gap-2">
          View Details
          <ChevronRight className="h-4 w-4" />
        </button>
      )}

      {status === "flagged" && (
        <button className="w-full py-2.5 px-4 rounded-full glass hover:bg-destructive/10 text-muted-foreground hover:text-destructive font-medium transition-all duration-200 flex items-center justify-center gap-2">
          Review Flagged Activity
          <ChevronRight className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
