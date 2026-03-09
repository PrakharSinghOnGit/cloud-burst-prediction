import express from "express";
import cors from "cors";

const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());

const dataSequence = [
  {
    final: 0.02,
    data: [0, 4322, 5400, 87, 50, 36, 1013],
  },
  {
    final: 0.02,
    data: [0, 4322, 5400, 87, 50, 36, 1013],
  },
  {
    final: 0.02,
    data: [0, 4322, 5400, 87, 50, 36, 1013],
  },
  {
    final: 0.02,
    data: [0, 4322, 5400, 87, 50, 36, 1013],
  },
  {
    final: 0.01,
    data: [0, 4331, 5379, 82, 52, 34, 1023],
  },
  {
    final: 0.02,
    data: [0, 4322, 5400, 87, 50, 36, 1013],
  },
  {
    final: 0.02,
    data: [0, 4322, 5400, 87, 50, 36, 1013],
  },
  {
    final: 0.01,
    data: [0, 4331, 5379, 82, 52, 34, 1023],
  },
  {
    final: 0.02,
    data: [0, 4322, 5400, 87, 50, 36, 1013],
  },
  {
    final: 0.02,
    data: [0, 4322, 5400, 87, 50, 36, 1013],
  },
  {
    final: 0.02,
    data: [0, 4322, 5400, 87, 50, 36, 1013],
  },
  {
    final: 0.01,
    data: [0, 4331, 5379, 82, 52, 34, 1023],
  },
  {
    final: 0.02,
    data: [0, 4322, 5400, 87, 50, 36, 1013],
  },
  {
    final: 0.02,
    data: [0, 4322, 5400, 87, 50, 36, 1013],
  },
  {
    final: 0.02,
    data: [0, 4322, 5400, 87, 50, 36, 1013],
  },
  {
    final: 0.01,
    data: [0, 4331, 5379, 82, 52, 34, 1023],
  },
  {
    final: 0.02,
    data: [0, 4322, 5400, 87, 50, 36, 1013],
  },
  {
    final: 0.01,
    data: [0, 4331, 5379, 82, 52, 34, 1023],
  },
  {
    final: 0.02,
    data: [0, 4322, 5400, 87, 50, 36, 1013],
  },
  {
    final: 0.01,
    data: [0, 4331, 5379, 82, 52, 34, 1023],
  },
  {
    final: 0.01,
    data: [0, 4331, 5379, 82, 52, 34, 1023],
  },
  {
    final: 0.02,
    data: [0, 4322, 5400, 87, 50, 36, 1013],
  },
  {
    final: 0.02,
    data: [0, 4322, 5400, 87, 50, 36, 1013],
  },
  {
    final: 0.02,
    data: [0, 4322, 5400, 87, 50, 36, 1013],
  },
  {
    final: 0.02,
    data: [0, 4322, 5400, 87, 50, 36, 1013],
  },
  {
    final: 0.02,
    data: [0, 4322, 5400, 87, 50, 36, 1013],
  },
  {
    final: 0.02,
    data: [0, 4322, 5400, 87, 50, 36, 1013],
  },
  {
    final: 0.02,
    data: [0, 4322, 5400, 87, 50, 36, 1013],
  },
  // 5 sec
  {
    final: 0.02,
    data: [0, 4331, 2500, 82, 52, 34, 1023],
  },
  {
    final: 0.02,
    data: [0, 4331, 1900, 82, 52, 34, 1023],
  },
  {
    final: 0.03,
    data: [0, 4331, 1400, 82, 52, 34, 1023],
  },
  {
    final: 0.03,
    data: [0, 4331, 900, 82, 52, 34, 1023],
  },
  {
    final: 0.08,
    data: [0, 4331, 340, 82, 52, 34, 1023],
  },
  // 4 sec
  {
    final: 0.08,
    data: [0, 4331, 340, 82, 52, 34, 1023],
  },
  {
    final: 0.08,
    data: [0, 4100, 340, 82, 52, 34, 1023],
  },
  {
    final: 0.1,
    data: [0, 4000, 340, 82, 52, 34, 1023],
  },
  {
    final: 0.12,
    data: [0, 3800, 340, 82, 52, 34, 1023],
  },
  {
    final: 0.13,
    data: [0, 3600, 340, 82, 52, 34, 1023],
  },
  {
    final: 0.14,
    data: [0, 3400, 340, 82, 52, 34, 1023],
  },
  {
    final: 0.15,
    data: [0, 3200, 340, 82, 52, 34, 1023],
  },
  {
    final: 0.16,
    data: [0, 3000, 340, 82, 52, 34, 1023],
  },
  {
    final: 0.17,
    data: [0, 2900, 340, 82, 52, 34, 1023],
  },
  {
    final: 0.18,
    data: [0, 2800, 340, 82, 52, 34, 1023],
  },
  {
    final: 0.19,
    data: [0, 2700, 340, 82, 52, 34, 1023],
  },
  {
    final: 0.2,
    data: [0, 2600, 340, 82, 52, 34, 1023],
  },
  {
    final: 0.21,
    data: [0, 2500, 340, 82, 52, 34, 1023],
  },
  {
    final: 0.22,
    data: [0, 2400, 340, 82, 52, 34, 1023],
  },
  {
    final: 0.23,
    data: [0, 2300, 340, 82, 52, 34, 1023],
  },
  {
    final: 0.24,
    data: [0, 2200, 340, 82, 52, 34, 1023],
  },
  {
    final: 0.25,
    data: [0, 2150, 340, 82, 52, 34, 1023],
  },
  {
    final: 0.26,
    data: [0, 2100, 340, 82, 52, 34, 1023],
  },
  {
    final: 0.27,
    data: [0, 2070, 340, 82, 52, 34, 1023],
  },
  {
    final: 0.28,
    data: [0, 2043, 340, 82, 52, 34, 1023],
  },
  // 3 sec
  {
    final: 0.28,
    data: [0, 2043, 340, 82, 52, 34, 1023],
  },
  {
    final: 0.28,
    data: [0, 2043, 340, 82, 52, 34, 1023],
  },
  {
    final: 0.31,
    data: [0, 2043, 340, 170, 52, 34, 1023],
  },
  {
    final: 0.35,
    data: [0, 2043, 340, 240, 52, 34, 1023],
  },
  {
    final: 0.38,
    data: [0, 2043, 340, 280, 52, 34, 1023],
  },
  {
    final: 0.42,
    data: [0, 2043, 340, 320, 52, 34, 1023],
  },
  {
    final: 0.45,
    data: [0, 2043, 340, 360, 52, 34, 1023],
  },
  {
    final: 0.48,
    data: [0, 2043, 340, 400, 52, 34, 1023],
  },
  {
    final: 0.51,
    data: [0, 2043, 340, 440, 52, 34, 1023],
  },
  {
    final: 0.54,
    data: [0, 2043, 340, 480, 52, 34, 1023],
  },
  {
    final: 0.57,
    data: [0, 2043, 340, 520, 52, 34, 1023],
  },
  {
    final: 0.6,
    data: [0, 2043, 340, 550, 52, 34, 1023],
  },
  {
    final: 0.61,
    data: [0, 2043, 340, 560, 52, 34, 1023],
  },
  {
    final: 0.62,
    data: [0, 2043, 340, 565, 52, 34, 1023],
  },
  {
    final: 0.63,
    data: [0, 2043, 340, 570, 52, 34, 1023],
  },
  // 3sec
  {
    final: 0.62,
    data: [0, 2043, 340, 570, 52, 34, 1023],
  },
  {
    final: 0.65,
    data: [0, 2043, 340, 570, 55, 32, 1010],
  },
  {
    final: 0.68,
    data: [0, 2043, 340, 570, 58, 31, 990],
  },
  {
    final: 0.71,
    data: [0, 2043, 340, 570, 61, 30, 970],
  },
  {
    final: 0.74,
    data: [0, 2043, 340, 570, 64, 29, 950],
  },
  {
    final: 0.77,
    data: [0, 2043, 340, 570, 67, 28, 930],
  },
  {
    final: 0.8,
    data: [0, 2043, 340, 570, 70, 27, 910],
  },
  {
    final: 0.83,
    data: [0, 2043, 340, 570, 73, 26, 890],
  },
  {
    final: 0.86,
    data: [0, 2043, 340, 570, 76, 25, 880],
  },
  {
    final: 0.89,
    data: [0, 2043, 340, 570, 79, 24, 870],
  },
  {
    final: 0.92,
    data: [0, 2043, 340, 570, 82, 23, 865],
  },
  {
    final: 0.94,
    data: [0, 2043, 340, 570, 85, 22, 860],
  },
  {
    final: 0.96,
    data: [0, 2043, 340, 570, 87, 21.5, 855],
  },
  {
    final: 0.97,
    data: [0, 2043, 340, 570, 89, 21, 852],
  },
  {
    final: 0.98,
    data: [1, 2043, 340, 570, 90, 21, 850],
  },
];
// ============================================
// EDIT THIS ARRAY TO CONTROL YOUR FAKE DATA
// ============================================
const getFakeRes = (lastinp, final) => {
  return {
    status: "success",
    message: "Final prediction is ready!",
    details: {
      current_prediction: {
        xgboost_tabular: 0,
        rf_tabular: 0,
        svc_tabular: 0,
      },
      current_prediction_prob: {
        xgboost_tabular: 0.1,
        rf_tabular: 0.15,
        svc_tabular: 0.12,
      },
      final_prediction: 0,
      final_prediction_prob: final,
      window_status: {
        current_size: 5,
        needed_for_final: 5,
      },
      last_input: lastinp,
    },
  };
};

let currentIndex = 0;

// Auto-advance through the array every second
setInterval(() => {
  currentIndex++;
  if (currentIndex >= dataSequence.length) {
    currentIndex = dataSequence.length - 1; // Stay at last entry
  }
  console.log(
    `⏭️  Auto-advanced to index ${currentIndex}/${dataSequence.length - 1}`,
  );
}, 1000); // Advance every 1 second

// Main endpoint - returns current data (no auto-advance on request)
app.get("/latest-result/", (req, res) => {
  const currentData = getFakeRes(
    dataSequence[currentIndex].data,
    dataSequence[currentIndex].final,
  );
  console.log(
    `📊 [${new Date().toLocaleTimeString()}] Serving data index ${currentIndex}/${
      dataSequence.length - 1
    }`,
  );
  res.json(currentData);
});

app.listen(PORT, () => {
  console.log(`\n🚀 Fake Server Running!`);
  console.log(`📡 Endpoint: http://localhost:${PORT}/latest-result/`);
  console.log(`📊 Total data entries: ${dataSequence.length}`);
});
