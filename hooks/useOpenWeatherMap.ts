"use client";

import { useState, useEffect } from "react";

const UPDATE_INTERVAL = 5 * 60 * 1000; // 5 minutes in milliseconds

export function useWeatherData(apiKey: string) {
  const [data, setData] = useState<null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeatherData = async (lat: number, lon: number) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch weather data");
      }

      const result = await response.json();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
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
        setError(geoError.message);
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    getLocationAndFetch();
    const interval = setInterval(getLocationAndFetch, UPDATE_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  return {
    data,
    loading,
    error,
    refresh: getLocationAndFetch,
  };
}
