import { SimulationState, PerformanceMetrics, Hazard } from '@/types/cpu';

export class PerformanceAnalyzer {
  static calculateMetrics(state: SimulationState): PerformanceMetrics {
    const totalCycles = state.currentCycle;
    const instructionsExecuted = state.completedInstructions;
    const totalInstructions = state.instructions.length;

    // Calculate CPI (Cycles Per Instruction)
    const cpi = instructionsExecuted > 0 ? totalCycles / instructionsExecuted : 0;

    // Count different types of stalls
    const dataHazardStalls = this.countHazardStalls(state.hazards, 'data');
    const controlHazardStalls = this.countHazardStalls(state.hazards, 'control');
    const structuralHazardStalls = this.countHazardStalls(state.hazards, 'structural');
    const totalStalls = dataHazardStalls + controlHazardStalls + structuralHazardStalls;

    // Calculate speedup compared to sequential execution
    // Sequential execution would take: totalInstructions * 5 cycles (5-stage pipeline)
    const sequentialCycles = totalInstructions * 5;
    const speedup = sequentialCycles > 0 ? sequentialCycles / Math.max(totalCycles, 1) : 1;

    // Calculate pipeline efficiency
    // Ideal pipelined execution: totalInstructions + 4 cycles (pipeline depth - 1)
    const idealPipelinedCycles = totalInstructions + 4;
    const efficiency = idealPipelinedCycles > 0 ? (idealPipelinedCycles / Math.max(totalCycles, 1)) * 100 : 100;

    return {
      totalCycles,
      instructionsExecuted,
      cpi: Math.round(cpi * 100) / 100,
      stallCycles: totalStalls,
      dataHazardStalls,
      controlHazardStalls,
      structuralHazardStalls,
      speedup: Math.round(speedup * 100) / 100,
      efficiency: Math.round(efficiency * 10) / 10
    };
  }

  private static countHazardStalls(hazards: Hazard[], type: 'data' | 'control' | 'structural'): number {
    return hazards.filter(hazard => 
      hazard.type === type && !hazard.resolved
    ).length;
  }

  static getDetailedAnalysis(state: SimulationState): {
    hazardBreakdown: Record<string, number>;
    instructionTypes: Record<string, number>;
    cycleEfficiency: number;
  } {
    const hazardBreakdown: Record<string, number> = {
      'RAW': 0,
      'WAR': 0,
      'WAW': 0,
      'Branch': 0,
      'Structural': 0
    };

    state.hazards.forEach(hazard => {
      if (hazard.subtype === 'RAW') hazardBreakdown['RAW']++;
      else if (hazard.subtype === 'WAR') hazardBreakdown['WAR']++;
      else if (hazard.subtype === 'WAW') hazardBreakdown['WAW']++;
      else if (hazard.subtype === 'branch') hazardBreakdown['Branch']++;
      else if (hazard.subtype === 'resource') hazardBreakdown['Structural']++;
    });

    const instructionTypes: Record<string, number> = {};
    state.instructions.forEach(instruction => {
      instructionTypes[instruction.type] = (instructionTypes[instruction.type] || 0) + 1;
    });

    const cycleEfficiency = state.instructions.length > 0 ? 
      (state.completedInstructions / state.currentCycle) * 100 : 0;

    return {
      hazardBreakdown,
      instructionTypes,
      cycleEfficiency: Math.round(cycleEfficiency * 10) / 10
    };
  }

  static compareExecution(state: SimulationState): {
    sequential: number;
    idealPipelined: number;
    actualPipelined: number;
    hazardOverhead: number;
  } {
    const totalInstructions = state.instructions.length;
    const sequential = totalInstructions * 5; // 5 cycles per instruction
    const idealPipelined = totalInstructions + 4; // pipeline depth - 1
    const actualPipelined = state.currentCycle;
    const hazardOverhead = actualPipelined - idealPipelined;

    return {
      sequential,
      idealPipelined,
      actualPipelined,
      hazardOverhead: Math.max(0, hazardOverhead)
    };
  }
}
