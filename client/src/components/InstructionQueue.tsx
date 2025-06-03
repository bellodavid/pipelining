import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ListOrdered, Clock } from 'lucide-react';
import { SimulationState, PipelineStage } from '@/types/cpu';

interface InstructionQueueProps {
  state: SimulationState;
}

const stageColors = {
  IF: 'bg-blue-100 text-blue-800',
  ID: 'bg-emerald-100 text-emerald-800',
  EX: 'bg-amber-100 text-amber-800',
  MEM: 'bg-purple-100 text-purple-800',
  WB: 'bg-cyan-100 text-cyan-800',
  Waiting: 'bg-gray-100 text-gray-600',
  Completed: 'bg-green-100 text-green-800'
};

export default function InstructionQueue({ state }: InstructionQueueProps) {
  const getInstructionStatus = (instruction: any) => {
    if (instruction.completed) return 'Completed';
    
    // Find instruction in pipeline
    for (const [stage, pipelineInst] of Object.entries(state.pipeline)) {
      if (pipelineInst && pipelineInst.id === instruction.id) {
        return stage as PipelineStage;
      }
    }
    
    return 'Waiting';
  };

  const getInstructionType = (opcode: string): string => {
    if (['ADD', 'SUB', 'AND', 'OR'].includes(opcode)) return 'R-Type';
    if (['LW', 'SW', 'BEQ', 'BNE'].includes(opcode)) return 'I-Type';
    if (['J'].includes(opcode)) return 'J-Type';
    return '-';
  };

  const formatPC = (pc: number) => {
    return `0x${pc.toString(16).toUpperCase()}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
          <ListOrdered className="h-5 w-5 mr-2 text-emerald-600" />
          Instruction Queue
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-3 text-sm font-medium text-gray-700">PC</th>
                <th className="text-left py-2 px-3 text-sm font-medium text-gray-700">Instruction</th>
                <th className="text-left py-2 px-3 text-sm font-medium text-gray-700">Type</th>
                <th className="text-left py-2 px-3 text-sm font-medium text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody className="font-mono text-sm">
              {state.instructions.slice(0, 10).map((instruction, index) => {
                const status = getInstructionStatus(instruction);
                const isActive = status !== 'Waiting' && status !== 'Completed';
                
                return (
                  <tr 
                    key={instruction.id}
                    className={`${
                      isActive ? `${getRowColor(status)} border-l-4 ${getBorderColor(status)}` : ''
                    } hover:bg-gray-50 transition-colors`}
                  >
                    <td className={`py-2 px-3 ${isActive ? getTextColor(status) : 'text-gray-500'}`}>
                      {formatPC(instruction.pc)}
                    </td>
                    <td className={`py-2 px-3 font-semibold ${
                      isActive ? getInstructionTextColor(status) : 'text-gray-600'
                    }`}>
                      {instruction.raw}
                    </td>
                    <td className="py-2 px-3 text-gray-600">
                      {getInstructionType(instruction.opcode)}
                    </td>
                    <td className="py-2 px-3">
                      <Badge 
                        className={`text-xs ${stageColors[status as keyof typeof stageColors]}`}
                        variant="outline"
                      >
                        {status}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Queue Statistics */}
        <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-4">
            <span>
              <span className="font-medium">{state.instructions.length - state.completedInstructions}</span> instructions remaining
            </span>
            <span>
              <span className="font-medium">{state.completedInstructions}</span> completed
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="h-3 w-3" />
            <span>PC: {formatPC(state.pc)}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Progress</span>
            <span>{Math.round((state.completedInstructions / Math.max(state.instructions.length, 1)) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${(state.completedInstructions / Math.max(state.instructions.length, 1)) * 100}%` 
              }}
            ></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function getRowColor(status: string): string {
  const colors: Record<string, string> = {
    IF: 'bg-blue-50',
    ID: 'bg-emerald-50',
    EX: 'bg-amber-50',
    MEM: 'bg-purple-50',
    WB: 'bg-cyan-50'
  };
  return colors[status] || '';
}

function getBorderColor(status: string): string {
  const colors: Record<string, string> = {
    IF: 'border-blue-400',
    ID: 'border-emerald-400',
    EX: 'border-amber-400',
    MEM: 'border-purple-400',
    WB: 'border-cyan-400'
  };
  return colors[status] || '';
}

function getTextColor(status: string): string {
  const colors: Record<string, string> = {
    IF: 'text-blue-700',
    ID: 'text-emerald-700',
    EX: 'text-amber-700',
    MEM: 'text-purple-700',
    WB: 'text-cyan-700'
  };
  return colors[status] || 'text-gray-500';
}

function getInstructionTextColor(status: string): string {
  const colors: Record<string, string> = {
    IF: 'text-blue-800',
    ID: 'text-emerald-800',
    EX: 'text-amber-800',
    MEM: 'text-purple-800',
    WB: 'text-cyan-800'
  };
  return colors[status] || 'text-gray-600';
}
