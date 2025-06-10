'use client';

import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, ChevronDown, GitBranch, ArrowRight, ArrowDown, Repeat, TreePine } from 'lucide-react';
import CodeHighlighter from '../ui/CodeHighlighter';
import { cn } from '../../lib/utils';

interface RecursionNode {
  id: string;
  call: string;
  parameters: any[];
  result?: any;
  level: number;
  x: number;
  y: number;
  children: RecursionNode[];
  isActive: boolean;
  isReturning: boolean;
  isCompleted: boolean;
  parent?: string;
}

interface RecursionType {
  name: string;
  icon: React.ElementType;
  description: string;
  code: string;
  examples: { name: string; code: string; description: string }[];
}

const RECURSION_TYPES: { [key: string]: RecursionType } = {
  direct: {
    name: 'Direct Recursion',
    icon: ArrowDown,
    description: 'A function calls itself directly',
    code: `function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1); // Direct self-call
}`,
    examples: [
      {
        name: 'Factorial',
        code: `function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}`,
        description: 'Classic factorial calculation'
      },
      {
        name: 'Sum of N',
        code: `function sum(n) {
  if (n <= 0) return 0;
  return n + sum(n - 1);
}`,
        description: 'Sum of first n natural numbers'
      },
      {
        name: 'Power',
        code: `function power(base, exp) {
  if (exp === 0) return 1;
  return base * power(base, exp - 1);
}`,
        description: 'Calculate base^exp recursively'
      }
    ]
  },
  indirect: {
    name: 'Indirect Recursion',
    icon: Repeat,
    description: 'Functions call each other in a cycle',
    code: `function isEven(n) {
  if (n === 0) return true;
  return isOdd(n - 1);
}

function isOdd(n) {
  if (n === 0) return false;
  return isEven(n - 1);
}`,
    examples: [
      {
        name: 'Even/Odd Check',
        code: `function isEven(n) {
  if (n === 0) return true;
  return isOdd(n - 1);
}

function isOdd(n) {
  if (n === 0) return false;
  return isEven(n - 1);
}`,
        description: 'Check if number is even/odd using mutual recursion'
      },
      {
        name: 'Forest Walk',
        code: `function walkForest(trees) {
  if (trees.length === 0) return 0;
  return walkTree(trees[0]) + walkForest(trees.slice(1));
}

function walkTree(tree) {
  if (!tree.children) return 1;
  return 1 + walkForest(tree.children);
}`,
        description: 'Traverse forest and trees mutually'
      }
    ]
  },
  tail: {
    name: 'Tail Recursion',
    icon: ArrowRight,
    description: 'Recursive call is the last operation',
    code: `function factorial(n, acc = 1) {
  if (n <= 1) return acc;
  return factorial(n - 1, n * acc); // Tail call
}`,
    examples: [
      {
        name: 'Tail Factorial',
        code: `function factorial(n, acc = 1) {
  if (n <= 1) return acc;
  return factorial(n - 1, n * acc);
}`,
        description: 'Factorial with accumulator (tail-optimizable)'
      },
      {
        name: 'Tail Sum',
        code: `function sum(n, acc = 0) {
  if (n <= 0) return acc;
  return sum(n - 1, acc + n);
}`,
        description: 'Sum with accumulator pattern'
      },
      {
        name: 'Countdown',
        code: `function countdown(n) {
  if (n <= 0) return "Done!";
  console.log(n);
  return countdown(n - 1);
}`,
        description: 'Simple countdown using tail recursion'
      }
    ]
  },
  head: {
    name: 'Head Recursion',
    icon: GitBranch,
    description: 'Processing happens after recursive call returns',
    code: `function printReverse(n) {
  if (n <= 0) return;
  printReverse(n - 1); // Call first
  console.log(n);      // Process after
}`,
    examples: [
      {
        name: 'Print Reverse',
        code: `function printReverse(n) {
  if (n <= 0) return;
  printReverse(n - 1);
  console.log(n);
}`,
        description: 'Print numbers in reverse order'
      },
      {
        name: 'Reverse String',
        code: `function reverseString(str, index = 0) {
  if (index >= str.length) return "";
  return reverseString(str, index + 1) + str[index];
}`,
        description: 'Build reversed string after recursive calls'
      }
    ]
  },
  tree: {
    name: 'Tree Recursion',
    icon: TreePine,
    description: 'Multiple recursive calls create tree structure',
    code: `function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2); // Two calls
}`,
    examples: [
      {
        name: 'Fibonacci',
        code: `function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}`,
        description: 'Classic tree recursion with two branches'
      },
      {
        name: 'Binary Paths',
        code: `function countPaths(n, m) {
  if (n === 1 || m === 1) return 1;
  return countPaths(n-1, m) + countPaths(n, m-1);
}`,
        description: 'Count paths in grid using tree recursion'
      },
      {
        name: 'Tower of Hanoi',
        code: `function hanoi(n, from, to, aux) {
  if (n === 1) return move(from, to);
  hanoi(n-1, from, aux, to);
  move(from, to);
  hanoi(n-1, aux, to, from);
}`,
        description: 'Classic puzzle with tree-like call pattern'
      }
    ]
  }
};

export default function RecursionVisualizer() {
  const [selectedType, setSelectedType] = useState<string>('direct');
  const [selectedExample, setSelectedExample] = useState<number>(0);
  const [input, setInput] = useState<number>(4);
  const [recursionTree, setRecursionTree] = useState<RecursionNode[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [currentNode, setCurrentNode] = useState<string | null>(null);
  const [maxDepth, setMaxDepth] = useState(0);
  const [totalNodes, setTotalNodes] = useState(0);

  const cancelRef = useRef(false);
  const nodeCounter = useRef(0);

  const generateId = () => `node_${nodeCounter.current++}`;

  const resetVisualization = useCallback(() => {
    cancelRef.current = true;
    setIsPlaying(false);
    setIsPaused(false);
    setIsComplete(false);
    setRecursionTree([]);
    setCurrentNode(null);
    setMaxDepth(0);
    setTotalNodes(0);
    nodeCounter.current = 0;
    setTimeout(() => { cancelRef.current = false; }, 100);
  }, []);

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

  const calculateNodePosition = (level: number, index: number, totalAtLevel: number) => {
    const baseWidth = 800;
    const levelHeight = 80;
    
    if (totalAtLevel === 1) {
      return { x: baseWidth / 2, y: level * levelHeight + 50 };
    }
    
    const spacing = baseWidth / (totalAtLevel + 1);
    return {
      x: spacing * (index + 1),
      y: level * levelHeight + 50
    };
  };

  const addNode = (call: string, parameters: any[], level: number, parentId?: string): string => {
    const nodeId = generateId();
    
    setRecursionTree(prev => {
      const newTree = [...prev];
      
      // Calculate position
      const nodesAtLevel = newTree.filter(n => n.level === level).length;
      const { x, y } = calculateNodePosition(level, nodesAtLevel, nodesAtLevel + 1);
      
      const newNode: RecursionNode = {
        id: nodeId,
        call,
        parameters,
        level,
        x,
        y,
        children: [],
        isActive: true,
        isReturning: false,
        isCompleted: false,
        parent: parentId
      };
      
      newTree.push(newNode);
      
      // Update parent's children
      if (parentId) {
        const parent = newTree.find(n => n.id === parentId);
        if (parent) {
          parent.children.push(newNode);
        }
      }
      
      // Recalculate positions for nodes at this level
      const levelNodes = newTree.filter(n => n.level === level);
      levelNodes.forEach((node, index) => {
        const pos = calculateNodePosition(level, index, levelNodes.length);
        node.x = pos.x;
        node.y = pos.y;
      });
      
      return newTree;
    });
    
    setMaxDepth(prev => Math.max(prev, level + 1));
    setTotalNodes(prev => prev + 1);
    setCurrentNode(nodeId);
    
    return nodeId;
  };

  const updateNode = (nodeId: string, updates: Partial<RecursionNode>) => {
    setRecursionTree(prev => prev.map(node => 
      node.id === nodeId ? { ...node, ...updates } : node
    ));
  };

  const simulateDirectRecursion = async (n: number, level: number = 0, parentId?: string): Promise<number> => {
    const nodeId = addNode(`factorial(${n})`, [n], level, parentId);
    await cancellableDelay(speed);

    if (n <= 1) {
      updateNode(nodeId, { result: 1, isReturning: true });
      await cancellableDelay(speed);
      updateNode(nodeId, { isCompleted: true, isActive: false });
      return 1;
    }

    const result = await simulateDirectRecursion(n - 1, level + 1, nodeId);
    const finalResult = n * result;
    
    updateNode(nodeId, { result: finalResult, isReturning: true });
    await cancellableDelay(speed);
    updateNode(nodeId, { isCompleted: true, isActive: false });
    
    return finalResult;
  };

  const simulateIndirectRecursion = async (n: number, isEvenCall: boolean = true, level: number = 0, parentId?: string): Promise<boolean> => {
    const funcName = isEvenCall ? 'isEven' : 'isOdd';
    const nodeId = addNode(`${funcName}(${n})`, [n], level, parentId);
    await cancellableDelay(speed);

    if (n === 0) {
      const result = isEvenCall;
      updateNode(nodeId, { result, isReturning: true });
      await cancellableDelay(speed);
      updateNode(nodeId, { isCompleted: true, isActive: false });
      return result;
    }

    const result = await simulateIndirectRecursion(n - 1, !isEvenCall, level + 1, nodeId);
    
    updateNode(nodeId, { result, isReturning: true });
    await cancellableDelay(speed);
    updateNode(nodeId, { isCompleted: true, isActive: false });
    
    return result;
  };

  const simulateTailRecursion = async (n: number, acc: number = 1, level: number = 0, parentId?: string): Promise<number> => {
    const nodeId = addNode(`factorial(${n}, ${acc})`, [n, acc], level, parentId);
    await cancellableDelay(speed);

    if (n <= 1) {
      updateNode(nodeId, { result: acc, isReturning: true });
      await cancellableDelay(speed);
      updateNode(nodeId, { isCompleted: true, isActive: false });
      return acc;
    }

    const result = await simulateTailRecursion(n - 1, n * acc, level + 1, nodeId);
    
    updateNode(nodeId, { result, isReturning: true });
    await cancellableDelay(speed);
    updateNode(nodeId, { isCompleted: true, isActive: false });
    
    return result;
  };

  const simulateHeadRecursion = async (n: number, level: number = 0, parentId?: string): Promise<string> => {
    const nodeId = addNode(`print(${n})`, [n], level, parentId);
    await cancellableDelay(speed);

    if (n <= 0) {
      updateNode(nodeId, { result: '', isReturning: true });
      await cancellableDelay(speed);
      updateNode(nodeId, { isCompleted: true, isActive: false });
      return '';
    }

    const result = await simulateHeadRecursion(n - 1, level + 1, nodeId);
    const finalResult = result + n + ' ';
    
    updateNode(nodeId, { result: finalResult, isReturning: true });
    await cancellableDelay(speed);
    updateNode(nodeId, { isCompleted: true, isActive: false });
    
    return finalResult;
  };

  const simulateTreeRecursion = async (n: number, level: number = 0, parentId?: string): Promise<number> => {
    const nodeId = addNode(`fib(${n})`, [n], level, parentId);
    await cancellableDelay(speed);

    if (n <= 1) {
      updateNode(nodeId, { result: n, isReturning: true });
      await cancellableDelay(speed);
      updateNode(nodeId, { isCompleted: true, isActive: false });
      return n;
    }

    const [fib1, fib2] = await Promise.all([
      simulateTreeRecursion(n - 1, level + 1, nodeId),
      simulateTreeRecursion(n - 2, level + 1, nodeId)
    ]);
    
    const result = fib1 + fib2;
    
    updateNode(nodeId, { result, isReturning: true });
    await cancellableDelay(speed);
    updateNode(nodeId, { isCompleted: true, isActive: false });
    
    return result;
  };

  const executeRecursion = useCallback(async () => {
    try {
      cancelRef.current = false;
      setIsPlaying(true);
      setIsComplete(false);
      setRecursionTree([]);
      setCurrentNode(null);
      setMaxDepth(0);
      setTotalNodes(0);
      nodeCounter.current = 0;

      let result;
      
      switch (selectedType) {
        case 'direct':
          result = await simulateDirectRecursion(input);
          break;
        case 'indirect':
          result = await simulateIndirectRecursion(input);
          break;
        case 'tail':
          result = await simulateTailRecursion(input);
          break;
        case 'head':
          result = await simulateHeadRecursion(input);
          break;
        case 'tree':
          result = await simulateTreeRecursion(Math.min(input, 6)); // Limit for performance
          break;
        default:
          result = 'Unknown type';
      }

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
  }, [selectedType, input, speed]);

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
      executeRecursion();
    }
  };

  const currentType = RECURSION_TYPES[selectedType];
  const currentExample = currentType.examples[selectedExample];

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-100 mb-2">Recursion Types Visualizer</h1>
          <p className="text-slate-400 text-lg">
            Explore different types of recursion with interactive tree visualization
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[5fr_3fr] gap-8">
          {/* Visualization Panel */}
          <div className="space-y-6">
            {/* Type Selection */}
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
              <h3 className="text-lg font-semibold text-slate-100 mb-4">Recursion Type</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
                {Object.entries(RECURSION_TYPES).map(([key, type]) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={key}
                      onClick={() => {
                        setSelectedType(key);
                        setSelectedExample(0);
                        resetVisualization();
                      }}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-200 text-left",
                        selectedType === key
                          ? "border-sky-500 bg-sky-500/10 text-sky-400"
                          : "border-slate-600 bg-slate-700/50 text-slate-300 hover:border-slate-500 hover:text-slate-200"
                      )}
                    >
                      <Icon size={20} />
                      <div>
                        <div className="font-medium text-sm">{type.name}</div>
                        <div className="text-xs opacity-75">{type.description}</div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Example Selection */}
              <div className="flex items-center gap-4">
                <label className="text-slate-300 font-medium min-w-fit">Example:</label>
                <select
                  value={selectedExample}
                  onChange={(e) => {
                    setSelectedExample(parseInt(e.target.value));
                    resetVisualization();
                  }}
                  disabled={isPlaying}
                  className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:border-sky-500 focus:outline-none disabled:opacity-50"
                >
                  {currentType.examples.map((example, index) => (
                    <option key={index} value={index}>
                      {example.name}
                    </option>
                  ))}
                </select>
                
                <label className="text-slate-300 font-medium ml-4 min-w-fit">Input:</label>
                <input
                  type="number"
                  min={selectedType === 'tree' ? 1 : 0}
                  max={selectedType === 'tree' ? 6 : 8}
                  value={input}
                  onChange={(e) => setInput(parseInt(e.target.value) || 0)}
                  disabled={isPlaying}
                  className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:border-sky-500 focus:outline-none disabled:opacity-50 w-20"
                />
              </div>
            </div>

            {/* Recursion Tree Visualization */}
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
              <h3 className="text-lg font-semibold text-slate-100 mb-4">Recursion Tree</h3>
              
              <div className="relative min-h-96 overflow-auto">
                <svg width="800" height={Math.max(400, maxDepth * 80 + 100)} className="w-full">
                  {/* Connections */}
                  {recursionTree.flatMap(node => 
                    node.children.map((child, index) => (
                      <line
                        key={`connection-${node.id}-${child.id}-${index}`}
                        x1={node.x}
                        y1={node.y + 15}
                        x2={child.x}
                        y2={child.y - 15}
                        stroke="#64748b"
                        strokeWidth="2"
                        className="transition-all duration-300"
                      />
                    ))
                  )}
                  
                  {/* Nodes */}
                  {recursionTree.map(node => (
                    <g key={node.id}>
                      <motion.circle
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        cx={node.x}
                        cy={node.y}
                        r="25"
                        className={cn(
                          "transition-all duration-300",
                          node.isCompleted
                            ? "fill-green-500/20 stroke-green-500"
                            : node.isReturning
                            ? "fill-blue-500/20 stroke-blue-500"
                            : node.isActive
                            ? "fill-orange-500/20 stroke-orange-500"
                            : "fill-slate-600/20 stroke-slate-600"
                        )}
                        strokeWidth="2"
                      />
                      <text
                        x={node.x}
                        y={node.y - 5}
                        textAnchor="middle"
                        className="text-xs fill-slate-200 font-mono"
                      >
                        {node.call}
                      </text>
                      {node.result !== undefined && (
                        <text
                          x={node.x}
                          y={node.y + 8}
                          textAnchor="middle"
                          className="text-xs fill-green-400 font-bold"
                        >
                          {typeof node.result === 'string' ? 
                            (node.result.length > 10 ? node.result.substring(0, 10) + '...' : node.result) :
                            node.result
                          }
                        </text>
                      )}
                    </g>
                  ))}
                </svg>
                
                {recursionTree.length === 0 && !isComplete && (
                  <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                    Recursion tree will appear here. Click "Start" to begin.
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
                  <div className="text-2xl font-bold text-purple-400">{totalNodes}</div>
                  <div className="text-xs text-slate-400">Total Calls</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {recursionTree.filter(n => n.isActive).length}
                  </div>
                  <div className="text-xs text-slate-400">Active</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-400">
                    {isComplete ? '✓' : '—'}
                  </div>
                  <div className="text-xs text-slate-400">Complete</div>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
              <h3 className="text-lg font-semibold text-slate-100 mb-4">Controls</h3>
              
              <div className="space-y-4">
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
                </div>
              </div>
            </div>
          </div>

          {/* Code Panel */}
          <div className="space-y-6">
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
              <h3 className="text-lg font-semibold text-slate-100 mb-4">{currentExample.name}</h3>
              <p className="text-slate-400 text-sm mb-4">{currentExample.description}</p>
              
              <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm">
                <pre className="text-slate-300 overflow-x-auto">
                  <code>{currentExample.code}</code>
                </pre>
              </div>
            </div>

            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
              <h3 className="text-lg font-semibold text-slate-100 mb-4">Characteristics</h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-sky-400 rounded-full mt-2"></div>
                  <div>
                    <div className="text-slate-200 font-medium">{currentType.name}</div>
                    <div className="text-slate-400">{currentType.description}</div>
                  </div>
                </div>
                
                {selectedType === 'direct' && (
                  <div className="text-slate-400 text-xs">
                    • Function calls itself<br/>
                    • Simple and intuitive<br/>
                    • Stack grows with each call
                  </div>
                )}
                
                {selectedType === 'indirect' && (
                  <div className="text-slate-400 text-xs">
                    • Two or more functions call each other<br/>
                    • Mutual recursion pattern<br/>
                    • Can be harder to trace
                  </div>
                )}
                
                {selectedType === 'tail' && (
                  <div className="text-slate-400 text-xs">
                    • Recursive call is last operation<br/>
                    • Can be optimized by compiler<br/>
                    • Uses accumulator pattern
                  </div>
                )}
                
                {selectedType === 'head' && (
                  <div className="text-slate-400 text-xs">
                    • Processing after recursive call<br/>
                    • Stack unwinds before processing<br/>
                    • Reverses order of operations
                  </div>
                )}
                
                {selectedType === 'tree' && (
                  <div className="text-slate-400 text-xs">
                    • Multiple recursive calls<br/>
                    • Creates tree-like structure<br/>
                    • Can have exponential complexity
                  </div>
                )}
              </div>
            </div>

            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
              <h3 className="text-lg font-semibold text-slate-100 mb-4">Legend</h3>
              
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-orange-500/20 border-2 border-orange-500 rounded-full"></div>
                  <span className="text-slate-300">Active (currently executing)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-blue-500/20 border-2 border-blue-500 rounded-full"></div>
                  <span className="text-slate-300">Returning (has result)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-green-500/20 border-2 border-green-500 rounded-full"></div>
                  <span className="text-slate-300">Completed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 