'use client';
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Eye, RotateCcw, ArrowDown, ArrowUp } from 'lucide-react';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

interface StackElement {
  value: number;
  id: string;
  isHighlighted?: boolean;
  isPushing?: boolean;
  isPopping?: boolean;
}

const STACK_OPERATIONS = {
  push: `function push(stack, value) {
  // Add element to the top of stack
  stack[stack.top] = value;
  
  // Move top pointer forward
  stack.top++;
  
  // Increment stack size
  stack.size++;
  
  return stack;
}`,
  
  pop: `function pop(stack) {
  // Check if stack is empty
  if (stack.size === 0) {
    throw new Error('Stack underflow');
  }
  
  // Get top element
  const topElement = stack[stack.top];
  
  // Move top pointer backward
  stack.top--;
  
  // Decrement stack size
  stack.size--;
  
  return topElement;
}`,
  
  peek: `function peekTop(stack) {
  // Check if stack is empty
  if (stack.size === 0) {
    return null;
  }
  
  // Return top element without removing
  return stack[stack.top];
}`
};

const CODE_STEPS = {
  push: [
    { line: 2, description: "Add the new element to the top of the stack" },
    { line: 5, description: "Move the top pointer to the next position" },
    { line: 8, description: "Increment the stack size counter" },
    { line: 10, description: "Return the modified stack" }
  ],
  
  pop: [
    { line: 2, description: "Check if the stack is empty (underflow condition)" },
    { line: 7, description: "Get reference to the top element" },
    { line: 10, description: "Move the top pointer to the previous position" },
    { line: 13, description: "Decrement the stack size counter" },
    { line: 15, description: "Return the removed element" }
  ],
  
  peek: [
    { line: 2, description: "Check if the stack is empty" },
    { line: 7, description: "Return the top element without removing it" }
  ]
};

export default function StackVisualizer() {
  const [stack, setStack] = useState<StackElement[]>([
    { value: 10, id: '1' },
    { value: 20, id: '2' },
    { value: 30, id: '3' }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [message, setMessage] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentOperation, setCurrentOperation] = useState<'push' | 'pop' | 'peek'>('push');
  const [currentStep, setCurrentStep] = useState(0);
  const [peekedValue, setPeekedValue] = useState<number | null>(null);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const showMessage = (text: string, type: 'success' | 'error' | 'info' = 'info') => {
    setMessage(text);
    setTimeout(() => setMessage(''), 3000);
  };

  const pushElement = useCallback(async () => {
    if (!inputValue.trim()) {
      showMessage('Please enter a value', 'error');
      return;
    }
    const value = parseInt(inputValue);
    if (isNaN(value)) {
      showMessage('Please enter a valid number', 'error');
      return;
    }

    setIsAnimating(true);
    setCurrentOperation('push');

    // Step-by-step animation
    for (let step = 0; step < CODE_STEPS.push.length; step++) {
      setCurrentStep(step);
      await delay(800);
      
      if (step === 0) {
        // Create new element and add to top of stack
        const newElement: StackElement = {
          value,
          id: generateId(),
          isPushing: true
        };
        
        // Add to end of array (top of visual stack)
        setStack(prev => [...prev, newElement]);
        
        setTimeout(() => {
          setStack(prev => prev.map(item => ({ ...item, isPushing: false })));
        }, 600);
      }
    }

    setInputValue('');
    showMessage(`Successfully pushed ${value} to the stack`, 'success');
    setIsAnimating(false);
  }, [inputValue]);

  const popElement = useCallback(async () => {
    if (stack.length === 0) {
      showMessage('Stack is empty! Cannot pop from empty stack', 'error');
      return;
    }

    setIsAnimating(true);
    setCurrentOperation('pop');
    const topElement = stack[stack.length - 1]; // Last element is the top

    // Step-by-step animation
    for (let step = 0; step < CODE_STEPS.pop.length; step++) {
      setCurrentStep(step);
      await delay(800);
      
      if (step === 1) {
        // Highlight the top element (last in array)
        setStack(prev => prev.map((item, idx) => ({
          ...item,
          isHighlighted: idx === prev.length - 1
        })));
      } else if (step === 2) {
        // Animate removal
        setStack(prev => prev.map((item, idx) => ({
          ...item,
          isPopping: idx === prev.length - 1,
          isHighlighted: false
        })));
        
        await delay(600);
        
        // Remove the top element (last in array)
        setStack(prev => prev.slice(0, -1));
      }
    }

    showMessage(`Successfully popped ${topElement.value} from the stack`, 'success');
    setIsAnimating(false);
  }, [stack]);

  const peekElement = useCallback(async () => {
    if (stack.length === 0) {
      showMessage('Stack is empty! Nothing to peek', 'error');
      setPeekedValue(null);
      return;
    }

    setIsAnimating(true);
    setCurrentOperation('peek');
    const topElement = stack[stack.length - 1]; // Last element is the top

    // Step-by-step animation
    for (let step = 0; step < CODE_STEPS.peek.length; step++) {
      setCurrentStep(step);
      await delay(800);
      
      if (step === 1) {
        // Highlight the top element (last in array)
        setStack(prev => prev.map((item, idx) => ({
          ...item,
          isHighlighted: idx === prev.length - 1
        })));
        
        setPeekedValue(topElement.value);
        
        setTimeout(() => {
          setStack(prev => prev.map(item => ({ ...item, isHighlighted: false })));
        }, 2000);
      }
    }

    showMessage(`Top element is ${topElement.value}`, 'success');   
    setIsAnimating(false);
  }, [stack]);

  const clearStack = () => {
    setStack([]);
    setPeekedValue(null);
    showMessage('Stack cleared', 'info');
  };

  // Reverse the stack for proper visualization (top element at top)
  const visualStack = [...stack].reverse();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-sky-400 to-blue-400 bg-clip-text text-transparent mb-3">
            Stack Visualizer
          </h1>
          <p className="text-slate-400 text-lg">
            LIFO (Last In, First Out) data structure with animated operations
          </p>
        </div>

        {/* Message Display */}
        <div className="mb-6">
          {message && (
            <div className="bg-sky-500/20 border border-sky-400/30 rounded-lg px-4 py-3 text-sky-200 text-center">
              {message}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Visualization Panel */}
          <div className="space-y-6">
            {/* Stack Display */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <ArrowUp className="w-5 h-5 text-sky-400" />
                  <h3 className="text-xl font-semibold text-slate-200">Stack Contents</h3>
                </div>
                <button
                  onClick={clearStack}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Clear
                </button>
              </div>

              {/* Stack Container - Proper vertical layout */}
              <div className="flex flex-col items-center space-y-4">
                {/* Top Label */}
                <div className="text-sm text-slate-400 font-medium flex items-center gap-2">
                  <ArrowUp className="w-4 h-4" />
                  TOP (Push/Pop)
                </div>

                {/* Stack Elements - Proper LIFO visualization */}
                <div className="relative w-full max-w-xs">
                  <AnimatePresence mode="popLayout">
                    {stack.length === 0 ? (
                      <div className="text-center py-12 text-slate-400">
                        <div className="text-lg font-medium mb-2">Stack is empty.</div>
                        <div className="text-sm">Push some elements!</div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {visualStack.map((item, visualIndex) => {
                          // Get the actual index in the original array
                          const actualIndex = stack.length - 1 - visualIndex;
                          const isTop = actualIndex === stack.length - 1;
                          const isBottom = actualIndex === 0;
                          
                          return (
                            <motion.div
                              key={item.id}
                              initial={item.isPushing ? { y: -50, opacity: 0, scale: 0.8 } : false}
                              animate={{ 
                                y: 0, 
                                opacity: 1, 
                                scale: item.isHighlighted ? 1.05 : 1,
                                backgroundColor: item.isHighlighted ? 'rgb(56 189 248)' : 'rgb(71 85 105)'
                              }}
                              exit={item.isPopping ? { 
                                y: -50, 
                                opacity: 0, 
                                scale: 0.8 
                              } : { opacity: 0 }}
                              transition={{ 
                                type: "spring", 
                                stiffness: 300, 
                                damping: 30 
                              }}
                              className="relative"
                            >
                              {/* Stack Element */}
                              <div className={`
                                relative px-6 py-4 rounded-xl border-2 text-center font-bold text-lg
                                ${item.isHighlighted 
                                  ? 'bg-sky-400 border-sky-300 text-slate-900' 
                                  : 'bg-slate-600 border-slate-500 text-slate-100'
                                }
                                transition-all duration-300
                              `}>
                                {item.value}
                                
                                {/* TOP indicator for the top element */}
                                {isTop && (
                                  <div className="absolute -top-2 -right-2 bg-yellow-500 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold">
                                    TOP
                                  </div>
                                )}
                                
                                {/* BOTTOM indicator for the bottom element when there are multiple */}
                                {isBottom && stack.length > 1 && (
                                  <div className="absolute -bottom-2 -right-2 bg-green-500 text-green-900 px-2 py-1 rounded-full text-xs font-bold">
                                    BOTTOM
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Bottom Label */}
                <div className="text-sm text-slate-400 font-medium flex items-center gap-2">
                  BOTTOM (Base)
                  <ArrowDown className="w-4 h-4" />
                </div>

                {/* Stack Pointer Visualization */}
                {stack.length > 0 && (
                  <div className="text-xs text-slate-500 flex items-center gap-2">
                    <ArrowUp className="w-3 h-3" />
                    <span className="font-mono">Stack Pointer</span>
                    <ArrowUp className="w-3 h-3" />
                  </div>
                )}
              </div>

              <div className="mt-6 text-center text-sm text-slate-400">
                Stack Size: {stack.length} | 
                {peekedValue !== null && (
                  <span className="text-sky-400 font-medium">
                    Peeked Value: {peekedValue}
                  </span>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
              <h3 className="text-xl font-semibold text-slate-200 mb-4">Stack Operations</h3>
              
              <div className="space-y-4">
                {/* Push Section */}
                <div className="space-y-3">
                  <h4 className="text-lg font-medium text-slate-300">Push (Add to Top)</h4>
                  <div className="flex gap-3">
                    <input
                      type="number"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Enter value to push"
                      disabled={isAnimating}
                      className="flex-1 px-4 py-3 bg-slate-600 border border-slate-500 rounded-xl text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition-colors disabled:opacity-50"
                      onKeyPress={(e) => e.key === 'Enter' && pushElement()}
                    />
                    <button
                      onClick={pushElement}
                      disabled={isAnimating}
                      className="px-6 py-3 bg-sky-600 hover:bg-sky-700 disabled:bg-sky-600/50 rounded-xl font-medium transition-colors flex items-center gap-2"
                    >
                      {isAnimating && currentOperation === 'push' ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                      Push
                    </button>
                  </div>
                </div>

                {/* Pop and Peek Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={popElement}
                    disabled={isAnimating || stack.length === 0}
                    className="px-4 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-600/50 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    {isAnimating && currentOperation === 'pop' ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Minus className="w-4 h-4" />
                    )}
                    Pop (Remove Top)
                  </button>
                  
                  <button
                    onClick={peekElement}
                    disabled={isAnimating || stack.length === 0}
                    className="px-4 py-3 bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-600/50 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    {isAnimating && currentOperation === 'peek' ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                    Peek (View Top)
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Information Panel */}
          <div className="space-y-6">
            {/* Stack Properties */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
              <h3 className="text-xl font-semibold text-slate-200 mb-4">Stack Properties</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Data Structure:</span>
                  <span className="text-slate-200 font-medium">Linear (LIFO)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Access Pattern:</span>
                  <span className="text-slate-200 font-medium">Last In, First Out</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Push Time Complexity:</span>
                  <span className="text-green-400 font-mono">O(1)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Pop Time Complexity:</span>
                  <span className="text-green-400 font-mono">O(1)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Peek Time Complexity:</span>
                  <span className="text-green-400 font-mono">O(1)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Space Complexity:</span>
                  <span className="text-blue-400 font-mono">O(n)</span>
                </div>
              </div>
            </div>

            {/* Use Cases */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
              <h3 className="text-xl font-semibold text-slate-200 mb-4">Common Use Cases</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-sky-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-slate-300">Function call management (call stack)</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-sky-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-slate-300">Expression evaluation and parsing</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-sky-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-slate-300">Undo operations in applications</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-sky-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-slate-300">Depth-First Search (DFS) algorithm</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-sky-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-slate-300">Backtracking algorithms</span>
                </div>
              </div>
            </div>

            {/* Current Operation Code */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
              <h3 className="text-xl font-semibold text-slate-200 mb-4">
                Stack {currentOperation.charAt(0).toUpperCase() + currentOperation.slice(1)} Operation
              </h3>
              <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm">
                <pre className="text-slate-300 whitespace-pre-wrap">
                  {STACK_OPERATIONS[currentOperation]}
                </pre>
              </div>
              
              {isAnimating && (
                <div className="mt-4 p-3 bg-sky-500/20 border border-sky-400/30 rounded-lg">
                  <div className="text-sm text-sky-200">
                    <strong>Step {currentStep + 1} of {CODE_STEPS[currentOperation].length}:</strong>
                    <br />
                    {CODE_STEPS[currentOperation][currentStep]?.description}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}