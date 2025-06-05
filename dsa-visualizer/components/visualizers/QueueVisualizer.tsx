'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import CodeHighlighter from '../ui/CodeHighlighter';
import { delay } from '../../lib/utils';

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
    { lines: [2, 3], description: "Add the new element to the rear of the queue" },
    { lines: [5, 6], description: "Move the rear pointer to the next position" },
    { lines: [8, 9], description: "Increment the queue size counter" },
    { line: 10, description: "Return the modified queue" }
  ],
  
  dequeue: [
    { lines: [2, 3, 4], description: "Check if the queue is empty (underflow condition)" },
    { lines: [7, 8], description: "Get reference to the front element" },
    { lines: [10, 11], description: "Move the front pointer to the next position" },
    { lines: [13, 14], description: "Decrement the queue size counter" },
    { line: 15, description: "Return the removed element" }
  ],
  
  peek: [
    { lines: [2, 3, 4], description: "Check if the queue is empty" },
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

  const showMessage = (text: string, _type?: 'success' | 'error' | 'info') => {
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
        showMessage(`Front element is ${frontElement.value}`, 'success');
      }
    }

    // Clear highlight after a delay
    setTimeout(() => {
      setQueue(prev => prev.map(item => ({ ...item, isHighlighted: false })));
      setPeekedValue(null);
    }, 2000);

    setIsAnimating(false);
  }, [queue]);

  const clearQueue = () => {
    setQueue([]);
    setMessage('Queue cleared');
    setPeekedValue(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-100 mb-2">Queue Visualizer</h1>
          <p className="text-slate-400 text-lg">
            Interactive visualization of queue operations with step-by-step code execution
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[7fr_3fr] gap-8">
          {/* Visualization Panel */}
          <div className="space-y-6">
            {/* Queue Visualization */}
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
              <h3 className="text-lg font-semibold text-slate-100 mb-4">Queue Structure</h3>
              
              <div className="mb-8 mt-5 overflow-x-auto">
                {queue.length === 0 ? (
                  <div className="flex justify-center p-4">
                    <div className="p-4 border border-dashed border-slate-600 rounded-md text-slate-400">
                      Empty Queue
                    </div>
                  </div>
                ) : (
                  <div className="min-w-max mx-auto">
                    <div className="flex items-center gap-4 justify-center">
                      {/* Front indicator */}
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-green-400 font-medium text-sm">FRONT</span>
                        <span className="text-green-300 text-xs">(dequeue)</span>
                        <ArrowRight className="text-green-400" size={20} />
                      </div>
                      
                      <div className="flex gap-2 items-center">
                        <AnimatePresence mode="popLayout">
                          {queue.map((item, index) => (
                            <motion.div
                              key={item.id}
                              layout
                              initial={{ opacity: 0, scale: 0.8, x: -20 }}
                              animate={{ opacity: 1, scale: 1, x: 0 }}
                              exit={{ opacity: 0, scale: 0.8, x: 20 }}
                              transition={{ duration: 0.3 }}
                              className="relative"
                            >
                              <div 
                                className={`w-20 h-16 flex flex-col items-center justify-center border-2 rounded-lg shadow-sm transition-all duration-300 ${
                                  item.isHighlighted 
                                    ? 'border-sky-400 bg-sky-900/50 text-sky-100 shadow-sky-400/25' 
                                    : item.isEnqueuing
                                    ? 'border-green-400 bg-green-900/50 text-green-100 shadow-green-400/25'
                                    : item.isDequeuing
                                    ? 'border-red-400 bg-red-900/50 text-red-100 shadow-red-400/25'
                                    : 'border-slate-600 bg-slate-700 text-slate-200'
                                }`}
                              >
                                <span className="text-lg font-semibold">{item.value}</span>
                                <span className="text-xs text-slate-400">[{index}]</span>
                              </div>
                              
                              {/* Arrow between elements */}
                              {index < queue.length - 1 && (
                                <div className="absolute -right-3 top-1/2 transform -translate-y-1/2">
                                  <ArrowRight className="text-slate-400" size={16} />
                                </div>
                              )}
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                      
                      {/* Rear indicator */}
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-red-400 font-medium text-sm">REAR</span>
                        <span className="text-red-300 text-xs">(enqueue)</span>
                        <ArrowLeft className="text-red-400" size={20} />
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="text-sm text-slate-400 text-center mt-6">
                  Queue Size: {queue.length}
                  {peekedValue !== null && (
                    <span className="ml-4 text-sky-400">
                      Peeked Value: {peekedValue}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
              <h3 className="text-lg font-semibold text-slate-100 mb-4">Queue Operations</h3>
              
              <div className="space-y-4">
                {/* Enqueue Element */}
                <div className="p-4 bg-slate-700 rounded-xl">
                  <h4 className="font-medium text-slate-200 mb-3">Enqueue Element</h4>
                  <div className="space-y-3">
                    <input
                      type="number"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-md text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
                      placeholder="Enter a number"
                      disabled={isAnimating}
                    />
                    
                    <button
                      onClick={enqueueElement}
                      disabled={isAnimating || !inputValue.trim()}
                      className="w-full px-4 py-2 bg-sky-500 hover:bg-sky-600 disabled:bg-slate-600 text-white disabled:text-slate-400 rounded-md font-medium transition-colors"
                    >
                      {isAnimating && currentOperation === 'enqueue' ? 'Enqueuing...' : 'Enqueue Element'}
                    </button>
                  </div>
                </div>

                {/* Other Operations */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <button
                    onClick={dequeueElement}
                    disabled={isAnimating || queue.length === 0}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-slate-600 text-white disabled:text-slate-400 rounded-md font-medium transition-colors"
                  >
                    {isAnimating && currentOperation === 'dequeue' ? 'Dequeuing...' : 'Dequeue Element'}
                  </button>
                  
                  <button
                    onClick={peekElement}
                    disabled={isAnimating || queue.length === 0}
                    className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 disabled:bg-slate-600 text-slate-900 disabled:text-slate-400 rounded-md font-medium transition-colors"
                  >
                    {isAnimating && currentOperation === 'peek' ? 'Peeking...' : 'Peek Front'}
                  </button>
                  
                  <button
                    onClick={clearQueue}
                    disabled={isAnimating}
                    className="px-4 py-2 bg-gray-500 hover:bg-gray-600 disabled:bg-slate-600 text-white disabled:text-slate-400 rounded-md font-medium transition-colors"
                  >
                    Clear Queue
                  </button>
                </div>
              </div>
              
              {message && (
                <div className="mt-4 p-3 bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-800 rounded-md text-sky-800 dark:text-sky-200">
                  {message}
                </div>
              )}
            </div>
          </div>

          {/* Code Panel */}
          <div className="space-y-6">
            <CodeHighlighter
              code={QUEUE_OPERATIONS[currentOperation as keyof typeof QUEUE_OPERATIONS]}
              language="javascript"
              title={`Queue ${currentOperation.charAt(0).toUpperCase() + currentOperation.slice(1)} Operation`}
              steps={CODE_STEPS[currentOperation as keyof typeof CODE_STEPS]}
              currentStep={currentStep}

            />
          </div>
        </div>

        {/* Information Section */}
        <div className="mt-12 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
              About Queues
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Understanding the fundamentals, properties, and complexity analysis of queue data structures
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            
            {/* What is a Queue - Takes more space */}
            <div className="xl:col-span-2 bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 border border-slate-700/50 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-100">What is a Queue?</h3>
              </div>
              
              <p className="text-slate-300 mb-8 leading-relaxed text-lg">
                A queue is a linear data structure that follows the First In, First Out (FIFO) principle. 
                Elements are added at the rear (enqueue) and removed from the front (dequeue). Think of it 
                like a line at a store - the first person in line is the first to be served.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Advantages */}
                <div className="bg-green-500/5 border border-green-500/20 rounded-2xl p-6">
                  <h4 className="font-bold mb-4 text-green-400 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Advantages
                  </h4>
                  <ul className="space-y-3 text-slate-300">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                      <span>Fair ordering - first come, first served</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                      <span>Constant time O(1) enqueue and dequeue</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                      <span>Simple and predictable behavior</span>
                    </li>
                  </ul>
                </div>

                {/* Disadvantages */}
                <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6">
                  <h4 className="font-bold mb-4 text-red-400 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Disadvantages
                  </h4>
                  <ul className="space-y-3 text-slate-300">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                      <span>Limited access - only front and rear</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                      <span>No random access to elements</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                      <span>Memory overhead in array implementation</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Properties Card */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 border border-slate-700/50 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-100">Properties</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
                  <span className="text-slate-400 font-medium">Type:</span>
                  <span className="text-slate-200 font-semibold">Linear FIFO</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
                  <span className="text-slate-400 font-medium">Access:</span>
                  <span className="text-slate-200 font-semibold">Front & Rear</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
                  <span className="text-slate-400 font-medium">Enqueue:</span>
                  <span className="text-green-400 font-mono font-bold">O(1)</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
                  <span className="text-slate-400 font-medium">Dequeue:</span>
                  <span className="text-green-400 font-mono font-bold">O(1)</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
                  <span className="text-slate-400 font-medium">Peek:</span>
                  <span className="text-green-400 font-mono font-bold">O(1)</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-slate-400 font-medium">Search:</span>
                  <span className="text-yellow-400 font-mono font-bold">O(n)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Second Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            
            {/* Use Cases */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 border border-slate-700/50 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-cyan-500/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-100">Common Use Cases</h3>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                {[
                  {title: "Task Scheduling", desc: "Process tasks in order of arrival" },
                  {title: "Breadth-First Search", desc: "Explore nodes level by level" },
                  {title: "Print Queue", desc: "Handle print jobs in order" },
                  {title: "Buffer for Data Streams", desc: "Handle incoming data streams" },
                  {title: "Call Center Systems", desc: "Manage customer service queues" }
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 bg-slate-700/30 rounded-xl border border-slate-600/30">
                    <div>
                      <h4 className="font-semibold text-slate-100 mb-1">{item.title}</h4>
                      <p className="text-slate-400 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Time Complexity Analysis */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 border border-slate-700/50 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-100">Time Complexity</h3>
              </div>
              
              <div className="space-y-6">
                {/* Core Operations */}
                <div className="bg-green-500/5 border border-green-500/20 rounded-2xl p-5">
                  <h4 className="font-bold mb-4 text-green-400 text-sm uppercase tracking-wide">Core Operations</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Enqueue (add to rear)</span>
                      <span className="text-green-400 font-mono font-bold text-lg">O(1)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Dequeue (remove from front)</span>
                      <span className="text-green-400 font-mono font-bold text-lg">O(1)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Peek (view front)</span>
                      <span className="text-green-400 font-mono font-bold text-lg">O(1)</span>
                    </div>
                  </div>
                </div>

                {/* Other Operations */}
                <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-2xl p-5">
                  <h4 className="font-bold mb-4 text-yellow-400 text-sm uppercase tracking-wide">Other Operations</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Search element</span>
                      <span className="text-yellow-400 font-mono font-bold text-lg">O(n)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Check if empty</span>
                      <span className="text-green-400 font-mono font-bold text-lg">O(1)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Get size</span>
                      <span className="text-green-400 font-mono font-bold text-lg">O(1)</span>
                    </div>
                  </div>
                </div>

                {/* Space Complexity */}
                <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-5">
                  <h4 className="font-bold mb-4 text-blue-400 text-sm uppercase tracking-wide">Space Complexity</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Total space</span>
                      <span className="text-yellow-400 font-mono font-bold text-lg">O(n)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Auxiliary space</span>
                      <span className="text-green-400 font-mono font-bold text-lg">O(1)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 