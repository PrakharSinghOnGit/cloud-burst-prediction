import { useProfile } from "@/hooks/useDatabase";
import { usePredictionData } from "@/hooks/usePredictionData";
import DashboardSkeleton from "./ui/DashboardSkeleton";
import KpiCards from "./dashboard/KpiCards";
import RainfallLineChart from "./dashboard/RainfallLineChart";
import CloudburstProbability from "./dashboard/CloudburstProbability";
import CloudburstInfo from "./dashboard/CloudburstInfo";
import HourlyForecastBar from "./dashboard/HourlyForecastBar";
// import RecentAlerts from "./dashboard/RecentAlerts";
// import RiskByZone from "./dashboard/RiskByZone";
import WindHumidity from "./dashboard/WindHumidity";
import { AnimatedGroup } from "@/components/ui/animated-group";
import { Button } from "@/components/ui/button";
import { Download, Share2, RefreshCw, AlertTriangle } from "lucide-react";
import MapWidget from "./dashboard/MapWidget";

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
    getHighestProbability,
    getModelConsensus,
    getDataCollectionProgress,
    refresh,
  } = usePredictionData();

  if (profileLoading || predictionLoading) return <DashboardSkeleton />;
  if (profile?.length == 0 || !profile)
    return <div>You don&apos;t have a profile yet.</div>;
  if (profileError)
    return <div>Error loading profile: {profileError.message}</div>;

  const probability = getHighestProbability();
  const consensus = getModelConsensus();
  const progress = getDataCollectionProgress();

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

      <div className="px-5 pb-5">
        <AnimatedGroup preset="slide" className="[&>*]:will-change-transform">
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" className="gap-2">
                <Download className="h-4 w-4" /> Download Report
              </Button>
              <Button size="sm" variant="outline" className="gap-2">
                <Share2 className="h-4 w-4" /> Share Analysis
              </Button>
            </div>
            <KpiCards
              intensityMmPerHr={predictionData?.details.last_input[0] || 0}
              probabilityPct={Math.round(probability * 100)}
              activeAlerts={consensus > 66 ? 2 : consensus > 33 ? 1 : 0}
              dataProgress={progress}
              predictionStatus={predictionData?.message || "No data available"}
            />
          </div>
        </AnimatedGroup>
      </div>

      <AnimatedGroup
        preset="blur-slide"
        className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-5 pb-10 [&>*]:will-change-transform"
      >
        <div className="col-span-1 md:col-span-2">
          <RainfallLineChart />
        </div>
        <div>
          <CloudburstProbability
            probability={probability}
            consensus={consensus}
            modelProbabilities={predictionData?.details.current_prediction_prob}
          />
        </div>
        <div className="col-span-1 md:col-span-2 lg:col-span-3">
          <MapWidget />
        </div>
        <div className="col-span-1 md:col-span-2">
          <HourlyForecastBar />
        </div>
        {/* <div>
          <RiskByZone />
        </div> */}
        <div className="col-span-1 md:col-span-2">
          <WindHumidity
            humidity={predictionData?.details.last_input[2] || 0}
            windSpeed={predictionData?.details.last_input[4] || 0}
            temperature={predictionData?.details.last_input[1] || 0}
            pressure={predictionData?.details.last_input[6] || 0}
          />
        </div>
        {/* <div className="md:col-span-2 lg:col-span-3">
          <RecentAlerts />
        </div> */}
        <div className="md:col-span-2 lg:col-span-3">
          <CloudburstInfo
            predictionData={predictionData}
            dataProgress={progress}
          />
        </div>
      </AnimatedGroup>
    </div>
  );
}
