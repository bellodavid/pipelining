import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Cpu, 
  Play, 
  Book, 
  ArrowRight, 
  Zap, 
  Target,
  Clock,
  TrendingUp,
  School,
  Users
} from 'lucide-react';

interface WelcomeScreenProps {
  onStartTutorial: () => void;
  onSkipToSimulator: () => void;
}

export default function WelcomeScreen({ onStartTutorial, onSkipToSimulator }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row items-center justify-center mb-4 gap-3">
            <div className="bg-blue-600 rounded-full p-3 md:p-4">
              <Cpu className="h-8 w-8 md:h-12 md:w-12 text-white" />
            </div>
            <div className="flex items-center">
              <School className="h-6 w-6 md:h-8 md:w-8 text-blue-700 mr-2" />
              <span className="text-sm md:text-base font-semibold text-blue-800">Federal University of Technology, Minna</span>
            </div>
          </div>
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2">
            CPU Pipeline Simulator
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-3 md:mb-4 px-2">
            Interactive visualization of computer processor pipelining
          </p>
          <div className="flex flex-wrap justify-center gap-2 mb-2">
            <Badge className="bg-blue-100 text-blue-800 px-3 py-1">
              5-Stage RISC Pipeline
            </Badge>
            <Badge className="bg-green-100 text-green-800 px-3 py-1 flex items-center">
              <Users className="h-3 w-3 mr-1" /> Group 2 Project
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8 mb-6 md:mb-8">
          {/* Tutorial Option */}
          <Card className="border-2 border-blue-200 hover:border-blue-400 transition-colors cursor-pointer group">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-800">
                <Play className="h-6 w-6 mr-2" />
                Start with Tutorial
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-700">
                  Learn step-by-step how CPU pipelines work with guided explanations 
                  and interactive examples.
                </p>
                
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-800">You'll learn:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li className="flex items-center">
                      <ArrowRight className="h-4 w-4 mr-2 text-blue-500" />
                      What assembly language instructions mean
                    </li>
                    <li className="flex items-center">
                      <ArrowRight className="h-4 w-4 mr-2 text-blue-500" />
                      How the 5-stage pipeline works
                    </li>
                    <li className="flex items-center">
                      <ArrowRight className="h-4 w-4 mr-2 text-blue-500" />
                      Why hazards occur and how to fix them
                    </li>
                    <li className="flex items-center">
                      <ArrowRight className="h-4 w-4 mr-2 text-blue-500" />
                      How to interpret performance metrics
                    </li>
                  </ul>
                </div>

                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-center text-blue-700">
                    <Clock className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">Takes about 10 minutes</span>
                  </div>
                </div>

                <Button 
                  onClick={onStartTutorial}
                  className="w-full bg-blue-600 hover:bg-blue-700 group-hover:bg-blue-700"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start Tutorial
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Direct Access Option */}
          <Card className="border-2 border-gray-200 hover:border-gray-400 transition-colors cursor-pointer group">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-800">
                <Zap className="h-6 w-6 mr-2" />
                Jump to Simulator
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-700">
                  Already familiar with computer architecture? Dive straight into 
                  the simulation with full access to all features.
                </p>

                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-800">Available features:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li className="flex items-center">
                      <ArrowRight className="h-4 w-4 mr-2 text-gray-500" />
                      Interactive pipeline visualization
                    </li>
                    <li className="flex items-center">
                      <ArrowRight className="h-4 w-4 mr-2 text-gray-500" />
                      Sample assembly programs
                    </li>
                    <li className="flex items-center">
                      <ArrowRight className="h-4 w-4 mr-2 text-gray-500" />
                      Performance analysis tools
                    </li>
                    <li className="flex items-center">
                      <ArrowRight className="h-4 w-4 mr-2 text-gray-500" />
                      Hazard detection and forwarding
                    </li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center text-gray-700">
                    <Book className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">Help available anytime</span>
                  </div>
                </div>

                <Button 
                  onClick={onSkipToSimulator}
                  variant="outline"
                  className="w-full border-gray-300 hover:bg-gray-50 group-hover:bg-gray-50"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Go to Simulator
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Key Concepts Preview */}
        <Card className="bg-white/50 backdrop-blur-sm">
          <CardHeader className="pb-2 md:pb-6">
            <CardTitle className="text-center text-gray-800 text-lg md:text-xl">
              Key Concepts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full p-2 md:p-3 w-12 h-12 md:w-16 md:h-16 mx-auto mb-2 md:mb-3 flex items-center justify-center">
                  <Cpu className="h-6 w-6 md:h-8 md:w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-1 md:mb-2">Pipeline Stages</h3>
                <p className="text-xs md:text-sm text-gray-600">
                  See how instructions flow through IF, ID, EX, MEM, and WB stages
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-amber-100 rounded-full p-2 md:p-3 w-12 h-12 md:w-16 md:h-16 mx-auto mb-2 md:mb-3 flex items-center justify-center">
                  <Target className="h-6 w-6 md:h-8 md:w-8 text-amber-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-1 md:mb-2">Hazard Detection</h3>
                <p className="text-xs md:text-sm text-gray-600">
                  Understand data, control, and structural hazards in real-time
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-green-100 rounded-full p-2 md:p-3 w-12 h-12 md:w-16 md:h-16 mx-auto mb-2 md:mb-3 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 md:h-8 md:w-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-1 md:mb-2">Performance Analysis</h3>
                <p className="text-xs md:text-sm text-gray-600">
                  Measure CPI, speedup, and efficiency with detailed metrics
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-4 md:mt-6">
          <p className="text-xs md:text-sm text-gray-500">
            Developed by Group 2, Department of Computer Engineering<br />
            Federal University of Technology, Minna
          </p>
        </div>
      </div>
    </div>
  );
}