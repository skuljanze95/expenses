"use client";

import { useState } from "react";

import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { type ChartConfig, ChartContainer } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { type BudgetType } from "@/lib/db/schema/budget";
import { type CategoryType } from "@/lib/db/schema/transaction";
import { formatCurrency } from "@/lib/utils";

import { UpdateBudgetDrawer } from "./update-budget-drawer";

const chartConfig = {
  safari: {
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

type Props = {
  budget: BudgetType;
  category: CategoryType | null;
  sum: number;
  categories: CategoryType[];
  transactionCount: number;
};

export function BudgetCard({
  budget,
  categories,
  category,
  sum,
  transactionCount,
}: Props) {
  const percentage = (sum / Number(budget.amount)) * 100;

  const isOverBudget = sum > Number(budget.amount);

  const [isOpen, setIsOpen] = useState(false);

  const chartData = [
    {
      amount: percentage,
      fill: isOverBudget ? "#ef4444" : "#10b981",
    },
  ];

  return (
    <Card
      className="flex h-44 w-full justify-between"
      onClick={() => setIsOpen(true)}
    >
      <CardHeader className="justify-between">
        <div>
          <CardTitle>{category?.name}</CardTitle>
          <CardDescription className="pt-2">
            Budget:
            <span className="font-semibold">
              {formatCurrency(Number(budget.amount))}
            </span>
          </CardDescription>
          <CardDescription>
            Spent: <span className="font-semibold">{formatCurrency(sum)}</span>
          </CardDescription>
        </div>

        <p className="text-nowrap text-xs text-muted-foreground">
          {transactionCount}{" "}
          {transactionCount === 1 ? "transaction" : "transactions"} this month
        </p>
      </CardHeader>
      <CardContent className="w-50% p-0">
        <ChartContainer className="aspect-square h-44" config={chartConfig}>
          <RadialBarChart
            data={chartData}
            endAngle={(percentage / 100) * 360}
            innerRadius={60}
            outerRadius={90}
            startAngle={0}
          >
            <PolarGrid
              className="first:fill-muted last:fill-background"
              gridType="circle"
              polarRadius={[65, 55]}
              radialLines={false}
              stroke="none"
            />
            <RadialBar cornerRadius={10} dataKey="amount" background />
            <PolarRadiusAxis axisLine={false} tick={false} tickLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        dominantBaseline="middle"
                        textAnchor="middle"
                        x={viewBox.cx}
                        y={viewBox.cy}
                      >
                        <tspan
                          className="fill-foreground text-base font-semibold"
                          x={viewBox.cx}
                          y={viewBox.cy}
                        >
                          {formatCurrency(
                            Math.abs(Number(budget.amount) - sum),
                          )}
                        </tspan>
                        <tspan
                          className="fill-muted-foreground"
                          x={viewBox.cx}
                          y={(viewBox.cy ?? 0) + 24}
                        >
                          {isOverBudget ? "Over budget" : "Available"}
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <UpdateBudgetDrawer
        budget={budget}
        categories={categories}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
    </Card>
  );
}
export function BudgetCardSkeleton() {
  return (
    <Card className="flex h-44 w-full justify-between">
      <CardHeader className="justify-between">
        <div>
          <CardTitle>
            <Skeleton className="h-6 w-32" />
          </CardTitle>
          <CardDescription className="pt-2">
            <Skeleton className="h-4 w-24" />
          </CardDescription>
          <CardDescription>
            <Skeleton className="h-4 w-24" />
          </CardDescription>
        </div>
        <Skeleton className="h-4 w-16" />
      </CardHeader>
      <CardContent className="w-50% flex h-44 items-center justify-center p-0 pr-5">
        <Skeleton className="aspect-square h-32 w-full rounded-full" />
      </CardContent>
    </Card>
  );
}
