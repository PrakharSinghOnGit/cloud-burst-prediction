import { useProfile } from "@/hooks/useDatabase";
import DashboardSkeleton from "./ui/DashboardSkeleton";
import KpiCards from "./dashboard/KpiCards";
import RainfallLineChart from "./dashboard/RainfallLineChart";
import CloudburstProbability from "./dashboard/CloudburstProbability";
import CloudburstInfo from "./dashboard/CloudburstInfo";
import HourlyForecastBar from "./dashboard/HourlyForecastBar";
import RecentAlerts from "./dashboard/RecentAlerts";
import RiskByZone from "./dashboard/RiskByZone";
import WindHumidity from "./dashboard/WindHumidity";
import { AnimatedGroup } from "@/components/ui/animated-group";
import { Button } from "@/components/ui/button";
import { Download, Share2 } from "lucide-react";
import MapWidget from "./dashboard/MapWidget";

export default function Dashboard() {
  const { data: profile, isLoading, error } = useProfile();

  if (isLoading) return <DashboardSkeleton />;
  if (profile?.length == 0 || !profile)
    return <div>You don&apos;t have a profile yet.</div>;
  if (error) return <div>Error loading profile: {error.message}</div>;
  return (
    <div>
      <h2 className="font-bold text-2xl p-5">Welcome, {profile[0].name}</h2>
      <div className="px-5 pb-5">
        <AnimatedGroup preset="slide" className="[&>*]:will-change-transform">
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" className="gap-2"><Download className="h-4 w-4" /> Download</Button>
              <Button size="sm" variant="outline" className="gap-2"><Share2 className="h-4 w-4" /> Share</Button>
            </div>
            <KpiCards intensityMmPerHr={56} probabilityPct={32} activeAlerts={2} />
          </div>
        </AnimatedGroup>
      </div>
      <AnimatedGroup preset="blur-slide" className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-5 pb-10 [&>*]:will-change-transform">
        <div className="col-span-1 md:col-span-2">
          <RainfallLineChart />
        </div>
        <div>
          <CloudburstProbability probability={0.32} />
        </div>
        <div className="col-span-1 md:col-span-2 lg:col-span-3">
          <MapWidget />
        </div>
        <div className="col-span-1 md:col-span-2">
          <HourlyForecastBar />
        </div>
        <div>
          <RiskByZone />
        </div>
        <div className="col-span-1 md:col-span-2">
          <WindHumidity />
        </div>
        <div className="md:col-span-2 lg:col-span-3">
          <RecentAlerts />
        </div>
        <div className="md:col-span-2 lg:col-span-3">
          <CloudburstInfo />
        </div>
      </AnimatedGroup>
    </div>
  );
}
