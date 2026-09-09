/**
 * ELXIE ESP32-S3 Hardware Verification Firmware
 * Target Board: ESP32-S3 N16R8 Dev Board (16MB Flash, 8MB PSRAM)
 * 
 * Versions:
 * - V1: Green Blink (500 ms ON, 500 ms OFF)
 * - V2: Blue Blink  (500 ms ON, 500 ms OFF)
 * - V3: Red Blink   (500 ms ON, 500 ms OFF)
 */

#include <Arduino.h>

// Standard ESP32-S3 DevKit onboard WS2812 RGB LED pin
#ifndef RGB_LED_PIN
#define RGB_LED_PIN 48 // Default for ESP32-S3 DevKitC-1
#endif

// Fallback standard LED pin (if single color LED is equipped)
#ifndef LED_BUILTIN_PIN
#define LED_BUILTIN_PIN 2
#endif

// Test Version Configuration (Select one when building)
// #define TEST_VERSION_V1_GREEN
// #define TEST_VERSION_V2_BLUE
// #define TEST_VERSION_V3_RED

#if defined(TEST_VERSION_V1_GREEN)
  #define COLOR_R 0
  #define COLOR_G 255
  #define COLOR_B 0
  #define VERSION_NAME "V1 - Green Blink"
#elif defined(TEST_VERSION_V2_BLUE)
  #define COLOR_R 0
  #define COLOR_G 0
  #define COLOR_B 255
  #define VERSION_NAME "V2 - Blue Blink"
#elif defined(TEST_VERSION_V3_RED)
  #define COLOR_R 255
  #define COLOR_G 0
  #define COLOR_B 0
  #define VERSION_NAME "V3 - Red Blink"
#else
  // Default to V1 Green
  #define COLOR_R 0
  #define COLOR_G 255
  #define COLOR_B 0
  #define VERSION_NAME "V1 - Green Blink (Default)"
#endif

#define BLINK_INTERVAL_MS 500

void setup() {
  Serial.begin(115200);
  delay(500);

  Serial.println("=========================================");
  Serial.println("ELXIE ESP32-S3 Hardware Test Firmware");
  Serial.print("Active Version: ");
  Serial.println(VERSION_NAME);
  Serial.println("Target: ESP32-S3 N16R8");
  Serial.println("=========================================");

  #ifdef RGB_BUILTIN
    // Use Arduino ESP32 built-in RGB driver if available
    neopixelWrite(RGB_BUILTIN, 0, 0, 0);
  #else
    pinMode(RGB_LED_PIN, OUTPUT);
    pinMode(LED_BUILTIN_PIN, OUTPUT);
  #endif
}

void loop() {
  // LED ON (500 ms)
  #ifdef RGB_BUILTIN
    neopixelWrite(RGB_BUILTIN, COLOR_R, COLOR_G, COLOR_B);
  #else
    neopixelWrite(RGB_LED_PIN, COLOR_R, COLOR_G, COLOR_B);
    digitalWrite(LED_BUILTIN_PIN, HIGH);
  #endif

  Serial.print("[");
  Serial.print(millis());
  Serial.print(" ms] LED ON (");
  Serial.print(VERSION_NAME);
  Serial.println(")");
  delay(BLINK_INTERVAL_MS);

  // LED OFF (500 ms)
  #ifdef RGB_BUILTIN
    neopixelWrite(RGB_BUILTIN, 0, 0, 0);
  #else
    neopixelWrite(RGB_LED_PIN, 0, 0, 0);
    digitalWrite(LED_BUILTIN_PIN, LOW);
  #endif

  Serial.print("[");
  Serial.print(millis());
  Serial.println(" ms] LED OFF");
  delay(BLINK_INTERVAL_MS);
}
