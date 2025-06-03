# CPU Pipeline Simulator: Project Report
**Federal University of Technology, Minna**  
**Department of Computer Engineering**  
**Group 2**

## Abstract

This project presents an interactive CPU pipeline simulator designed to model and visualize the execution of instructions in a 5-stage RISC processor pipeline. The simulator demonstrates key computer architecture concepts including instruction pipelining, hazard detection, data forwarding, and performance analysis. Through a web-based interface, users can write assembly code, observe instruction flow through pipeline stages, identify hazards, and analyze performance metrics. This report details the conceptual model, implementation, validation, and results of the simulation, providing insights into processor pipeline behavior and performance characteristics.

## 1. Introduction

### 1.1 Problem Definition

Modern computer processors employ pipelining to improve instruction throughput and overall performance. However, understanding the complex interactions between instructions in a pipeline, including hazards and their resolution techniques, presents significant challenges for students and practitioners in computer architecture. This project addresses the need for an interactive, visual tool that accurately models CPU pipeline behavior and provides insights into performance implications.

### 1.2 Key Parameters and Variables

The simulation models the following key components:
- **Instruction Set**: A subset of RISC assembly instructions
- **Pipeline Stages**: Fetch (IF), Decode (ID), Execute (EX), Memory (MEM), and Writeback (WB)
- **Hazard Types**: Data hazards (RAW, WAR, WAW), control hazards, and structural hazards
- **Resolution Techniques**: Stalling, forwarding, and branch prediction
- **Performance Metrics**: Cycles per instruction (CPI), pipeline efficiency, stall cycles

### 1.3 Assumptions

The simulator operates under the following assumptions:
- Single-issue, in-order execution pipeline
- Five-stage RISC pipeline architecture
- Register file with 32 general-purpose registers
- Memory access takes one cycle
- Branch outcomes are determined in the Execute stage
- Perfect instruction cache (no instruction fetch misses)

### 1.4 Objectives

The primary objectives of this simulation are to:
1. Provide an accurate model of instruction execution in a 5-stage RISC pipeline
2. Visualize instruction flow and interactions within the pipeline
3. Demonstrate hazard detection and resolution techniques
4. Calculate and display performance metrics
5. Serve as an educational tool for understanding pipeline concepts

## 2. Methodology

### 2.1 Conceptual Model Design

The CPU pipeline is modeled as an Extended Finite State Machine (EFSM) with states representing pipeline stages and transitions representing instruction movement through the pipeline. The conceptual model includes component interactions, state transitions, and behavioral models as detailed in the [conceptual model documentation](./conceptual_model.md).

### 2.2 Implementation Technologies

The simulator is implemented as a full-stack web application using:
- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Express.js, Node.js
- **State Management**: React Query, React Context
- **Visualization**: Custom React components
- **Deployment**: Netlify

### 2.3 Simulator Components

The implementation consists of several key components:
1. **Code Editor**: Allows users to write and edit assembly code
2. **Instruction Parser**: Converts assembly code to machine-readable format
3. **Pipeline Execution Engine**: Simulates instruction flow through pipeline stages
4. **Hazard Detection Unit**: Identifies data and control hazards
5. **Forwarding Unit**: Implements data forwarding where possible
6. **Visualization Components**: Renders pipeline stages, register file, and memory
7. **Performance Analyzer**: Calculates and displays performance metrics

### 2.4 User Interface Design

The user interface is designed to be intuitive and informative, featuring:
- Assembly code editor with syntax highlighting
- Visual representation of pipeline stages
- Register file and memory state displays
- Performance metrics dashboard
- Step-by-step execution controls
- Tutorial mode for guided learning

## 3. Results and Analysis

### 3.1 Pipeline Visualization

The simulator successfully visualizes instruction flow through the pipeline, showing:
- Current instruction in each pipeline stage
- Register values and updates
- Memory accesses
- Hazard detection and resolution

### 3.2 Hazard Detection and Resolution

The simulator accurately detects and resolves various hazards:
- **Data Hazards**: Identifies RAW dependencies and implements forwarding or stalling
- **Control Hazards**: Handles branch instructions and demonstrates branch penalty
- **Structural Hazards**: Shows resource conflicts when they occur

### 3.3 Performance Analysis

Performance metrics provided by the simulator include:
- **Cycles Per Instruction (CPI)**: Measures average cycles needed per instruction
- **Pipeline Efficiency**: Calculates the utilization of pipeline stages
- **Stall Analysis**: Quantifies stalls due to different hazard types
- **Speedup Comparison**: Compares pipelined vs. non-pipelined execution

### 3.4 Validation Results

The simulator was validated against theoretical models and known benchmarks:
- Instruction execution matches expected behavior in textbook examples
- Hazard detection aligns with theoretical predictions
- Performance metrics correlate with analytical calculations
- Edge cases (e.g., complex hazard combinations) are handled correctly

## 4. Discussion

### 4.1 Key Findings

The simulation reveals several important insights about pipeline behavior:
1. Data hazards are the most common source of pipeline stalls
2. Forwarding significantly reduces the performance impact of data hazards
3. Branch instructions introduce substantial performance penalties
4. Instruction mix strongly influences overall pipeline efficiency
5. Compiler optimization techniques can dramatically improve performance

### 4.2 Limitations

The current implementation has several limitations:
1. Simplified memory model without cache hierarchy
2. Limited instruction set compared to commercial processors
3. No support for out-of-order execution or superscalar features
4. Simplified branch prediction model
5. No modeling of exceptions or interrupts

### 4.3 Practical Applications

This simulator has practical applications in:
- Computer architecture education
- Compiler optimization research
- Assembly code optimization training
- Performance analysis of algorithms at the instruction level
- Demonstration of hardware/software interaction

## 5. Conclusion and Recommendations

### 5.1 Summary of Findings

The CPU pipeline simulator successfully models and visualizes the execution of instructions in a 5-stage RISC pipeline. It accurately demonstrates hazard detection and resolution techniques, and provides meaningful performance metrics. The interactive nature of the simulator makes it an effective educational tool for understanding complex pipeline concepts.

### 5.2 Recommendations

Based on our simulation results, we recommend:
1. Optimizing code to minimize data dependencies between adjacent instructions
2. Using compiler techniques to reduce branch penalties
3. Considering instruction scheduling to improve pipeline efficiency
4. Implementing more advanced branch prediction in hardware
5. Exploring forwarding paths to reduce stall cycles

### 5.3 Future Work

Potential extensions to this simulator include:
1. Adding cache hierarchy and memory system modeling
2. Implementing out-of-order execution and superscalar features
3. Supporting a broader instruction set
4. Adding advanced branch prediction techniques
5. Incorporating power and energy consumption models
6. Implementing a more sophisticated compiler optimizer

## 6. References

1. Hennessy, J. L., & Patterson, D. A. (2017). Computer Architecture: A Quantitative Approach (6th ed.). Morgan Kaufmann.
2. Harris, D. M., & Harris, S. L. (2015). Digital Design and Computer Architecture (2nd ed.). Morgan Kaufmann.
3. Stallings, W. (2016). Computer Organization and Architecture (10th ed.). Pearson.
4. Bryant, R. E., & O'Hallaron, D. R. (2015). Computer Systems: A Programmer's Perspective (3rd ed.). Pearson.
5. Tanenbaum, A. S. (2016). Structured Computer Organization (6th ed.). Pearson.

## Appendix A: Code Structure

The simulator codebase is organized as follows:

```
/
├── client/                  # Frontend code
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── lib/             # Core simulation logic
│   │   ├── pages/           # Application pages
│   │   └── types/           # TypeScript type definitions
├── server/                  # Backend code
│   ├── routes.ts            # API routes
│   └── storage.ts           # Data storage
├── shared/                  # Shared code
│   └── schema.ts            # Data schemas
├── api/                     # Serverless functions
│   └── standalone.ts        # Self-contained API
└── docs/                    # Documentation
    ├── conceptual_model.md  # Conceptual model documentation
    └── project_report.md    # This report
```

## Appendix B: Sample Code

Key implementation snippets:

### Pipeline Stage Implementation
```typescript
// Simplified pipeline stage implementation
class PipelineStage {
  private instruction: Instruction | null = null;
  private stalled: boolean = false;
  
  execute(): void {
    if (this.stalled || !this.instruction) return;
    
    // Stage-specific execution logic
    switch (this.stageName) {
      case 'IF':
        this.fetchInstruction();
        break;
      case 'ID':
        this.decodeInstruction();
        break;
      case 'EX':
        this.executeInstruction();
        break;
      case 'MEM':
        this.accessMemory();
        break;
      case 'WB':
        this.writeBack();
        break;
    }
  }
  
  // Other methods...
}
```

### Hazard Detection
```typescript
// Simplified data hazard detection
function detectDataHazards(
  instructions: Instruction[]
): Hazard[] {
  const hazards: Hazard[] = [];
  
  for (let i = 1; i < instructions.length; i++) {
    const curr = instructions[i];
    
    for (let j = 0; j < i; j++) {
      const prev = instructions[j];
      
      // Check for RAW hazard
      if (
        curr.sourceRegisters.some(reg => 
          prev.destinationRegister === reg
        )
      ) {
        hazards.push({
          type: 'RAW',
          instructions: [prev, curr],
          resolution: determineResolution(prev, curr)
        });
      }
      
      // Check for other hazard types...
    }
  }
  
  return hazards;
}
```

### Performance Analysis
```typescript
// Simplified CPI calculation
function calculateCPI(
  totalCycles: number,
  instructionsExecuted: number,
  stallCycles: number
): {
  cpi: number;
  baselineCPI: number;
  stallPercentage: number;
} {
  const cpi = totalCycles / instructionsExecuted;
  const baselineCPI = (totalCycles - stallCycles) / instructionsExecuted;
  const stallPercentage = (stallCycles / totalCycles) * 100;
  
  return {
    cpi,
    baselineCPI,
    stallPercentage
  };
}
```

## Appendix C: User Guide

### Getting Started
1. Access the simulator at: https://modeling-sim.windsurf.build
2. Choose between tutorial mode or direct simulator access
3. Write assembly code in the editor or select a sample program
4. Use the control panel to execute instructions step-by-step or run continuously
5. Observe the pipeline visualization and performance metrics

### Sample Programs
The simulator includes several sample programs:
1. Basic sequential operations
2. Programs with data hazards
3. Branch-heavy code
4. Memory access patterns
5. Optimized vs. unoptimized versions

### Tutorial Mode
The tutorial mode guides users through:
1. Basic pipeline concepts
2. Instruction execution
3. Hazard detection and resolution
4. Performance analysis
5. Code optimization techniques
