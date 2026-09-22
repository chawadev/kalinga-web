"use client";

import { Shield, CheckCircle2, XCircle } from "lucide-react";
import { useState } from "react";

interface ConsentCardProps {
  provider: string;
  scope: string;
  duration: string;
}

export default function ConsentCard({ provider, scope, duration }: ConsentCardProps) {
  const [status, setStatus] = useState<"pending" | "approved" | "declined">("pending");

  const handleApprove = () => {
    setStatus("approved");
  };

  const handleDeny = () => {
    setStatus("declined");
  };

  return (
    <div className="w-full max-w-md rounded-2xl glass-strong p-6 border border-glass-border">
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <div className="h-10 w-10 rounded-full bg-primary/10 text-primary grid place-items-center">
          <Shield className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-foreground mb-1">Permission required</h3>
          <p className="text-sm text-muted-foreground">{provider}</p>
        </div>
      </div>

      {/* Body */}
      <div className="mb-6">
        <p className="text-sm text-foreground leading-relaxed">
          {scope} for {duration}. This is a read-only access request.
        </p>
      </div>

      {/* Status Display */}
      {status !== "pending" && (
        <div className={`flex items-center gap-2 mb-4 p-3 rounded-lg ${
          status === "approved" 
            ? "bg-emerald-500/10 text-emerald-500" 
            : "bg-destructive/10 text-destructive"
        }`}>
          {status === "approved" ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <XCircle className="h-4 w-4" />
          )}
          <span className="text-sm font-medium capitalize">{status}</span>
        </div>
      )}

      {/* Actions */}
      {status === "pending" && (
        <div className="flex gap-3">
          <button
            onClick={handleApprove}
            className="flex-1 py-2.5 px-4 rounded-full bg-primary text-primary-foreground font-medium hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            Approve Sync
          </button>
          <button
            onClick={handleDeny}
            className="flex-1 py-2.5 px-4 rounded-full glass hover:bg-destructive/10 hover:text-destructive font-medium transition-all duration-200"
          >
            Deny
          </button>
        </div>
      )}
    </div>
  );
}
