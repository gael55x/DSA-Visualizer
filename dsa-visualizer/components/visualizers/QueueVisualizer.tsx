'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Eye, RotateCcw, ArrowRight } from 'lucide-react';
import CodeHighlighter from '../ui/CodeHighlighter';
import { cn, delay } from '../../lib/utils';

interface QueueElement {
  value: number;
  id: string;
  isHighlighted?: boolean;
  isEnqueuing?: boolean;
  isDequeuing?: boolean;
}

const QUEUE_OPERATIONS = {
  enqueue: `function enqueue(queue, value) {
  // Add element to the rear of queue
  queue[queue.rear] = value;
  
  // Move rear pointer forward
  queue.rear = (queue.rear + 1) % queue.capacity;
  
  // Increment queue size
  queue.size++;
  
  return queue;
}`,
  
  dequeue: `function dequeue(queue) {
  // Check if queue is empty
  if (queue.size === 0) {
    throw new Error('Queue underflow');
  }
  
  // Get front element
  const frontElement = queue[queue.front];
  
  // Move front pointer forward
  queue.front = (queue.front + 1) % queue.capacity;
  
  // Decrement queue size
  queue.size--;
  
  return frontElement;
}`,
  
  peek: `function peekFront(queue) {
  // Check if queue is empty
  if (queue.size === 0) {
    return null;
  }
  
  // Return front element without removing
  return queue[queue.front];
}`
};

const CODE_STEPS = {
  enqueue: [
    { line: 2, description: "Add the new element to the rear of the queue" },
    { line: 5, description: "Move the rear pointer to the next position" },
    { line: 8, description: "Increment the queue size counter" },
    { line: 10, description: "Return the modified queue" }
  ],
  
  dequeue: [
    { line: 2, description: "Check if the queue is empty (underflow condition)" },
    { line: 7, description: "Get reference to the front element" },
    { line: 10, description: "Move the front pointer to the next position" },
    { line: 13, description: "Decrement the queue size counter" },
    { line: 15, description: "Return the removed element" }
  ],
  
  peek: [
    { line: 2, description: "Check if the queue is empty" },
    { line: 7, description: "Return the front element without removing it" }
  ]
};

export default function QueueVisualizer() {
  const [queue, setQueue] = useState<QueueElement[]>([
    { value: 10, id: '1' },
    { value: 20, id: '2' },
    { value: 30, id: '3' }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [message, setMessage] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentOperation, setCurrentOperation] = useState<string>('enqueue');
  const [currentStep, setCurrentStep] = useState(0);
  const [peekedValue, setPeekedValue] = useState<number | null>(null);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const showMessage = (text: string, type: 'success' | 'error' | 'info' = 'info') => {
    setMessage(text);
    setTimeout(() => setMessage(''), 3000);
  };

  const enqueueElement = useCallback(async () => {
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
    setCurrentOperation('enqueue');

    // Step-by-step animation
    for (let step = 0; step < CODE_STEPS.enqueue.length; step++) {
      setCurrentStep(step);
      await delay(800);

      if (step === 0) {
        // Create new element and add to queue
        const newElement: QueueElement = {
          value,
          id: generateId(),
          isEnqueuing: true
        };
        
        setQueue(prev => [...prev, newElement]);
        
        setTimeout(() => {
          setQueue(prev => prev.map(item => ({ ...item, isEnqueuing: false })));
        }, 600);
      }
    }

    setInputValue('');
    showMessage(`Successfully enqueued ${value} to the queue`, 'success');
    setIsAnimating(false);
  }, [inputValue]);

  const dequeueElement = useCallback(async () => {
    if (queue.length === 0) {
      showMessage('Queue is empty! Cannot dequeue from empty queue', 'error');
      return;
    }

    setIsAnimating(true);
    setCurrentOperation('dequeue');

    const frontElement = queue[0];

    // Step-by-step animation
    for (let step = 0; step < CODE_STEPS.dequeue.length; step++) {
      setCurrentStep(step);
      await delay(800);

      if (step === 1) {
        // Highlight the front element
        setQueue(prev => prev.map((item, idx) => ({
          ...item,
          isHighlighted: idx === 0
        })));
      } else if (step === 2) {
        // Animate removal
        setQueue(prev => prev.map((item, idx) => ({
          ...item,
          isDequeuing: idx === 0,
          isHighlighted: false
        })));
        
        await delay(600);
        
        // Remove the element
        setQueue(prev => prev.slice(1));
      }
    }

    showMessage(`Successfully dequeued ${frontElement.value} from the queue`, 'success');
    setIsAnimating(false);
  }, [queue]);

  const peekElement = useCallback(async () => {
    if (queue.length === 0) {
      showMessage('Queue is empty! Nothing to peek', 'error');
      setPeekedValue(null);
      return;
    }

    setIsAnimating(true);
    setCurrentOperation('peek');

    const frontElement = queue[0];

    // Step-by-step animation
    for (let step = 0; step < CODE_STEPS.peek.length; step++) {
      setCurrentStep(step);
      await delay(800);

      if (step === 1) {
        // Highlight the front element
        setQueue(prev => prev.map((item, idx) => ({
          ...item,
          isHighlighted: idx === 0
        })));
        
        setPeekedValue(frontElement.value);
        
        setTimeout(() => {
          setQueue(prev => prev.map(item => ({ ...item, isHighlighted: false })));
        }, 2000);
      }
    }

    showMessage(`Front element is ${frontElement.value}`, 'success');
    setIsAnimating(false);
  }, [queue]);

  const clearQueue = () => {
    setQueue([]);
    setPeekedValue(null);
    showMessage('Queue cleared', 'info');
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
          <h1 className="text-4xl font-bold text-slate-100 mb-2">Queue Visualizer</h1>
          <p className="text-slate-400 text-lg">
            FIFO (First In, First Out) data structure with animated operations
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
                  Queue Contents
                </h2>
                <button
                  onClick={clearQueue}
                  disabled={isAnimating}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-slate-600 text-white disabled:text-slate-400 rounded-xl font-medium transition-colors"
                >
                  <RotateCcw size={16} />
                  Clear
                </button>
              </div>

              {/* Queue Container */}
              <div className="relative">
                {/* Front and Rear Labels */}
                <div className="flex justify-between mb-2 text-xs text-slate-400">
                  <span>FRONT (Dequeue)</span>
                  <span>REAR (Enqueue)</span>
                </div>
                
                {/* Queue Elements */}
                <div className="flex gap-2 min-h-[120px] items-center justify-center p-4 bg-slate-700 rounded-xl border-2 border-dashed border-slate-600">
                  <AnimatePresence mode="popLayout">
                    {queue.length === 0 ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-slate-400 text-center py-8"
                      >
                        Queue is empty. Enqueue some elements!
                      </motion.div>
                    ) : (
                      queue.map((item, index) => (
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
                              : item.isEnqueuing
                              ? 'rgb(34, 197, 94)'
                              : item.isDequeuing
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
                              FRONT
                            </div>
                          )}
                          
                          {index === queue.length - 1 && queue.length > 1 && (
                            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs bg-green-500 text-white px-2 py-1 rounded font-medium">
                              REAR
                            </div>
                          )}
                          
                          {/* Arrow between elements */}
                          {index < queue.length - 1 && (
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
                Queue Size: {queue.length}
                {peekedValue !== null && (
                  <span className="ml-4 text-yellow-400">
                    • Front Value: {peekedValue}
                  </span>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
              <h3 className="text-lg font-semibold text-slate-100 mb-4">Queue Operations</h3>
              
              <div className="space-y-4">
                {/* Enqueue Section */}
                <div className="p-4 bg-slate-700 rounded-xl">
                  <h4 className="font-medium text-slate-200 mb-3">Enqueue (Add to Rear)</h4>
                  <div className="flex gap-3">
                    <input
                      type="number"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Enter value to enqueue"
                      disabled={isAnimating}
                      className="flex-1 px-4 py-3 bg-slate-600 border border-slate-500 rounded-xl text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition-colors disabled:opacity-50"
                      onKeyPress={(e) => e.key === 'Enter' && enqueueElement()}
                    />
                    <button
                      onClick={enqueueElement}
                      disabled={isAnimating || !inputValue}
                      className="flex items-center gap-2 px-6 py-3 bg-sky-500 hover:bg-sky-600 disabled:bg-slate-600 text-white disabled:text-slate-400 rounded-xl font-medium transition-colors"
                    >
                      {isAnimating && currentOperation === 'enqueue' ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        />
                      ) : (
                        <Plus size={16} />
                      )}
                      Enqueue
                    </button>
                  </div>
                </div>

                {/* Dequeue and Peek Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={dequeueElement}
                    disabled={isAnimating || queue.length === 0}
                    className="flex items-center justify-center gap-2 p-4 bg-red-500 hover:bg-red-600 disabled:bg-slate-600 text-white disabled:text-slate-400 rounded-xl font-medium transition-colors"
                  >
                    {isAnimating && currentOperation === 'dequeue' ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      <Minus size={16} />
                    )}
                    Dequeue (Remove Front)
                  </button>
                  
                  <button
                    onClick={peekElement}
                    disabled={isAnimating || queue.length === 0}
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
                    Peek (View Front)
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
              code={QUEUE_OPERATIONS[currentOperation as keyof typeof QUEUE_OPERATIONS]}
              language="javascript"
              title={`Queue ${currentOperation.charAt(0).toUpperCase() + currentOperation.slice(1)} Operation`}
              steps={CODE_STEPS[currentOperation as keyof typeof CODE_STEPS]}
              currentStep={currentStep}
              showControls={false}
            />

            {/* Queue Properties */}
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
              <h3 className="text-lg font-semibold text-slate-100 mb-4">Queue Properties</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Data Structure:</span>
                  <span className="text-slate-200">Linear (FIFO)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Access Pattern:</span>
                  <span className="text-slate-200">First In, First Out</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Enqueue Time Complexity:</span>
                  <span className="text-green-400">O(1)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Dequeue Time Complexity:</span>
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
                  Breadth-First Search (BFS) algorithm
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-sky-400 rounded-full mt-2 flex-shrink-0" />
                  Print job management
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-sky-400 rounded-full mt-2 flex-shrink-0" />
                  Buffer for data streams
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-sky-400 rounded-full mt-2 flex-shrink-0" />
                  Level-order tree traversal
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 