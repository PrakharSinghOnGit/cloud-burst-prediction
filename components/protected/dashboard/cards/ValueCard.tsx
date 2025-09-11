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
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface DataPoint {
  timestamp: number;
  value: number;
}

interface ValueCardProps {
  title: string;
  value: string | number | undefined;
  unit: string;
  desc: string;
  icon: React.ReactNode;
  data?: DataPoint[];
  maxDataPoints?: number;
  showTrend?: boolean;
  color?: string;
}

const ValueCard = ({
  title,
  value,
  unit,
  desc,
  icon,
  data = [],
  maxDataPoints = 20,
  showTrend = true,
}: ValueCardProps) => {
  const [chartData, setChartData] = useState<DataPoint[]>([]);

  useEffect(() => {
    console.log("ValueCard received data:", data); // Debug log

    // If we have new data points, update chartData
    if (data && data.length > 0) {
      setChartData((prev) => {
        // If data has timestamps, use them; otherwise generate current timestamp
        const processedData = data.map((point, index) => ({
          timestamp:
            point.timestamp || Date.now() - (data.length - index - 1) * 60000, // 1 min intervals
          value:
            typeof point.value === "number"
              ? point.value
              : parseFloat(String(point.value)) || 0,
        }));

        // Combine with previous data and keep only recent points
        const combined = [...prev, ...processedData];
        // Remove duplicates based on timestamp and keep only maxDataPoints
        const unique = combined.filter(
          (item, index, self) =>
            index === self.findIndex((t) => t.timestamp === item.timestamp)
        );

        return unique.slice(-maxDataPoints);
      });
    }
  }, [data, maxDataPoints]);

  // Generate sample data if no real data is available
  useEffect(() => {
    if (chartData.length === 0 && (!data || data.length === 0)) {
      // Generate some sample data if no data is provided (for testing)
      const now = Date.now();
      const sampleData: DataPoint[] = Array.from({ length: 10 }, (_, i) => ({
        timestamp: now - (9 - i) * 60000, // Last 10 minutes
        value: Math.random() * 100 + 50, // Random values between 50-150
      }));
      setChartData(sampleData);
    }
  }, [chartData.length, data]);

  console.log("Current chartData length:", chartData.length); // Debug log

  // Calculate trend
  const getTrend = () => {
    if (chartData.length < 2) return { direction: "flat", percentage: 0 };

    const recent = chartData.slice(-3); // Last 3 points for trend
    const firstValue = recent[0]?.value || 0;
    const lastValue = recent[recent.length - 1]?.value || 0;

    if (firstValue === 0) return { direction: "flat", percentage: 0 };

    const percentage = ((lastValue - firstValue) / firstValue) * 100;
    const direction = percentage > 1 ? "up" : percentage < -1 ? "down" : "flat";

    return { direction, percentage: Math.abs(percentage) };
  };

  const trend = getTrend();

  // Format data for chart display
  const formattedChartData = chartData.map((point, index) => ({
    index: index,
    value: point.value,
    timestamp: point.timestamp,
    label: new Date(point.timestamp).toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    }),
  }));

  console.log("Formatted Chart Data:", formattedChartData);

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
        return "text-green-600 dark:text-green-400";
      case "down":
        return "text-red-600 dark:text-red-400";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <Card className="w-full">
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
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                //   dataKey="label"
                //   tickLine={false}
                //   axisLine={false}
                //   tickMargin={8}
                //   tick={{ fontSize: 10 }}
                //   interval="preserveStartEnd"
                />
                <YAxis hide />
                <Tooltip />
                <Line
                  dataKey="value"
                  strokeWidth={2}
                  dot={{
                    strokeWidth: 2,
                    r: 2,
                  }}
                  activeDot={{
                    r: 4,
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
      {showTrend && formattedChartData.length > 2 && (
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

export default ValueCard;
