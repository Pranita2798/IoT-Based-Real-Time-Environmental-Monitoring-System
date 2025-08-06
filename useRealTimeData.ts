import { useState, useEffect } from 'react';
import { generateMockData, generateAlerts, SensorReading, Alert } from '../utils/dataGenerator';

export const useRealTimeData = (updateInterval: number = 5000) => {
  const [sensorData, setSensorData] = useState<SensorReading[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isConnected, setIsConnected] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    const updateData = () => {
      try {
        const newReadings = generateMockData();
        const newAlerts = generateAlerts(newReadings);
        
        setSensorData(newReadings);
        setAlerts(prevAlerts => {
          // Keep only the most recent 20 alerts
          const combinedAlerts = [...newAlerts, ...prevAlerts];
          return combinedAlerts.slice(0, 20);
        });
        setLastUpdate(new Date());
        setIsConnected(true);
      } catch (error) {
        console.error('Error updating sensor data:', error);
        setIsConnected(false);
      }
    };

    // Initial data load
    updateData();

    // Set up interval for regular updates
    const interval = setInterval(updateData, updateInterval);

    return () => clearInterval(interval);
  }, [updateInterval]);

  const getAverageTemperature = (): number => {
    if (sensorData.length === 0) return 0;
    const sum = sensorData.reduce((acc, sensor) => acc + sensor.temperature, 0);
    return Math.round((sum / sensorData.length) * 10) / 10;
  };

  const getAverageHumidity = (): number => {
    if (sensorData.length === 0) return 0;
    const sum = sensorData.reduce((acc, sensor) => acc + sensor.humidity, 0);
    return Math.round((sum / sensorData.length) * 10) / 10;
  };

  const getCriticalAlerts = (): Alert[] => {
    return alerts.filter(alert => alert.severity === 'high');
  };

  const getSystemStatus = (): 'normal' | 'warning' | 'critical' => {
    const criticalSensors = sensorData.filter(sensor => sensor.status === 'critical');
    const warningSensors = sensorData.filter(sensor => sensor.status === 'warning');
    
    if (criticalSensors.length > 0) return 'critical';
    if (warningSensors.length > 0) return 'warning';
    return 'normal';
  };

  return {
    sensorData,
    alerts,
    isConnected,
    lastUpdate,
    averageTemperature: getAverageTemperature(),
    averageHumidity: getAverageHumidity(),
    criticalAlerts: getCriticalAlerts(),
    systemStatus: getSystemStatus(),
    activeSensors: sensorData.length
  };
};