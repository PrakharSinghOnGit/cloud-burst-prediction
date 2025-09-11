import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DataProgress {
  current: number;
  needed: number;
  percentage: number;
}

export default function KpiCards({
  intensityMmPerHr = 56,
  probabilityPct = 32,
  activeAlerts = 2,
  dataProgress,
  predictionStatus,
}: {
  intensityMmPerHr?: number;
  probabilityPct?: number;
  activeAlerts?: number;
  dataProgress?: DataProgress;
  predictionStatus?: string;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      <Card>
        <CardHeader>
          <CardTitle>Rainfall Intensity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{intensityMmPerHr} mm/hr</div>
          <p className="text-sm text-muted-foreground">
            Current rainfall intensity
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Cloudburst Probability</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{probabilityPct}%</div>
          <p className="text-sm text-muted-foreground">
            AI model confidence level
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Prediction Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{activeAlerts}</div>
          <p className="text-sm text-muted-foreground">Active risk alerts</p>
          {dataProgress && (
            <div className="mt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Data Collection</span>
                <span>
                  {dataProgress.current}/{dataProgress.needed}
                </span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${dataProgress.percentage}%` }}
                ></div>
              </div>
              <p className="text-xs text-muted-foreground">
                {predictionStatus}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
