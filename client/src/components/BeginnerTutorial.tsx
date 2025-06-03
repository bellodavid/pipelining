import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  SkipForward,
  Lightbulb,
  Target,
  CheckCircle
} from 'lucide-react';

interface BeginnerTutorialProps {
  onClose: () => void;
  onLoadSample: (code: string) => void;
}

const tutorialSteps = [
  {
    title: "Welcome to CPU Pipeline Simulation!",
    content: (
      <div className="space-y-4">
        <p className="text-gray-700">
          This tutorial will guide you through understanding how a computer's processor (CPU) 
          works using a simple, visual simulation.
        </p>
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">What you'll learn:</h4>
          <ul className="text-blue-700 space-y-1 text-sm">
            <li>• How computers execute instructions step by step</li>
            <li>• Why pipelining makes computers faster</li>
            <li>• What happens when things go wrong (hazards)</li>
            <li>• How to read simple assembly code</li>
          </ul>
        </div>
        <p className="text-sm text-gray-600">
          <strong>Time needed:</strong> About 5-10 minutes
        </p>
      </div>
    )
  },
  {
    title: "What is Assembly Code?",
    content: (
      <div className="space-y-4">
        <p className="text-gray-700">
          Assembly code is like giving very simple, specific instructions to a computer. 
          Think of it as a recipe with very basic steps.
        </p>
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-semibold text-green-800 mb-2">Example:</h4>
          <code className="bg-white px-2 py-1 rounded block">ADD R1, R2, R3</code>
          <p className="text-green-700 text-sm mt-2">
            This means: "Add the numbers in box R2 and box R3, put the result in box R1"
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <h5 className="font-semibold">Common Instructions:</h5>
            <ul className="text-gray-600 space-y-1">
              <li>ADD - Addition</li>
              <li>SUB - Subtraction</li>
              <li>LW - Load (read from memory)</li>
              <li>SW - Store (save to memory)</li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold">Registers (R1, R2, etc.):</h5>
            <p className="text-gray-600">
              Think of these as numbered storage boxes where the computer 
              keeps numbers it's working with.
            </p>
          </div>
        </div>
      </div>
    )
  },
  {
    title: "The Pipeline Concept",
    content: (
      <div className="space-y-4">
        <p className="text-gray-700">
          A pipeline is like an assembly line in a factory. Instead of completing 
          one task entirely before starting the next, multiple tasks work simultaneously 
          at different stages.
        </p>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h4 className="font-semibold text-purple-800 mb-3">The 5 Stages:</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center space-x-2">
              <Badge className="bg-blue-100 text-blue-800">IF</Badge>
              <span className="text-purple-700">Fetch - Get the instruction</span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className="bg-emerald-100 text-emerald-800">ID</Badge>
              <span className="text-purple-700">Decode - Understand what to do</span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className="bg-amber-100 text-amber-800">EX</Badge>
              <span className="text-purple-700">Execute - Do the calculation</span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className="bg-purple-100 text-purple-800">MEM</Badge>
              <span className="text-purple-700">Memory - Read/write memory if needed</span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className="bg-cyan-100 text-cyan-800">WB</Badge>
              <span className="text-purple-700">Write Back - Save the result</span>
            </div>
          </div>
        </div>
        <div className="bg-yellow-50 p-3 rounded border-l-4 border-yellow-400">
          <p className="text-yellow-800 text-sm">
            <strong>Key insight:</strong> While one instruction is being executed, 
            another can be decoded, and another can be fetched simultaneously!
          </p>
        </div>
      </div>
    )
  },
  {
    title: "Let's Load Our First Program",
    content: (
      <div className="space-y-4">
        <p className="text-gray-700">
          Now we'll load a simple program and watch it execute step by step.
        </p>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Our first program:</h4>
          <pre className="text-sm bg-white p-3 rounded border">
{`ADD R1, R2, R3    // Add R2 + R3, store in R1
SUB R4, R1, R5    // Subtract R5 from R1, store in R4
ADD R6, R4, R7    // Add R4 + R7, store in R6`}
          </pre>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">What this program does:</h4>
          <ol className="text-blue-700 text-sm space-y-1">
            <li>1. Adds two numbers together</li>
            <li>2. Subtracts one number from the result</li>
            <li>3. Adds another number to create a final result</li>
          </ol>
          <p className="text-blue-600 text-sm mt-2">
            Notice how instruction 2 needs the result from instruction 1, 
            and instruction 3 needs the result from instruction 2!
          </p>
        </div>
      </div>
    ),
    action: {
      text: "Load This Program",
      code: `ADD R1, R2, R3    // Add R2 + R3, store in R1
SUB R4, R1, R5    // Subtract R5 from R1, store in R4  
ADD R6, R4, R7    // Add R4 + R7, store in R6`
    }
  },
  {
    title: "Understanding the Interface",
    content: (
      <div className="space-y-4">
        <p className="text-gray-700">
          Let's explore the different parts of the simulator interface:
        </p>
        <div className="space-y-3">
          <div className="bg-green-50 p-3 rounded-lg">
            <h4 className="font-semibold text-green-800">Pipeline Visualization</h4>
            <p className="text-green-700 text-sm">
              The colored boxes show which instructions are in which stage. 
              Watch instructions move from left (IF) to right (WB).
            </p>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg">
            <h4 className="font-semibold text-blue-800">Performance Metrics</h4>
            <p className="text-blue-700 text-sm">
              Shows how efficiently the pipeline is running. Lower CPI (Cycles Per Instruction) is better.
            </p>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg">
            <h4 className="font-semibold text-purple-800">Control Panel</h4>
            <p className="text-purple-700 text-sm">
              Use "Step" to advance one cycle at a time, or "Run" to watch automatically.
            </p>
          </div>
          <div className="bg-amber-50 p-3 rounded-lg">
            <h4 className="font-semibold text-amber-800">Instruction Queue</h4>
            <p className="text-amber-700 text-sm">
              Shows all instructions and their current status (waiting, in pipeline, or completed).
            </p>
          </div>
        </div>
      </div>
    )
  },
  {
    title: "Let's Step Through Execution",
    content: (
      <div className="space-y-4">
        <p className="text-gray-700">
          Now comes the fun part! We'll step through the execution cycle by cycle.
        </p>
        <div className="bg-indigo-50 p-4 rounded-lg">
          <h4 className="font-semibold text-indigo-800 mb-2">What to do:</h4>
          <ol className="text-indigo-700 space-y-2 text-sm">
            <li>1. Look for the "Step" button in the control panel</li>
            <li>2. Click it once and watch the first instruction enter the pipeline</li>
            <li>3. Keep clicking "Step" and observe how instructions move through stages</li>
            <li>4. Notice when multiple instructions are in the pipeline simultaneously</li>
            <li>5. Watch the performance metrics change</li>
          </ol>
        </div>
        <div className="bg-yellow-50 p-3 rounded border-l-4 border-yellow-400">
          <p className="text-yellow-800 text-sm">
            <strong>What to watch for:</strong> After a few cycles, you'll see multiple 
            instructions in different stages at the same time - that's the pipeline working!
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <SkipForward className="h-4 w-4" />
          <span>Try clicking the Step button 8-10 times to see the full process</span>
        </div>
      </div>
    )
  },
  {
    title: "Understanding Hazards",
    content: (
      <div className="space-y-4">
        <p className="text-gray-700">
          Sometimes instructions can't proceed smoothly. These problems are called "hazards."
        </p>
        <div className="bg-red-50 p-4 rounded-lg">
          <h4 className="font-semibold text-red-800 mb-2">Data Hazard Example:</h4>
          <pre className="text-sm bg-white p-2 rounded">
{`ADD R1, R2, R3    // Creates a value in R1
SUB R4, R1, R5    // Needs R1 but it's not ready yet!`}
          </pre>
          <p className="text-red-700 text-sm mt-2">
            The second instruction needs R1, but the first instruction hasn't 
            finished calculating it yet. This causes a "stall" - the pipeline has to wait.
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-semibold text-green-800 mb-2">Solutions:</h4>
          <ul className="text-green-700 text-sm space-y-1">
            <li>• <strong>Forwarding:</strong> Pass the result directly without waiting</li>
            <li>• <strong>Stalling:</strong> Pause until the result is ready</li>
            <li>• <strong>Reordering:</strong> Do other instructions first if possible</li>
          </ul>
        </div>
        <p className="text-sm text-gray-600">
          You can toggle "Forwarding" in the control panel to see how it affects performance!
        </p>
      </div>
    )
  },
  {
    title: "Experiment and Explore!",
    content: (
      <div className="space-y-4">
        <p className="text-gray-700">
          Now you're ready to explore on your own! Here are some things to try:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Try Different Programs:</h4>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• Load "Data Hazard Example"</li>
              <li>• Try "Control Hazard Example"</li>
              <li>• Experiment with "Mixed Hazards"</li>
            </ul>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">Adjust Settings:</h4>
            <ul className="text-green-700 text-sm space-y-1">
              <li>• Turn Forwarding on/off</li>
              <li>• Try Branch Prediction</li>
              <li>• Adjust simulation speed</li>
            </ul>
          </div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h4 className="font-semibold text-purple-800 mb-2">What to observe:</h4>
          <ul className="text-purple-700 text-sm space-y-1">
            <li>• How does CPI change with different programs?</li>
            <li>• When do you see pipeline stalls?</li>
            <li>• How does forwarding affect performance?</li>
            <li>• Which types of instructions cause the most problems?</li>
          </ul>
        </div>
        <div className="bg-yellow-50 p-3 rounded border-l-4 border-yellow-400">
          <p className="text-yellow-800 text-sm">
            <strong>Remember:</strong> You can always click the "Help" button to revisit 
            the detailed documentation, or restart this tutorial anytime!
          </p>
        </div>
      </div>
    )
  }
];

export default function BeginnerTutorial({ onClose, onLoadSample }: BeginnerTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCompletedSteps(prev => [...prev, currentStep]);
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAction = () => {
    const step = tutorialSteps[currentStep];
    if (step.action?.code) {
      onLoadSample(step.action.code);
      setCompletedSteps(prev => [...prev, currentStep]);
    }
  };

  const currentTutorialStep = tutorialSteps[currentStep];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Target className="h-6 w-6 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Beginner Tutorial</h1>
                <p className="text-sm text-gray-500">
                  Step {currentStep + 1} of {tutorialSteps.length}
                </p>
              </div>
            </div>
            <Button onClick={onClose} variant="outline" size="sm">
              Skip Tutorial
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-xs text-gray-500 mb-2">
              <span>Progress</span>
              <span>{Math.round(((currentStep + 1) / tutorialSteps.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / tutorialSteps.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Step Content */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                {completedSteps.includes(currentStep) && (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                )}
                <span>{currentTutorialStep.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {currentTutorialStep.content}
              
              {/* Action Button */}
              {currentTutorialStep.action && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-800 font-medium">Ready to try it?</p>
                      <p className="text-green-700 text-sm">
                        Click the button to load the example program automatically.
                      </p>
                    </div>
                    <Button onClick={handleAction} className="bg-green-600 hover:bg-green-700">
                      <Play className="h-4 w-4 mr-2" />
                      {currentTutorialStep.action.text}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button 
              onClick={handlePrevious} 
              variant="outline"
              disabled={currentStep === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            <div className="flex space-x-2">
              {tutorialSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentStep 
                      ? 'bg-blue-500' 
                      : completedSteps.includes(index)
                      ? 'bg-green-500'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            {currentStep === tutorialSteps.length - 1 ? (
              <Button onClick={onClose} className="bg-green-600 hover:bg-green-700">
                <CheckCircle className="h-4 w-4 mr-2" />
                Finish Tutorial
              </Button>
            ) : (
              <Button onClick={handleNext}>
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}