import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Code, Check, Upload, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CodeEditorProps {
  onLoadProgram: (code: string) => boolean;
  defaultCode: string;
}

const samplePrograms = {
  'Data Hazard Example': `// Data Hazard Example
ADD R1, R2, R3    // R1 = R2 + R3  
SUB R4, R1, R5    // Uses R1 (RAW hazard)
ADD R6, R4, R7    // Uses R4 (RAW hazard)`,

  'Control Hazard Example': `// Control Hazard Example
ADD R1, R2, R3    // R1 = R2 + R3
BEQ R1, R4, 8     // Branch instruction
ADD R5, R6, R7    // May not be executed
SUB R8, R9, R10   // May not be executed`,

  'Load-Use Hazard': `// Load-Use Hazard Example
LW R1, 0(R2)      // Load from memory
ADD R3, R1, R4    // Uses loaded value (stall required)
SUB R5, R3, R6    // Uses result`,

  'Mixed Hazards': `// Mixed Hazards Example
LW R1, 0(R2)      // Load instruction
ADD R3, R1, R4    // Load-use hazard
BEQ R3, R5, 8     // Control hazard
SW R3, 4(R2)      // Store instruction
ADD R6, R3, R7    // Data hazard`,

  'Complex Pipeline': `// Complex Pipeline Test
ADD R1, R2, R3    // R1 = R2 + R3
LW R4, 0(R1)      // Load using R1
SUB R5, R4, R2    // Use loaded R4
SW R5, 4(R1)      // Store result
BEQ R5, R6, 8     // Branch on result
ADD R7, R8, R9    // After branch
OR R10, R7, R4    // Multiple dependencies
AND R11, R10, R1  // Chain of dependencies`
};

export default function CodeEditor({ onLoadProgram, defaultCode }: CodeEditorProps) {
  const [code, setCode] = useState(defaultCode);
  const [isValid, setIsValid] = useState(true);
  const [lineCount, setLineCount] = useState(8);
  const { toast } = useToast();

  const validateCode = (codeText: string): boolean => {
    const lines = codeText.split('\n').filter(line => 
      line.trim() && !line.trim().startsWith('//') && !line.trim().startsWith('#')
    );

    setLineCount(lines.length);

    // Basic validation - check for valid instruction format
    for (const line of lines) {
      const cleanLine = line.trim();
      if (!cleanLine) continue;

      // Check if line starts with a valid opcode
      const validOpcodes = ['ADD', 'SUB', 'LW', 'SW', 'BEQ', 'BNE', 'AND', 'OR', 'J', 'NOP'];
      const firstWord = cleanLine.split(/\s+/)[0].toUpperCase();
      
      if (!validOpcodes.includes(firstWord)) {
        return false;
      }
    }

    return true;
  };

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    const valid = validateCode(newCode);
    setIsValid(valid);
  };

  const handleLoadProgram = () => {
    if (!isValid) {
      toast({
        title: "Invalid Code",
        description: "Please fix syntax errors before loading the program.",
        variant: "destructive"
      });
      return;
    }

    const success = onLoadProgram(code);
    if (success) {
      toast({
        title: "Program Loaded",
        description: `Successfully loaded ${lineCount} instructions.`,
      });
    } else {
      toast({
        title: "Load Failed",
        description: "Failed to parse the assembly code. Please check for errors.",
        variant: "destructive"
      });
    }
  };

  const loadSampleProgram = (programName: string) => {
    const sampleCode = samplePrograms[programName as keyof typeof samplePrograms];
    if (sampleCode) {
      handleCodeChange(sampleCode);
      toast({
        title: "Sample Loaded",
        description: `Loaded ${programName} sample program.`,
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
            <Code className="h-5 w-5 mr-2 text-green-600" />
            Assembly Code Input
          </CardTitle>
          <div className="flex items-center space-x-2">
            <select 
              className="text-sm border border-gray-300 rounded-md px-2 py-1"
              onChange={(e) => loadSampleProgram(e.target.value)}
              value=""
            >
              <option value="">Load Sample...</option>
              {Object.keys(samplePrograms).map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
            <Button 
              onClick={handleLoadProgram}
              size="sm" 
              className="flex items-center space-x-1"
            >
              <Upload className="h-4 w-4" />
              <span>Load Program</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <Textarea
            value={code}
            onChange={(e) => handleCodeChange(e.target.value)}
            className="w-full h-64 font-mono text-sm resize-none bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter MIPS assembly instructions here..."
            style={{ paddingLeft: '3rem' }}
          />
          
          {/* Line Numbers */}
          <div className="absolute left-2 top-3 text-xs text-gray-400 font-mono leading-5 pointer-events-none select-none">
            {code.split('\n').map((_, index) => (
              <div key={index}>{index + 1}</div>
            ))}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            <span className="font-medium">{lineCount}</span> instructions loaded
          </div>
          <div className="flex items-center space-x-2">
            <Badge 
              variant={isValid ? "default" : "destructive"}
              className={isValid ? "bg-green-100 text-green-800" : ""}
            >
              {isValid ? (
                <>
                  <Check className="h-3 w-3 mr-1" />
                  Valid Syntax
                </>
              ) : (
                <>
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Invalid Syntax
                </>
              )}
            </Badge>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="text-sm font-medium text-blue-800 mb-1">Supported Instructions:</h4>
          <div className="text-xs text-blue-700 space-y-1">
            <div><code className="font-mono">ADD Rd, Rs, Rt</code> - Addition</div>
            <div><code className="font-mono">SUB Rd, Rs, Rt</code> - Subtraction</div>
            <div><code className="font-mono">LW Rt, offset(base)</code> - Load word</div>
            <div><code className="font-mono">SW Rt, offset(base)</code> - Store word</div>
            <div><code className="font-mono">BEQ Rs, Rt, offset</code> - Branch if equal</div>
            <div><code className="font-mono">AND, OR</code> - Logical operations</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
