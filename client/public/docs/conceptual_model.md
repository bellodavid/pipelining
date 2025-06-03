# CPU Pipeline Simulator: Conceptual Model

## Extended Finite State Machine (EFSM) Model

The CPU pipeline is modeled as an Extended Finite State Machine with the following components:

### States
1. **Fetch (IF)**: Retrieves instruction from memory
2. **Decode (ID)**: Decodes instruction and reads registers
3. **Execute (EX)**: Performs ALU operations
4. **Memory (MEM)**: Accesses data memory if needed
5. **Writeback (WB)**: Writes results back to registers

### Transitions
- IF → ID: Instruction fetched successfully
- ID → EX: Instruction decoded, registers read
- EX → MEM: Execution completed
- MEM → WB: Memory access completed (if needed)
- WB → (end): Register writeback completed

### Variables and Parameters
- Program Counter (PC)
- Register File (32 registers)
- Instruction Memory
- Data Memory
- Control Signals
- Forwarding Paths
- Hazard Detection Signals

### Guards and Conditions
- Data Hazards: RAW, WAR, WAW dependencies
- Control Hazards: Branch prediction and resolution
- Structural Hazards: Resource conflicts

## UML Component Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                  CPU Pipeline Simulator                      │
└─────────────────────────────────────────────────────────────┘
                               │
           ┌──────────────────┼──────────────────┐
           ▼                   ▼                  ▼
┌─────────────────┐  ┌─────────────────┐ ┌─────────────────┐
│ Instruction     │  │ Pipeline        │ │ Performance     │
│ Management      │  │ Execution       │ │ Analysis        │
└─────────────────┘  └─────────────────┘ └─────────────────┘
         │                   │                   │
         ▼                   ▼                   ▼
┌─────────────────┐  ┌─────────────────┐ ┌─────────────────┐
│ - Code Editor   │  │ - IF Stage      │ │ - CPI Calc      │
│ - Parser        │  │ - ID Stage      │ │ - Stall Analysis│
│ - Assembler     │  │ - EX Stage      │ │ - Hazard Stats  │
└─────────────────┘  │ - MEM Stage     │ └─────────────────┘
                     │ - WB Stage      │
                     └─────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │ Hazard Detection│
                    │ - Data Hazards  │
                    │ - Control Hazards│
                    │ - Forwarding    │
                    └─────────────────┘
```

## Petri Net Model for Pipeline Execution

The pipeline execution can be modeled as a Petri net where:
- Places represent pipeline stages and resources
- Transitions represent instruction movements
- Tokens represent instructions in the pipeline
- Arc weights represent resource requirements

This model captures the concurrent nature of pipelining, where multiple instructions are in different stages of execution simultaneously.

## State Transition Diagram for Hazard Detection

```
┌─────────┐  No Hazard   ┌─────────┐
│ Normal  │─────────────▶│ Normal  │
│ Execution│◀─────────────│Execution│
└────┬────┘              └─────────┘
     │
     │ Data Hazard Detected
     ▼
┌─────────┐  Forwarding  ┌─────────┐
│ Stall   │─────────────▶│ Forward │
│         │              │         │
└────┬────┘              └────┬────┘
     │                        │
     │ Hazard Resolved        │ Hazard Resolved
     ▼                        ▼
┌─────────┐              ┌─────────┐
│ Resume  │◀─────────────│ Resume  │
│Execution│              │Execution│
└─────────┘              └─────────┘
```

## Behavioral Model for Instruction Execution

Each instruction follows this behavioral model:
1. Fetch: PC → Instruction Memory → Instruction Register
2. Decode: Instruction Register → Control Unit + Register File
3. Execute: ALU Operations + Branch Calculation
4. Memory: Data Memory Access (Load/Store)
5. Writeback: Result → Register File

This conceptual model forms the foundation of our executable simulation implementation.
