# ESP32-S3 Hardware Verification Firmware (V1 / V2 / V3)

This directory contains the firmware source code for the 3 visual verification test firmware releases for the **ESP32-S3 N16R8 Dev Board** (16MB Flash, 8MB PSRAM).

---

## 1. Version Specifications

| Version | Binary Filename | LED Color | Timing | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **V1** | `v1_green.bin` | **Green** | 500 ms ON / 500 ms OFF | Confirms successful flashing of Version 1 |
| **V2** | `v2_blue.bin` | **Blue** | 500 ms ON / 500 ms OFF | Confirms successful flashing of Version 2 |
| **V3** | `v3_red.bin` | **Red** | 500 ms ON / 500 ms OFF | Confirms successful flashing of Version 3 |

---

## 2. Hardware Pinout

- **Board**: ESP32-S3 N16R8 Dev Board (Octal SPI Flash 16MB, PSRAM 8MB).
- **RGB LED**: Addressable WS2812 RGB LED on **GPIO 48** (default for ESP32-S3 DevKitC-1) / **GPIO 38**.
- **Standard LED**: GPIO 2 fallback.
- **Serial Telemetry**: 115200 baud.

---

## 3. Build & Generation Instructions

### Using Arduino CLI
```bash
# Compile V1 (Green)
arduino-cli compile --fqbn esp32:esp32:esp32s3:CDCOnBoot=default,FlashSize=16M,PSRAM=opi \
  --build-property build.extra_flags="-DTEST_VERSION_V1_GREEN" \
  --output-dir ./build/v1 src/

# Compile V2 (Blue)
arduino-cli compile --fqbn esp32:esp32:esp32s3:CDCOnBoot=default,FlashSize=16M,PSRAM=opi \
  --build-property build.extra_flags="-DTEST_VERSION_V2_BLUE" \
  --output-dir ./build/v2 src/

# Compile V3 (Red)
arduino-cli compile --fqbn esp32:esp32:esp32s3:CDCOnBoot=default,FlashSize=16M,PSRAM=opi \
  --build-property build.extra_flags="-DTEST_VERSION_V3_RED" \
  --output-dir ./build/v3 src/

# Copy binaries to public distribution folder
cp build/v1/esp32-s3-test-firmware.bin ../../public/firmware/v1_green.bin
cp build/v2/esp32-s3-test-firmware.bin ../../public/firmware/v2_blue.bin
cp build/v3/esp32-s3-test-firmware.bin ../../public/firmware/v3_red.bin
```

### Using ESP-IDF
```bash
idf.py set-target esp32s3
idf.py build
```
