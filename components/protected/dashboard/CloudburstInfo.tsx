import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PredictionData } from "@/hooks/usePredictionData";

interface DataProgress {
  current: number;
  needed: number;
  percentage: number;
}

export default function CloudburstInfo({
  predictionData,
  dataProgress,
}: {
  predictionData?: PredictionData | null;
  dataProgress?: DataProgress;
}) {
  const formatSensorData = (data: number[]) => {
    const labels = [
      "Rainfall (mm/hr)",
      "Temperature (°C)",
      "Humidity (%)",
      "Cloud Cover",
      "Wind Speed (km/h)",
      "Pressure (hPa)",
      "Altitude (m)",
    ];

    return data.map((value, index) => ({
      label: labels[index] || `Sensor ${index + 1}`,
      value: value,
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Status & Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {predictionData && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium">System Status:</span>
              <Badge
                variant={
                  predictionData.status === "success"
                    ? "default"
                    : "destructive"
                }
              >
                {predictionData.status}
              </Badge>
            </div>

            <div className="bg-muted/50 p-3 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">
                Current Message:
              </p>
              <p className="text-sm font-medium">{predictionData.message}</p>
            </div>

            {dataProgress && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Data Collection Progress:</span>
                  <span>
                    {dataProgress.current} / {dataProgress.needed} samples
                  </span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${dataProgress.percentage}%` }}
                  ></div>
                </div>
                <p className="text-xs text-muted-foreground">
                  {dataProgress.needed - dataProgress.current} more samples
                  needed for final prediction
                </p>
              </div>
            )}

            {predictionData.details.last_input && (
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Latest Sensor Readings:</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                  {formatSensorData(predictionData.details.last_input).map(
                    (item, index) => (
                      <div key={index} className="bg-muted/30 p-2 rounded">
                        <div className="font-medium">{item.label}</div>
                        <div className="text-muted-foreground">
                          {item.value}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="border-t pt-3 space-y-2 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">
            About Cloudburst Prediction:
          </p>
          <p>
            This system uses machine learning models to predict cloudburst
            events based on real-time weather data. The AI models analyze
            patterns in rainfall, temperature, humidity, and atmospheric
            pressure.
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>XGBoost:</strong> Gradient boosting model for
              high-accuracy predictions
            </li>
            <li>
              <strong>Random Forest:</strong> Ensemble model for robust pattern
              recognition
            </li>
            <li>
              <strong>SVM:</strong> Support Vector Machine for complex boundary
              detection
            </li>
          </ul>
          <p className="text-xs">
            <strong>Disclaimer:</strong> This system provides probabilistic
            forecasts. Always follow official meteorological advisories for
            critical decisions.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
