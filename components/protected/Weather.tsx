"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Cloud,
  Sun,
  CloudRain,
  CloudSnow,
  Zap,
  Wind,
  Droplets,
  Eye,
  Gauge,
  RefreshCw,
  MapPin,
  Activity,
  AlertTriangle,
} from "lucide-react";
import { useWeatherData } from "@/hooks/useOpenWeatherMap";
import { AnimatedGroup } from "../ui/animated-group";

const Weather = () => {
  const { data: weather, loading, error, location, refresh } = useWeatherData();

  const getWeatherIcon = (weatherMain: string) => {
    switch (weatherMain.toLowerCase()) {
      case "clear":
        return <Sun className="h-8 w-8 text-yellow-500" />;
      case "clouds":
        return <Cloud className="h-8 w-8 text-gray-500" />;
      case "rain":
      case "drizzle":
        return <CloudRain className="h-8 w-8 text-blue-500" />;
      case "snow":
        return <CloudSnow className="h-8 w-8 text-blue-200" />;
      case "thunderstorm":
        return <Zap className="h-8 w-8 text-purple-500" />;
      default:
        return <Cloud className="h-8 w-8 text-gray-500" />;
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 animate-spin" />
              Loading Weather Data...
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Weather Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <Button onClick={refresh} size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="pt-6">
            <p>No weather data available</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <AnimatedGroup preset="blur-slide" className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-2xl font-bold">
            {weather.name}, {weather.sys.country}
          </h2>
        </div>
        <Button onClick={refresh} size="sm" variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Main Weather Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {getWeatherIcon(weather.weather[0].main)}
              <div>
                <CardTitle className="text-3xl">
                  {Math.round(weather.main.temp)}°C
                </CardTitle>
                <p className="text-muted-foreground capitalize">
                  {weather.weather[0].description}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Feels like</p>
              <p className="text-lg font-semibold">
                {Math.round(weather.main.feels_like)}°C
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between text-sm">
            <span>H: {Math.round(weather.main.temp_max)}°</span>
            <span>L: {Math.round(weather.main.temp_min)}°</span>
          </div>
        </CardContent>
      </Card>

      {/* Weather Details Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Wind className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{weather.wind.speed} m/s</p>
                <p className="text-xs text-muted-foreground">Wind Speed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Droplets className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{weather.main.humidity}%</p>
                <p className="text-xs text-muted-foreground">Humidity</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Gauge className="h-5 w-5 text-gray-600" />
              <div>
                <p className="text-2xl font-bold">{weather.main.pressure}</p>
                <p className="text-xs text-muted-foreground">Pressure (hPa)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">
                  {(weather.visibility / 1000).toFixed(1)} km
                </p>
                <p className="text-xs text-muted-foreground">Visibility</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Sun Times</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sunrise</span>
                <span>{formatTime(weather.sys.sunrise)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sunset</span>
                <span>{formatTime(weather.sys.sunset)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Cloud Coverage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">{weather.clouds.all}%</span>
              <Badge
                variant={
                  weather.clouds.all > 70
                    ? "destructive"
                    : weather.clouds.all > 40
                    ? "secondary"
                    : "default"
                }
              >
                {weather.clouds.all > 70
                  ? "Heavy"
                  : weather.clouds.all > 40
                  ? "Moderate"
                  : "Light"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Weather Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {/* Air Quality & Comfort */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wind className="h-5 w-5" />
              Air Conditions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm">Feels Like</span>
              <span className="font-semibold">
                {Math.round(weather.main.feels_like)}°C
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Min/Max</span>
              <span className="font-semibold">
                {Math.round(weather.main.temp_min)}° /{" "}
                {Math.round(weather.main.temp_max)}°
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Sea Level</span>
              <span className="font-semibold">
                {weather.main.sea_level
                  ? `${weather.main.sea_level} hPa`
                  : "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Ground Level</span>
              <span className="font-semibold">
                {weather.main.grnd_level
                  ? `${weather.main.grnd_level} hPa`
                  : "N/A"}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Location Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Location Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm">Coordinates</span>
              <span className="font-semibold text-xs">
                {location
                  ? `${location.lat.toFixed(4)}, ${location.lon.toFixed(4)}`
                  : `${weather.coord.lat.toFixed(
                      4
                    )}, ${weather.coord.lon.toFixed(4)}`}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Country</span>
              <span className="font-semibold">{weather.sys.country}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Timezone</span>
              <span className="font-semibold">
                UTC{weather.timezone >= 0 ? "+" : ""}
                {weather.timezone / 3600}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Data Source</span>
              <span className="font-semibold text-xs">OpenWeather API</span>
            </div>
          </CardContent>
        </Card>

        {/* Weather System */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              System Info
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm">Data Time</span>
              <span className="font-semibold text-xs">
                {new Date(weather.dt * 1000).toLocaleTimeString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Last Updated</span>
              <span className="font-semibold text-xs">
                {new Date().toLocaleTimeString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Weather ID</span>
              <span className="font-semibold">{weather.weather[0].id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Base Station</span>
              <span className="font-semibold">{weather.base}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weather Alerts Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Weather Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Temperature Assessment */}
            <div className="text-center p-4 rounded-lg border">
              <div className="text-sm text-muted-foreground">Temperature</div>
              <Badge
                variant={
                  weather.main.temp > 30
                    ? "destructive"
                    : weather.main.temp < 5
                    ? "secondary"
                    : "default"
                }
                className="mt-2"
              >
                {weather.main.temp > 30
                  ? "Hot"
                  : weather.main.temp < 5
                  ? "Cold"
                  : "Comfortable"}
              </Badge>
            </div>

            {/* Humidity Assessment */}
            <div className="text-center p-4 rounded-lg border">
              <div className="text-sm text-muted-foreground">Humidity</div>
              <Badge
                variant={
                  weather.main.humidity > 80
                    ? "destructive"
                    : weather.main.humidity < 30
                    ? "secondary"
                    : "default"
                }
                className="mt-2"
              >
                {weather.main.humidity > 80
                  ? "Very Humid"
                  : weather.main.humidity < 30
                  ? "Dry"
                  : "Comfortable"}
              </Badge>
            </div>

            {/* Wind Assessment */}
            <div className="text-center p-4 rounded-lg border">
              <div className="text-sm text-muted-foreground">Wind</div>
              <Badge
                variant={
                  weather.wind.speed > 10
                    ? "destructive"
                    : weather.wind.speed > 5
                    ? "secondary"
                    : "default"
                }
                className="mt-2"
              >
                {weather.wind.speed > 10
                  ? "Strong"
                  : weather.wind.speed > 5
                  ? "Moderate"
                  : "Light"}
              </Badge>
            </div>

            {/* Visibility Assessment */}
            <div className="text-center p-4 rounded-lg border">
              <div className="text-sm text-muted-foreground">Visibility</div>
              <Badge
                variant={
                  weather.visibility < 1000
                    ? "destructive"
                    : weather.visibility < 5000
                    ? "secondary"
                    : "default"
                }
                className="mt-2"
              >
                {weather.visibility < 1000
                  ? "Poor"
                  : weather.visibility < 5000
                  ? "Moderate"
                  : "Good"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Debug Info
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Raw Weather Data (Debug)</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-xs bg-muted p-4 rounded-md overflow-auto max-h-60">
            {JSON.stringify(weather, null, 2)}
          </pre>
        </CardContent>
      </Card> */}
    </AnimatedGroup>
  );
};

export default Weather;
