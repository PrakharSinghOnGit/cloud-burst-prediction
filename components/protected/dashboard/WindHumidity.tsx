import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function WindHumidity({
  windSpeed = 14,
  humidity = 78,
  temperature = 25,
  pressure = 1013,
}: {
  windSpeed?: number;
  humidity?: number;
  temperature?: number;
  pressure?: number;
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Wind Speed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{windSpeed.toFixed(1)} km/h</div>
          <p className="text-xs text-muted-foreground">Current</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Humidity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{humidity.toFixed(1)}%</div>
          <p className="text-xs text-muted-foreground">Relative</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Temperature</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{temperature.toFixed(1)}°C</div>
          <p className="text-xs text-muted-foreground">Current</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Pressure</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pressure.toFixed(0)} hPa</div>
          <p className="text-xs text-muted-foreground">Atmospheric</p>
        </CardContent>
      </Card>
    </div>
  );
}
