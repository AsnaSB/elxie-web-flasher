/**
 * Standalone ESP32-S3 Onboard LED Diagnostic Firmware
 * Target: ESP32-S3 N16R8 Dev Board (16MB Flash, 8MB PSRAM)
 * 
 * Drives:
 * - Built-in Addressable WS2812B RGB LED on GPIO 48 & GPIO 38
 * - Built-in / External Standard LED on GPIO 2 & GPIO 21
 * - Serial Telemetry at 115200 baud on both UART and USB CDC
 */

#include <Arduino.h>

#define WS2812_PRIMARY_PIN   48
#define WS2812_SECONDARY_PIN 38
#define STANDARD_LED_PIN     2
#define STANDARD_LED_ALT     21

#define BLINK_DELAY_MS       500

void setup() {
  // Initialize Serial (works on both UART0 and Native USB CDC)
  Serial.begin(115200);
  delay(1000);

  Serial.println("=========================================");
  Serial.println("ELXIE ESP32-S3 STANDALONE LED TEST");
  Serial.println("Firmware started");
  Serial.println("Target: ESP32-S3 N16R8");
  Serial.println("Initializing LEDs on GPIO 48, 38, 2, 21...");

  pinMode(STANDARD_LED_PIN, OUTPUT);
  pinMode(STANDARD_LED_ALT, OUTPUT);

  #ifdef RGB_BUILTIN
    neopixelWrite(RGB_BUILTIN, 0, 0, 0);
  #endif
  neopixelWrite(WS2812_PRIMARY_PIN, 0, 0, 0);
  neopixelWrite(WS2812_SECONDARY_PIN, 0, 0, 0);

  Serial.println("LED initialized");
  Serial.println("Blinking...");
  Serial.println("=========================================");
}

void loop() {
  // --- LED ON ---
  // Drive WS2812 with full Green (GRB = 255, 0, 0)
  neopixelWrite(WS2812_PRIMARY_PIN, 255, 0, 0);
  neopixelWrite(WS2812_SECONDARY_PIN, 255, 0, 0);
  #ifdef RGB_BUILTIN
    neopixelWrite(RGB_BUILTIN, 255, 0, 0);
  #endif

  // Drive regular GPIOs HIGH
  digitalWrite(STANDARD_LED_PIN, HIGH);
  digitalWrite(STANDARD_LED_ALT, HIGH);

  Serial.print("[");
  Serial.print(millis());
  Serial.println(" ms] LED ON (Green)");

  delay(BLINK_DELAY_MS);

  // --- LED OFF ---
  // Turn off WS2812
  neopixelWrite(WS2812_PRIMARY_PIN, 0, 0, 0);
  neopixelWrite(WS2812_SECONDARY_PIN, 0, 0, 0);
  #ifdef RGB_BUILTIN
    neopixelWrite(RGB_BUILTIN, 0, 0, 0);
  #endif

  // Drive regular GPIOs LOW
  digitalWrite(STANDARD_LED_PIN, LOW);
  digitalWrite(STANDARD_LED_ALT, LOW);

  Serial.print("[");
  Serial.print(millis());
  Serial.println(" ms] LED OFF");

  delay(BLINK_DELAY_MS);
}
