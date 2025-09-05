import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function WindHumidity({ windKmph = 14, humidityPct = 78 }: { windKmph?: number; humidityPct?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <Card>
        <CardHeader>
          <CardTitle>Wind Speed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{windKmph} km/h</div>
          <p className="text-sm text-muted-foreground">Surface winds</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Humidity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{humidityPct}%</div>
          <p className="text-sm text-muted-foreground">Relative humidity</p>
        </CardContent>
      </Card>
    </div>
  );
}


