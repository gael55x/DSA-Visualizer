'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Eye, RotateCcw, ArrowRight } from 'lucide-react';
import CodeHighlighter from '../ui/CodeHighlighter';
import { cn, delay } from '../../lib/utils';

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
  // Check if queue is empty
  if (stack.size === 0) {
    throw new Error('Stack underflow');
  }
  
  // Get top element
  const topElement = stack[stack.top];
  
  // Move top pointer forward
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
    { line: 10, description: "Move the top pointer to the next position" },
    { line: 13, description: "Decrement the stack size counter" },
    { line: 15, description: "Return the removed element" }
  ],
  
  peek: [
    { line: 2, description: "Check if the queue is empty" },
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
  const [currentOperation, setCurrentOperation] = useState<string>('push');
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
        // Create new element and add to queue
        const newElement: StackElement = {
          value,
          id: generateId(),
          isPushing: true
        };
        
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

    const topElement = stack[0];

    // Step-by-step animation
    for (let step = 0; step < CODE_STEPS.pop.length; step++) {
      setCurrentStep(step);
      await delay(800);

      if (step === 1) {
        // Highlight the front element
        setStack(prev => prev.map((item, idx) => ({
          ...item,
          isHighlighted: idx === 0
        })));
      } else if (step === 2) {
        // Animate removal
        setStack(prev => prev.map((item, idx) => ({
          ...item,
          isPopping: idx === 0,
          isHighlighted: false
        })));
        
        await delay(600);
        
        // Remove the element
        setStack(prev => prev.slice(1));
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

    const topElement = stack[0];

    // Step-by-step animation
    for (let step = 0; step < CODE_STEPS.peek.length; step++) {
      setCurrentStep(step);
      await delay(800);

      if (step === 1) {
        // Highlight the front element
        setStack(prev => prev.map((item, idx) => ({
          ...item,
          isHighlighted: idx === 0
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

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-slate-100 mb-2">Stack Visualizer</h1>
          <p className="text-slate-400 text-lg">
            LIFO (Last In, First Out) data structure with animated operations
          </p>
        </motion.div>

        {/* Message Display */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-slate-800 border border-slate-700 rounded-2xl text-slate-100 text-center"
            >
              {message}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Visualization Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Queue Display */}
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-100 flex items-center gap-2">
                  <ArrowRight size={20} />
                    Stack Contents
                </h2>
                <button
                  onClick={clearStack}
                  disabled={isAnimating}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-slate-600 text-white disabled:text-slate-400 rounded-xl font-medium transition-colors"
                >
                  <RotateCcw size={16} />
                  Clear
                </button>
              </div>

              {/* Stack Container */}
              <div className="relative">
                {/* Top and Bottom Labels */}
                <div className="flex justify-between mb-2 text-xs text-slate-400">
                <span>TOP (Pop)</span>
                  <span>BOTTOM (Push)</span>
                </div>
                
                {/* Stack Elements */}
                <div className="flex gap-2 min-h-[120px] items-center justify-center p-4 bg-slate-700 rounded-xl border-2 border-dashed border-slate-600">
                  <AnimatePresence mode="popLayout">
                    {stack.length === 0 ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-slate-400 text-center py-8"
                      >
                        Stack is empty. Push some elements!
                      </motion.div>
                    ) : (
                      stack.map((item, index) => (
                        <motion.div
                          key={item.id}
                          layout
                          initial={{ opacity: 0, scale: 0.8, x: 50 }}
                          animate={{ 
                            opacity: 1, 
                            scale: 1, 
                            x: 0,
                            backgroundColor: item.isHighlighted 
                              ? 'rgb(56, 189, 248)' 
                              : item.isPushing
                              ? 'rgb(34, 197, 94)'
                              : item.isPopping
                              ? 'rgb(239, 68, 68)'
                              : 'rgb(51, 65, 85)'
                          }}
                          exit={{ 
                            opacity: 0, 
                            scale: 0.8, 
                            x: -50,
                            transition: { duration: 0.3 }
                          }}
                          transition={{ duration: 0.4 }}
                          className="relative"
                        >
                          <div className="w-16 h-16 flex items-center justify-center rounded-2xl border-2 border-slate-600 text-slate-100 font-bold text-lg shadow-lg">
                            {item.value}
                          </div>
                          
                          {/* Position indicators */}
                          {index === 0 && (
                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs bg-yellow-500 text-slate-900 px-2 py-1 rounded font-medium">
                              TOP
                            </div>
                          )}
                          
                          {index === stack.length - 1 && stack.length > 1 && (
                            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs bg-green-500 text-white px-2 py-1 rounded font-medium">
                              BOTTOM
                            </div>
                          )}
                          
                          {/* Arrow between elements */}
                          {index < stack.length - 1 && (
                            <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 text-slate-400">
                              →
                            </div>
                          )}
                        </motion.div>
                      ))
                    )}
                  </AnimatePresence>
                </div>

                {/* Direction Indicator */}
                <div className="mt-4 flex items-center justify-center gap-2 text-sm text-slate-400">
                  <span>Dequeue ←</span>
                  <div className="flex-1 h-px bg-slate-600"></div>
                  <span>Flow Direction</span>
                  <div className="flex-1 h-px bg-slate-600"></div>
                  <span>→ Enqueue</span>
                </div>
              </div>

              <div className="mt-4 text-sm text-slate-400 text-center">
                Stack Size: {stack.length}
              </div>
            </div>

            {/* Controls */}
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
              <h3 className="text-lg font-semibold text-slate-100 mb-4">Stack Operations</h3>
              
              <div className="space-y-4">
                {/* Enqueue Section */}
                <div className="p-4 bg-slate-700 rounded-xl">
                  <h4 className="font-medium text-slate-200 mb-3">Push (Add to Top)</h4>
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
                      disabled={isAnimating || !inputValue}
                      className="flex items-center gap-2 px-6 py-3 bg-sky-500 hover:bg-sky-600 disabled:bg-slate-600 text-white disabled:text-slate-400 rounded-xl font-medium transition-colors"
                    >
                      {isAnimating && currentOperation === 'push' ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        />
                      ) : (
                        <Plus size={16} />
                      )}
                      Push
                    </button>
                  </div>
                </div>

                {/* Dequeue and Peek Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={popElement}
                    disabled={isAnimating || stack.length === 0}
                    className="flex items-center justify-center gap-2 p-4 bg-red-500 hover:bg-red-600 disabled:bg-slate-600 text-white disabled:text-slate-400 rounded-xl font-medium transition-colors"
                  >
                    {isAnimating && currentOperation === 'pop' ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      <Minus size={16} />
                    )}
                    Pop (Remove Top)
                  </button>
                  
                  <button
                    onClick={peekElement}
                    disabled={isAnimating || stack.length === 0}
                    className="flex items-center justify-center gap-2 p-4 bg-yellow-500 hover:bg-yellow-600 disabled:bg-slate-600 text-slate-900 disabled:text-slate-400 rounded-xl font-medium transition-colors"
                  >
                    {isAnimating && currentOperation === 'peek' ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full"
                      />
                    ) : (
                      <Eye size={16} />
                    )}
                    Peek (View Top)
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Code Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <CodeHighlighter
              code={STACK_OPERATIONS[currentOperation as keyof typeof STACK_OPERATIONS]}
              language="javascript"
              title={`Stack ${currentOperation.charAt(0).toUpperCase() + currentOperation.slice(1)} Operation`}
              steps={CODE_STEPS[currentOperation as keyof typeof CODE_STEPS]}
              currentStep={currentStep}
              showControls={false}
            />

            {/* Stack Properties */}
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
              <h3 className="text-lg font-semibold text-slate-100 mb-4">Stack Properties</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Data Structure:</span>
                  <span className="text-slate-200">Linear (LIFO)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Access Pattern:</span>
                  <span className="text-slate-200">Last In, First Out</span>
                </div>
                <div className="flex justify-between">
                <span className="text-slate-400">Push Time Complexity:</span>
                  <span className="text-green-400">O(1)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Pop Time Complexity:</span>
                  <span className="text-green-400">O(1)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Peek Time Complexity:</span>
                  <span className="text-green-400">O(1)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Space Complexity:</span>
                  <span className="text-yellow-400">O(n)</span>
                </div>
              </div>
            </div>

            {/* Use Cases */}
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
              <h3 className="text-lg font-semibold text-slate-100 mb-4">Common Use Cases</h3>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-sky-400 rounded-full mt-2 flex-shrink-0" />
                  Task scheduling in operating systems
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-sky-400 rounded-full mt-2 flex-shrink-0" />
                  Depth-First Search (DFS) algorithm
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-sky-400 rounded-full mt-2 flex-shrink-0" />
                  Expression evaluation
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-sky-400 rounded-full mt-2 flex-shrink-0" />
                  Function call management
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-sky-400 rounded-full mt-2 flex-shrink-0" />
                  Backtracking algorithms
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 