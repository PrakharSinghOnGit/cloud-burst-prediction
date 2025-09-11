"use client";

import { useState, useEffect } from "react";

const UPDATE_INTERVAL = 5 * 60 * 1000; // 5 minutes in milliseconds

interface WeatherData {
  name: string;
  coord: {
    lat: number;
    lon: number;
  };
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level?: number;
    grnd_level?: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
    deg: number;
  };
  visibility: number;
  clouds: {
    all: number;
  };
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  dt: number;
  timezone: number;
  base: string;
}

export function useWeatherData(apiKey?: string) {
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(
    null
  );

  // Use provided API key or get from environment
  const API_KEY = apiKey || process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

  const fetchWeatherData = async (lat: number, lon: number) => {
    try {
      setLoading(true);
      setError(null);

      if (!API_KEY) {
        throw new Error("OpenWeatherMap API key is required");
      }

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
      );

      if (!response.ok) {
        throw new Error(
          `Weather data not found for coordinates ${lat}, ${lon}`
        );
      }

      const result = await response.json();
      setData(result);
      setLocation({ lat, lon });
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
      console.error("Weather fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getLocationAndFetch = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherData(latitude, longitude);
      },
      (geoError) => {
        console.error("Geolocation error:", geoError);
        setError("Unable to get location. Using default location.");
        // Fallback to a default location (New York)
        const defaultLat = 40.7128;
        const defaultLon = -74.006;
        fetchWeatherData(defaultLat, defaultLon);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  };

  useEffect(() => {
    getLocationAndFetch();
    const interval = setInterval(getLocationAndFetch, UPDATE_INTERVAL);
    return () => clearInterval(interval);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    data,
    loading,
    error,
    location,
    refresh: getLocationAndFetch,
  };
}
