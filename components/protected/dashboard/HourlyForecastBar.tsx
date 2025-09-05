"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

type HourPoint = { hour: string; mm: number };

export default function HourlyForecastBar({
  title = "Hourly Rainfall Forecast (next 12h)",
  data = defaultData,
}: {
  title?: string;
  data?: HourPoint[];
}) {
  return (
    <Card className="w-full h-80">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 24, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="hour" tick={{ fontSize: 12 }} />
            <YAxis tickFormatter={(v) => `${v}mm`} width={48} tick={{ fontSize: 12 }} />
            <Tooltip formatter={(v: number) => [`${v} mm`, "Forecast"]} />
            <Bar dataKey="mm" fill="#0ea5e9" radius={[4, 4, 0, 0]} isAnimationActive animationDuration={700} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

const defaultData: HourPoint[] = [
  { hour: "+1h", mm: 2 },
  { hour: "+2h", mm: 4 },
  { hour: "+3h", mm: 6 },
  { hour: "+4h", mm: 9 },
  { hour: "+5h", mm: 7 },
  { hour: "+6h", mm: 5 },
  { hour: "+7h", mm: 3 },
  { hour: "+8h", mm: 1 },
  { hour: "+9h", mm: 0 },
  { hour: "+10h", mm: 0 },
  { hour: "+11h", mm: 2 },
  { hour: "+12h", mm: 4 },
];


