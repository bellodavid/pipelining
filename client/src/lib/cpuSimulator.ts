import { SimulationState, Instruction, Register, MemoryLocation, PipelineState, Hazard } from '@/types/cpu';
import { InstructionParser } from './instructionParser';
import { HazardDetector } from './hazardDetection';

export class CPUSimulator {
  private state: SimulationState;

  constructor() {
    this.state = this.getInitialState();
  }

  private getInitialState(): SimulationState {
    return {
      currentCycle: 0,
      instructions: [],
      registers: this.initializeRegisters(),
      memory: this.initializeMemory(),
      pipeline: {
        IF: null,
        ID: null,
        EX: null,
        MEM: null,
        WB: null
      },
      hazards: [],
      isRunning: false,
      isPaused: false,
      pc: 0x400000,
      completedInstructions: 0,
      stallCycles: 0,
      forwardingEnabled: true,
      branchPredictionEnabled: false
    };
  }

  private initializeRegisters(): Register[] {
    const registers: Register[] = [];
    for (let i = 0; i < 32; i++) {
      registers.push({
        name: `R${i}`,
        value: i === 0 ? 0 : Math.floor(Math.random() * 0x1000), // R0 is always 0
        modified: false,
        lastModifiedCycle: 0
      });
    }
    return registers;
  }

  private initializeMemory(): MemoryLocation[] {
    const memory: MemoryLocation[] = [];
    const baseAddress = 0x10000000;
    for (let i = 0; i < 16; i++) {
      memory.push({
        address: baseAddress + (i * 4),
        value: Math.floor(Math.random() * 0xFFFFFFFF),
        modified: false,
        lastModifiedCycle: 0
      });
    }
    return memory;
  }

  loadProgram(code: string): boolean {
    try {
      const instructions = InstructionParser.parseAssembly(code);
      this.state.instructions = instructions;
      this.state.pc = 0x400000;
      this.state.currentCycle = 0;
      this.state.completedInstructions = 0;
      this.state.hazards = [];
      this.state.pipeline = {
        IF: null,
        ID: null,
        EX: null,
        MEM: null,
        WB: null
      };
      return true;
    } catch (error) {
      console.error('Failed to load program:', error);
      return false;
    }
  }

  step(): SimulationState {
    this.state.currentCycle++;
    
    // Execute pipeline stages in reverse order (WB -> IF)
    this.executeWriteBack();
    this.executeMemoryAccess();
    this.executeExecute();
    this.executeInstructionDecode();
    this.executeInstructionFetch();

    // Update register modification flags
    this.updateModificationFlags();

    return { ...this.state };
  }

  private executeWriteBack(): void {
    const instruction = this.state.pipeline.WB;
    if (instruction) {
      // Write result back to register
      const deps = InstructionParser.getRegisterDependencies(instruction);
      if (deps.writes.length > 0) {
        const targetReg = deps.writes[0];
        const regIndex = this.getRegisterIndex(targetReg);
        if (regIndex >= 0) {
          this.state.registers[regIndex].value = this.calculateResult(instruction);
          this.state.registers[regIndex].modified = true;
          this.state.registers[regIndex].lastModifiedCycle = this.state.currentCycle;
        }
      }

      instruction.completed = true;
      this.state.completedInstructions++;
      this.state.pipeline.WB = null;
    }
  }

  private executeMemoryAccess(): void {
    const instruction = this.state.pipeline.MEM;
    if (instruction) {
      if (instruction.opcode === 'LW' || instruction.opcode === 'SW') {
        const address = this.calculateMemoryAddress(instruction);
        const memLocation = this.state.memory.find(m => m.address === address);
        
        if (memLocation) {
          if (instruction.opcode === 'SW') {
            // Store word
            const sourceReg = instruction.operands[0];
            const regIndex = this.getRegisterIndex(sourceReg);
            if (regIndex >= 0) {
              memLocation.value = this.state.registers[regIndex].value;
              memLocation.modified = true;
              memLocation.lastModifiedCycle = this.state.currentCycle;
            }
          }
          // For LW, the value will be written in WB stage
        }
      }

      // Move to WB stage
      this.state.pipeline.WB = instruction;
      this.state.pipeline.MEM = null;
    }
  }

  private executeExecute(): void {
    const instruction = this.state.pipeline.EX;
    if (instruction) {
      // Detect hazards
      const hazards = HazardDetector.detectDataHazards(
        instruction,
        this.state.pipeline,
        this.state.forwardingEnabled
      );
      
      this.state.hazards.push(...hazards);

      // Check if we need to stall
      if (HazardDetector.needsStall(hazards)) {
        this.state.stallCycles++;
        return; // Don't advance this instruction
      }

      // Move to MEM stage
      this.state.pipeline.MEM = instruction;
      this.state.pipeline.EX = null;
    }
  }

  private executeInstructionDecode(): void {
    const instruction = this.state.pipeline.ID;
    if (instruction) {
      // Decode and read registers
      const deps = InstructionParser.getRegisterDependencies(instruction);
      
      // Detect control hazards
      const controlHazards = HazardDetector.detectControlHazards(
        instruction,
        this.state.branchPredictionEnabled
      );
      this.state.hazards.push(...controlHazards);

      // Move to EX stage
      this.state.pipeline.EX = instruction;
      this.state.pipeline.ID = null;
    }
  }

  private executeInstructionFetch(): void {
    const instruction = this.state.pipeline.IF;
    if (instruction) {
      // Move to ID stage
      this.state.pipeline.ID = instruction;
      this.state.pipeline.IF = null;
    }

    // Fetch next instruction
    const nextInstruction = this.getNextInstruction();
    if (nextInstruction) {
      nextInstruction.cycle = this.state.currentCycle;
      nextInstruction.stage = 'IF';
      this.state.pipeline.IF = nextInstruction;
      this.state.pc += 4;
    }
  }

  private getNextInstruction(): Instruction | null {
    const instructionIndex = (this.state.pc - 0x400000) / 4;
    return this.state.instructions[instructionIndex] || null;
  }

  private getRegisterIndex(regName: string): number {
    const match = regName.match(/R(\d+)/i);
    return match ? parseInt(match[1]) : -1;
  }

  private calculateResult(instruction: Instruction): number {
    const { opcode, operands } = instruction;

    switch (opcode) {
      case 'ADD': {
        const val1 = this.getRegisterValue(operands[1]);
        const val2 = this.getRegisterValue(operands[2]);
        return val1 + val2;
      }
      case 'SUB': {
        const val1 = this.getRegisterValue(operands[1]);
        const val2 = this.getRegisterValue(operands[2]);
        return val1 - val2;
      }
      case 'AND': {
        const val1 = this.getRegisterValue(operands[1]);
        const val2 = this.getRegisterValue(operands[2]);
        return val1 & val2;
      }
      case 'OR': {
        const val1 = this.getRegisterValue(operands[1]);
        const val2 = this.getRegisterValue(operands[2]);
        return val1 | val2;
      }
      case 'LW': {
        const address = this.calculateMemoryAddress(instruction);
        const memLocation = this.state.memory.find(m => m.address === address);
        return memLocation ? memLocation.value : 0;
      }
      default:
        return 0;
    }
  }

  private getRegisterValue(regName: string): number {
    const regIndex = this.getRegisterIndex(regName);
    return regIndex >= 0 ? this.state.registers[regIndex].value : 0;
  }

  private calculateMemoryAddress(instruction: Instruction): number {
    // For LW/SW: operands are [rt, offset, base]
    const offset = parseInt(instruction.operands[1]) || 0;
    const baseValue = this.getRegisterValue(instruction.operands[2]);
    return baseValue + offset;
  }

  private updateModificationFlags(): void {
    // Clear modification flags that are older than 3 cycles
    this.state.registers.forEach(reg => {
      if (reg.modified && this.state.currentCycle - reg.lastModifiedCycle > 3) {
        reg.modified = false;
      }
    });

    this.state.memory.forEach(mem => {
      if (mem.modified && this.state.currentCycle - mem.lastModifiedCycle > 3) {
        mem.modified = false;
      }
    });
  }

  getState(): SimulationState {
    return { ...this.state };
  }

  setState(newState: Partial<SimulationState>): void {
    this.state = { ...this.state, ...newState };
  }

  reset(): void {
    this.state = this.getInitialState();
  }

  isComplete(): boolean {
    return (
      this.state.completedInstructions === this.state.instructions.length &&
      !this.state.pipeline.IF &&
      !this.state.pipeline.ID &&
      !this.state.pipeline.EX &&
      !this.state.pipeline.MEM &&
      !this.state.pipeline.WB
    );
  }
}
