import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Database } from 'lucide-react';
import { Register } from '@/types/cpu';

interface RegisterFileProps {
  registers: Register[];
  currentCycle: number;
}

export default function RegisterFile({ registers, currentCycle }: RegisterFileProps) {
  const isRecentlyModified = (register: Register) => {
    return register.modified && (currentCycle - register.lastModifiedCycle) <= 3;
  };

  const formatValue = (value: number) => {
    return `0x${value.toString(16).toUpperCase().padStart(8, '0')}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
          <Database className="h-5 w-5 mr-2 text-indigo-600" />
          Register File
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {registers.slice(0, 16).map((register, index) => (
            <div
              key={register.name}
              className={`flex items-center justify-between py-2 px-3 rounded-lg transition-colors ${
                isRecentlyModified(register)
                  ? `${getModificationColor(index)} border`
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <span className={`font-mono text-sm font-medium ${
                isRecentlyModified(register) ? getTextColor(index) : 'text-gray-700'
              }`}>
                {register.name}:
              </span>
              <span className={`font-mono text-sm ${
                isRecentlyModified(register) ? getValueTextColor(index) : 'text-gray-900'
              }`}>
                {formatValue(register.value)}
              </span>
            </div>
          ))}
        </div>
        
        <div className="mt-4 text-xs text-gray-500 text-center">
          Highlighted registers indicate recent modifications
        </div>

        {/* Legend */}
        <div className="mt-3 flex flex-wrap gap-2 justify-center">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-blue-200 border border-blue-300 rounded"></div>
            <span className="text-xs text-gray-600">Recently Modified</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-gray-100 border border-gray-200 rounded"></div>
            <span className="text-xs text-gray-600">Normal</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function getModificationColor(index: number): string {
  const colors = [
    'bg-blue-50 border-blue-200',
    'bg-emerald-50 border-emerald-200',
    'bg-amber-50 border-amber-200',
    'bg-purple-50 border-purple-200',
    'bg-cyan-50 border-cyan-200',
    'bg-pink-50 border-pink-200'
  ];
  return colors[index % colors.length];
}

function getTextColor(index: number): string {
  const colors = [
    'text-blue-700',
    'text-emerald-700',
    'text-amber-700',
    'text-purple-700',
    'text-cyan-700',
    'text-pink-700'
  ];
  return colors[index % colors.length];
}

function getValueTextColor(index: number): string {
  const colors = [
    'text-blue-900',
    'text-emerald-900',
    'text-amber-900',
    'text-purple-900',
    'text-cyan-900',
    'text-pink-900'
  ];
  return colors[index % colors.length];
}
