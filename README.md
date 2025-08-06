# IoT-Based Real-Time Environmental Monitoring System

## Overview

A comprehensive real-time environmental monitoring system that combines Arduino hardware with DHT sensors for precise temperature and humidity measurements. The system features cloud logging capabilities via Google Sheets integration, providing live dashboard access and advanced anomaly tracking suitable for industrial applications.

## Features

### 🌡️ Real-Time Monitoring
- Continuous temperature and humidity data collection
- Live dashboard with real-time updates
- Historical data trends and analysis
- Multi-sensor support for large-scale deployments

### ☁️ Cloud Integration
- Google Sheets API integration for data logging
- Real-time cloud synchronization
- Remote access capabilities
- Data backup and redundancy

### 🚨 Anomaly Detection
- Intelligent threshold monitoring
- Automated alert system
- Email and SMS notifications
- Custom alert rules and conditions

### 📊 Data Visualization
- Interactive charts and graphs
- Exportable reports (CSV, PDF)
- Historical trend analysis
- Real-time data streaming

### 🏭 Industrial Applications
- Scalable architecture for multiple locations
- Robust data logging system
- API endpoints for third-party integrations
- Industrial-grade reliability

## Hardware Requirements

### Arduino Setup
- **Arduino Uno/Nano/ESP32** - Main microcontroller
- **DHT22/DHT11 Sensors** - Temperature and humidity measurement
- **Wi-Fi Module** (ESP8266/ESP32) - Internet connectivity
- **Power Supply** - 5V/3.3V depending on board
- **Breadboard/PCB** - Circuit assembly

### Wiring Diagram
```
DHT22 Sensor -> Arduino
VCC -> 3.3V/5V
GND -> GND
DATA -> Digital Pin 2
```

## Software Architecture

### Frontend (Web Dashboard)
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Chart.js/D3.js** for data visualization
- **Real-time WebSocket** connections

### Backend (Arduino Code)
```cpp
#include <DHT.h>
#include <WiFi.h>
#include <HTTPClient.h>

#define DHT_PIN 2
#define DHT_TYPE DHT22

DHT dht(DHT_PIN, DHT_TYPE);

void setup() {
  Serial.begin(115200);
  dht.begin();
  WiFi.begin("SSID", "PASSWORD");
}

void loop() {
  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();
  
  // Send to Google Sheets
  sendToGoogleSheets(temperature, humidity);
  
  delay(30000); // 30 second intervals
}
```

### Cloud Integration
- **Google Sheets API** for data storage
- **Google Apps Script** for serverless processing
- **REST API endpoints** for data retrieval
- **Real-time data synchronization**

## Installation & Setup

### 1. Hardware Setup
1. Connect DHT22 sensor to Arduino as per wiring diagram
2. Upload the Arduino sketch to your board
3. Configure Wi-Fi credentials in the code
4. Power on the system

### 2. Google Sheets Setup
1. Create a new Google Sheet for data logging
2. Enable Google Sheets API in Google Cloud Console
3. Create service account credentials
4. Share the sheet with the service account email
5. Configure the Google Apps Script for data processing

### 3. Web Dashboard Setup
1. Clone this repository
2. Install dependencies: `npm install`
3. Configure environment variables
4. Start the development server: `npm run dev`

### 4. Environment Variables
Create a `.env` file with the following:
```env
VITE_GOOGLE_SHEETS_API_KEY=your_api_key
VITE_SHEET_ID=your_sheet_id
VITE_WEBSOCKET_URL=ws://your-arduino-ip:81
```

## API Endpoints

### Data Collection
- `GET /api/sensors/latest` - Get latest sensor readings
- `GET /api/sensors/history` - Get historical data
- `POST /api/sensors/data` - Submit new sensor data
- `GET /api/alerts/active` - Get active alerts

### Configuration
- `POST /api/config/thresholds` - Set alert thresholds  
- `GET /api/config/settings` - Get system settings
- `PUT /api/config/sensors` - Update sensor configuration

## Data Schema

### Sensor Data Structure
```json
{
  "timestamp": "2025-01-08T10:30:00Z",
  "sensorId": "DHT22_001",
  "location": "Warehouse_A",
  "temperature": {
    "value": 23.5,
    "unit": "°C",
    "status": "normal"
  },
  "humidity": {
    "value": 45.2,
    "unit": "%",
    "status": "normal"
  }
}
```

## Anomaly Detection

### Threshold-Based Detection
- **Temperature**: 18-25°C (configurable)
- **Humidity**: 40-60% (configurable)
- **Rate of change**: Max 2°C/hour
- **Sensor failure**: No data for 5 minutes

### Machine Learning Integration
- Pattern recognition for predictive anomalies
- Seasonal trend analysis
- Correlation analysis between sensors
- Automated threshold adjustment

## Industrial Applications

### Manufacturing
- Climate-controlled production environments
- Quality assurance monitoring
- Equipment temperature monitoring
- Process optimization

### Agriculture
- Greenhouse climate control
- Crop storage monitoring
- Livestock environment tracking
- Irrigation system optimization

### Healthcare
- Hospital room climate monitoring
- Pharmaceutical storage
- Laboratory environment control
- Medical equipment monitoring

### Data Centers
- Server room temperature monitoring
- Humidity control for equipment protection
- Energy efficiency optimization
- Predictive maintenance

## Deployment Options

### Local Deployment
- Run dashboard on local network
- Direct Arduino to local server communication
- Offline data storage capabilities

### Cloud Deployment
- Deploy to Netlify/Vercel for dashboard
- Use cloud databases (Firebase/Supabase)
- Global accessibility and monitoring

### Hybrid Deployment
- Local data collection with cloud backup
- Edge computing for real-time processing
- Cloud analytics and reporting

## Troubleshooting

### Common Issues
1. **Sensor not responding**: Check wiring and power supply
2. **Wi-Fi connection failed**: Verify credentials and signal strength
3. **Google Sheets not updating**: Check API credentials and permissions
4. **Dashboard not loading data**: Verify WebSocket connection

### Debug Commands
```bash
# Check Arduino serial output
arduino-cli monitor -p /dev/ttyUSB0

# Test API endpoints
curl http://localhost:3000/api/sensors/latest

# Verify Google Sheets connection
npm run test:sheets-api
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


## Roadmap

### Version 2.0
- [ ] Multi-sensor dashboard
- [ ] Mobile app integration
- [ ] Advanced machine learning
- [ ] Docker containerization

### Version 3.0
- [ ] Blockchain data integrity
- [ ] Edge AI processing
- [ ] Industrial IoT protocols
- [ ] Enterprise integrations

---
