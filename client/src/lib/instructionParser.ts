import { Instruction } from '@/types/cpu';

export class InstructionParser {
  private static opcodes = {
    'ADD': { type: 'R' as const, format: 'rd,rs,rt' },
    'SUB': { type: 'R' as const, format: 'rd,rs,rt' },
    'AND': { type: 'R' as const, format: 'rd,rs,rt' },
    'OR': { type: 'R' as const, format: 'rd,rs,rt' },
    'LW': { type: 'I' as const, format: 'rt,offset(base)' },
    'SW': { type: 'I' as const, format: 'rt,offset(base)' },
    'BEQ': { type: 'I' as const, format: 'rs,rt,offset' },
    'BNE': { type: 'I' as const, format: 'rs,rt,offset' },
    'J': { type: 'J' as const, format: 'target' },
    'NOP': { type: 'R' as const, format: '' }
  };

  static parseAssembly(code: string): Instruction[] {
    const lines = code.split('\n').filter(line => 
      line.trim() && !line.trim().startsWith('//') && !line.trim().startsWith('#')
    );

    const instructions: Instruction[] = [];
    let pc = 0x400000; // Starting PC address

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      try {
        const instruction = this.parseLine(line, pc, i.toString());
        instructions.push(instruction);
        pc += 4; // MIPS instructions are 4 bytes
      } catch (error) {
        console.warn(`Failed to parse line ${i + 1}: ${line}`, error);
      }
    }

    return instructions;
  }

  private static parseLine(line: string, pc: number, id: string): Instruction {
    // Remove comments
    const cleanLine = line.split('//')[0].split('#')[0].trim();
    
    // Split instruction and operands
    const parts = cleanLine.split(/\s+/);
    const opcode = parts[0].toUpperCase();
    
    if (!this.opcodes[opcode as keyof typeof this.opcodes]) {
      throw new Error(`Unknown opcode: ${opcode}`);
    }

    const opcodeInfo = this.opcodes[opcode as keyof typeof this.opcodes];
    let operands: string[] = [];

    if (parts.length > 1) {
      const operandString = parts.slice(1).join(' ');
      operands = this.parseOperands(operandString, opcodeInfo.type);
    }

    return {
      id,
      pc,
      opcode,
      operands,
      type: opcodeInfo.type,
      raw: cleanLine,
      cycle: 0,
      stage: null,
      completed: false
    };
  }

  private static parseOperands(operandString: string, type: 'R' | 'I' | 'J'): string[] {
    if (type === 'I' && operandString.includes('(')) {
      // Handle memory operands like "0(R1)"
      const parts = operandString.split(',').map(s => s.trim());
      const result: string[] = [];
      
      for (const part of parts) {
        if (part.includes('(')) {
          // Parse memory operand
          const match = part.match(/(.+)\((.+)\)/);
          if (match) {
            result.push(match[1].trim()); // offset
            result.push(match[2].trim()); // base register
          }
        } else {
          result.push(part);
        }
      }
      return result;
    }

    return operandString.split(',').map(s => s.trim());
  }

  static validateInstruction(instruction: Instruction): boolean {
    const opcode = instruction.opcode;
    const operands = instruction.operands;

    switch (opcode) {
      case 'ADD':
      case 'SUB':
      case 'AND':
      case 'OR':
        return operands.length === 3 && operands.every(op => op.match(/^R\d+$/i));
      
      case 'LW':
      case 'SW':
        return operands.length === 3; // rt, offset, base
      
      case 'BEQ':
      case 'BNE':
        return operands.length === 3; // rs, rt, offset
      
      case 'J':
        return operands.length === 1;
      
      case 'NOP':
        return operands.length === 0;
      
      default:
        return false;
    }
  }

  static getRegisterDependencies(instruction: Instruction): { reads: string[], writes: string[] } {
    const { opcode, operands } = instruction;
    const reads: string[] = [];
    const writes: string[] = [];

    switch (opcode) {
      case 'ADD':
      case 'SUB':
      case 'AND':
      case 'OR':
        reads.push(operands[1], operands[2]); // rs, rt
        writes.push(operands[0]); // rd
        break;
      
      case 'LW':
        reads.push(operands[2]); // base register
        writes.push(operands[0]); // rt
        break;
      
      case 'SW':
        reads.push(operands[0], operands[2]); // rt, base register
        break;
      
      case 'BEQ':
      case 'BNE':
        reads.push(operands[0], operands[1]); // rs, rt
        break;
    }

    return { reads, writes };
  }
}
