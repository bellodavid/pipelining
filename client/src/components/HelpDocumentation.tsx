import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Book, 
  Cpu, 
  Code, 
  AlertTriangle, 
  TrendingUp, 
  Play, 
  ChevronRight,
  Lightbulb,
  Target,
  Clock
} from 'lucide-react';

interface HelpDocumentationProps {
  onClose: () => void;
}

export default function HelpDocumentation({ onClose }: HelpDocumentationProps) {
  const [activeExample, setActiveExample] = useState(0);

  const assemblyExamples = [
    {
      title: "Basic Addition",
      code: "ADD R1, R2, R3",
      explanation: "Add the values in registers R2 and R3, store the result in R1",
      steps: [
        "Read the value from register R2",
        "Read the value from register R3", 
        "Add these two values together",
        "Store the result in register R1"
      ]
    },
    {
      title: "Load from Memory",
      code: "LW R4, 0(R1)",
      explanation: "Load a word from memory address stored in R1 into register R4",
      steps: [
        "Read the address from register R1",
        "Go to that memory location",
        "Read the value stored there",
        "Put that value into register R4"
      ]
    },
    {
      title: "Store to Memory",
      code: "SW R4, 4(R2)",
      explanation: "Store the value in R4 to memory at address R2 + 4",
      steps: [
        "Read the value from register R4",
        "Read the address from register R2",
        "Add 4 to that address",
        "Store R4's value at the calculated address"
      ]
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Book className="h-6 w-6 mr-2 text-blue-600" />
              CPU Pipeline Simulator Guide
            </h1>
            <Button onClick={onClose} variant="outline">Close</Button>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="assembly">Assembly Code</TabsTrigger>
              <TabsTrigger value="pipeline">Pipeline Stages</TabsTrigger>
              <TabsTrigger value="hazards">Hazards</TabsTrigger>
              <TabsTrigger value="tutorial">Tutorial</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Target className="h-5 w-5 mr-2 text-green-600" />
                      What is a CPU Pipeline?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4">
                      Think of a CPU pipeline like an assembly line in a factory. Instead of building one car completely 
                      before starting the next, workers at different stations work on different cars simultaneously.
                    </p>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2">Real-world analogy:</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• <strong>Car Factory:</strong> 5 stations work on different cars at the same time</li>
                        <li>• <strong>CPU Pipeline:</strong> 5 stages work on different instructions at the same time</li>
                        <li>• <strong>Result:</strong> Much faster overall processing, just like the factory produces cars faster</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Why Does This Matter?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-green-800 mb-2">Without Pipeline:</h4>
                        <p className="text-sm text-green-700">
                          Each instruction takes 5 steps to complete. For 8 instructions, that's 40 steps total.
                        </p>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-800 mb-2">With Pipeline:</h4>
                        <p className="text-sm text-blue-700">
                          Multiple instructions work simultaneously. 8 instructions might only take 12 steps total!
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="assembly" className="mt-6">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Code className="h-5 w-5 mr-2 text-purple-600" />
                      Understanding Assembly Language
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4">
                      Assembly language is like giving very specific, simple instructions to a computer. 
                      Think of it as talking to someone who only understands basic commands.
                    </p>
                    
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">Basic Format:</h4>
                        <code className="bg-white px-2 py-1 rounded">INSTRUCTION destination, source1, source2</code>
                        <p className="text-sm text-gray-600 mt-2">
                          Like saying: "ADD the result to R1, using values from R2 and R3"
                        </p>
                      </div>

                      {assemblyExamples.map((example, index) => (
                        <Card key={index} className="border border-gray-200">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-gray-800">{example.title}</h4>
                              <Badge variant="outline">{example.code}</Badge>
                            </div>
                            <p className="text-gray-700 mb-3">{example.explanation}</p>
                            <div className="bg-blue-50 p-3 rounded">
                              <h5 className="text-sm font-medium text-blue-800 mb-2">Step by step:</h5>
                              <ol className="text-sm text-blue-700 space-y-1">
                                {example.steps.map((step, stepIndex) => (
                                  <li key={stepIndex}>{stepIndex + 1}. {step}</li>
                                ))}
                              </ol>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Registers: The CPU's Quick Memory</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4">
                      Registers are like the CPU's hands - small, fast storage spaces where it keeps numbers 
                      it's currently working with.
                    </p>
                    <div className="bg-amber-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-amber-800 mb-2">Think of registers like:</h4>
                      <ul className="text-sm text-amber-700 space-y-1">
                        <li>• <strong>R0:</strong> Always contains 0 (like a constant)</li>
                        <li>• <strong>R1, R2, R3...</strong> Temporary storage boxes for numbers</li>
                        <li>• <strong>Very fast:</strong> The CPU can access these instantly</li>
                        <li>• <strong>Limited:</strong> Only 32 of them (R0 to R31)</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="pipeline" className="mt-6">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Cpu className="h-5 w-5 mr-2 text-blue-600" />
                      The 5 Pipeline Stages
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-6">
                      Every instruction goes through these 5 stages, like stations on an assembly line:
                    </p>
                    
                    <div className="space-y-4">
                      <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                        <h3 className="font-semibold text-blue-800 mb-2">1. IF - Instruction Fetch</h3>
                        <p className="text-blue-700 mb-2"><strong>What it does:</strong> Gets the next instruction from memory</p>
                        <p className="text-sm text-blue-600">Like picking up the next recipe card from a stack</p>
                      </div>

                      <div className="bg-emerald-50 border-l-4 border-emerald-400 p-4">
                        <h3 className="font-semibold text-emerald-800 mb-2">2. ID - Instruction Decode</h3>
                        <p className="text-emerald-700 mb-2"><strong>What it does:</strong> Figures out what the instruction means</p>
                        <p className="text-sm text-emerald-600">Like reading the recipe and understanding "add flour to bowl"</p>
                      </div>

                      <div className="bg-amber-50 border-l-4 border-amber-400 p-4">
                        <h3 className="font-semibold text-amber-800 mb-2">3. EX - Execute</h3>
                        <p className="text-amber-700 mb-2"><strong>What it does:</strong> Performs the actual calculation</p>
                        <p className="text-sm text-amber-600">Like actually mixing the ingredients together</p>
                      </div>

                      <div className="bg-purple-50 border-l-4 border-purple-400 p-4">
                        <h3 className="font-semibold text-purple-800 mb-2">4. MEM - Memory Access</h3>
                        <p className="text-purple-700 mb-2"><strong>What it does:</strong> Reads from or writes to memory if needed</p>
                        <p className="text-sm text-purple-600">Like getting ingredients from the pantry or putting the result back</p>
                      </div>

                      <div className="bg-cyan-50 border-l-4 border-cyan-400 p-4">
                        <h3 className="font-semibold text-cyan-800 mb-2">5. WB - Write Back</h3>
                        <p className="text-cyan-700 mb-2"><strong>What it does:</strong> Saves the final result to a register</p>
                        <p className="text-sm text-cyan-600">Like putting the finished dish on the serving table</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="hazards" className="mt-6">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
                      Pipeline Hazards: When Things Go Wrong
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-6">
                      Sometimes instructions can't proceed smoothly through the pipeline. 
                      Think of these like traffic jams on an assembly line.
                    </p>

                    <div className="space-y-4">
                      <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                        <h3 className="font-semibold text-red-800 mb-2">Data Hazards (RAW - Read After Write)</h3>
                        <p className="text-red-700 mb-2">
                          <strong>Problem:</strong> One instruction needs a result that the previous instruction hasn't finished calculating yet.
                        </p>
                        <div className="bg-white p-3 rounded border">
                          <code className="text-sm">
                            ADD R1, R2, R3  &nbsp;&nbsp; // Calculates R1<br/>
                            SUB R4, R1, R5  &nbsp;&nbsp; // Needs R1 (but it's not ready yet!)
                          </code>
                        </div>
                        <p className="text-sm text-red-600 mt-2">
                          <strong>Real-world analogy:</strong> Like trying to frost a cake before it's finished baking
                        </p>
                      </div>

                      <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
                        <h3 className="font-semibold text-orange-800 mb-2">Control Hazards (Branch Hazards)</h3>
                        <p className="text-orange-700 mb-2">
                          <strong>Problem:</strong> The CPU doesn't know which instruction comes next because it depends on a comparison.
                        </p>
                        <div className="bg-white p-3 rounded border">
                          <code className="text-sm">
                            BEQ R1, R2, label  &nbsp;&nbsp; // If R1 equals R2, jump somewhere else<br/>
                            ADD R3, R4, R5     &nbsp;&nbsp; // Should this execute or not?
                          </code>
                        </div>
                        <p className="text-sm text-orange-600 mt-2">
                          <strong>Real-world analogy:</strong> Like not knowing whether to turn left or right until you reach the intersection
                        </p>
                      </div>

                      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                        <h3 className="font-semibold text-blue-800 mb-2">Structural Hazards</h3>
                        <p className="text-blue-700 mb-2">
                          <strong>Problem:</strong> Two instructions need the same hardware resource at the same time.
                        </p>
                        <p className="text-sm text-blue-600">
                          <strong>Real-world analogy:</strong> Like two workers trying to use the same tool at the same time
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 bg-green-50 border border-green-200 p-4 rounded-lg">
                      <h3 className="font-semibold text-green-800 mb-2">Solutions:</h3>
                      <ul className="text-green-700 space-y-1">
                        <li>• <strong>Forwarding:</strong> Pass results directly to where they're needed (like handing ingredients directly to the next cook)</li>
                        <li>• <strong>Stalling:</strong> Wait for the needed result (like pausing until the oven is free)</li>
                        <li>• <strong>Branch Prediction:</strong> Guess which way to go (like choosing a route based on typical traffic)</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="tutorial" className="mt-6">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Play className="h-5 w-5 mr-2 text-green-600" />
                      How to Use the Simulator
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                        <h3 className="font-semibold text-green-800 mb-3">Step 1: Load a Program</h3>
                        <ol className="text-green-700 space-y-2">
                          <li>1. Look for the "Assembly Code Input" section</li>
                          <li>2. Click the dropdown that says "Load Sample..."</li>
                          <li>3. Choose "Data Hazard Example" to start with something simple</li>
                          <li>4. Click the "Load Program" button</li>
                        </ol>
                      </div>

                      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                        <h3 className="font-semibold text-blue-800 mb-3">Step 2: Watch the Pipeline</h3>
                        <ol className="text-blue-700 space-y-2">
                          <li>1. Look at the "Pipeline Visualization" section</li>
                          <li>2. You'll see 5 colored boxes labeled IF, ID, EX, MEM, WB</li>
                          <li>3. Click the "Step" button to see instructions move through the pipeline</li>
                          <li>4. Watch how each instruction moves from left to right through the stages</li>
                        </ol>
                      </div>

                      <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
                        <h3 className="font-semibold text-purple-800 mb-3">Step 3: Observe Performance</h3>
                        <ol className="text-purple-700 space-y-2">
                          <li>1. Look at the "Performance Metrics" panel on the right</li>
                          <li>2. Watch how "Total Cycles" increases as you step through</li>
                          <li>3. See how "CPI" (Cycles Per Instruction) changes</li>
                          <li>4. Notice when "Pipeline Stalls" occur (these are hazards!)</li>
                        </ol>
                      </div>

                      <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                        <h3 className="font-semibold text-amber-800 mb-3">Step 4: Experiment</h3>
                        <ul className="text-amber-700 space-y-2">
                          <li>• Try turning "Forwarding" on and off to see how it affects performance</li>
                          <li>• Load different sample programs to see different types of hazards</li>
                          <li>• Use the "Run" button to see the simulation run automatically</li>
                          <li>• Check the "Instruction Queue" to see which instructions are waiting</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>What to Look For</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-800">Good Performance:</h4>
                        <ul className="text-sm text-gray-700 space-y-1">
                          <li>• CPI close to 1.0</li>
                          <li>• Few pipeline stalls</li>
                          <li>• High speedup compared to sequential</li>
                          <li>• Instructions flowing smoothly</li>
                        </ul>
                      </div>
                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-800">Performance Issues:</h4>
                        <ul className="text-sm text-gray-700 space-y-1">
                          <li>• CPI much higher than 1.0</li>
                          <li>• Many pipeline stalls</li>
                          <li>• Red hazard warnings</li>
                          <li>• Instructions getting stuck</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}