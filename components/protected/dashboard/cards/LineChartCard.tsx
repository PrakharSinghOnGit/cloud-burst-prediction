"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React, { useEffect, useState } from "react";
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const MAX_DATA_POINTS = 20;

interface ValueCardProps {
  title: string;
  value: number;
  unit: string;
  desc: string;
  type:
    | "basis"
    | "basisClosed"
    | "basisOpen"
    | "bumpX"
    | "bumpY"
    | "bump"
    | "linear"
    | "linearClosed"
    | "natural"
    | "monotoneX"
    | "monotoneY"
    | "monotone"
    | "step"
    | "stepBefore"
    | "stepAfter";
  icon: React.ReactNode;
  color?: string;
}

const LineChartCard = ({
  title,
  value,
  unit,
  desc,
  icon,
  type,
  color,
}: ValueCardProps) => {
  const [chartData, setchartData] = useState<number[]>([]);

  useEffect(() => {
    setchartData((prev) => [...prev, value].slice(-MAX_DATA_POINTS));
  }, [value]);

  const getTrend = () => {
    if (chartData.length < 2) return { direction: "flat", percentage: 0 };

    const recent = chartData.slice(-3); // Last 3 points for trend
    const firstValue = recent[0] || 0;
    const lastValue = recent[recent.length - 1] || 0;

    if (firstValue === 0) return { direction: "flat", percentage: 0 };

    const percentage = ((lastValue - firstValue) / firstValue) * 100;
    const direction = percentage > 1 ? "up" : percentage < -1 ? "down" : "flat";

    return { direction, percentage: Math.abs(percentage) };
  };

  const trend = getTrend();

  // Format data for chart display
  const formattedChartData = chartData.map((point, index) => ({
    index: index,
    value: point,
    timestamp: new Date().getTime(),
    label: `T-${chartData.length - index}`,
  }));

  const getTrendIcon = () => {
    switch (trend.direction) {
      case "up":
        return <TrendingUp className="h-4 w-4" />;
      case "down":
        return <TrendingDown className="h-4 w-4" />;
      default:
        return <Minus className="h-4 w-4" />;
    }
  };

  const getTrendColor = () => {
    switch (trend.direction) {
      case "up":
        return "text-green-600/70 dark:text-green-400/70";
      case "down":
        return "text-red-600/70 dark:text-red-400/70";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <Card className="w-full h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {icon && <div className="text-muted-foreground">{icon}</div>}
            <CardTitle className="text-base font-medium">{title}</CardTitle>
          </div>
        </div>
        <div className="flex items-baseline space-x-1">
          <span className="text-2xl font-bold">{value}</span>
          {unit && (
            <span className="text-sm text-muted-foreground">{unit}</span>
          )}
        </div>
        {desc && <CardDescription className="text-xs">{desc}</CardDescription>}
      </CardHeader>
      <CardContent className="pb-2">
        <div className="h-[160px]">
          {formattedChartData.length > 1 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={formattedChartData}>
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tick={{ fontSize: 10 }}
                  interval="preserveStartEnd"
                />
                <YAxis hide />
                <Tooltip />
                <Line
                  dataKey="value"
                  strokeWidth={2}
                  type={type}
                  color={color}
                  dot={{
                    strokeWidth: 3,
                    r: 3,
                  }}
                  activeDot={{
                    r: 5,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <span className="text-sm">Collecting data...</span>
            </div>
          )}
        </div>
      </CardContent>
      {formattedChartData.length > 2 && (
        <CardFooter className="pt-0">
          <div className="flex w-full items-start gap-2 text-sm">
            <div
              className={`flex gap-1 font-medium leading-none ${getTrendColor()}`}
            >
              {trend.direction !== "flat" && (
                <>
                  {trend.direction === "up" ? "Up" : "Down"} by{" "}
                  {trend.percentage.toFixed(1)}%{getTrendIcon()}
                </>
              )}
              {trend.direction === "flat" && <>Stable trend {getTrendIcon()}</>}
            </div>
          </div>
          <div className="w-full text-xs text-muted-foreground leading-none mt-1">
            Based on recent data points
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default LineChartCard;
