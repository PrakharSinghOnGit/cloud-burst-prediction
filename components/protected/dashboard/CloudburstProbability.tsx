"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  Tooltip,
} from "recharts";

export default function CloudburstProbability({
  probability = 0.32,
}: {
  probability?: number; // 0..1
}) {
  const percent = Math.max(0, Math.min(1, probability)) * 100;
  const data = [
    {
      name: "Cloudburst",
      value: percent,
      fill: percent > 70 ? "#ef4444" : percent > 40 ? "#f59e0b" : "#22c55e",
    },
  ];
  return (
    <Card className="w-full h-80">
      <CardHeader>
        <CardTitle>Cloudburst Probability</CardTitle>
      </CardHeader>
      <CardContent className="h-64 grid grid-cols-1">
        <div className="relative h-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              innerRadius="70%"
              outerRadius="100%"
              data={data}
              startAngle={90}
              endAngle={-270}
            >
              <RadialBar
                minAngle={15}
                background
                clockWise
                dataKey="value"
                isAnimationActive
                animationDuration={800}
              />
              <Tooltip
                formatter={(v: number) => [`${v.toFixed(0)}%`, "Probability"]}
              />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl font-bold">{percent.toFixed(0)}%</div>
              <div className="text-sm text-muted-foreground">
                risk next 6–12h
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
