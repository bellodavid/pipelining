import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, ArrowRight, CheckCircle } from 'lucide-react';
import { SimulationState, PipelineStage } from '@/types/cpu';

interface PipelineVisualizationProps {
  state: SimulationState;
}

const stageColors = {
  IF: 'bg-blue-100 border-blue-300 text-blue-800',
  ID: 'bg-emerald-100 border-emerald-300 text-emerald-800',
  EX: 'bg-amber-100 border-amber-300 text-amber-800',
  MEM: 'bg-purple-100 border-purple-300 text-purple-800',
  WB: 'bg-cyan-100 border-cyan-300 text-cyan-800'
};

const stageNames = {
  IF: 'Instruction Fetch',
  ID: 'Instruction Decode',
  EX: 'Execute',
  MEM: 'Memory Access',
  WB: 'Write Back'
};

export default function PipelineVisualization({ state }: PipelineVisualizationProps) {
  const currentHazards = state.hazards.filter(h => 
    h.cycle >= state.currentCycle - 2 && h.cycle <= state.currentCycle
  );

  const getHazardForStage = (stage: PipelineStage) => {
    const instruction = state.pipeline[stage];
    if (!instruction) return null;
    
    return currentHazards.find(h => 
      h.instruction1 === instruction.raw || h.instruction2 === instruction.raw
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold text-gray-900">
            Pipeline Visualization
          </CardTitle>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">5-Stage RISC Pipeline</span>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${state.isRunning ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              <span className="text-xs text-gray-600">
                {state.isRunning ? 'Running' : state.isPaused ? 'Paused' : 'Stopped'}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Pipeline Stage Headers */}
        <div className="grid grid-cols-5 gap-4 mb-4">
          {(['IF', 'ID', 'EX', 'MEM', 'WB'] as PipelineStage[]).map(stage => (
            <div key={stage} className={`${stageColors[stage]} rounded-lg p-3 text-center border-2`}>
              <div className="font-semibold">{stage}</div>
              <div className="text-xs opacity-90 mt-1">{stageNames[stage]}</div>
            </div>
          ))}
        </div>

        {/* Current Pipeline State */}
        <div className="grid grid-cols-5 gap-4 mb-4">
          {(['IF', 'ID', 'EX', 'MEM', 'WB'] as PipelineStage[]).map(stage => {
            const instruction = state.pipeline[stage];
            const hazard = getHazardForStage(stage);
            
            return (
              <div 
                key={stage} 
                className={`${
                  instruction 
                    ? stageColors[stage] 
                    : 'bg-gray-50 border-gray-200 text-gray-400'
                } border-2 rounded-lg p-3 text-center transition-all duration-300 ${
                  instruction ? 'animate-pulse' : ''
                }`}
              >
                {instruction ? (
                  <>
                    <div className="font-mono text-sm font-semibold">
                      {instruction.raw}
                    </div>
                    <div className="text-xs mt-1">
                      PC: 0x{instruction.pc.toString(16).toUpperCase().padStart(4, '0')}
                    </div>
                    {hazard && (
                      <div className="mt-2">
                        <Badge 
                          variant={hazard.resolved ? "secondary" : "destructive"} 
                          className="text-xs"
                        >
                          {hazard.subtype}
                        </Badge>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="font-mono text-sm">Empty</div>
                )}
              </div>
            );
          })}
        </div>

        {/* Hazard Indicators */}
        {currentHazards.length > 0 && (
          <div className="grid grid-cols-5 gap-4 mb-4">
            {(['IF', 'ID', 'EX', 'MEM', 'WB'] as PipelineStage[]).map(stage => {
              const hazard = getHazardForStage(stage);
              
              return (
                <div key={`hazard-${stage}`} className="h-12 flex items-center justify-center">
                  {hazard && (
                    <div className={`
                      flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium
                      ${hazard.resolved 
                        ? 'bg-amber-100 text-amber-700 border border-amber-300' 
                        : 'bg-red-100 text-red-700 border border-red-300'
                      }
                    `}>
                      {hazard.resolved ? (
                        <CheckCircle className="h-3 w-3" />
                      ) : (
                        <AlertTriangle className="h-3 w-3" />
                      )}
                      <span>
                        {hazard.type === 'data' && hazard.subtype === 'RAW' && 'RAW'}
                        {hazard.type === 'control' && 'Branch'}
                        {hazard.type === 'structural' && 'Resource'}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Pipeline Flow Indicator */}
        <div className="mt-6 flex items-center justify-center">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <ArrowRight className="h-4 w-4 text-blue-500" />
            <span>Instruction Flow Direction</span>
          </div>
        </div>

        {/* Active Hazards Summary */}
        {currentHazards.length > 0 && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-medium text-yellow-800 mb-2">Active Hazards:</h4>
            <div className="space-y-1">
              {currentHazards.map((hazard, index) => (
                <div key={index} className="text-sm text-yellow-700">
                  <span className="font-medium">{hazard.subtype}:</span> {hazard.description}
                  {hazard.resolved && (
                    <span className="ml-2 text-green-600">(Resolved via {
                      hazard.type === 'data' ? 'forwarding' : 'prediction'
                    })</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
