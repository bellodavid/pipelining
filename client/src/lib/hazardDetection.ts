import { Instruction, Hazard, PipelineState } from '@/types/cpu';
import { InstructionParser } from './instructionParser';

export class HazardDetector {
  static detectDataHazards(
    currentInstruction: Instruction,
    pipeline: PipelineState,
    forwardingEnabled: boolean
  ): Hazard[] {
    const hazards: Hazard[] = [];
    const currentDeps = InstructionParser.getRegisterDependencies(currentInstruction);

    // Check against instructions in pipeline
    const pipelineInstructions = [pipeline.EX, pipeline.MEM, pipeline.WB].filter(Boolean) as Instruction[];

    for (const pipelineInst of pipelineInstructions) {
      const pipelineDeps = InstructionParser.getRegisterDependencies(pipelineInst);

      // RAW Hazard: Current instruction reads what pipeline instruction writes
      for (const readReg of currentDeps.reads) {
        for (const writeReg of pipelineDeps.writes) {
          if (readReg === writeReg) {
            const canForward = this.canForward(pipelineInst, currentInstruction, forwardingEnabled);
            hazards.push({
              type: 'data',
              subtype: 'RAW',
              instruction1: pipelineInst.raw,
              instruction2: currentInstruction.raw,
              description: `${currentInstruction.raw} reads ${readReg} written by ${pipelineInst.raw}`,
              resolved: canForward,
              cycle: currentInstruction.cycle
            });
          }
        }
      }

      // WAR Hazard: Current instruction writes what pipeline instruction reads
      for (const writeReg of currentDeps.writes) {
        for (const readReg of pipelineDeps.reads) {
          if (writeReg === readReg) {
            hazards.push({
              type: 'data',
              subtype: 'WAR',
              instruction1: pipelineInst.raw,
              instruction2: currentInstruction.raw,
              description: `${currentInstruction.raw} writes ${writeReg} read by ${pipelineInst.raw}`,
              resolved: true, // WAR hazards are typically resolved by register renaming
              cycle: currentInstruction.cycle
            });
          }
        }
      }

      // WAW Hazard: Current instruction writes what pipeline instruction writes
      for (const writeReg of currentDeps.writes) {
        for (const pipelineWriteReg of pipelineDeps.writes) {
          if (writeReg === pipelineWriteReg) {
            hazards.push({
              type: 'data',
              subtype: 'WAW',
              instruction1: pipelineInst.raw,
              instruction2: currentInstruction.raw,
              description: `Both instructions write to ${writeReg}`,
              resolved: false,
              cycle: currentInstruction.cycle
            });
          }
        }
      }
    }

    return hazards;
  }

  static detectControlHazards(
    instruction: Instruction,
    branchPredictionEnabled: boolean
  ): Hazard[] {
    const hazards: Hazard[] = [];

    if (instruction.opcode === 'BEQ' || instruction.opcode === 'BNE' || instruction.opcode === 'J') {
      hazards.push({
        type: 'control',
        subtype: 'branch',
        instruction1: instruction.raw,
        instruction2: '',
        description: `Branch instruction ${instruction.raw} causes control hazard`,
        resolved: branchPredictionEnabled,
        cycle: instruction.cycle
      });
    }

    return hazards;
  }

  static detectStructuralHazards(pipeline: PipelineState): Hazard[] {
    const hazards: Hazard[] = [];

    // Check for memory access conflicts
    const memInstruction = pipeline.MEM;
    const ifInstruction = pipeline.IF;

    if (memInstruction && ifInstruction && 
        (memInstruction.opcode === 'LW' || memInstruction.opcode === 'SW')) {
      hazards.push({
        type: 'structural',
        subtype: 'resource',
        instruction1: memInstruction.raw,
        instruction2: ifInstruction.raw,
        description: 'Memory access conflict between MEM and IF stages',
        resolved: false,
        cycle: memInstruction.cycle
      });
    }

    return hazards;
  }

  private static canForward(
    producer: Instruction,
    consumer: Instruction,
    forwardingEnabled: boolean
  ): boolean {
    if (!forwardingEnabled) return false;

    // Cannot forward from load instructions (load-use hazard)
    if (producer.opcode === 'LW') {
      return false;
    }

    // Can forward from ALU operations
    if (['ADD', 'SUB', 'AND', 'OR'].includes(producer.opcode)) {
      return true;
    }

    return false;
  }

  static needsStall(hazards: Hazard[]): boolean {
    return hazards.some(hazard => !hazard.resolved && hazard.type === 'data' && hazard.subtype === 'RAW');
  }

  static getStallCycles(instruction: Instruction, pipeline: PipelineState): number {
    // Load-use hazard requires 1 stall cycle
    const memInstruction = pipeline.EX;
    if (memInstruction && memInstruction.opcode === 'LW') {
      const consumerDeps = InstructionParser.getRegisterDependencies(instruction);
      const producerDeps = InstructionParser.getRegisterDependencies(memInstruction);
      
      for (const readReg of consumerDeps.reads) {
        if (producerDeps.writes.includes(readReg)) {
          return 1;
        }
      }
    }

    return 0;
  }
}
