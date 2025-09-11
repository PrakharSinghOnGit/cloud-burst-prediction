"use client";

import { useState, useEffect } from "react";

const UPDATE_INTERVAL = 5000; // 5 seconds - you can edit this value

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

export function usePredictionData() {
  const [data, setData] = useState<PredictionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchData = async () => {
    try {
      const response = await fetch("http://34.131.144.192:8000/latest-result/");
      if (!response.ok) {
        throw new Error("Failed to fetch prediction data");
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

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, UPDATE_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  return {
    data,
    loading,
    error,
    refresh: fetchData,
  };
}
