#include "DHT.h"
#include <Wire.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_BMP280.h>
#include <BH1750.h>

// --- DHT11 ---
#define DHTPIN 2 // D4 on ESP8266
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

// --- Rain sensor ---
#define RAIN_ANALOG A0

// --- BMP280 ---
Adafruit_BMP280 bmp;
bool bmp_ok = false;

// --- BH1750 ---
BH1750 lightMeter;
bool bh1750_ok = false;

// --- Ultrasonic (HC-SR04) ---
#define TRIG_PIN D6 // GPIO12
#define ECHO_PIN D7 // GPIO13
long duration;
float distance;

void setup() {
  Serial.begin(115200);  // Use high baud rate for faster data transfer

  // DHT11
  dht.begin();

  // I2C sensors
  Wire.begin(D2, D1);

  // BMP280
  if (!bmp.begin(0x76)) {
    Serial.println("❌ BMP280 not found!");
  } else {
    bmp_ok = true;
  }

  // BH1750
  if (lightMeter.begin(BH1750::CONTINUOUS_HIGH_RES_MODE, 0x23, &Wire) ||
      lightMeter.begin(BH1750::CONTINUOUS_HIGH_RES_MODE, 0x5C, &Wire)) {
    bh1750_ok = true;
  }

  // Ultrasonic
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);

  // Print CSV header once
  Serial.println("Cloud_Top_Height,Cloud_Base_Height,Optical_Thickness,Rainfall,Humidity,Temperature,Pressure");
}

void loop() {
  // --- DHT11 ---
  float h = dht.readHumidity();
  float t = dht.readTemperature();
  if (isnan(h) || isnan(t)) {
    h = -1;
    t = -1;
  }

  // --- Rain Sensor ---
  int rainAnalog = analogRead(RAIN_ANALOG);
  int rainIntensity = 1024 - rainAnalog;

  // Encode first value based on rainfall
  int cloud_top_value = 0;  // default 0
  if (rainIntensity > 100) {  // moderate/heavy
    cloud_top_value = 1;
  }

  // --- BMP280 ---
  float pressure = -1;
  if (bmp_ok) {
    pressure = bmp.readPressure();  // hPa
  }
  float newpres = pressure / 100.0F;

  // --- BH1750 (Optical Thickness Approximation) ---
  float optical_thickness = -1;
  if (bh1750_ok) {
    float lux = lightMeter.readLightLevel();
    optical_thickness = lux;
  }

  // --- Ultrasonic ---
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  duration = pulseIn(ECHO_PIN, HIGH);
  distance = duration * 0.034 / 2;  // cm → base height

  // --- Print CSV Row with updated first value ---
  Serial.print(cloud_top_value); Serial.print(",");
  Serial.print(distance); Serial.print(",");
  Serial.print(optical_thickness); Serial.print(",");
  Serial.print(rainIntensity); Serial.print(",");
  Serial.print(h); Serial.print(",");
  Serial.print(t); Serial.print(",");
  Serial.println(newpres);

  delay(5000); // every 5 seconds
}
