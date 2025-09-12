"use client";

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
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { useEffect, useState } from "react";
export const description = "A radial chart with text";

export function ChartRadialText({ val }: { val: number }) {
  const chartConfig = {} satisfies ChartConfig;
  const chartData = [{ browser: "safari", visitors: val, fill: "blue" }];
  const [pro, setPro] = useState<number>(0);

  useEffect(() => {
    if (val != null) setPro(val);
  }, [val]);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Burst Probablity</CardTitle>
        <CardDescription>for next 1 hrs</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          {val == null ? (
            <div className="text-center text-sm text-muted-foreground">
              Computing
            </div>
          ) : (
            <RadialBarChart
              data={chartData}
              startAngle={0}
              endAngle={pro * 3.6}
              innerRadius={70}
              outerRadius={110}
            >
              <PolarGrid
                gridType="circle"
                radialLines={false}
                stroke="none"
                className="first:fill-muted last:fill-background"
                polarRadius={[86, 74]}
              />
              <RadialBar dataKey="visitors" background cornerRadius={10} />
              <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {pro.toLocaleString() + "%"}
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </PolarRadiusAxis>
            </RadialBarChart>
          )}
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
