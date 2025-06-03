import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { HardDrive } from 'lucide-react';
import { MemoryLocation } from '@/types/cpu';

interface MemoryViewProps {
  memory: MemoryLocation[];
  currentCycle: number;
}

export default function MemoryView({ memory, currentCycle }: MemoryViewProps) {
  const isRecentlyModified = (location: MemoryLocation) => {
    return location.modified && (currentCycle - location.lastModifiedCycle) <= 3;
  };

  const formatAddress = (address: number) => {
    return `0x${address.toString(16).toUpperCase()}`;
  };

  const formatValue = (value: number) => {
    return `0x${value.toString(16).toUpperCase().padStart(8, '0')}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
          <HardDrive className="h-5 w-5 mr-2 text-purple-600" />
          Memory View
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {memory.map((location, index) => (
            <div
              key={location.address}
              className={`flex items-center justify-between py-2 px-3 rounded-lg transition-colors ${
                isRecentlyModified(location)
                  ? `${getModificationColor(index)} border`
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <span className={`font-mono text-sm font-medium ${
                isRecentlyModified(location) ? getTextColor(index) : 'text-gray-700'
              }`}>
                {formatAddress(location.address)}
              </span>
              <span className={`font-mono text-sm ${
                isRecentlyModified(location) ? getValueTextColor(index) : 'text-gray-900'
              }`}>
                {formatValue(location.value)}
              </span>
            </div>
          ))}
        </div>
        
        <div className="mt-4 text-xs text-gray-500 text-center">
          Highlighted addresses show recent memory operations
        </div>

        {/* Memory Stats */}
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <div className="font-semibold text-blue-800">{memory.length}</div>
            <div className="text-blue-600 text-xs">Memory Locations</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-3 text-center">
            <div className="font-semibold text-purple-800">
              {memory.filter(m => m.modified).length}
            </div>
            <div className="text-purple-600 text-xs">Recently Modified</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function getModificationColor(index: number): string {
  const colors = [
    'bg-purple-50 border-purple-200',
    'bg-red-50 border-red-200',
    'bg-emerald-50 border-emerald-200',
    'bg-amber-50 border-amber-200',
    'bg-blue-50 border-blue-200',
    'bg-cyan-50 border-cyan-200'
  ];
  return colors[index % colors.length];
}

function getTextColor(index: number): string {
  const colors = [
    'text-purple-700',
    'text-red-700',
    'text-emerald-700',
    'text-amber-700',
    'text-blue-700',
    'text-cyan-700'
  ];
  return colors[index % colors.length];
}

function getValueTextColor(index: number): string {
  const colors = [
    'text-purple-900',
    'text-red-900',
    'text-emerald-900',
    'text-amber-900',
    'text-blue-900',
    'text-cyan-900'
  ];
  return colors[index % colors.length];
}
