/*
 * FRESH-ID - Food Freshness Monitoring System
 * ESP32 IoT Monitoring dengan Sensor Gas (NH3, H2S, CH4)
 * Sistem Pemantauan Kesegaran Makanan untuk Program MBG (Makanan Bergizi Gratis)
 * 
 * Hardware Berdasarkan Dokumen EL3:
 * - ESP32 Development Board (Dual-core 240MHz, WiFi+BLE, 34 GPIO pins)
 * - TGS2602 (Sensor VOC, NH3, H2S) - Pin Analog GPIO 34
 * - TGS2611 (Sensor CH4) - Pin Analog GPIO 35
 * - DHT22 (Temperature & Humidity) - Pin Digital GPIO 4
 * - OLED Display 128x64 I2C - SDA: GPIO 21, SCL: GPIO 22
 * - LED Hijau (Normal) - GPIO 26
 * - LED Kuning (Warning) - GPIO 27
 * - LED Merah (Danger) - GPIO 25
 * - Power Supply 5V 16A (80W max)
 * - Converter 5V to 3.3V
 * 
 * Communication:
 * - Protocol: HTTP/HTTPS untuk IoT communication
 * - Cloud Platform: Firebase Realtime Database
 * - Web Dashboard: Real-time monitoring dengan grafik
 * 
 * Author: Tim FRESH-ID (Muhammad Bintang Pamungkas, Puja Andesta, Daffa Zakky Kurniawan)
 * Pembimbing: Dean Corio, S.T, M.T. & Afit Miranto, S.T, M.T.
 * Date: December 2025
 * Document: EL3 - TA2526.01.099
 */

#include <WiFi.h>
#include <HTTPClient.h>       // HTTP Library
#include <DHT.h>
#include <ArduinoJson.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

// ===== KONFIGURASI WiFi =====
const char* ssid = "NAMA_WIFI_ANDA";           // Ganti dengan nama WiFi Anda
const char* password = "PASSWORD_WIFI_ANDA";   // Ganti dengan password WiFi Anda

// ===== KONFIGURASI FIREBASE =====
// Ganti dengan URL Firebase Realtime Database Anda
// Format: https://YOUR-PROJECT-ID.firebaseio.com/
const char* firebaseHost = "https://freshid-xxxxx.firebaseio.com";
const char* firebasePath = "/sensors";         // Path untuk data sensor
const char* firebaseAuth = "";                 // Database secret (kosongkan jika public)

// Alternative: Bisa juga gunakan server sendiri
// const char* serverURL = "http://192.168.1.100:8080/api/sensor-data";

// ===== PIN KONFIGURASI (Sesuai Dokumen EL3) =====
#define DHT_PIN 4           // DHT22 Temperature & Humidity
#define TGS2602_PIN 34      // TGS2602 VOC/NH3/H2S Sensor (Analog)
#define TGS2611_PIN 35      // TGS2611 CH4 Sensor (Analog)
#define LED_HIJAU 26        // LED Hijau (Status Normal)
#define LED_KUNING 27       // LED Kuning (Status Warning/Kurang Segar)
#define LED_MERAH 25        // LED Merah (Status Danger/Busuk)

// ===== KONFIGURASI OLED Display =====
#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_RESET -1       // Reset pin (atau -1 jika sharing ESP32 reset pin)
#define SCREEN_ADDRESS 0x3C // I2C address untuk OLED 128x64

// ===== SENSOR DHT22 =====
#define DHT_TYPE DHT22
DHT dht(DHT_PIN, DHT_TYPE);

// ===== OLED DISPLAY =====
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

// ===== VARIABEL GLOBAL =====
String productType = "sapi";  // Jenis produk: sapi, ayam, ikan, susu
String deviceID = "";         // Akan diisi dengan MAC Address ESP32
unsigned long lastSendTime = 0;
unsigned long sendInterval = 3000;  // Kirim data setiap 3 detik (sesuai spesifikasi real-time)
unsigned long lastDisplayUpdate = 0;
unsigned long displayInterval = 1000; // Update OLED setiap 1 detik
int httpRetryCount = 0;
const int maxRetries = 3;

// ===== STRUKTUR DATA THRESHOLD (Sesuai Dokumen EL3 & pengaturan.html) =====
struct GasThreshold {
  float warning;
  float danger;
};

struct ProductThreshold {
  GasThreshold nh3_h2s;  // TGS2602 mendeteksi NH3 dan H2S
  GasThreshold ch4;      // TGS2611 mendeteksi CH4
};

// ===== THRESHOLD SETTINGS (sesuai kategori di pengaturan.html) =====
// Catatan: TGS2602 membaca NH3 dan H2S sekaligus, nilai threshold disesuaikan
ProductThreshold thresholds[4] = {
  // SAPI (Beef) - Threshold lebih tinggi karena daging merah
  {{20.0, 30.0}, {40.0, 60.0}},
  // AYAM (Chicken) - Threshold sedang
  {{25.0, 35.0}, {45.0, 65.0}},
  // IKAN (Fish) - Threshold lebih rendah karena cepat busuk
  {{15.0, 25.0}, {30.0, 50.0}},
  // SUSU (Milk) - Threshold sedang-rendah
  {{18.0, 28.0}, {35.0, 55.0}}
};

int currentProductIndex = 0;  // 0=Sapi, 1=Ayam, 2=Ikan, 3=Susu

// ===== STRUKTUR DATA SENSOR =====
struct SensorData {
  float temperature;
  float humidity;
  float tgs2602_ppm;  // VOC/NH3/H2S combined reading
  float tgs2611_ppm;  // CH4 reading
  String status;      // "Segar", "Kurang Segar", "Busuk" (sesuai EL3)
  unsigned long timestamp;
};

SensorData currentData;

// ===== FUNGSI SETUP =====
void setup() {
  Serial.begin(115200);
  delay(1000);
  
  Serial.println("\n\n===========================================");
  Serial.println("   FRESH-ID Monitoring System v1.0");
  Serial.println("   Smart Food Freshness Detection");
  Serial.println("   Dokumen: EL3 - TA2526.01.099");
  Serial.println("===========================================\n");
  
  // Get Device ID dari MAC Address
  deviceID = WiFi.macAddress();
  deviceID.replace(":", "");
  Serial.print("[i] Device ID: ");
  Serial.println(deviceID);
  
  // Inisialisasi Pin LED
  pinMode(LED_HIJAU, OUTPUT);
  pinMode(LED_KUNING, OUTPUT);
  pinMode(LED_MERAH, OUTPUT);
  
  // Test LED (Sequential blink)
  digitalWrite(LED_HIJAU, HIGH);
  delay(300);
  digitalWrite(LED_HIJAU, LOW);
  digitalWrite(LED_KUNING, HIGH);
  delay(300);
  digitalWrite(LED_KUNING, LOW);
  digitalWrite(LED_MERAH, HIGH);
  delay(300);
  digitalWrite(LED_MERAH, LOW);
  
  // Inisialisasi I2C untuk OLED
  Wire.begin();
  
  // Inisialisasi OLED Display
  if(!display.begin(SSD1306_SWITCHCAPVCC, SCREEN_ADDRESS)) {
    Serial.println("[✗] OLED Display initialization failed!");
    for(;;); // Loop forever jika OLED gagal
  }
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(0,0);
  display.println("FRESH-ID v1.0");
  display.println("Initializing...");
  display.display();
  Serial.println("[✓] OLED Display initialized");
  
  // Inisialisasi DHT22
  dht.begin();
  delay(2000); // DHT22 perlu waktu untuk stabilisasi
  Serial.println("[✓] DHT22 sensor initialized");
  
  // Warming up sensor gas (TGS perlu 3-5 menit preheating untuk akurasi optimal)
  Serial.println("[i] Warming up TGS sensors...");
  display.clearDisplay();
  display.setCursor(0,0);
  display.println("FRESH-ID");
  display.println("");
  display.println("Warming up");
  display.println("TGS sensors...");
  display.println("Please wait 30s");
  display.display();
  
  for(int i = 30; i > 0; i--) {
    Serial.print(".");
    if(i % 10 == 0) Serial.println(" " + String(i) + "s");
    delay(1000);
  }
  Serial.println("\n[✓] Sensor warmup complete");
  
  // Koneksi WiFi
  connectWiFi();
  
  // Update OLED dengan status ready
  updateOLED("System Ready", "Product: " + productType, "", "");
  
  Serial.println("\n[✓] System initialization complete!");
  Serial.println("Product Type: " + productType);
  Serial.println("Firebase URL: " + String(firebaseHost) + String(firebasePath));
  Serial.println("Update Interval: " + String(sendInterval) + "ms");
  Serial.println("===========================================\n");
}

// ===== FUNGSI LOOP =====
void loop() {
  // Check WiFi connection
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("[!] WiFi disconnected. Reconnecting...");
    connectWiFi();
  }
  
  // Baca data sensor
  readSensors();
  
  // Check threshold dan update status
  checkThresholds();
  
  // Update LED indicators
  updateLEDIndicators();
  
  // Kirim data ke Firebase/Server setiap interval
  if (millis() - lastSendTime >= sendInterval) {
    sendDataToServer();
    lastSendTime = millis();
  }
  
  // Update OLED Display
  if (millis() - lastDisplayUpdate >= displayInterval) {
    String line1 = productType.substring(0, 1).toUpperCase() + productType.substring(1);
    String line2 = String(currentData.temperature, 1) + "C " + String(currentData.humidity, 0) + "%";
    String line3 = "VOC:" + String(currentData.tgs2602_ppm, 1);
    String line4 = "CH4:" + String(currentData.tgs2611_ppm, 1);
    updateOLED(line1, line2, line3, line4);
    lastDisplayUpdate = millis();
  }
  
  // Tampilkan data di Serial Monitor (setiap 3 detik)
  static unsigned long lastPrint = 0;
  if (millis() - lastPrint >= 3000) {
    displayData();
    lastPrint = millis();
  }
  
  delay(100);  // Delay kecil untuk stabilitas
}

// ===== KONEKSI WiFi =====
void connectWiFi() {
  Serial.print("Connecting to WiFi: ");
  Serial.println(ssid);
  
  display.clearDisplay();
  display.setCursor(0,0);
  display.println("FRESH-ID");
  display.println("");
  display.println("Connecting WiFi");
  display.println(ssid);
  display.display();
  
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 30) {
    delay(500);
    Serial.print(".");
    attempts++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n[✓] WiFi connected!");
    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());
    Serial.print("Signal Strength: ");
    Serial.print(WiFi.RSSI());
    Serial.println(" dBm");
    
    display.clearDisplay();
    display.setCursor(0,0);
    display.println("WiFi Connected");
    display.println("");
    display.println("IP:");
    display.println(WiFi.localIP());
    display.display();
    delay(2000);
  } else {
    Serial.println("\n[✗] WiFi connection failed!");
    Serial.println("System will continue in offline mode");
    
    display.clearDisplay();
    display.setCursor(0,0);
    display.println("WiFi Failed!");
    display.println("");
    display.println("Offline Mode");
    display.display();
    delay(2000);
  }
}

// ===== BACA SENSOR =====
void readSensors() {
  // Baca Temperature & Humidity dari DHT22
  currentData.temperature = dht.readTemperature();
  currentData.humidity = dht.readHumidity();
  
  // Validasi DHT22
  if (isnan(currentData.temperature) || isnan(currentData.humidity)) {
    Serial.println("[!] DHT22 reading error!");
    currentData.temperature = 0.0;
    currentData.humidity = 0.0;
  }
  
  // Baca sensor gas TGS2602 (VOC/NH3/H2S)
  // TGS2602 output analog 0-4095, perlu konversi ke PPM
  int tgs2602_raw = analogRead(TGS2602_PIN);
  
  // Baca sensor gas TGS2611 (CH4/Methane)
  int tgs2611_raw = analogRead(TGS2611_PIN);
  
  // Konversi ADC ke PPM (menggunakan rumus kalibrasi)
  // Catatan: Rumus ini perlu dikalibrasi dengan gas standar untuk akurasi tinggi
  // Formula sederhana: PPM = (ADC / 4095) * Range_Max
  // Untuk TGS2602: Range 1-30 ppm (sesuai datasheet)
  // Untuk TGS2611: Range 500-10000 ppm (sesuai datasheet)
  
  currentData.tgs2602_ppm = mapFloat(tgs2602_raw, 0, 4095, 0, 30);
  currentData.tgs2611_ppm = mapFloat(tgs2611_raw, 0, 4095, 500, 10000);
  
  // Tambahkan noise reduction (simple moving average bisa ditambahkan di sini)
  
  // Timestamp
  currentData.timestamp = millis();
}

// ===== KONVERSI FLOAT MAP =====
float mapFloat(float x, float in_min, float in_max, float out_min, float out_max) {
  return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

// ===== CEK THRESHOLD (Sesuai Spesifikasi EL3: Segar/Kurang Segar/Busuk) =====
void checkThresholds() {
  ProductThreshold currentThreshold = thresholds[currentProductIndex];
  bool isBusuk = false;
  bool isKurangSegar = false;
  
  // Cek TGS2602 (VOC/NH3/H2S combined)
  if (currentData.tgs2602_ppm >= currentThreshold.nh3_h2s.danger) {
    isBusuk = true;
  } else if (currentData.tgs2602_ppm >= currentThreshold.nh3_h2s.warning) {
    isKurangSegar = true;
  }
  
  // Cek TGS2611 (CH4)
  if (currentData.tgs2611_ppm >= currentThreshold.ch4.danger) {
    isBusuk = true;
  } else if (currentData.tgs2611_ppm >= currentThreshold.ch4.warning) {
    isKurangSegar = true;
  }
  
  // Update status sesuai kategori EL3
  if (isBusuk) {
    currentData.status = "Busuk";
  } else if (isKurangSegar) {
    currentData.status = "Kurang Segar";
  } else {
    currentData.status = "Segar";
  }
}

// ===== UPDATE LED INDICATORS =====
void updateLEDIndicators() {
  if (currentData.status == "Segar") {
    digitalWrite(LED_HIJAU, HIGH);
    digitalWrite(LED_KUNING, LOW);
    digitalWrite(LED_MERAH, LOW);
  } else if (currentData.status == "Kurang Segar") {
    digitalWrite(LED_HIJAU, LOW);
    digitalWrite(LED_KUNING, HIGH);
    digitalWrite(LED_MERAH, LOW);
  } else if (currentData.status == "Busuk") {
    digitalWrite(LED_HIJAU, LOW);
    digitalWrite(LED_KUNING, LOW);
    digitalWrite(LED_MERAH, HIGH);
  }
}

// ===== KIRIM DATA KE SERVER (HTTP POST) =====
void sendDataToServer() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("[!] WiFi not connected. Skipping data send.");
    return;
  }
  
  HTTPClient http;
  
  // Buat JSON payload
  StaticJsonDocument<512> doc;
  doc["device_id"] = deviceID;
  doc["product_type"] = productType;
  doc["temperature"] = round(currentData.temperature * 10) / 10.0;  // 1 decimal
  doc["humidity"] = round(currentData.humidity);                    // Integer
  doc["tgs2602_ppm"] = round(currentData.tgs2602_ppm * 10) / 10.0; // VOC/NH3/H2S
  doc["tgs2611_ppm"] = round(currentData.tgs2611_ppm * 10) / 10.0; // CH4
  doc["status"] = currentData.status;
  doc["timestamp"] = currentData.timestamp;
  
  String jsonPayload;
  serializeJson(doc, jsonPayload);
  
  // === FIREBASE REALTIME DATABASE ===
  // Format: https://YOUR-PROJECT.firebaseio.com/sensors.json
  String firebaseURL = String(firebaseHost) + firebasePath + ".json";
  if (strlen(firebaseAuth) > 0) {
    firebaseURL += "?auth=" + String(firebaseAuth);
  }
  
  // === ALTERNATIVE: Gunakan server sendiri ===
  // Uncomment jika pakai server sendiri bukan Firebase
  // String serverURL = "http://192.168.1.100:8080/api/sensor-data";
  
  http.begin(firebaseURL);
  http.addHeader("Content-Type", "application/json");
  
  // Firebase menggunakan PATCH untuk update data tanpa replace semua
  // Gunakan PUT jika ingin replace semua data
  // Gunakan POST jika ingin push data baru dengan auto-generated key
  int httpResponseCode = http.PATCH(jsonPayload);  // Update existing data
  // int httpResponseCode = http.POST(jsonPayload); // Untuk push data baru
  
  if (httpResponseCode > 0) {
    String response = http.getString();
    Serial.println("[✓] Data sent successfully");
    Serial.print("    HTTP Response code: ");
    Serial.println(httpResponseCode);
    Serial.print("    Server response: ");
    Serial.println(response);
    Serial.print("    Payload size: ");
    Serial.print(jsonPayload.length());
    Serial.println(" bytes");
    
    httpRetryCount = 0;  // Reset retry counter on success
  } else {
    Serial.println("[✗] Error sending data");
    Serial.print("    HTTP Error code: ");
    Serial.println(httpResponseCode);
    Serial.print("    Error: ");
    Serial.println(http.errorToString(httpResponseCode).c_str());
    
    httpRetryCount++;
    if (httpRetryCount >= maxRetries) {
      Serial.println("[!] Max retries reached. Check your network or Firebase URL.");
      httpRetryCount = 0;
    }
  }
  
  http.end();
  
  // Optional: Log ke Serial Monitor untuk debugging
  Serial.println("    JSON Payload: " + jsonPayload);
}

// ===== UPDATE OLED DISPLAY =====
void updateOLED(String line1, String line2, String line3, String line4) {
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  
  // Line 1 (Product name or title)
  display.setCursor(0, 0);
  display.setTextSize(2);
  display.println(line1);
  
  // Line 2 (Temperature & Humidity)
  display.setCursor(0, 20);
  display.setTextSize(1);
  display.println(line2);
  
  // Line 3 (TGS2602 reading)
  display.setCursor(0, 35);
  display.println(line3);
  
  // Line 4 (TGS2611 reading)
  display.setCursor(0, 45);
  display.println(line4);
  
  // Status indicator di bottom
  display.setCursor(0, 56);
  display.print("Status: ");
  display.println(currentData.status);
  
  display.display();
}

// ===== TAMPILKAN DATA DI SERIAL MONITOR =====
void displayData() {
  Serial.println("\n╔════════════════════════════════════════╗");
  Serial.println("║      FRESH-ID SENSOR READINGS         ║");
  Serial.println("╠════════════════════════════════════════╣");
  Serial.print("║ Device ID    : "); Serial.println(deviceID + "           ║");
  Serial.print("║ Product      : "); 
  Serial.print(productType); 
  for(int i = productType.length(); i < 27; i++) Serial.print(" ");
  Serial.println("║");
  Serial.println("╠════════════════════════════════════════╣");
  Serial.print("║ Temperature  : "); 
  Serial.print(currentData.temperature, 1); 
  Serial.println(" °C                  ║");
  Serial.print("║ Humidity     : "); 
  Serial.print(currentData.humidity, 1); 
  Serial.println(" %                   ║");
  Serial.println("╠════════════════════════════════════════╣");
  Serial.print("║ TGS2602 (VOC): "); 
  Serial.print(currentData.tgs2602_ppm, 2); 
  Serial.println(" ppm             ║");
  Serial.print("║ TGS2611 (CH4): "); 
  Serial.print(currentData.tgs2611_ppm, 2); 
  Serial.println(" ppm           ║");
  Serial.println("╠════════════════════════════════════════╣");
  Serial.print("║ Status       : "); 
  Serial.print(currentData.status); 
  for(int i = currentData.status.length(); i < 27; i++) Serial.print(" ");
  Serial.println("║");
  Serial.print("║ WiFi         : ");
  Serial.print(WiFi.status() == WL_CONNECTED ? "Connected" : "Disconnected");
  for(int i = 0; i < (WiFi.status() == WL_CONNECTED ? 10 : 5); i++) Serial.print(" ");
  Serial.println("║");
  Serial.print("║ HTTP Status  : ");
  Serial.print(httpRetryCount == 0 ? "OK" : "Error (" + String(httpRetryCount) + "/" + String(maxRetries) + ")");
  for(int i = 0; i < (httpRetryCount == 0 ? 25 : 15); i++) Serial.print(" ");
  Serial.println("║");
  Serial.println("╚════════════════════════════════════════╝\n");
}
