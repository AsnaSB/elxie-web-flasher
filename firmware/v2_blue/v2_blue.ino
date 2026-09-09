/**
 * ELXIE Test Firmware V2 — Blue Blink
 * Target: ESP32-S3 N16R8 Dev Board
 */

#include <Arduino.h>

#define WS2812_PRIMARY_PIN   48
#define WS2812_SECONDARY_PIN 38
#define STANDARD_LED_PIN     2

// Color definition for BLUE in neopixelWrite(pin, red, green, blue)
#define COLOR_R 0
#define COLOR_G 0
#define COLOR_B 255

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

  Serial.println("\n=========================================");
  Serial.println("ELXIE TEST FIRMWARE");
  Serial.println("VERSION = V2");
  Serial.println("COLOR = BLUE");
  Serial.println("=========================================");

  pinMode(STANDARD_LED_PIN, OUTPUT);
  setLed(0, 0, 0);

  // Startup pattern: 2 Blue Blinks
  for (int i = 0; i < 2; i++) {
    setLed(COLOR_R, COLOR_G, COLOR_B);
    delay(200);
    setLed(0, 0, 0);
    delay(200);
  }

  Serial.println("V2 initialized. Starting continuous BLUE blink (500ms)...");
}

void loop() {
  // BLUE ON
  setLed(COLOR_R, COLOR_G, COLOR_B);
  digitalWrite(STANDARD_LED_PIN, HIGH);
  Serial.print("[");
  Serial.print(millis());
  Serial.println(" ms] V2: BLUE ON");
  delay(500);

  // OFF
  setLed(0, 0, 0);
  digitalWrite(STANDARD_LED_PIN, LOW);
  Serial.print("[");
  Serial.print(millis());
  Serial.println(" ms] V2: LED OFF");
  delay(500);
}
