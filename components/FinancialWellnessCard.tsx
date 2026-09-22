"use client";

import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";

interface FinancialWellnessCardProps {
  score: number;
  incomeRegularity: number;
  expenseToIncome: number;
  projectedSavings: string;
}

export default function FinancialWellnessCard({
  score,
  incomeRegularity,
  expenseToIncome,
  projectedSavings,
}: FinancialWellnessCardProps) {
  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="w-full max-w-md rounded-2xl glass-strong p-6 border border-glass-border">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-foreground">Financial Wellness</h3>
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-medium">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Healthy
        </div>
      </div>

      {/* Score Gauge */}
      <div className="flex justify-center mb-6">
        <div className="relative">
          <svg className="h-32 w-32 transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="54"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-muted-foreground/20"
            />
            <circle
              cx="64"
              cy="64"
              r="54"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="text-primary transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-foreground">{score}</span>
            <span className="text-xs text-muted-foreground">/100</span>
          </div>
        </div>
      </div>

      {/* Metric Grid */}
      <div className="space-y-4 mb-6">
        {/* Income Regularity */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Income Regularity</span>
            <span className="text-sm font-medium text-foreground">{incomeRegularity}%</span>
          </div>
          <div className="h-2 rounded-full bg-muted-foreground/20 overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${incomeRegularity}%` }}
            />
          </div>
        </div>

        {/* Expense-to-Income */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Expense-to-Income</span>
            <span className="text-sm font-medium text-foreground">{expenseToIncome}%</span>
          </div>
          <div className="h-2 rounded-full bg-muted-foreground/20 overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${expenseToIncome}%` }}
            />
          </div>
        </div>

        {/* Projected Savings */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-primary/5 border border-primary/20">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-primary" />
            <span className="text-sm text-muted-foreground">Projected Savings</span>
          </div>
          <span className="text-sm font-medium text-emerald-500">{projectedSavings}</span>
        </div>
      </div>

      {/* Summary */}
      <div className="p-4 rounded-lg bg-background/50 border border-glass-border">
        <p className="text-sm text-foreground leading-relaxed">
          Your financial health shows strong stability with consistent income patterns. Your expense-to-income ratio is well-balanced, positioning you for continued growth.
        </p>
      </div>
    </div>
  );
}
