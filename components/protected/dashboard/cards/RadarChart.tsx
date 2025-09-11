"use client";

import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "A radar chart with dots";

export function ChartRadarDots({ arr }: { arr: number[] }) {
  // Normalize array values to a 0-100 scale for better visualization
  const normalizedArr = arr.map((value) => {
    const min = Math.min(...arr);
    const max = Math.max(...arr);
    return ((value - min) / (max - min)) * 100;
  });

  console.log("Normalized Array:", normalizedArr);

  const chartData = [
    { domain: "Humidity", data: normalizedArr[1] },
    { domain: "Temperature", data: normalizedArr[2] },
    { domain: "Rainfall", data: normalizedArr[3] },
    { domain: "Pressure", data: normalizedArr[4] },
    { domain: "Thickness", data: normalizedArr[5] },
    { domain: "Height", data: normalizedArr[6] },
  ];

  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "blue",
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader className="items-center">
        <CardTitle>Overall Data</CardTitle>
        <CardDescription>
          Showing all sensor data in a radar chart
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadarChart data={chartData}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarAngleAxis dataKey="domain" />
            <PolarGrid />
            <Radar
              dataKey="data"
              fillOpacity={0.3}
              strokeWidth={2}
              stroke="green"
              dot={{
                r: 4,
                fillOpacity: 1,
              }}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
