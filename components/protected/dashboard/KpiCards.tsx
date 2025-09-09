import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function KpiCards({
  intensityMmPerHr = 56,
  probabilityPct = 32,
  activeAlerts = 2,
}: {
  intensityMmPerHr?: number;
  probabilityPct?: number;
  activeAlerts?: number;
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
            Nowcasting intensity estimate
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
            Risk window next 6–12 hours
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Active Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{activeAlerts}</div>
          <p className="text-sm text-muted-foreground">City/zone advisories</p>
        </CardContent>
      </Card>
    </div>
  );
}
