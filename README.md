<p align="center">
  <img src="logo.svg" alt="Workshop DIY" width="120"><br>
  <strong style="font-size:2rem">ESP32-C3 KIDS LAB</strong><br>
  <em>Play • Learn • Create</em><br><br>
  <img src="https://img.shields.io/badge/ESPHome-Kids%20Lab-22c55e?style=for-the-badge&logo=esphome&logoColor=white" alt="ESPHome">
  <img src="https://img.shields.io/badge/ESP32--C3-SuperMini-3b82f6?style=for-the-badge&logo=espressif&logoColor=white" alt="ESP32-C3">
  <img src="https://img.shields.io/badge/micro%3Abit-BLE%20%2B%20UART-f97316?style=for-the-badge&logo=micro:bit&logoColor=white" alt="micro:bit">
  <img src="https://img.shields.io/badge/version-1.2-9ca3af?style=for-the-badge" alt="v1.3">
</p>

---

## 🤔 What is this?

**Kids Lab** turns a tiny **$3 board** into a WiFi-controlled science lab. No coding. Just YAML.

Your ESP32-C3 gets its own **website** where you can:

- 💡 Turn LEDs on and off
- ✨ Make rainbow NeoPixel animations
- 🔔 Play Mario & Star Wars melodies
- ⚙️ Move a servo motor like a robot arm
- 🌡️ Read temperature and humidity LIVE
- ☀️ Measure light levels
- 🚶 Detect motion with PIR sensor
- 🤖 Connect a micro:bit wirelessly via BLE!

All from your phone. No app to install. Just WiFi.

```
  📱 Your Phone                    🔬 ESP32-C3 Kids Lab
  ┌──────────────┐    WiFi AP     ┌──────────────────────┐
  │              │   "KidsLab"    │  💡 LED              │
  │  Browser     │ ◄───────────► │  ✨ NeoPixels         │
  │  Web App     │   REST API    │  🔔 Buzzer            │
  │              │   + SSE       │  ⚙️ Servo             │
  └──────────────┘               │  🌡️ DHT22 Sensor     │
                                 │  ☀️ Light Sensor      │
  🤖 micro:bit                   │  🔘 Buttons           │
  ┌──────────────┐    BLE/UART   │  🚶 PIR Motion        │
  │  Sensors     │ ◄───────────► │  📡 BLE Gateway       │
  │  P0, P1, P2  │               │                      │
  └──────────────┘               └──────────────────────┘
```

---

## 🎮 Why is this cool?

| Feature | What it means for you |
|---|---|
| **Zero code** | Write YAML (looks like a shopping list), not C++ |
| **WiFi web app** | Control everything from any browser — phone, tablet, laptop |
| **REST API** | Every component = a web URL you can call |
| **Live updates** | Sensor values stream to your screen in real-time (SSE) |
| **4 themes** | 🌙 Stealth · ⚡ Neon · ☁️ Arctic · 🔥 Blaze |
| **2 languages** | 🇬🇧 English · 🇫🇷 Français |
| **micro:bit bridge** | Your micro:bit becomes a wireless sensor node! |
| **Home Assistant** | Auto-discovered. Voice control: "Hey Google, turn on the LED" |
| **OTA updates** | After first flash, update wirelessly. Never unplug! |

---

## 🛒 What do I need?

### Essential (the bare minimum)

| Part | Price | Why |
|---|---|---|
| **ESP32-C3 SuperMini** | ~$3 | The brain. WiFi + Bluetooth |
| **USB-C data cable** | ~$2 | ⚠️ Must be a DATA cable, not charge-only! |
| **Computer** | — | Windows, Mac, or Linux |

### Starter Kit (recommended)

| Part | Price | Why |
|---|---|---|
| Everything above | — | — |
| **LED** (any color) | ~$0.10 | Blink stuff! |
| **Push button** | ~$0.10 | Press stuff! |
| **Passive buzzer** | ~$0.50 | Play melodies! |
| **Breadboard** | ~$2 | No soldering needed |
| **Jumper wires** (M-M) | ~$2 | Connect everything |

### Level Up (more fun)

| Part | Price | Why |
|---|---|---|
| **NeoPixel strip** (8 LEDs WS2812) | ~$2 | 🌈 Rainbow animations |
| **SG90 Servo motor** | ~$2 | ⚙️ Robot arm movements |
| **DHT22 sensor** | ~$3 | 🌡️ Temperature + humidity |
| **LDR** + 10kΩ resistor | ~$0.30 | ☀️ Light detection |
| **PIR sensor** (HC-SR501) | ~$1.50 | 🚶 Motion detection |
| **OLED display** (SSD1306 128x64) | ~$3 | 🖥️ Tiny screen |

### micro:bit Bridge (optional, awesome)

| Part | Price | Why |
|---|---|---|
| **micro:bit v2** | ~$15 | Extra sensors + BLE wireless |
| **Edge connector breakout** | ~$3 | Access P0, P1, P2 easily |

> 💡 **Total starter cost: under $10.** That's less than a pizza. And this lasts forever.

---

## 🚀 Setup — Step by Step

### Step 1: Install ESPHome

ESPHome turns YAML into firmware. No code. Magic.

**🪟 Windows:**

```bash
# 1. Install Python from https://python.org
#    ⚠️ CHECK "Add Python to PATH" during install!

# 2. Open PowerShell and run:
pip install esphome

# 3. Verify:
esphome version
# Should print something like: Version: 2024.x.x
```

**🐧 Linux / Mac:**

```bash
# 1. Install Python (probably already there):
sudo apt install -y python3 python3-pip    # Linux
# or: brew install python                   # Mac

# 2. Install ESPHome:
pip3 install esphome

# 3. Verify:
esphome version
```

> 🎉 **Done?** You just installed a firmware compiler. You're basically a hacker now.

---

### Step 2: USB Driver

Your ESP32-C3 SuperMini has a **CH340** USB chip inside.

| OS | What to do |
|---|---|
| 🐧 **Linux** | Nothing! Already built into the kernel. Lucky you. |
| 🍎 **Mac** | Usually works automatically. If not: [download CH340 driver](https://www.wch.cn/download/CH341SER_MAC_ZIP.html) |
| 🪟 **Windows** | [Download CH341SER.EXE](https://www.wch.cn/download/CH341SER_EXE.html) → run it → done |

**How to check it worked:**

```bash
# Linux:
ls /dev/ttyUSB*   # Should show /dev/ttyUSB0

# Mac:
ls /dev/cu.wch*   # Should show something

# Windows:
# Open Device Manager → Ports → look for "CH340"
```

> ⚠️ **#1 problem:** charge-only cables. If your board isn't detected, try a DIFFERENT USB-C cable. The one from your phone charger might be charge-only. You need a DATA cable.

---

### Step 3: Create the Project

```bash
# Create a folder:
mkdir kids-lab
cd kids-lab
```

Create a file called **`kids-lab.yaml`** and paste this inside:

```yaml
# ============================================================
# 🔬 ESP32-C3 Kids Lab — ESPHome Config
# ============================================================
# Version: 1.2
# Board: ESP32-C3 SuperMini
# ============================================================

esphome:
  name: kids-lab
  friendly_name: Kids Lab
  platformio_options:
    board_build.flash_mode: dio    # ← CRITICAL for SuperMini!

esp32:
  board: esp32-c3-devkitm-1
  variant: ESP32C3
  framework:
    type: arduino

# --- WiFi Access Point (your own network!) ---
wifi:
  ap:
    ssid: "KidsLab"
    password: ""                   # Open network, no password

captive_portal:                    # Auto-opens web page on connect

# --- Web Server (REST API + built-in UI) ---
web_server:
  port: 80
  version: 3
  local: true

logger:
  level: DEBUG

ota:
  - platform: esphome

# ============================================================
# 💡 ONBOARD LED (GPIO8, active low)
# ============================================================
output:
  - platform: gpio
    pin:
      number: 8
      inverted: true
    id: onboard_led_output

light:
  - platform: binary
    name: "Onboard LED"
    output: onboard_led_output

# ============================================================
# ✨ NEOPIXEL STRIP (8 LEDs on GPIO3)
# ============================================================
  - platform: neopixelbus
    type: GRB
    variant: WS2812
    pin: 3
    num_leds: 8
    name: "NeoPixels"
    effects:
      - addressable_rainbow:
          name: "Rainbow"
      - pulse:
          name: "Pulse"
      - addressable_color_wipe:
          name: "Color Wipe"
      - strobe:
          name: "Strobe"

# ============================================================
# 🔔 BUZZER — RTTTL melodies (GPIO2)
# ============================================================
output:
  - platform: ledc
    pin: 2
    id: buzzer_output

rtttl:
  output: buzzer_output
  id: buzzer

button:
  - platform: template
    name: "Play Mario"
    on_press:
      - rtttl.play: "mario:d=4,o=5,b=100:16e6,16e6,32p,8e6,16c6,8e6,8g6"

  - platform: template
    name: "Play Star Wars"
    on_press:
      - rtttl.play: "starwars:d=4,o=5,b=45:32p,32f,32f,32f,8b.4,8f.6"

  - platform: template
    name: "Play Beep"
    on_press:
      - rtttl.play: "beep:d=4,o=5,b=100:16e6"

  - platform: template
    name: "Stop Buzzer"
    on_press:
      - rtttl.stop

# ============================================================
# ⚙️ SERVO MOTOR (GPIO0, SG90)
# ============================================================
output:
  - platform: ledc
    pin: 0
    id: servo_output
    frequency: 50 Hz

servo:
  - id: my_servo
    output: servo_output

number:
  - platform: template
    name: "Servo Angle"
    min_value: -100
    max_value: 100
    step: 1
    optimistic: true
    set_action:
      - servo.write:
          id: my_servo
          level: !lambda "return x / 100.0;"

# ============================================================
# 🌡️ DHT22 SENSOR (GPIO4)
# ============================================================
sensor:
  - platform: dht
    pin: 4
    model: DHT22
    temperature:
      name: "Temperature"
    humidity:
      name: "Humidity"
    update_interval: 5s

# ============================================================
# ☀️ LIGHT SENSOR — LDR (GPIO5)
# ============================================================
  - platform: adc
    pin: 5
    name: "Light Level"
    update_interval: 1s
    attenuation: auto

# ============================================================
# 🔘 BUTTONS (GPIO9 = BOOT, GPIO1 = external)
# ============================================================
binary_sensor:
  - platform: gpio
    pin:
      number: 9
      mode: INPUT_PULLUP
      inverted: true
    name: "Boot Button"

  - platform: gpio
    pin:
      number: 1
      mode: INPUT_PULLUP
      inverted: true
    name: "Push Button"
```

> 🚨 **The most important line:** `board_build.flash_mode: dio` — without this, your SuperMini will NOT flash. This is the #1 error everyone hits.

---

### Step 4: Build & Flash!

Plug in your ESP32-C3 via USB-C, then:

```bash
esphome run kids-lab.yaml
```

**What happens:**

```
1. ⏳ Compiling... (first time = 3-8 minutes, downloads toolchain)
2. ❓ "Choose upload port" → pick your serial port (COM3, /dev/ttyUSB0)
3. 🚀 Uploading... brain transplant in progress 🧠
4. ✅ Done! Your ESP32 reboots with the new firmware!
```

> ⚠️ **Upload fails?** Hold the **BOOT button** on the board while plugging in USB, then try again.

---

### Step 5: Connect!

1. On your phone/laptop, look for WiFi network **"KidsLab"**
2. Connect (no password)
3. Open **http://192.168.4.1** in your browser
4. 🎉 **You should see the ESPHome web dashboard!**

```
┌──────────────────────────────────────┐
│  Kids Lab                            │
│                                      │
│  Onboard LED         [Toggle]        │
│  NeoPixels           [Toggle] 🎨     │
│  Play Mario          [Press]         │
│  Temperature          23.5°C         │
│  Humidity             65%            │
│  Light Level          1.2V           │
│  Boot Button          OFF            │
│  Servo Angle          [---0---]      │
│                                      │
└──────────────────────────────────────┘

That's the BUILT-IN ESPHome UI. 
It works. But our custom web app is WAY cooler. ⬇️
```

---

## 🌐 Custom Web App

The built-in ESPHome UI is functional but boring. Our custom web app has:

- 🎨 Dark theme with 4 color schemes
- 🧪 Interactive test panels for every component
- 📊 Live sensor gauges with animations
- 🎹 Color pickers for NeoPixels
- ⚙️ Visual servo control with presets
- 🔔 One-click melody buttons
- 🤖 micro:bit bridge integration
- 🌍 English + French

### How to use it

**Option A — Open the HTML file directly:**

1. Download `esphome-kids-lab.html`
2. Open it in your browser
3. Click the **OFFLINE** chip → enter `192.168.4.1` → Connect
4. Browse components → test panels light up!

**Option B — Served from ESP32 (advanced):**

1. Create a `www/` folder in your project
2. Put the web app files inside
3. ESPHome serves them at `http://192.168.4.1/`

**Option C — GitHub Pages:**

Fork this repo → enable Pages → access from anywhere!

---

## 🤖 micro:bit Bridge

**Already have a micro:bit?** Turn it into a wireless sensor node!

### Option 1: BLE (wireless, recommended)

```
  micro:bit                     ESP32-C3
  ┌─────────────┐    BLE      ┌──────────────┐
  │ Temperature  │ ═══════╗   │              │
  │ Light level  │        ║   │  BLE Client  │──► WiFi ──► Phone
  │ Buttons A/B  │        ║   │              │
  │ P0 → sensor  │  ══════╝   │  REST API    │
  │ P1 → sensor  │            │  SSE Events  │
  │ P2 → sensor  │            │              │
  └─────────────┘            └──────────────┘
  
  No wires! All 3 pins free!     Range: ~10m
```

**Advantages:**
- 🚀 No wires between boards
- 📌 P0, P1, P2 ALL free for kid sensors
- 📡 Works up to ~10 meters away
- 🔄 Same BLE UART protocol as bit-playground

**YAML:**

```yaml
esp32_ble_tracker:
  scan_parameters:
    active: true

ble_client:
  - mac_address: "XX:XX:XX:XX:XX:XX"   # Your micro:bit MAC
    id: microbit1
```

> 💡 **Find your micro:bit MAC address:** Run `esphome logs kids-lab.yaml` and look for `[ble_tracker]` lines.

### Option 2: UART (wired, simpler)

```
  micro:bit                ESP32-C3
  Pin 0 (TX)  ──────────► GPIO20 (RX)
  Pin 1 (RX)  ◄────────── GPIO21 (TX)
  GND         ═══════════ GND
```

**YAML:**

```yaml
uart:
  rx_pin: 20
  tx_pin: 21
  baud_rate: 115200
  id: microbit_uart
```

> ⚠️ UART uses P0 and P1 for serial. Only P2 stays free for sensors.

---

## 📁 Project Structure

```
kids-lab/
├── kids-lab.yaml              ← ESPHome firmware config
├── esphome-kids-lab.html      ← Custom web app (single file!)
├── logo.svg                   ← Workshop-DIY logo
├── README.md                  ← You are here!
└── www/                       ← (optional) files served by ESP32
    └── index.html
```

---

## 🧩 All 17 Components

### Output (make things happen)

| # | Component | Icon | Difficulty | GPIO | What it does |
|---|---|---|---|---|---|
| 1 | Onboard LED | 💡 | ⭐ | 8 | Blue LED built into the board |
| 2 | NeoPixel Strip | ✨ | ⭐⭐ | 3 | 8 RGB LEDs with rainbow effects |
| 3 | Passive Buzzer | 🔔 | ⭐ | 2 | Plays RTTTL melodies |
| 4 | Servo Motor | ⚙️ | ⭐⭐ | 0 | Precise angle control (-100° to +100°) |
| 5 | Relay Module | 🔌 | ⭐⭐ | 7 | Switch for big things (lamps, fans) |
| 6 | OLED Display | 🖥️ | ⭐⭐ | 6,7 (I2C) | 128x64 pixel tiny screen |

### Sensors (measure the world)

| # | Component | Icon | Difficulty | GPIO | What it does |
|---|---|---|---|---|---|
| 7 | DHT22 | 🌡️ | ⭐ | 4 | Temperature + humidity |
| 8 | LDR | ☀️ | ⭐ | 5 | Light level (bright/dark) |
| 9 | Ultrasonic | 📏 | ⭐⭐ | 6,7 | Distance with sound waves |
| 10 | PIR Motion | 🚶 | ⭐ | 10 | Detects movement |
| 11 | Soil Moisture | 🌱 | ⭐ | 5 | Is your plant thirsty? |

### Input (interact)

| # | Component | Icon | Difficulty | GPIO | What it does |
|---|---|---|---|---|---|
| 12 | Push Button | 🔘 | ⭐ | 9, 1 | Boot button + external button |
| 13 | Touch Sensor | 👆 | ⭐ | 10 | No press needed, just touch |
| 14 | Potentiometer | 🎛️ | ⭐ | 5 | Turn a knob to change values |

### micro:bit Bridge

| # | Component | Icon | Difficulty | Connection | What it does |
|---|---|---|---|---|---|
| 15 | micro:bit UART | 🔌 | ⭐ | GPIO20,21 | Wired bridge, P2 free |
| 16 | micro:bit BLE | 📡 | ⭐⭐ | Wireless | All pins free! |

---

## 🌐 REST API — How it Works

ESPHome auto-generates REST endpoints from your YAML. Every component becomes a URL.

### Control stuff (POST)

```bash
# Turn LED on
curl -X POST http://192.168.4.1/light/onboard_led/turn_on

# Turn LED off
curl -X POST http://192.168.4.1/light/onboard_led/turn_off

# NeoPixels: red at 80% brightness
curl -X POST "http://192.168.4.1/light/neopixels/turn_on?r=255&g=0&b=0&brightness=200"

# NeoPixels: rainbow effect
curl -X POST "http://192.168.4.1/light/neopixels/turn_on?effect=Rainbow"

# Play Mario melody
curl -X POST http://192.168.4.1/button/play_mario/press

# Move servo to +45°
curl -X POST "http://192.168.4.1/number/servo_angle/set?value=45"
```

### Read stuff (GET)

```bash
# Temperature
curl http://192.168.4.1/sensor/temperature
# → {"id":"sensor-temperature","state":"23.5","value":23.5}

# Humidity
curl http://192.168.4.1/sensor/humidity

# Button state
curl http://192.168.4.1/binary_sensor/boot_button
```

### Live stream (SSE)

```bash
# Get real-time updates for ALL sensors:
curl http://192.168.4.1/events

# Output:
# event: state
# data: {"id":"sensor-temperature","state":"23.5","value":23.5}
#
# event: state
# data: {"id":"binary_sensor-boot_button","state":"ON","value":true}
```

---

## 🛠️ Troubleshooting

### 😱 "No serial port found"

| Problem | Fix |
|---|---|
| Wrong cable | Try a different USB-C cable (must be DATA, not charge-only) |
| No driver | Install CH340 driver (see Step 2) |
| Port busy | Close any Serial Monitor / other ESPHome instance |
| Board stuck | Hold BOOT button while plugging USB, then flash |

### 😱 Can't see "KidsLab" WiFi

| Problem | Fix |
|---|---|
| Board not powered | Check USB, look for LED flash on boot |
| Wrong config | Run `esphome config kids-lab.yaml` to check for errors |
| STA mode active | If you added home WiFi, the AP might not start |

### 😱 Sensors show "N/A"

| Problem | Fix |
|---|---|
| Not wired | Normal! N/A means the sensor isn't connected |
| Wrong pin | Double-check GPIO numbers in YAML |
| DHT22 needs pullup | Add a 10kΩ resistor between DATA and 3.3V |

### 😱 Build errors

```bash
# Nuclear option — clean everything and retry:
esphome clean kids-lab.yaml
esphome run kids-lab.yaml
```

### 😱 CORS errors in custom web app

Add this to your YAML:

```yaml
web_server:
  port: 80
  version: 3
  headers:
    Access-Control-Allow-Origin: "*"
```

---

## 📋 Cheat Sheet

```bash
esphome run kids-lab.yaml        # Compile + flash (USB or OTA)
esphome logs kids-lab.yaml       # View live serial logs
esphome config kids-lab.yaml     # Validate YAML (find errors)
esphome clean kids-lab.yaml      # Clean build cache
esphome dashboard ./             # Launch web dashboard at :6052
```

---

## 🏠 Home Assistant Integration

Want voice control? Add these 2 lines to your YAML:

```yaml
api:                              # ← Enables HA auto-discovery

wifi:
  ssid: "YourHomeWiFi"           # ← Add your home network
  password: "YourPassword"
  ap:
    ssid: "KidsLab"              # ← Keep AP as fallback
```

Flash → Home Assistant discovers it automatically → "Hey Google, turn on the Kids Lab LED!"

---

## 📊 ESPHome vs PlatformIO

Already seen the [PlatformIO version](https://github.com/nicmusic/bit-playground)? Here's how they compare:

| | ESPHome | PlatformIO |
|---|---|---|
| **Firmware** | 120 lines YAML | 350 lines C++ |
| **Transport** | HTTP REST + SSE | WebSocket + BLE |
| **Setup time** | 3-8 min | 3-8 min |
| **Add a sensor** | 3 lines YAML | ~30 lines C++ |
| **BLE support** | ✅ (as client) | ✅ (as server) |
| **micro:bit** | BLE gateway or UART | Same BLE UART protocol |
| **Home Assistant** | ✅ Auto-discovered | Needs MQTT bridge |
| **OTA updates** | ✅ Built-in | Manual setup |
| **iOS Safari** | ✅ WiFi works | ✅ WiFi / ❌ BLE |
| **Best for** | Smart home + YAML fans | Custom protocols + BLE |

---

## 🙏 Credits

- **[ESPHome](https://esphome.io)** — The amazing YAML-to-firmware framework
- **[Workshop-DIY](https://github.com/nicmusic)** — The maker lab behind all this
- **[bit-playground](https://github.com/nicmusic/bit-playground)** — The micro:bit web companion

---

## 📝 Version History

| Version | Date | Changes |
|---|---|---|
| v1.0 | 2026-02-14 | Initial release — 15 components, web app, EN/FR |
| v1.1 | 2026-02-14 | micro:bit split into UART + BLE, own sidebar category |
| v1.3 | 2026-02-14 | Version tag in header, versioned output files |

---

<p align="center">
  <strong>Made with ❤️ for kids who want to build cool stuff</strong><br>
  <em>If you build something awesome, show us!</em> 🚀
</p>
