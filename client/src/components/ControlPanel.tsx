import React from 'react';
import { Play, Pause, SkipForward, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { SimulationState, SimulationSettings } from '@/types/cpu';

interface ControlPanelProps {
  state: SimulationState;
  settings: SimulationSettings;
  onStep: () => void;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onSettingsChange: (settings: Partial<SimulationSettings>) => void;
}

export default function ControlPanel({
  state,
  settings,
  onStep,
  onStart,
  onPause,
  onReset,
  onSettingsChange
}: ControlPanelProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div className="flex items-center space-x-4">
        <h2 className="text-lg font-semibold text-gray-900">Simulation Controls</h2>
        <div className="flex items-center space-x-2">
          <Button 
            onClick={onStep} 
            variant="outline"
            size="sm"
            disabled={state.isRunning}
            className="flex items-center space-x-2"
          >
            <SkipForward className="h-4 w-4" />
            <span>Step</span>
          </Button>
          
          {!state.isRunning ? (
            <Button 
              onClick={onStart} 
              size="sm"
              className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700"
            >
              <Play className="h-4 w-4" />
              <span>Run</span>
            </Button>
          ) : (
            <Button 
              onClick={onPause} 
              size="sm"
              variant="outline"
              className="flex items-center space-x-2"
            >
              <Pause className="h-4 w-4" />
              <span>Pause</span>
            </Button>
          )}
          
          <Button 
            onClick={onReset} 
            variant="outline"
            size="sm"
            className="flex items-center space-x-2"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reset</span>
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <Label htmlFor="speed-slider" className="text-sm font-medium text-gray-700">
            Speed:
          </Label>
          <div className="w-24">
            <Slider
              id="speed-slider"
              min={1}
              max={10}
              step={1}
              value={[settings.speed]}
              onValueChange={(value) => onSettingsChange({ speed: value[0] })}
              className="w-full"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="forwarding-toggle"
            checked={settings.forwardingEnabled}
            onCheckedChange={(checked) => onSettingsChange({ forwardingEnabled: checked })}
          />
          <Label htmlFor="forwarding-toggle" className="text-sm text-gray-700">
            Forwarding
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="branch-prediction-toggle"
            checked={settings.branchPredictionEnabled}
            onCheckedChange={(checked) => onSettingsChange({ branchPredictionEnabled: checked })}
          />
          <Label htmlFor="branch-prediction-toggle" className="text-sm text-gray-700">
            Branch Prediction
          </Label>
        </div>

        <div className="text-sm text-gray-600">
          <span className="font-medium">Instructions:</span>{' '}
          <span className="font-mono">{state.completedInstructions}/{state.instructions.length}</span>
        </div>
      </div>
    </div>
  );
}
