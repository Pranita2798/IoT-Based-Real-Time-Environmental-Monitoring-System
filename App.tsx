import React, { useState, useEffect } from 'react';
import { 
  Thermometer, 
  Droplets, 
  Wifi, 
  AlertTriangle, 
  TrendingUp, 
  Settings,
  Download,
  Cloud,
  Activity,
  MapPin,
  Calendar,
  Bell
} from 'lucide-react';

interface SensorData {
  id: string;
  location: string;
  temperature: number;
  humidity: number;
  timestamp: string;
  status: 'normal' | 'warning' | 'critical';
}

interface Alert {
  id: string;
  type: 'temperature' | 'humidity' | 'sensor';
  message: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: string;
}

function App() {
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isConnected, setIsConnected] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');

  // Simulate real-time sensor data
  useEffect(() => {
    const generateSensorData = (): SensorData[] => {
      const locations = ['Warehouse A', 'Warehouse B', 'Server Room', 'Laboratory'];
      return locations.map((location, index) => {
        const baseTemp = 22 + (Math.random() - 0.5) * 8;
        const baseHumidity = 50 + (Math.random() - 0.5) * 30;
        
        let status: 'normal' | 'warning' | 'critical' = 'normal';
        if (baseTemp > 28 || baseTemp < 18 || baseHumidity > 70 || baseHumidity < 30) {
          status = 'warning';
        }
        if (baseTemp > 32 || baseTemp < 15 || baseHumidity > 80 || baseHumidity < 20) {
          status = 'critical';
        }

        return {
          id: `DHT22_00${index + 1}`,
          location,
          temperature: Math.round(baseTemp * 10) / 10,
          humidity: Math.round(baseHumidity * 10) / 10,
          timestamp: new Date().toISOString(),
          status
        };
      });
    };

    const generateAlerts = (data: SensorData[]): Alert[] => {
      const newAlerts: Alert[] = [];
      data.forEach(sensor => {
        if (sensor.status === 'warning' || sensor.status === 'critical') {
          if (sensor.temperature > 28) {
            newAlerts.push({
              id: `temp_${sensor.id}_${Date.now()}`,
              type: 'temperature',
              message: `High temperature detected in ${sensor.location}: ${sensor.temperature}°C`,
              severity: sensor.status === 'critical' ? 'high' : 'medium',
              timestamp: sensor.timestamp
            });
          }
          if (sensor.humidity > 70) {
            newAlerts.push({
              id: `hum_${sensor.id}_${Date.now()}`,
              type: 'humidity',
              message: `High humidity detected in ${sensor.location}: ${sensor.humidity}%`,
              severity: sensor.status === 'critical' ? 'high' : 'medium',
              timestamp: sensor.timestamp
            });
          }
        }
      });
      return newAlerts;
    };

    const updateData = () => {
      const newData = generateSensorData();
      setSensorData(newData);
      
      const newAlerts = generateAlerts(newData);
      setAlerts(prev => [...newAlerts, ...prev].slice(0, 10));
    };

    updateData();
    const interval = setInterval(updateData, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'critical': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'normal': return 'bg-green-100 border-green-200';
      case 'warning': return 'bg-yellow-100 border-yellow-200';
      case 'critical': return 'bg-red-100 border-red-200';
      default: return 'bg-gray-100 border-gray-200';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-blue-100 text-blue-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      {/* Header */}
      <header className={`border-b transition-colors duration-200 ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">IoT Environmental Monitor</h1>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Real-time environmental monitoring system
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Wifi className={`h-5 w-5 ${isConnected ? 'text-green-500' : 'text-red-500'}`} />
                <span className="text-sm font-medium">
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              
              <select 
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
                className={`px-3 py-1 rounded-md border text-sm ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="1h">Last Hour</option>
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
              </select>

              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode 
                    ? 'bg-gray-700 hover:bg-gray-600' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className={`p-6 rounded-xl border transition-colors ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Active Sensors
                </p>
                <p className="text-3xl font-bold text-blue-600">{sensorData.length}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className={`p-6 rounded-xl border transition-colors ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Avg Temperature
                </p>
                <p className="text-3xl font-bold text-orange-600">
                  {sensorData.length > 0 
                    ? Math.round(sensorData.reduce((acc, s) => acc + s.temperature, 0) / sensorData.length * 10) / 10
                    : 0}°C
                </p>
              </div>
              <Thermometer className="h-8 w-8 text-orange-600" />
            </div>
          </div>

          <div className={`p-6 rounded-xl border transition-colors ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Avg Humidity
                </p>
                <p className="text-3xl font-bold text-cyan-600">
                  {sensorData.length > 0 
                    ? Math.round(sensorData.reduce((acc, s) => acc + s.humidity, 0) / sensorData.length * 10) / 10
                    : 0}%
                </p>
              </div>
              <Droplets className="h-8 w-8 text-cyan-600" />
            </div>
          </div>

          <div className={`p-6 rounded-xl border transition-colors ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Active Alerts
                </p>
                <p className="text-3xl font-bold text-red-600">{alerts.length}</p>
              </div>
              <Bell className="h-8 w-8 text-red-600" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sensor Data Cards */}
          <div className="lg:col-span-2">
            <div className={`rounded-xl border transition-colors ${
              darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Live Sensor Data</h2>
                  <div className="flex items-center space-x-2">
                    <Cloud className="h-5 w-5 text-green-500" />
                    <span className="text-sm text-green-500 font-medium">Synced</span>
                  </div>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                {sensorData.map((sensor) => (
                  <div 
                    key={sensor.id}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${getStatusBg(sensor.status)}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="font-semibold">{sensor.location}</span>
                        <span className="text-sm text-gray-500">({sensor.id})</span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium uppercase ${getStatusColor(sensor.status)}`}>
                        {sensor.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-orange-100 rounded-lg">
                          <Thermometer className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Temperature</p>
                          <p className="text-xl font-bold">{sensor.temperature}°C</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-cyan-100 rounded-lg">
                          <Droplets className="h-5 w-5 text-cyan-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Humidity</p>
                          <p className="text-xl font-bold">{sensor.humidity}%</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Calendar className="h-4 w-4" />
                        <span>Last updated: {new Date(sensor.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Alerts Panel */}
          <div className="space-y-6">
            <div className={`rounded-xl border transition-colors ${
              darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    <span>Active Alerts</span>
                  </h2>
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                    {alerts.length}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                {alerts.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                      <Activity className="h-8 w-8 text-green-600" />
                    </div>
                    <p className="text-gray-500">All systems normal</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {alerts.slice(0, 5).map((alert) => (
                      <div key={alert.id} className={`p-3 rounded-lg border-l-4 ${
                        alert.severity === 'high' ? 'border-red-500 bg-red-50 dark:bg-red-900/20' :
                        alert.severity === 'medium' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' :
                        'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      }`}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-sm font-medium mb-1">{alert.message}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(alert.timestamp).toLocaleString()}
                            </p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                            {alert.severity}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className={`rounded-xl border transition-colors ${
              darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Download className="h-4 w-4" />
                    <span>Export Data</span>
                  </button>
                  
                  <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    <Cloud className="h-4 w-4" />
                    <span>Sync to Sheets</span>
                  </button>
                  
                  <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                    <Settings className="h-4 w-4" />
                    <span>Configure Alerts</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;