export interface SensorReading {
  id: string;
  location: string;
  temperature: number;
  humidity: number;
  timestamp: string;
  status: 'normal' | 'warning' | 'critical';
}

export interface Alert {
  id: string;
  type: 'temperature' | 'humidity' | 'sensor';
  message: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: string;
}

const LOCATIONS = [
  'Warehouse A',
  'Warehouse B', 
  'Server Room',
  'Laboratory',
  'Production Floor',
  'Cold Storage'
];

const TEMPERATURE_RANGES = {
  'Warehouse A': { min: 18, max: 26, optimal: 22 },
  'Warehouse B': { min: 18, max: 26, optimal: 22 },
  'Server Room': { min: 16, max: 24, optimal: 20 },
  'Laboratory': { min: 20, max: 25, optimal: 23 },
  'Production Floor': { min: 19, max: 27, optimal: 23 },
  'Cold Storage': { min: 2, max: 8, optimal: 5 }
};

const HUMIDITY_RANGES = {
  'Warehouse A': { min: 40, max: 60, optimal: 50 },
  'Warehouse B': { min: 40, max: 60, optimal: 50 },
  'Server Room': { min: 30, max: 50, optimal: 40 },
  'Laboratory': { min: 35, max: 55, optimal: 45 },
  'Production Floor': { min: 40, max: 65, optimal: 52 },
  'Cold Storage': { min: 80, max: 95, optimal: 85 }
};

export const generateSensorReading = (location: string, index: number): SensorReading => {
  const tempRange = TEMPERATURE_RANGES[location as keyof typeof TEMPERATURE_RANGES];
  const humidityRange = HUMIDITY_RANGES[location as keyof typeof HUMIDITY_RANGES];
  
  // Add some randomness around optimal values
  const tempVariation = (Math.random() - 0.5) * 6;
  const humidityVariation = (Math.random() - 0.5) * 20;
  
  const temperature = Math.round((tempRange.optimal + tempVariation) * 10) / 10;
  const humidity = Math.round((humidityRange.optimal + humidityVariation) * 10) / 10;
  
  // Determine status based on ranges
  let status: 'normal' | 'warning' | 'critical' = 'normal';
  
  if (temperature < tempRange.min || temperature > tempRange.max || 
      humidity < humidityRange.min || humidity > humidityRange.max) {
    status = 'warning';
  }
  
  if (temperature < tempRange.min - 3 || temperature > tempRange.max + 3 ||
      humidity < humidityRange.min - 10 || humidity > humidityRange.max + 10) {
    status = 'critical';
  }
  
  return {
    id: `DHT22_${String(index + 1).padStart(3, '0')}`,
    location,
    temperature,
    humidity,
    timestamp: new Date().toISOString(),
    status
  };
};

export const generateAlerts = (readings: SensorReading[]): Alert[] => {
  const alerts: Alert[] = [];
  
  readings.forEach(reading => {
    const tempRange = TEMPERATURE_RANGES[reading.location as keyof typeof TEMPERATURE_RANGES];
    const humidityRange = HUMIDITY_RANGES[reading.location as keyof typeof HUMIDITY_RANGES];
    
    // Temperature alerts
    if (reading.temperature > tempRange.max) {
      alerts.push({
        id: `temp_high_${reading.id}_${Date.now()}`,
        type: 'temperature',
        message: `High temperature in ${reading.location}: ${reading.temperature}°C (max: ${tempRange.max}°C)`,
        severity: reading.temperature > tempRange.max + 3 ? 'high' : 'medium',
        timestamp: reading.timestamp
      });
    } else if (reading.temperature < tempRange.min) {
      alerts.push({
        id: `temp_low_${reading.id}_${Date.now()}`,
        type: 'temperature',
        message: `Low temperature in ${reading.location}: ${reading.temperature}°C (min: ${tempRange.min}°C)`,
        severity: reading.temperature < tempRange.min - 3 ? 'high' : 'medium',
        timestamp: reading.timestamp
      });
    }
    
    // Humidity alerts
    if (reading.humidity > humidityRange.max) {
      alerts.push({
        id: `humidity_high_${reading.id}_${Date.now()}`,
        type: 'humidity',
        message: `High humidity in ${reading.location}: ${reading.humidity}% (max: ${humidityRange.max}%)`,
        severity: reading.humidity > humidityRange.max + 10 ? 'high' : 'medium',
        timestamp: reading.timestamp
      });
    } else if (reading.humidity < humidityRange.min) {
      alerts.push({
        id: `humidity_low_${reading.id}_${Date.now()}`,
        type: 'humidity',
        message: `Low humidity in ${reading.location}: ${reading.humidity}% (min: ${humidityRange.min}%)`,
        severity: reading.humidity < humidityRange.min - 10 ? 'high' : 'medium',
        timestamp: reading.timestamp
      });
    }
  });
  
  return alerts;
};

export const generateMockData = (): SensorReading[] => {
  return LOCATIONS.map((location, index) => 
    generateSensorReading(location, index)
  );
};