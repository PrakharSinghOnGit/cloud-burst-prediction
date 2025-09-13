import os
import serial
import time
import requests
from dotenv import load_dotenv

load_dotenv(dotenv_path=".env.local")

# --- Arduino Serial Setup ---
arduino = serial.Serial('COM5', 115200)
time.sleep(2)
arduino.flushInput()

# --- API Endpoint ---
url = os.getenv("BACKEND_URL")

# --- Headers (fixed order) ---
header = ["cloud_top", "distance", "light", "rain", "humidity", "temperature", "pressure"]
print("Header:", header)

try:
    while True:
        line = arduino.readline().decode(errors='ignore').strip()
        if line:
            print("Arduino Raw:", line)
            row = line.split(",")

            if len(row) == len(header):  # ensure matching data length
                try:
                    # Convert to numeric values (int for rain, float for others)
                    values = []
                    for h, v in zip(header, row):
                        if h == "rain":
                            values.append(int(float(v)))
                        else:
                            values.append(float(v))

                    # JSON payload exactly like your working Invoke-WebRequest
                    payload = {"data": values}

                    print("Parsed Data:", payload)

                    # --- Send to FastAPI Server ---
                    try:
                        response = requests.post(url, json=payload, timeout=5)
                        print("Sent →", payload, "| Response:", response.status_code)
                    except requests.exceptions.RequestException as e:
                        print("Error sending data:", e)

                except ValueError as e:
                    print("Parsing error:", e)

                print("-" * 40)

except KeyboardInterrupt:
    print("Stopped by user")

finally:
    arduino.close()
