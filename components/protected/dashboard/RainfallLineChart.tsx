"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type RainfallPoint = {
  time: string;
  rainfallMm: number;
};

export default function RainfallLineChart({
  title = "Rainfall (last 24h)",
  data = defaultData,
}: {
  title?: string;
  data?: RainfallPoint[];
}) {
  return (
    <Card className="w-full h-80">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 24, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="time" tick={{ fontSize: 12 }} />
            <YAxis
              tickFormatter={(v) => `${v}mm`}
              width={48}
              tick={{ fontSize: 12 }}
            />
            <Tooltip formatter={(v: number) => [`${v} mm`, "Rainfall"]} />
            <Line
              type="monotone"
              dataKey="rainfallMm"
              stroke="#2563eb"
              strokeWidth={2}
              dot={false}
              isAnimationActive
              animationDuration={700}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

const defaultData: RainfallPoint[] = [
  { time: "00:00", rainfallMm: 0 },
  { time: "02:00", rainfallMm: 1 },
  { time: "04:00", rainfallMm: 0 },
  { time: "06:00", rainfallMm: 3 },
  { time: "08:00", rainfallMm: 5 },
  { time: "10:00", rainfallMm: 8 },
  { time: "12:00", rainfallMm: 4 },
  { time: "14:00", rainfallMm: 2 },
  { time: "16:00", rainfallMm: 6 },
  { time: "18:00", rainfallMm: 10 },
  { time: "20:00", rainfallMm: 7 },
  { time: "22:00", rainfallMm: 2 },
];
