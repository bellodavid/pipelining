import React, { useState, useEffect, useCallback } from 'react';
import { Cpu, Play, Pause, SkipForward, RotateCcw, Download, HelpCircle, FileText, ExternalLink } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CPUSimulator } from '@/lib/cpuSimulator';
import { PerformanceAnalyzer } from '@/lib/performanceAnalyzer';
import { SimulationState, PerformanceMetrics as MetricsType, SimulationSettings } from '@/types/cpu';
import PipelineVisualization from '@/components/PipelineVisualization';
import ControlPanel from '@/components/ControlPanel';
import PerformanceMetrics from '@/components/PerformanceMetrics';
import CodeEditor from '@/components/CodeEditor';
import RegisterFile from '@/components/RegisterFile';
import MemoryView from '@/components/MemoryView';
import InstructionQueue from '@/components/InstructionQueue';
import HelpDocumentation from '@/components/HelpDocumentation';
import BeginnerTutorial from '@/components/BeginnerTutorial';
import WelcomeScreen from '@/components/WelcomeScreen';

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
  const [metrics, setMetrics] = useState<MetricsType>(PerformanceAnalyzer.calculateMetrics(state));
  const [settings, setSettings] = useState<SimulationSettings>({
    forwardingEnabled: true,
    branchPredictionEnabled: false,
    speed: 5,
    stepMode: false
  });
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(true);

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

  // Check if user has visited before
  useEffect(() => {
    const hasVisited = localStorage.getItem('cpu-simulator-visited');
    if (!hasVisited) {
      setIsFirstVisit(true);
    } else {
      setIsFirstVisit(false);
    }
  }, []);

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

  const handleStartTutorial = () => {
    localStorage.setItem('cpu-simulator-visited', 'true');
    setIsFirstVisit(false);
    setShowTutorial(true);
  };

  const handleSkipToSimulator = () => {
    localStorage.setItem('cpu-simulator-visited', 'true');
    setIsFirstVisit(false);
  };

  // Show welcome screen for first-time visitors
  if (isFirstVisit) {
    return (
      <WelcomeScreen 
        onStartTutorial={handleStartTutorial}
        onSkipToSimulator={handleSkipToSimulator}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="min-h-screen bg-gray-50 p-2 sm:p-4">
        {/* Header - Mobile Responsive */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
          <div className="flex items-center">
            <Cpu className="h-6 w-6 text-blue-600 mr-2" />
            <h1 className="text-xl font-bold text-gray-900">CPU Pipeline Simulator</h1>
          </div>
          
          {/* Stats and Controls - Mobile Responsive */}
          <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
            <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs sm:text-sm font-medium flex items-center">
              <span className="font-mono font-semibold">{state.instructions.length}</span>
              <span className="ml-1">Instructions</span>
            </div>
            <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs sm:text-sm font-medium flex items-center">
              <span>CPI:</span>{' '}
              <span className="font-mono font-semibold">{metrics.cpi}</span>
            </div>
          </div>
          
          {/* Controls - Mobile Responsive */}
          <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
            <Button variant="outline" size="sm" className="text-xs sm:text-sm h-8 px-2 sm:px-3" onClick={() => setShowTutorial(true)}>
              <Play className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              <span className="whitespace-nowrap">Tutorial</span>
            </Button>
            <Button variant="outline" size="sm" className="text-xs sm:text-sm h-8 px-2 sm:px-3" onClick={() => setShowHelp(true)}>
              <HelpCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              <span className="whitespace-nowrap">Help</span>
            </Button>
            <Link href="/docs">
              <Button variant="outline" size="sm" className="text-xs sm:text-sm h-8 px-2 sm:px-3">
                <FileText className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                <span className="whitespace-nowrap">Docs</span>
              </Button>
            </Link>
            <Button onClick={exportResults} size="sm" className="text-xs sm:text-sm h-8 px-2 sm:px-3">
              <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              <span className="whitespace-nowrap">Export</span>
            </Button>
          </div>
        </div>

        {/* Control Panel - Mobile Responsive */}
        <Card className="mb-4 sm:mb-6">
          <CardContent className="p-3 sm:p-6">
            <div className="overflow-x-auto pb-2">
              <ControlPanel
                state={state}
                settings={settings}
                onStep={stepSimulation}
                onStart={startSimulation}
                onPause={pauseSimulation}
                onReset={resetSimulation}
                onSettingsChange={updateSettings}
              />
            </div>
          </CardContent>
        </Card>

        {/* Pipeline Visualization - Mobile Responsive */}
        <Card className="mb-4 sm:mb-6">
          <CardContent className="p-3 sm:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
              {/* Left side - Pipeline Visualization */}
              <div className="lg:col-span-8">
                <h2 className="text-base sm:text-lg font-semibold mb-2 sm:mb-4">Pipeline Visualization</h2>
                <div className="overflow-x-auto">
                  <PipelineVisualization 
                    state={state}
                  />
                </div>
              </div>
              
              {/* Right side - Instructions Queue */}
              <div className="lg:col-span-4">
                <h2 className="text-base sm:text-lg font-semibold mb-2 sm:mb-4">Instruction Queue</h2>
                <InstructionQueue 
                  state={state}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Second Row: Code Input */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-6">
          <CodeEditor onLoadProgram={loadProgram} defaultCode={defaultProgram} />
          <PerformanceMetrics metrics={metrics} />
        </div>

        {/* Third Row: Register and Memory State */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-6">
          <RegisterFile registers={state.registers} currentCycle={state.currentCycle} />
          <MemoryView memory={state.memory} currentCycle={state.currentCycle} />
        </div>

        {/* Performance Comparison */}
        <div className="mt-4 sm:mt-6">
          <Card>
            <CardHeader className="py-3 sm:py-4">
              <CardTitle className="flex items-center text-base sm:text-lg">
                Performance Comparison
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-6">
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

      {/* Tutorial Modal */}
      {showTutorial && (
        <BeginnerTutorial 
          onClose={() => setShowTutorial(false)} 
          onLoadSample={loadProgram}
        />
      )}

      {/* Help Documentation Modal */}
      {showHelp && (
        <HelpDocumentation onClose={() => setShowHelp(false)} />
      )}
    </div>
  );
}
