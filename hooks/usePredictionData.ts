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
    // Initial fetch
    fetchData();

    // Set up interval for updates
    const interval = setInterval(fetchData, UPDATE_INTERVAL);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

  // Helper functions to get user-friendly data
  const getHighestProbability = () => {
    if (!data?.details.current_prediction_prob) return 0;
    const probs = data.details.current_prediction_prob;
    return Math.max(probs.xgboost_tabular, probs.rf_tabular, probs.svc_tabular);
  };

  const getModelConsensus = () => {
    if (!data?.details.current_prediction) return 0;
    const predictions = data.details.current_prediction;
    const total =
      predictions.xgboost_tabular +
      predictions.rf_tabular +
      predictions.svc_tabular;
    return Math.round((total / 3) * 100); // Convert to percentage
  };

  const getDataCollectionProgress = () => {
    if (!data?.details.window_status)
      return { current: 0, needed: 14, percentage: 0 };
    const { current_size, needed_for_final } = data.details.window_status;
    return {
      current: current_size,
      needed: needed_for_final,
      percentage: Math.round((current_size / needed_for_final) * 100),
    };
  };

  return {
    data,
    loading,
    error,
    getHighestProbability,
    getModelConsensus,
    getDataCollectionProgress,
    refresh: fetchData,
  };
}
