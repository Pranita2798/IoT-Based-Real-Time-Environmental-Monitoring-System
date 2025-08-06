import React from 'react';
import { Thermometer, Droplets, MapPin, Calendar, TrendingUp } from 'lucide-react';

interface SensorCardProps {
  id: string;
  location: string;
  temperature: number;
  humidity: number;
  timestamp: string;
  status: 'normal' | 'warning' | 'critical';
  darkMode?: boolean;
}

export const SensorCard: React.FC<SensorCardProps> = ({
  id,
  location,
  temperature,
  humidity,
  timestamp,
  status,
  darkMode = false
}) => {
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
      case 'normal': return 'bg-green-100 border-green-200 dark:bg-green-900/20 dark:border-green-800';
      case 'warning': return 'bg-yellow-100 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800';
      case 'critical': return 'bg-red-100 border-red-200 dark:bg-red-900/20 dark:border-red-800';
      default: return 'bg-gray-100 border-gray-200 dark:bg-gray-900/20 dark:border-gray-800';
    }
  };

  return (
    <div className={`p-4 rounded-lg border-2 transition-all duration-200 ${getStatusBg(status)}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <MapPin className="h-4 w-4 text-gray-500" />
          <span className="font-semibold">{location}</span>
          <span className="text-sm text-gray-500">({id})</span>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium uppercase ${getStatusColor(status)}`}>
          {status}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-orange-100 rounded-lg dark:bg-orange-900/30">
            <Thermometer className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Temperature</p>
            <p className="text-xl font-bold">{temperature}°C</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-cyan-100 rounded-lg dark:bg-cyan-900/30">
            <Droplets className="h-5 w-5 text-cyan-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Humidity</p>
            <p className="text-xl font-bold">{humidity}%</p>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Calendar className="h-4 w-4" />
          <span>Last updated: {new Date(timestamp).toLocaleTimeString()}</span>
        </div>
        <TrendingUp className="h-4 w-4 text-green-500" />
      </div>
    </div>
  );
};