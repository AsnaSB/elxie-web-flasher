/**
 * ELXIE Test Firmware V1 — Green Blink
 * Target: ESP32-S3 N16R8 Dev Board
 */

#include <Arduino.h>

#define WS2812_PRIMARY_PIN   48
#define WS2812_SECONDARY_PIN 38
#define STANDARD_LED_PIN     2

// V1 = GREEN
#define COLOR_R 0
#define COLOR_G 255
#define COLOR_B 0

void setLed(uint8_t r, uint8_t g, uint8_t b) {
  neopixelWrite(WS2812_PRIMARY_PIN, r, g, b);
  neopixelWrite(WS2812_SECONDARY_PIN, r, g, b);

#ifdef RGB_BUILTIN
  neopixelWrite(RGB_BUILTIN, r, g, b);
#endif
}

void setup() {
  Serial.begin(115200);
  delay(1000);

  Serial.println();
  Serial.println("=========================================");
  Serial.println("ELXIE TEST FIRMWARE");
  Serial.println("VERSION = V1");
  Serial.println("COLOR = GREEN");
  Serial.println("=========================================");

  pinMode(STANDARD_LED_PIN, OUTPUT);

  // Start with LED OFF
  setLed(0, 0, 0);
  digitalWrite(STANDARD_LED_PIN, LOW);

  // Startup pattern: 1 GREEN blink
  setLed(COLOR_R, COLOR_G, COLOR_B);
  digitalWrite(STANDARD_LED_PIN, HIGH);
  delay(200);

  setLed(0, 0, 0);
  digitalWrite(STANDARD_LED_PIN, LOW);
  delay(200);

  Serial.println("V1 initialized.");
  Serial.println("Starting continuous GREEN blink (500ms)...");
}

void loop() {

  // GREEN ON
  setLed(COLOR_R, COLOR_G, COLOR_B);
  digitalWrite(STANDARD_LED_PIN, HIGH);

  Serial.print("[");
  Serial.print(millis());
  Serial.println(" ms] V1: GREEN ON");

  delay(500);

  // OFF
  setLed(0, 0, 0);
  digitalWrite(STANDARD_LED_PIN, LOW);

  Serial.print("[");
  Serial.print(millis());
  Serial.println(" ms] V1: LED OFF");

  delay(500);
}