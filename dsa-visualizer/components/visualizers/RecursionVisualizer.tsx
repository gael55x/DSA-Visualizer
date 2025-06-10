'use client';

import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Shuffle, Calculator, Hash, Castle } from 'lucide-react';
import CodeHighlighter from '../ui/CodeHighlighter';
import { cn, delay } from '../../lib/utils';

interface CallStackFrame {
  id: string;
  functionName: string;
  parameters: { [key: string]: any };
  returnValue?: any;
  level: number;
  isActive: boolean;
  isReturning: boolean;
  lineNumber?: number;
}

interface RecursiveAlgorithm {
  name: string;
  icon: React.ElementType;
  code: string;
  steps: { lines: number[]; description: string }[];
  defaultInput: any;
  inputType: 'number' | 'towers';
}

const FACTORIAL_CODE = `function factorial(n) {
  // Base case: factorial of 0 or 1 is 1
  if (n <= 1) {
    return 1;
  }
  
  // Recursive case: n! = n * (n-1)!
  return n * factorial(n - 1);
}`;

const FIBONACCI_CODE = `function fibonacci(n) {
  // Base cases: F(0) = 0, F(1) = 1
  if (n <= 1) {
    return n;
  }
  
  // Recursive case: F(n) = F(n-1) + F(n-2)
  return fibonacci(n - 1) + fibonacci(n - 2);
}`;

const HANOI_CODE = `function hanoi(n, source, destination, auxiliary) {
  // Base case: only one disk to move
  if (n === 1) {
    moveDisk(source, destination);
    return;
  }
  
  // Move n-1 disks from source to auxiliary
  hanoi(n - 1, source, auxiliary, destination);
  
  // Move the largest disk from source to destination
  moveDisk(source, destination);
  
  // Move n-1 disks from auxiliary to destination
  hanoi(n - 1, auxiliary, destination, source);
}`;

const ALGORITHMS: { [key: string]: RecursiveAlgorithm } = {
  factorial: {
    name: 'Factorial',
    icon: Calculator,
    code: FACTORIAL_CODE,
    steps: [
      { lines: [2, 3, 4], description: "Check base case: if n ≤ 1, return 1" },
      { lines: [7], description: "Recursive case: return n * factorial(n-1)" }
    ],
    defaultInput: 5,
    inputType: 'number'
  },
  fibonacci: {
    name: 'Fibonacci',
    icon: Hash,
    code: FIBONACCI_CODE,
    steps: [
      { lines: [2, 3, 4], description: "Check base cases: if n ≤ 1, return n" },
      { lines: [7], description: "Recursive case: return fib(n-1) + fib(n-2)" }
    ],
    defaultInput: 5,
    inputType: 'number'
  },
  hanoi: {
    name: 'Tower of Hanoi',
    icon: Castle,
    code: HANOI_CODE,
    steps: [
      { lines: [2, 3, 4, 5], description: "Base case: if n = 1, move disk directly" },
      { lines: [8], description: "Move n-1 disks to auxiliary tower" },
      { lines: [11], description: "Move largest disk to destination" },
      { lines: [14], description: "Move n-1 disks to destination tower" }
    ],
    defaultInput: 3,
    inputType: 'towers'
  }
};

export default function RecursionVisualizer() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>('factorial');
  const [input, setInput] = useState<number>(5);
  const [callStack, setCallStack] = useState<CallStackFrame[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [result, setResult] = useState<any>(null);
  const [maxDepth, setMaxDepth] = useState(0);
  const [totalCalls, setTotalCalls] = useState(0);

  // Hanoi specific state
  const [towers, setTowers] = useState<number[][]>([
    [3, 2, 1], // Tower A
    [],        // Tower B  
    []         // Tower C
  ]);
  const [moves, setMoves] = useState<string[]>([]);

  const cancelRef = useRef(false);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const resetVisualization = useCallback(() => {
    cancelRef.current = true;
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentStep(0);
    setIsComplete(false);
    setCallStack([]);
    setResult(null);
    setMaxDepth(0);
    setTotalCalls(0);
    setMoves([]);
    
    // Reset Hanoi towers
    if (selectedAlgorithm === 'hanoi') {
      const disks = Array.from({ length: input }, (_, i) => input - i);
      setTowers([disks, [], []]);
    }
    
    setTimeout(() => { cancelRef.current = false; }, 100);
  }, [input, selectedAlgorithm]);

  const cancellableDelay = async (ms: number) => {
    return new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        if (cancelRef.current) {
          reject(new Error('Cancelled'));
        } else {
          resolve();
        }
      }, ms);

      const checkCancellation = () => {
        if (cancelRef.current) {
          clearTimeout(timeout);
          reject(new Error('Cancelled'));
        }
      };
      
      const interval = setInterval(checkCancellation, 50);
      setTimeout(() => clearInterval(interval), ms);
    });
  };

  const addCallFrame = (functionName: string, parameters: any, level: number) => {
    const frame: CallStackFrame = {
      id: generateId(),
      functionName,
      parameters,
      level,
      isActive: true,
      isReturning: false
    };
    
    setCallStack(prev => [...prev, frame]);
    setMaxDepth(prev => Math.max(prev, level + 1));
    setTotalCalls(prev => prev + 1);
    return frame.id;
  };

  const updateCallFrame = (frameId: string, updates: Partial<CallStackFrame>) => {
    setCallStack(prev => prev.map(frame => 
      frame.id === frameId ? { ...frame, ...updates } : frame
    ));
  };

  const removeCallFrame = (frameId: string) => {
    setCallStack(prev => prev.filter(frame => frame.id !== frameId));
  };

  const factorial = async (n: number, level: number = 0): Promise<number> => {
    const frameId = addCallFrame('factorial', { n }, level);
    await cancellableDelay(speed);

    // Step 0: Base case check
    setCurrentStep(0);
    updateCallFrame(frameId, { lineNumber: 2 });
    await cancellableDelay(speed);

    if (n <= 1) {
      updateCallFrame(frameId, { returnValue: 1, isReturning: true });
      await cancellableDelay(speed);
      removeCallFrame(frameId);
      return 1;
    }

    // Step 1: Recursive case
    setCurrentStep(1);
    updateCallFrame(frameId, { lineNumber: 7 });
    await cancellableDelay(speed);

    const recursiveResult = await factorial(n - 1, level + 1);
    const result = n * recursiveResult;
    
    updateCallFrame(frameId, { returnValue: result, isReturning: true });
    await cancellableDelay(speed);
    removeCallFrame(frameId);
    
    return result;
  };

  const fibonacci = async (n: number, level: number = 0): Promise<number> => {
    const frameId = addCallFrame('fibonacci', { n }, level);
    await cancellableDelay(speed);

    // Step 0: Base case check
    setCurrentStep(0);
    updateCallFrame(frameId, { lineNumber: 2 });
    await cancellableDelay(speed);

    if (n <= 1) {
      updateCallFrame(frameId, { returnValue: n, isReturning: true });
      await cancellableDelay(speed);
      removeCallFrame(frameId);
      return n;
    }

    // Step 1: Recursive case
    setCurrentStep(1);
    updateCallFrame(frameId, { lineNumber: 7 });
    await cancellableDelay(speed);

    const fib1 = await fibonacci(n - 1, level + 1);
    const fib2 = await fibonacci(n - 2, level + 1);
    const result = fib1 + fib2;
    
    updateCallFrame(frameId, { returnValue: result, isReturning: true });
    await cancellableDelay(speed);
    removeCallFrame(frameId);
    
    return result;
  };

  const moveDisk = async (from: number, to: number) => {
    setTowers(prev => {
      const newTowers = [...prev];
      const disk = newTowers[from].pop();
      if (disk !== undefined) {
        newTowers[to].push(disk);
      }
      return newTowers;
    });
    
    const towerNames = ['A', 'B', 'C'];
    setMoves(prev => [...prev, `Move disk from ${towerNames[from]} to ${towerNames[to]}`]);
    await cancellableDelay(speed * 0.5);
  };

  const hanoi = async (n: number, source: number, destination: number, auxiliary: number, level: number = 0): Promise<void> => {
    const frameId = addCallFrame('hanoi', { n, source, destination, auxiliary }, level);
    await cancellableDelay(speed);

    // Step 0: Base case check
    setCurrentStep(0);
    updateCallFrame(frameId, { lineNumber: 2 });
    await cancellableDelay(speed);

    if (n === 1) {
      updateCallFrame(frameId, { lineNumber: 3 });
      await moveDisk(source, destination);
      updateCallFrame(frameId, { isReturning: true });
      await cancellableDelay(speed);
      removeCallFrame(frameId);
      return;
    }

    // Step 1: Move n-1 disks to auxiliary
    setCurrentStep(1);
    updateCallFrame(frameId, { lineNumber: 8 });
    await cancellableDelay(speed);
    await hanoi(n - 1, source, auxiliary, destination, level + 1);

    // Step 2: Move largest disk
    setCurrentStep(2);
    updateCallFrame(frameId, { lineNumber: 11 });
    await cancellableDelay(speed);
    await moveDisk(source, destination);

    // Step 3: Move n-1 disks to destination
    setCurrentStep(3);
    updateCallFrame(frameId, { lineNumber: 14 });
    await cancellableDelay(speed);
    await hanoi(n - 1, auxiliary, destination, source, level + 1);

    updateCallFrame(frameId, { isReturning: true });
    await cancellableDelay(speed);
    removeCallFrame(frameId);
  };

  const executeAlgorithm = useCallback(async () => {
    try {
      cancelRef.current = false;
      setIsPlaying(true);
      setIsComplete(false);
      setCallStack([]);
      setResult(null);
      setMoves([]);

      let finalResult;
      
      if (selectedAlgorithm === 'factorial') {
        finalResult = await factorial(input);
      } else if (selectedAlgorithm === 'fibonacci') {
        finalResult = await fibonacci(input);
      } else if (selectedAlgorithm === 'hanoi') {
        const disks = Array.from({ length: input }, (_, i) => input - i);
        setTowers([disks, [], []]);
        await hanoi(input, 0, 2, 1);
        finalResult = `Completed in ${Math.pow(2, input) - 1} moves`;
      }

      setResult(finalResult);
      setIsComplete(true);
      setIsPlaying(false);
    } catch (error) {
      if (error instanceof Error && error.message === 'Cancelled') {
        setIsPlaying(false);
        setIsPaused(true);
        return;
      }
      throw error;
    }
  }, [selectedAlgorithm, input, speed]);

  const handlePlayPause = () => {
    if (isComplete) {
      resetVisualization();
      return;
    }
    
    if (isPlaying) {
      cancelRef.current = true;
      setIsPlaying(false);
      setIsPaused(true);
    } else {
      executeAlgorithm();
    }
  };

  const algorithm = ALGORITHMS[selectedAlgorithm];

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-100 mb-2">Recursion Visualizer</h1>
          <p className="text-slate-400 text-lg">
            Interactive visualization of recursive algorithms with call stack tracking
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[5fr_3fr] gap-8">
          {/* Visualization Panel */}
          <div className="space-y-6">
            {/* Algorithm Selection */}
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
              <h3 className="text-lg font-semibold text-slate-100 mb-4">Select Algorithm</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {Object.entries(ALGORITHMS).map(([key, alg]) => {
                  const Icon = alg.icon;
                  return (
                    <button
                      key={key}
                      onClick={() => {
                        setSelectedAlgorithm(key);
                        resetVisualization();
                      }}
                      className={cn(
                        "flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200",
                        selectedAlgorithm === key
                          ? "border-sky-500 bg-sky-500/10 text-sky-400"
                          : "border-slate-600 bg-slate-700/50 text-slate-300 hover:border-slate-500 hover:text-slate-200"
                      )}
                    >
                      <Icon size={24} />
                      <span className="font-medium">{alg.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Input */}
              <div className="flex items-center gap-4">
                <label className="text-slate-300 font-medium min-w-fit">
                  {selectedAlgorithm === 'hanoi' ? 'Number of disks:' : 'Input value:'}
                </label>
                <input
                  type="number"
                  min={selectedAlgorithm === 'hanoi' ? 1 : 0}
                  max={selectedAlgorithm === 'fibonacci' ? 8 : selectedAlgorithm === 'hanoi' ? 5 : 10}
                  value={input}
                  onChange={(e) => setInput(parseInt(e.target.value) || 0)}
                  disabled={isPlaying}
                  className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:border-sky-500 focus:outline-none disabled:opacity-50"
                />
                {selectedAlgorithm === 'fibonacci' && input > 6 && (
                  <span className="text-amber-400 text-sm">⚠️ Large values may be slow</span>
                )}
              </div>
            </div>

            {/* Call Stack Visualization */}
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
              <h3 className="text-lg font-semibold text-slate-100 mb-4">Call Stack</h3>
              
              <div className="space-y-2 max-h-96 overflow-y-auto">
                <AnimatePresence>
                  {callStack.slice().reverse().map((frame, index) => (
                    <motion.div
                      key={frame.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className={cn(
                        "p-4 rounded-lg border-l-4 transition-all duration-200",
                        frame.isReturning
                          ? "bg-green-500/10 border-green-500 text-green-400"
                          : frame.isActive
                          ? "bg-blue-500/10 border-blue-500 text-blue-400"
                          : "bg-slate-700 border-slate-600 text-slate-300"
                      )}
                      style={{ marginLeft: `${frame.level * 20}px` }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-mono font-medium">
                            {frame.functionName}({Object.entries(frame.parameters).map(([key, value]) => 
                              `${key}: ${typeof value === 'string' ? `"${value}"` : value}`
                            ).join(', ')})
                          </span>
                          {frame.returnValue !== undefined && (
                            <span className="ml-3 text-green-400">
                              → {frame.returnValue}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500">
                          Level {frame.level}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {callStack.length === 0 && !isComplete && (
                  <div className="text-center text-slate-400 py-8">
                    Call stack is empty. Click "Start" to begin execution.
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-700">
                <div className="text-center">
                  <div className="text-2xl font-bold text-sky-400">{maxDepth}</div>
                  <div className="text-xs text-slate-400">Max Depth</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">{totalCalls}</div>
                  <div className="text-xs text-slate-400">Total Calls</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{callStack.length}</div>
                  <div className="text-xs text-slate-400">Active Calls</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-400">
                    {result ? '✓' : '—'}
                  </div>
                  <div className="text-xs text-slate-400">Complete</div>
                </div>
              </div>
            </div>

            {/* Hanoi Towers Visualization */}
            {selectedAlgorithm === 'hanoi' && (
              <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
                <h3 className="text-lg font-semibold text-slate-100 mb-4">Tower of Hanoi</h3>
                
                <div className="flex justify-center items-end gap-8 min-h-48 mb-6">
                  {towers.map((tower, towerIndex) => (
                    <div key={towerIndex} className="flex flex-col items-center">
                      <div className="text-slate-300 mb-2 font-medium">
                        Tower {String.fromCharCode(65 + towerIndex)}
                      </div>
                      <div className="relative">
                        {/* Tower pole */}
                        <div className="w-2 h-32 bg-slate-600 mx-auto"></div>
                        {/* Base */}
                        <div className="w-20 h-2 bg-slate-600 -mt-1"></div>
                        {/* Disks */}
                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
                          {tower.map((disk, diskIndex) => {
                            const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500'];
                            return (
                              <motion.div
                                key={`${towerIndex}-${disk}`}
                                layout
                                className={cn(
                                  "rounded-full mx-auto border-2 border-white/20",
                                  colors[disk - 1]
                                )}
                                style={{
                                  width: `${disk * 12 + 20}px`,
                                  height: '12px',
                                  marginBottom: diskIndex === 0 ? '0' : '2px'
                                }}
                              />
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Move history */}
                {moves.length > 0 && (
                  <div className="max-h-32 overflow-y-auto">
                    <h4 className="text-sm font-medium text-slate-300 mb-2">Move History:</h4>
                    <div className="space-y-1">
                      {moves.slice(-5).map((move, index) => (
                        <div key={index} className="text-xs text-slate-400 font-mono">
                          {moves.length - 4 + index}. {move}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Controls */}
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
              <h3 className="text-lg font-semibold text-slate-100 mb-4">Controls</h3>
              
              <div className="space-y-4">
                {/* Play Controls */}
                <div className="flex gap-3">
                  <button
                    onClick={handlePlayPause}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors",
                      isComplete 
                        ? "bg-green-500 hover:bg-green-600 text-white"
                        : isPlaying 
                        ? "bg-red-500 hover:bg-red-600 text-white"
                        : "bg-sky-500 hover:bg-sky-600 text-white"
                    )}
                  >
                    {isComplete ? (
                      <>
                        <RotateCcw size={16} />
                        Reset
                      </>
                    ) : isPlaying ? (
                      <>
                        <Pause size={16} />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play size={16} />
                        {isPaused ? 'Resume' : 'Start'}
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={resetVisualization}
                    disabled={isPlaying}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 disabled:bg-slate-600 text-white disabled:text-slate-400 rounded-md font-medium transition-colors"
                  >
                    <RotateCcw size={16} />
                    Reset
                  </button>
                </div>

                {/* Speed Control */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Animation Speed: {Math.round(2000 / speed * 10) / 10}x
                  </label>
                  <input
                    type="range"
                    min="500"
                    max="2000"
                    step="100"
                    value={2500 - speed}
                    onChange={(e) => setSpeed(2500 - parseInt(e.target.value))}
                    disabled={isPlaying}
                    className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>Slow</span>
                    <span>Fast</span>
                  </div>
                </div>

                {/* Result */}
                {result !== null && (
                  <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <div className="text-green-400 font-medium">Result: {result}</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Code Panel */}
          <div className="space-y-6">
            <CodeHighlighter
              code={algorithm.code}
              language="javascript"
              title={`${algorithm.name} Algorithm`}
              steps={algorithm.steps}
              currentStep={currentStep}
            />
          </div>
        </div>

        {/* Information Section */}
        <div className="mt-12 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
              About Recursion
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Understanding recursive algorithms through call stack visualization and step-by-step execution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* What is Recursion */}
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
              <h3 className="text-xl font-semibold text-slate-100 mb-4">What is Recursion?</h3>
              <p className="text-slate-300 text-sm mb-4">
                Recursion is a programming technique where a function calls itself to solve smaller instances of the same problem.
              </p>
              <ul className="space-y-2 text-slate-300 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">✓</span>
                  <span>Base case stops the recursion</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">✓</span>
                  <span>Recursive case breaks down the problem</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">✓</span>
                  <span>Call stack manages function calls</span>
                </li>
              </ul>
            </div>

            {/* Key Concepts */}
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
              <h3 className="text-xl font-semibold text-slate-100 mb-4">Key Concepts</h3>
              <div className="space-y-3">
                <div>
                  <div className="text-blue-400 font-medium text-sm">Base Case</div>
                  <div className="text-slate-400 text-xs">Condition that stops recursion</div>
                </div>
                <div>
                  <div className="text-purple-400 font-medium text-sm">Recursive Case</div>
                  <div className="text-slate-400 text-xs">Function calls itself with modified input</div>
                </div>
                <div>
                  <div className="text-green-400 font-medium text-sm">Call Stack</div>
                  <div className="text-slate-400 text-xs">Memory structure tracking function calls</div>
                </div>
                <div>
                  <div className="text-orange-400 font-medium text-sm">Stack Overflow</div>
                  <div className="text-slate-400 text-xs">When recursion depth exceeds limit</div>
                </div>
              </div>
            </div>

            {/* Complexity Analysis */}
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
              <h3 className="text-xl font-semibold text-slate-100 mb-4">Complexity</h3>
              <div className="space-y-3">
                <div>
                  <div className="text-slate-300 text-sm mb-1">Factorial</div>
                  <div className="text-xs text-slate-400">Time: O(n), Space: O(n)</div>
                </div>
                <div>
                  <div className="text-slate-300 text-sm mb-1">Fibonacci (naive)</div>
                  <div className="text-xs text-slate-400">Time: O(2^n), Space: O(n)</div>
                </div>
                <div>
                  <div className="text-slate-300 text-sm mb-1">Tower of Hanoi</div>
                  <div className="text-xs text-slate-400">Time: O(2^n), Space: O(n)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 