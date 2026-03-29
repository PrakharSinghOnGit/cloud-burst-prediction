# Cloudburst Prediction Dataset Quick Reference

This Markdown provides essential details and full tables for the **10,000-record, source-tracked cloudburst dataset**.

---

## 1. Dataset Composition

| Source Type           | Records | Cloudburst Rate | Description                    |
|-----------------------|--------:|----------------:|--------------------------------|
| actual_based          |     160 |         97.5%   | Real event variations          |
| extreme_synthetic     |   1,500 |         99.1%   | Severe cloudburst conditions   |
| moderate_synthetic    |   1,500 |         99.1%   | Moderate cloudburst conditions |
| marginal_synthetic    |   3,500 |         53.7%   | Borderline conditions          |
| normal_synthetic      |   3,340 |         10.4%   | Typical weather                |
| **TOTAL**             | **10,000** |   **53.5%** | **Balanced classification**     |

---

## 2. Historical Cloudburst Events

| Event Name           | Date       | Location                      | Rainfall (24 hr) | Temp | Humidity | Pressure | Source                       |
|----------------------|------------|-------------------------------|------------------|------|----------|----------|------------------------------|
| Kedarnath Disaster   | 2013-06-16 | Uttarakhand, India            | 326 mm           | 2.5°C| 97.5%    | 840 hPa  | AWS, NCMRWF, WRF model       |
| Mumbai Floods        | 2005-07-26 | Mumbai, India                 | 944 mm           | 28°C | 95%      | 995 hPa  | IMD, TRMM satellite          |
| Ahr Valley Floods    | 2021-07-14 | Ahr Valley, Germany           | 150 mm/18 hr     | 18°C | 85%      | 980 hPa  | RADOLAN, HYRAS, DWD          |
| Uttarakhand Jaspur   | 2017-07-20 | Jaspur, Uttarakhand, India    | 180 mm           | 15°C | 92%      | 875 hPa  | IMD AWS, GPRS stations       |
| Uttarakhand Dehradun | 2017-06-26 | Dehradun, Uttarakhand, India  | 150 mm           | 22°C | 88%      | 885 hPa  | IMD Dehradun AWS             |
| HP Solan             | 2023-08-14 | Solan, Himachal Pradesh, India| 273 mm           | 20°C | 88%      | 920 hPa  | IMD Himachal Pradesh         |
| Chamoli Disaster     | 2021-02-07 | Chamoli, Uttarakhand, India   | 60 mm            | –2°C | 75%      | 780 hPa  | Satellite imagery            |
| Kullu Event          | 2019-08-06 | Kullu, Himachal Pradesh, India| 200 mm           | 18°C | 90%      | 890 hPa  | IMD reports                  |

---

## 3. Schema & Parameter Ranges

| Column                | Unit           | Min     | Max      | Mean     |
|-----------------------|---------------:|--------:|---------:|---------:|
| Cloud_Top_Height      | meters         | 10,559  | 19,490   | 15,130   |
| Cloud_Base_Height     | meters         |    784  |  6,132   |  2,294   |
| Optical_Thickness     | dimensionless  |   13.9  |   104.9  |    57.2  |
| Rainfall              | mm/hour        |  113.9  |   639.3  |   230.4  |
| Humidity              | %              |   63.0  |   102.5  |    82.8  |
| Temperature           | °C             |    2.5  |    43.8  |    20.6  |
| Pressure              | hPa            |  800.7  |  1026.7  |   931.4  |
| **cloud_burst**       | Binary         | **0**   | **1**    |    –     |

---

## 4. Rainfall Intensity Distribution

| Category      | Range (mm/hr) | Records | Cloudburst Rate |
|---------------|--------------:|--------:|---------------:|
| Light         | < 150         | 3,752   | 20.2%          |
| Moderate      | 150 – 250     | 3,375   | 53.4%          |
| Heavy         | 250 – 350     | 1,148   | 94.5%          |
| Intense       | 350 – 500     |   900   | 99.2%          |
| Extreme       | > 500         |   825   | 98.9%          |

---

## 5. Contact & Citation

**Citation:**  
Comprehensive Cloudburst Prediction Dataset (2025), Version 1.0.
