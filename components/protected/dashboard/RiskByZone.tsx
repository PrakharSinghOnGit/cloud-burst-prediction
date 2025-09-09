"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

type ZoneRisk = { zone: string; risk: number };

const defaults: ZoneRisk[] = [
  { zone: "North", risk: 70 },
  { zone: "Central", risk: 45 },
  { zone: "West", risk: 30 },
  { zone: "South", risk: 55 },
  { zone: "East", risk: 20 },
];

export default function RiskByZone({
  title = "Risk by Zone",
  data = defaults,
}: {
  title?: string;
  data?: ZoneRisk[];
}) {
  return (
    <Card className="w-full h-80">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 24, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="zone" tick={{ fontSize: 12 }} />
            <YAxis
              tickFormatter={(v) => `${v}%`}
              width={40}
              tick={{ fontSize: 12 }}
            />
            <Tooltip formatter={(v: number) => [`${v}%`, "Risk"]} />
            <Bar
              dataKey="risk"
              fill="#f59e0b"
              radius={[4, 4, 0, 0]}
              isAnimationActive
              animationDuration={700}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
