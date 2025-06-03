import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Clock, Zap, AlertCircle } from 'lucide-react';
import { PerformanceMetrics as MetricsType } from '@/types/cpu';

interface PerformanceMetricsProps {
  metrics: MetricsType;
}

export default function PerformanceMetrics({ metrics }: PerformanceMetricsProps) {
  const stallPercentage = metrics.totalCycles > 0 ? (metrics.stallCycles / metrics.totalCycles) * 100 : 0;
  const dataHazardPercentage = metrics.stallCycles > 0 ? (metrics.dataHazardStalls / metrics.stallCycles) * 100 : 0;
  const controlHazardPercentage = metrics.stallCycles > 0 ? (metrics.controlHazardStalls / metrics.stallCycles) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Main Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-purple-600" />
            Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-blue-800 font-mono">{metrics.totalCycles}</div>
                  <div className="text-sm text-blue-600">Total Cycles</div>
                </div>
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-emerald-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-emerald-800 font-mono">{metrics.instructionsExecuted}</div>
                  <div className="text-sm text-emerald-600">Instructions Executed</div>
                </div>
                <Zap className="h-8 w-8 text-emerald-600" />
              </div>
            </div>

            <div className="bg-amber-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-amber-800 font-mono">{metrics.cpi}</div>
                  <div className="text-sm text-amber-600">CPI (Cycles Per Instruction)</div>
                </div>
                <TrendingUp className="h-8 w-8 text-amber-600" />
              </div>
            </div>

            <div className="bg-red-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-red-800 font-mono">{metrics.stallCycles}</div>
                  <div className="text-sm text-red-600">Pipeline Stalls</div>
                </div>
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-purple-800 font-mono">{metrics.speedup}x</div>
                  <div className="text-sm text-purple-600">Speedup vs Sequential</div>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Stall Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Data Hazard Stalls</span>
                <span className="text-sm font-semibold text-red-600">{metrics.dataHazardStalls}</span>
              </div>
              <Progress value={dataHazardPercentage} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Control Hazard Stalls</span>
                <span className="text-sm font-semibold text-orange-600">{metrics.controlHazardStalls}</span>
              </div>
              <Progress value={controlHazardPercentage} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Structural Hazard Stalls</span>
                <span className="text-sm font-semibold text-gray-600">{metrics.structuralHazardStalls}</span>
              </div>
              <Progress value={0} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Efficiency Indicator */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Pipeline Efficiency</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Overall Efficiency</span>
              <span className="text-lg font-bold text-green-600">{metrics.efficiency}%</span>
            </div>
            <Progress value={metrics.efficiency} className="h-3" />
            <div className="mt-2 text-xs text-gray-500">
              Based on ideal vs actual execution time
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
