import React, { useState, useEffect, useCallback } from 'react';
import { Cpu, Play, Pause, SkipForward, RotateCcw, Download, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CPUSimulator } from '@/lib/cpuSimulator';
import { PerformanceAnalyzer } from '@/lib/performanceAnalyzer';
import { SimulationState, PerformanceMetrics, SimulationSettings } from '@/types/cpu';
import PipelineVisualization from '@/components/PipelineVisualization';
import ControlPanel from '@/components/ControlPanel';
import PerformanceMetrics from '@/components/PerformanceMetrics';
import CodeEditor from '@/components/CodeEditor';
import RegisterFile from '@/components/RegisterFile';
import MemoryView from '@/components/MemoryView';
import InstructionQueue from '@/components/InstructionQueue';

const defaultProgram = `// Sample MIPS Assembly Code
ADD R1, R2, R3    // R1 = R2 + R3
LW R4, 0(R1)      // Load word from memory
SW R4, 4(R2)      // Store word to memory  
BEQ R1, R2, 8     // Branch if equal
ADD R5, R6, R7    // R5 = R6 + R7
SUB R8, R9, R10   // R8 = R9 - R10
AND R11, R12, R13 // R11 = R12 & R13
OR R14, R15, R16  // R14 = R15 | R16`;

export default function Simulator() {
  const [simulator] = useState(() => new CPUSimulator());
  const [state, setState] = useState<SimulationState>(simulator.getState());
  const [metrics, setMetrics] = useState<PerformanceMetrics>(PerformanceAnalyzer.calculateMetrics(state));
  const [settings, setSettings] = useState<SimulationSettings>({
    forwardingEnabled: true,
    branchPredictionEnabled: false,
    speed: 5,
    stepMode: false
  });
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  const updateState = useCallback(() => {
    const newState = simulator.getState();
    setState(newState);
    setMetrics(PerformanceAnalyzer.calculateMetrics(newState));
  }, [simulator]);

  const loadProgram = useCallback((code: string) => {
    const success = simulator.loadProgram(code);
    if (success) {
      updateState();
    }
    return success;
  }, [simulator, updateState]);

  const stepSimulation = useCallback(() => {
    if (!simulator.isComplete()) {
      simulator.step();
      updateState();
    }
  }, [simulator, updateState]);

  const startSimulation = useCallback(() => {
    if (intervalId) return;

    const speed = 1100 - (settings.speed * 100); // Convert speed to interval
    const id = setInterval(() => {
      if (simulator.isComplete()) {
        stopSimulation();
        return;
      }
      simulator.step();
      updateState();
    }, speed);

    setIntervalId(id);
    simulator.setState({ isRunning: true, isPaused: false });
    updateState();
  }, [intervalId, settings.speed, simulator, updateState]);

  const stopSimulation = useCallback(() => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    simulator.setState({ isRunning: false, isPaused: false });
    updateState();
  }, [intervalId, simulator, updateState]);

  const pauseSimulation = useCallback(() => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    simulator.setState({ isRunning: false, isPaused: true });
    updateState();
  }, [intervalId, simulator, updateState]);

  const resetSimulation = useCallback(() => {
    stopSimulation();
    simulator.reset();
    updateState();
  }, [simulator, stopSimulation, updateState]);

  const updateSettings = useCallback((newSettings: Partial<SimulationSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    simulator.setState({
      forwardingEnabled: newSettings.forwardingEnabled ?? settings.forwardingEnabled,
      branchPredictionEnabled: newSettings.branchPredictionEnabled ?? settings.branchPredictionEnabled
    });
    updateState();
  }, [simulator, settings, updateState]);

  const exportResults = useCallback(() => {
    const detailedAnalysis = PerformanceAnalyzer.getDetailedAnalysis(state);
    const comparison = PerformanceAnalyzer.compareExecution(state);
    
    const exportData = {
      timestamp: new Date().toISOString(),
      metrics,
      detailedAnalysis,
      comparison,
      hazards: state.hazards,
      settings
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cpu-simulation-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [state, metrics, settings]);

  // Load default program on mount
  useEffect(() => {
    loadProgram(defaultProgram);
  }, [loadProgram]);

  // Update simulator settings when they change
  useEffect(() => {
    if (intervalId && state.isRunning) {
      stopSimulation();
      startSimulation();
    }
  }, [settings.speed]);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <Cpu className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">CPU Pipeline Simulator</h1>
                <p className="text-sm text-gray-500">5-Stage RISC Pipeline Educational Tool</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                <span className="font-medium">Cycle:</span>{' '}
                <span className="font-mono font-semibold text-blue-600">{state.currentCycle}</span>
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium">CPI:</span>{' '}
                <span className="font-mono font-semibold text-emerald-600">{metrics.cpi}</span>
              </div>
              <Button variant="outline" size="sm">
                <HelpCircle className="h-4 w-4 mr-2" />
                Help
              </Button>
              <Button onClick={exportResults} size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Results
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Control Panel */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <ControlPanel
              state={state}
              settings={settings}
              onStep={stepSimulation}
              onStart={startSimulation}
              onPause={pauseSimulation}
              onReset={resetSimulation}
              onSettingsChange={updateSettings}
            />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Pipeline Visualization - Takes 3 columns */}
          <div className="xl:col-span-3">
            <PipelineVisualization state={state} />
          </div>

          {/* Control Panel */}
          <div className="xl:col-span-1">
            <PerformanceMetrics metrics={metrics} />
          </div>
        </div>

        {/* Second Row: Code Input and Additional Components */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <CodeEditor onLoadProgram={loadProgram} defaultCode={defaultProgram} />
          <InstructionQueue state={state} />
        </div>

        {/* Third Row: Register and Memory State */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <RegisterFile registers={state.registers} currentCycle={state.currentCycle} />
          <MemoryView memory={state.memory} currentCycle={state.currentCycle} />
        </div>

        {/* Performance Comparison */}
        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                Performance Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Pipelined vs Non-Pipelined */}
                <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4 border">
                  <h4 className="font-semibold text-gray-800 mb-3">Execution Time Comparison</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-700">Pipelined Execution</span>
                        <span className="text-sm font-semibold text-green-600">{metrics.totalCycles} cycles</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${Math.min(100, (metrics.totalCycles / (metrics.totalCycles * 3)) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-700">Non-Pipelined Execution</span>
                        <span className="text-sm font-semibold text-red-600">{state.instructions.length * 5} cycles</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-red-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 text-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      {metrics.speedup}x Speedup
                    </span>
                  </div>
                </div>

                {/* Hazard Impact Analysis */}
                <div className="bg-gradient-to-r from-yellow-50 to-red-50 rounded-lg p-4 border">
                  <h4 className="font-semibold text-gray-800 mb-3">Hazard Impact Analysis</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">Ideal Pipeline (No Hazards)</span>
                      <span className="font-semibold text-blue-600">{state.instructions.length + 4} cycles</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">With Data Hazards</span>
                      <span className="font-semibold text-yellow-600">+{metrics.dataHazardStalls} cycles</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">With Control Hazards</span>
                      <span className="font-semibold text-orange-600">+{metrics.controlHazardStalls} cycles</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">Current (All Hazards)</span>
                      <span className="font-semibold text-red-600">{metrics.totalCycles} cycles</span>
                    </div>
                  </div>
                  <div className="mt-3 text-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                      {Math.round(((metrics.stallCycles / Math.max(metrics.totalCycles, 1)) * 100))}% Hazard Overhead
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
