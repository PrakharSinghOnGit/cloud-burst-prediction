"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  Tooltip,
} from "recharts";

interface ModelProbabilities {
  xgboost_tabular: number;
  rf_tabular: number;
  svc_tabular: number;
}

export default function CloudburstProbability({
  probability = 0.32,
  consensus = 0,
  modelProbabilities,
}: {
  probability?: number; // 0..1
  consensus?: number; // 0..100
  modelProbabilities?: ModelProbabilities;
}) {
  const percent = Math.max(0, Math.min(1, probability)) * 100;
  const data = [
    {
      name: "Cloudburst",
      value: percent,
      fill: percent > 70 ? "#ef4444" : percent > 40 ? "#f59e0b" : "#22c55e",
    },
  ];

  const getModelName = (key: string) => {
    switch (key) {
      case "xgboost_tabular":
        return "XGBoost";
      case "rf_tabular":
        return "Random Forest";
      case "svc_tabular":
        return "SVM";
      default:
        return key;
    }
  };

  return (
    <Card className="w-full h-80">
      <CardHeader>
        <CardTitle>Cloudburst Probability</CardTitle>
      </CardHeader>
      <CardContent className="h-64 space-y-4">
        <div className="relative h-48">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              innerRadius="70%"
              outerRadius="100%"
              data={data}
              startAngle={90}
              endAngle={-270}
            >
              <RadialBar
                background
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
              <div className="text-2xl font-bold">{percent.toFixed(0)}%</div>
              <div className="text-xs text-muted-foreground">Risk Level</div>
            </div>
          </div>
        </div>

        {modelProbabilities && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Model Predictions:</h4>
            <div className="space-y-1">
              {Object.entries(modelProbabilities).map(([key, value]) => (
                <div
                  key={key}
                  className="flex justify-between items-center text-sm"
                >
                  <span>{getModelName(key)}</span>
                  <Badge
                    variant={
                      value > 0.7
                        ? "destructive"
                        : value > 0.4
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {Math.round(value * 100)}%
                  </Badge>
                </div>
              ))}
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              Consensus: {consensus}% agreement
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
