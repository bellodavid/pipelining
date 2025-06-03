export type PipelineStage = 'IF' | 'ID' | 'EX' | 'MEM' | 'WB';

export interface Instruction {
  id: string;
  pc: number;
  opcode: string;
  operands: string[];
  type: 'R' | 'I' | 'J';
  raw: string;
  cycle: number;
  stage: PipelineStage | null;
  completed: boolean;
}

export interface Register {
  name: string;
  value: number;
  modified: boolean;
  lastModifiedCycle: number;
}

export interface MemoryLocation {
  address: number;
  value: number;
  modified: boolean;
  lastModifiedCycle: number;
}

export interface Hazard {
  type: 'data' | 'control' | 'structural';
  subtype: 'RAW' | 'WAR' | 'WAW' | 'branch' | 'resource';
  instruction1: string;
  instruction2: string;
  description: string;
  resolved: boolean;
  cycle: number;
}

export interface PipelineState {
  IF: Instruction | null;
  ID: Instruction | null;
  EX: Instruction | null;
  MEM: Instruction | null;
  WB: Instruction | null;
}

export interface SimulationState {
  currentCycle: number;
  instructions: Instruction[];
  registers: Register[];
  memory: MemoryLocation[];
  pipeline: PipelineState;
  hazards: Hazard[];
  isRunning: boolean;
  isPaused: boolean;
  pc: number;
  completedInstructions: number;
  stallCycles: number;
  forwardingEnabled: boolean;
  branchPredictionEnabled: boolean;
}

export interface PerformanceMetrics {
  totalCycles: number;
  instructionsExecuted: number;
  cpi: number;
  stallCycles: number;
  dataHazardStalls: number;
  controlHazardStalls: number;
  structuralHazardStalls: number;
  speedup: number;
  efficiency: number;
}

export interface SimulationSettings {
  forwardingEnabled: boolean;
  branchPredictionEnabled: boolean;
  speed: number;
  stepMode: boolean;
}
