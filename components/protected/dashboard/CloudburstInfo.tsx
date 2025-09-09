import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CloudburstInfo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>About Cloudburst Prediction</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-muted-foreground">
        <p>
          Cloudbursts are short-duration, high-intensity rainfall events that
          can cause flash flooding. Prediction combines nowcasting
          (radar/satellite), numerical weather models, and historical patterns.
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            Intensity: Estimated mm/hr from radar reflectivity and local gauge
            corrections.
          </li>
          <li>
            Probability: Derived from ensemble models, convective indices, and
            recent trends.
          </li>
          <li>
            Alerts: Issued when thresholds are exceeded for risk windows
            (6–12h).
          </li>
        </ul>
        <p>
          Note: Values are indicative; always follow official meteorological
          advisories for safety actions.
        </p>
      </CardContent>
    </Card>
  );
}
