import { useProfile } from "@/hooks/useDatabase";
import { usePredictionDataContext } from "@/contexts/PredictionDataContext";
import DashboardSkeleton from "./ui/DashboardSkeleton";
import { AnimatedGroup } from "@/components/ui/animated-group";
import { Button } from "@/components/ui/button";
import {
  RefreshCw,
  AlertTriangle,
  CloudAlert,
  EyeIcon,
  Droplet,
  Wind,
  Thermometer,
} from "lucide-react";
import LineChartCard from "./dashboard/cards/LineChartCard";
// import { ChartRadarDots } from "./dashboard/cards/RadarChart";
import { ChartRadialText } from "./dashboard/cards/RadialChart";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export default function Dashboard() {
  const {
    data: profile,
    isLoading: profileLoading,
    error: profileError,
  } = useProfile();
  const {
    data: predictionData,
    loading: predictionLoading,
    error: predictionError,
    getSensorHistory,
    refresh,
  } = usePredictionDataContext();

  if (profileLoading || predictionLoading) return <DashboardSkeleton />;
  if (profile?.length == 0 || !profile)
    return <div>You don&apos;t have a profile yet.</div>;
  if (profileError)
    return <div>Error loading profile: {profileError.message}</div>;

  // Remove the unused function since we'll use getSensorHistory directly

  return (
    <div>
      <div className="flex items-center justify-between p-5 pb-3">
        <h2 className="font-bold text-2xl">Welcome, {profile[0].name}</h2>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <div
              className={`w-2 h-2 rounded-full ${
                predictionError ? "bg-red-500" : "bg-green-500"
              }`}
            ></div>
            {predictionError ? "Connection Error" : "Live Data"}
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={refresh}
            className="h-6 w-6 p-0"
          >
            <RefreshCw className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {predictionError && (
        <div className="mx-5 mb-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-red-500" />
          <span className="text-sm text-red-700 dark:text-red-300">
            Unable to fetch live prediction data: {predictionError}
          </span>
        </div>
      )}

      {predictionData?.details.last_input[0] !== undefined &&
        predictionData?.details.last_input[1] !== undefined &&
        predictionData?.details.last_input[2] !== undefined &&
        predictionData?.details.last_input[3] !== undefined &&
        predictionData?.details.last_input[4] !== undefined &&
        predictionData?.details.last_input[5] !== undefined &&
        predictionData?.details.last_input[6] !== undefined && (
          <AnimatedGroup
            preset="blur-slide"
            className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-5 pb-10"
          >
            {/* <ChartRadarDots arr={predictionData?.details.last_input} /> */}
            <Card className="w-full h-full flex flex-col">
              <CardHeader>
                <CardTitle>Cloudburst Warning</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col text-center items-center justify-center grow">
                {predictionData.details.final_prediction == 1 ? (
                  <>
                    <div className="text-2xl font-bold text-red-600">
                      Cloud Burst Detected!
                    </div>
                    <p>Take immediate precautions!</p>
                  </>
                ) : (
                  <>
                    <div className="text-2xl font-bold text-green-600">
                      Low Risk of Cloudburst
                    </div>
                    <p>Conditions are stable.</p>
                  </>
                )}
              </CardContent>
            </Card>
            <ChartRadialText
              val={
                predictionData.details.final_prediction_prob
                  ? predictionData.details.final_prediction_prob
                  : (predictionData.details.current_prediction_prob.rf_tabular +
                      predictionData.details.current_prediction_prob
                        .svc_tabular +
                      predictionData.details.current_prediction_prob
                        .xgboost_tabular) /
                    3
              }
            />
            <LineChartCard
              type="step"
              title="Cloud Top Height"
              value={predictionData?.details.last_input[0]}
              unit="km"
              desc="Current cloud top height"
              color="blue"
              icon={<AlertTriangle className="h-6 w-6 text-muted-foreground" />}
              persistentData={getSensorHistory(0)}
            />
            <LineChartCard
              type="monotone"
              title="Cloud Base Height"
              value={predictionData?.details.last_input[1]}
              unit="km"
              desc="Current cloud base height"
              color="pink"
              icon={<CloudAlert className="h-6 w-6 text-muted-foreground" />}
              persistentData={getSensorHistory(1)}
            />
            <LineChartCard
              type="monotone"
              title="Optical Thickness"
              value={predictionData?.details.last_input[2]}
              unit=""
              desc="Optical Thickness of the cloud"
              color="purple"
              icon={<EyeIcon className="h-6 w-6 text-muted-foreground" />}
              persistentData={getSensorHistory(2)}
            />
            <LineChartCard
              type="step"
              title="Rainfall Intensity"
              value={predictionData?.details.last_input[3]}
              unit="mm"
              desc="Current rainfall intensity"
              color="teal"
              icon={<Droplet className="h-6 w-6 text-muted-foreground" />}
              persistentData={getSensorHistory(3)}
            />
            <LineChartCard
              type="bump"
              title="Humidity"
              value={predictionData?.details.last_input[4]}
              unit="%"
              desc="Current humidity level"
              color="cyan"
              icon={<Wind className="h-6 w-6 text-muted-foreground" />}
              persistentData={getSensorHistory(4)}
            />
            <LineChartCard
              type="monotone"
              title="Temperature"
              value={predictionData?.details.last_input[5]}
              unit="°C"
              desc="Current Temperature"
              color="orange"
              icon={<Thermometer className="h-6 w-6 text-muted-foreground" />}
              persistentData={getSensorHistory(5)}
            />
            <LineChartCard
              type="monotone"
              title="Pressure"
              value={predictionData?.details.last_input[6]}
              unit="m"
              desc="Current cloud top height"
              color="yellow"
              icon={<Thermometer className="h-6 w-6 text-muted-foreground" />}
              persistentData={getSensorHistory(6)}
            />
          </AnimatedGroup>
        )}
    </div>
  );
}
