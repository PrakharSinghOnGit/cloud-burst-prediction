"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const UPDATE_INTERVAL = 5000; // 5 seconds

export interface PredictionData {
  status: string;
  message: string;
  details: {
    current_prediction: {
      xgboost_tabular: number;
      rf_tabular: number;
      svc_tabular: number;
    };
    current_prediction_prob: {
      xgboost_tabular: number;
      rf_tabular: number;
      svc_tabular: number;
    };
    final_prediction: number | null;
    final_prediction_prob: number | null;
    window_status: {
      current_size: number;
      needed_for_final: number;
    };
    last_input: number[];
  };
}

interface ChartDataPoint {
  time: string;
  xgboost: number;
  randomForest: number;
  svc: number;
  consensus: number;
  timestamp: number;
  // Store sensor readings for individual charts
  sensorReadings: number[];
}

interface PredictionDataContextType {
  data: PredictionData | null;
  loading: boolean;
  error: string | null;
  chartHistory: ChartDataPoint[];
  getSensorHistory: (sensorIndex: number) => number[];
  refresh: () => void;
}

const PredictionDataContext = createContext<
  PredictionDataContextType | undefined
>(undefined);

export function PredictionDataProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [data, setData] = useState<PredictionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartHistory, setChartHistory] = useState<ChartDataPoint[]>([]);

  const fetchData = async () => {
    try {
      const response = await fetch("http://api:8000/latest-result/");
      if (!response.ok) {
        throw new Error("Failed to fetch prediction data");
      }
      const result = await response.json();
      setData(result);
      setError(null);

      // Add to chart history
      if (result.details) {
        const now = new Date();
        const timeString = now.toLocaleTimeString();

        const newDataPoint: ChartDataPoint = {
          time: timeString,
          xgboost: result.details.current_prediction_prob.xgboost_tabular * 100,
          randomForest: result.details.current_prediction_prob.rf_tabular * 100,
          svc: result.details.current_prediction_prob.svc_tabular * 100,
          consensus: result.details.final_prediction_prob
            ? result.details.final_prediction_prob * 100
            : 0,
          timestamp: now.getTime(),
          sensorReadings: result.details.last_input || [],
        };

        setChartHistory((prev) => {
          const updated = [...prev, newDataPoint];
          // Keep only last 20 points to prevent memory issues
          return updated.slice(-20);
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, UPDATE_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  const getSensorHistory = (sensorIndex: number): number[] => {
    return chartHistory.map((point) => point.sensorReadings[sensorIndex] || 0);
  };

  return (
    <PredictionDataContext.Provider
      value={{
        data,
        loading,
        error,
        chartHistory,
        getSensorHistory,
        refresh: fetchData,
      }}
    >
      {children}
    </PredictionDataContext.Provider>
  );
}

export function usePredictionDataContext() {
  const context = useContext(PredictionDataContext);
  if (context === undefined) {
    throw new Error(
      "usePredictionDataContext must be used within a PredictionDataProvider"
    );
  }
  return context;
}
