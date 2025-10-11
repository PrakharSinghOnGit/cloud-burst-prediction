"use client";

import { useState, useEffect } from "react";

const UPDATE_INTERVAL = 5000; // 5 seconds
const STORAGE_KEY = "prediction_data_history";
const MAX_HISTORY_LENGTH = 50;

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
}

export function usePersistentPredictionData() {
  const [data, setData] = useState<PredictionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartHistory, setChartHistory] = useState<ChartDataPoint[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem(STORAGE_KEY);
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        setChartHistory(parsed);
      } catch (err) {
        console.error("Failed to parse saved chart history:", err);
      }
    }
  }, []);

  // Save to localStorage whenever chartHistory changes
  useEffect(() => {
    if (chartHistory.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(chartHistory));
    }
  }, [chartHistory]);

  const fetchData = async () => {
    try {
      const response = await fetch("http://34.131.101.8:8000/latest-result/");
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
        };

        setChartHistory((prev) => {
          const updated = [...prev, newDataPoint];
          // Keep only recent data
          return updated.slice(-MAX_HISTORY_LENGTH);
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = () => {
    setChartHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, UPDATE_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  return {
    data,
    loading,
    error,
    chartHistory,
    refresh: fetchData,
    clearHistory,
  };
}
