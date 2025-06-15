'use client';

import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Shuffle } from 'lucide-react';
import CodeHighlighter from '../ui/CodeHighlighter';
import { ToastContainer } from '../ui/Toast';
import { useToast } from '../../hooks/useToast';
import { cn, delay } from '../../lib/utils';

interface ArrayElement {
  value: number;
  id: string;
  isComparing?: boolean;
  isSwapping?: boolean;
  isSorted?: boolean;
  isActive?: boolean;
  isHeapified?: boolean;
  isExtracted?: boolean;
}

const HEAP_SORT_CODE = `function heapSort(array) {
  const n = array.length;
  
  // Build max heap from bottom up
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(array, n, i);
  }
  
  // Extract elements from heap one by one
  for (let i = n - 1; i > 0; i--) {
    // Move current root to end (largest element)
    [array[0], array[i]] = [array[i], array[0]];
    
    // Call heapify on the reduced heap
    heapify(array, i, 0);
  }
  
  return array;
}

function heapify(array, n, rootIndex) {
  let largest = rootIndex;
  let left = 2 * rootIndex + 1;
  let right = 2 * rootIndex + 2;
  
  // Check if left child is larger than root
  if (left < n && array[left] > array[largest]) {
    largest = left;
  }
  
  // Check if right child is larger than largest so far
  if (right < n && array[right] > array[largest]) {
    largest = right;
  }
  
  // If largest is not root, swap and continue heapifying
  if (largest !== rootIndex) {
    [array[rootIndex], array[largest]] = [array[largest], array[rootIndex]];
    heapify(array, n, largest);
  }
}`;

const CODE_STEPS = {
  heapSort: [
    { lines: [2], description: "Get the length of the array" },
    { lines: [4, 5, 6], description: "Build max heap from bottom up" },
    { lines: [8, 9], description: "Extract elements from heap one by one" },
    { lines: [10, 11], description: "Move current root (max) to end" },
    { lines: [13, 14], description: "Restore heap property for reduced heap" },
    { lines: [17], description: "Return the sorted array" },
    { lines: [20, 21, 22, 23], description: "Initialize variables for heapify" },
    { lines: [25, 26, 27], description: "Check if left child is larger than root" },
    { lines: [30, 31, 32], description: "Check if right child is larger than current largest" },
    { lines: [35, 36, 37], description: "If largest changed, swap and continue heapifying" }
  ]
};

export default function HeapSortVisualizer() {
  const [array, setArray] = useState<ArrayElement[]>([
    { value: 64, id: '1' },
    { value: 34, id: '2' },
    { value: 25, id: '3' },
    { value: 12, id: '4' },
    { value: 22, id: '5' },
    { value: 11, id: '6' },
    { value: 90, id: '7' }
  ]);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [speed, setSpeed] = useState(500);
  const [comparisons, setComparisons] = useState(0);
  const [swaps, setSwaps] = useState(0);
  const [heapSize, setHeapSize] = useState(0);
  const [phase, setPhase] = useState<'building' | 'sorting'>('building');
  
  // Add cancellation ref for pause functionality
  const cancelRef = useRef(false);
  
  // Pan state
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const generateId = () => Math.random().toString(36).substr(2, 9);
  const { toasts, removeToast, showSuccess, showError, showInfo } = useToast();

  const generateRandomArray = useCallback(() => {
    const newArray = [];
    for (let i = 0; i < 8; i++) {
      newArray.push({
        value: Math.floor(Math.random() * 100) + 1,
        id: generateId()
      });
    }
    setArray(newArray);
    resetSort();
    showInfo('Generated new random array');
  }, [showInfo]);

  const resetSort = useCallback(() => {
    cancelRef.current = true; // Cancel any ongoing animation
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentStep(0);
    setIsComplete(false);
    setComparisons(0);
    setSwaps(0);
    setHeapSize(0);
    setPhase('building');
    setArray(prev => prev.map(item => ({
      ...item,
      isComparing: false,
      isSwapping: false,
      isSorted: false,
      isActive: false,
      isHeapified: false,
      isExtracted: false
    })));
    setTimeout(() => { cancelRef.current = false; }, 100); // Reset cancellation flag
    showInfo('Visualization reset');
  }, [showInfo]);

  // Cancellable delay function
  const cancellableDelay = async (ms: number) => {
    return new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        if (cancelRef.current) {
          reject(new Error('Cancelled'));
        } else {
          resolve();
        }
      }, ms);

      // Check for cancellation periodically
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

  const heapify = async (arr: ArrayElement[], n: number, rootIndex: number): Promise<void> => {
    let largest = rootIndex;
    let left = 2 * rootIndex + 1;
    let right = 2 * rootIndex + 2;
    let totalComparisons = comparisons;

    try {
      // Step 6: Initialize heapify variables
      setCurrentStep(6);
      setArray(prev => prev.map((item, idx) => ({
        ...item,
        isActive: idx === rootIndex,
        isComparing: false,
        isSwapping: false
      })));
      await cancellableDelay(speed);

      // Step 7: Check left child
      setCurrentStep(7);
      if (left < n) {
        setArray(prev => prev.map((item, idx) => ({
          ...item,
          isComparing: idx === left || idx === largest,
          isActive: idx === rootIndex
        })));
        totalComparisons++;
        setComparisons(totalComparisons);
        await cancellableDelay(speed);

        if (arr[left].value > arr[largest].value) {
          largest = left;
        }
      }

      // Step 8: Check right child
      setCurrentStep(8);
      if (right < n) {
        setArray(prev => prev.map((item, idx) => ({
          ...item,
          isComparing: idx === right || idx === largest,
          isActive: idx === rootIndex
        })));
        totalComparisons++;
        setComparisons(totalComparisons);
        await cancellableDelay(speed);

        if (arr[right].value > arr[largest].value) {
          largest = right;
        }
      }

      // Step 9: Swap if needed
      setCurrentStep(9);
      if (largest !== rootIndex) {
        setArray(prev => prev.map((item, idx) => ({
          ...item,
          isSwapping: idx === rootIndex || idx === largest,
          isComparing: false,
          isActive: false
        })));
        await cancellableDelay(speed);

        // Perform swap
        [arr[rootIndex], arr[largest]] = [arr[largest], arr[rootIndex]];
        setSwaps(prev => prev + 1);
        
        setArray(prev => {
          const newArr = [...prev];
          [newArr[rootIndex], newArr[largest]] = [newArr[largest], newArr[rootIndex]];
          return newArr;
        });
        
        await cancellableDelay(speed);
        
        // Recursively heapify affected subtree
        await heapify(arr, n, largest);
      }

      // Clear highlighting
      setArray(prev => prev.map(item => ({
        ...item,
        isComparing: false,
        isSwapping: false,
        isActive: false
      })));
    } catch (error) {
      // Handle cancellation
      if (error instanceof Error && error.message === 'Cancelled') {
        return;
      }
      throw error;
    }
  };

  const heapSort = useCallback(async () => {
    try {
      cancelRef.current = false;
      setIsPlaying(true);
      setIsComplete(false);
      
      const arr = [...array];
      const n = arr.length;
      setHeapSize(n);

      // Step 0: Show array length
      setCurrentStep(0);
      await cancellableDelay(speed);

      // Build max heap (heapify phase)
      setPhase('building');
      
      // Step 1: Build heap from bottom up
      setCurrentStep(1);
      await cancellableDelay(speed);

      for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        await heapify(arr, n, i);
        
        // Mark heapified region
        setArray(prev => prev.map((item, idx) => ({
          ...item,
          isHeapified: idx <= Math.floor(n / 2) - 1 - i + Math.floor(n / 2) - 1
        })));
      }

      // Sorting phase
      setPhase('sorting');
      
      // Step 2: Extract elements from heap
      setCurrentStep(2);
      await cancellableDelay(speed);

      for (let i = n - 1; i > 0; i--) {
        setHeapSize(i);
        
        // Step 3: Move root to end
        setCurrentStep(3);
        setArray(prev => prev.map((item, idx) => ({
          ...item,
          isSwapping: idx === 0 || idx === i,
          isHeapified: false
        })));
        await cancellableDelay(speed);

        // Perform swap
        [arr[0], arr[i]] = [arr[i], arr[0]];
        setSwaps(prev => prev + 1);
        
        setArray(prev => {
          const newArr = [...prev];
          [newArr[0], newArr[i]] = [newArr[i], newArr[0]];
          return newArr.map((item, idx) => ({
            ...item,
            isSorted: idx >= i,
            isExtracted: idx === i,
            isSwapping: false
          }));
        });
        
        await cancellableDelay(speed);

        // Step 4: Heapify reduced heap
        setCurrentStep(4);
        await cancellableDelay(speed);
        
        await heapify(arr, i, 0);
      }

      // Mark all as sorted
      setArray(prev => prev.map(item => ({ 
        ...item, 
        isSorted: true,
        isHeapified: false,
        isExtracted: false
      })));
      setIsComplete(true);
      setIsPlaying(false);
      showSuccess(`Heap sort completed! ${comparisons} comparisons, ${swaps} swaps`);
      setCurrentStep(5);
    } catch (error) {
      // Handle cancellation gracefully
      if (error instanceof Error && error.message === 'Cancelled') {
        setIsPlaying(false);
        setIsPaused(true);
        return;
      }
      throw error;
    }
  }, [array, speed, comparisons]);

  const handlePlayPause = () => {
    if (isComplete) {
      resetSort();
      return;
    }
    
    if (isPlaying) {
      cancelRef.current = true;
      setIsPlaying(false);
      setIsPaused(true);
    } else {
      heapSort();
    }
  };

  // Helper function to get heap tree positions
  const getTreePosition = (index: number, totalNodes: number) => {
    const level = Math.floor(Math.log2(index + 1));
    const positionInLevel = index - (Math.pow(2, level) - 1);
    const maxPositionsInLevel = Math.pow(2, level);
    
    return {
      level,
      position: positionInLevel,
      maxPositions: maxPositionsInLevel
    };
  };

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-100 mb-2">Heap Sort Visualizer</h1>
          <p className="text-slate-400 text-lg">
            Interactive visualization of heap sort algorithm with heap tree structure
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[4fr_1fr] lg:grid-cols-1 gap-8">
          {/* Visualization Panel */}
          <div className="space-y-6">
            {/* Array Visualization */}
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
              <h3 className="text-lg font-semibold text-slate-100 mb-4">Array Visualization</h3>
              
              <div className="mb-8 mt-5">
                <div className="flex items-end justify-center gap-2 min-h-[300px]">
                  <AnimatePresence mode="wait">
                    {array.map((item, index) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center gap-2"
                      >
                        <motion.div
                          className={cn(
                            "w-12 flex items-center justify-center text-white font-bold text-sm rounded-lg border-2 transition-all duration-300",
                            item.isSorted 
                              ? "bg-green-500 border-green-400 shadow-green-400/25" 
                              : item.isSwapping
                              ? "bg-red-500 border-red-400 shadow-red-400/25"
                              : item.isComparing
                              ? "bg-yellow-500 border-yellow-400 shadow-yellow-400/25"
                              : item.isActive
                              ? "bg-blue-500 border-blue-400 shadow-blue-400/25"
                              : item.isHeapified
                              ? "bg-purple-500 border-purple-400 shadow-purple-400/25"
                              : item.isExtracted
                              ? "bg-orange-500 border-orange-400 shadow-orange-400/25"
                              : index < heapSize 
                              ? "bg-slate-600 border-slate-500"
                              : "bg-slate-700 border-slate-600 opacity-50"
                          )}
                          style={{ height: `${item.value * 3 + 20}px` }}
                          animate={{
                            scale: item.isComparing || item.isSwapping || item.isActive ? 1.1 : 1,
                          }}
                          transition={{ duration: 0.2 }}
                        >
                          {item.value}
                        </motion.div>
                        <span className="text-xs text-slate-400">[{index}]</span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
                
                <div className="text-sm text-slate-400 text-center mt-6 space-y-2">
                  <div>Phase: {phase === 'building' ? 'Building Heap' : 'Sorting'} | Heap Size: {heapSize}</div>
                  <div>Comparisons: {comparisons} | Swaps: {swaps}</div>
                </div>
              </div>
            </div>

            {/* Heap Tree Visualization */}
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
              <h3 className="text-lg font-semibold text-slate-100 mb-4">Heap Tree Structure</h3>
              
              <div className="relative overflow-hidden bg-slate-900 rounded-lg border border-slate-600 h-80">
                <div 
                  className={cn(
                    "relative w-full h-full",
                    isDragging ? "cursor-grabbing" : "cursor-grab"
                  )}
                  style={{
                    backgroundImage: 'radial-gradient(circle, #334155 1px, transparent 1px)',
                    backgroundSize: '20px 20px',
                    backgroundPosition: `${panOffset.x}px ${panOffset.y}px`
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                    const startX = e.clientX;
                    const startY = e.clientY;
                    const startPanX = panOffset.x;
                    const startPanY = panOffset.y;

                    const handleMouseMove = (e: MouseEvent) => {
                      const deltaX = e.clientX - startX;
                      const deltaY = e.clientY - startY;
                      setPanOffset({
                        x: startPanX + deltaX,
                        y: startPanY + deltaY
                      });
                    };

                    const handleMouseUp = () => {
                      setIsDragging(false);
                      document.removeEventListener('mousemove', handleMouseMove);
                      document.removeEventListener('mouseup', handleMouseUp);
                    };

                    document.addEventListener('mousemove', handleMouseMove);
                    document.addEventListener('mouseup', handleMouseUp);
                  }}
                >
                  <div 
                    className="absolute w-full h-full"
                    style={{
                      transform: `translate(${panOffset.x}px, ${panOffset.y}px)`
                    }}
                  >
                    {/* Tree connections */}
                    <svg 
                      className="absolute inset-0 pointer-events-none overflow-visible" 
                      style={{ 
                        zIndex: 1,
                        width: '100%',
                        height: '100%'
                      }}
                    >
                      {array.slice(0, heapSize).map((_, index) => {
                        const leftChild = 2 * index + 1;
                        const rightChild = 2 * index + 2;
                        const connections = [];
                        
                        const parentPos = getTreePosition(index, heapSize);
                        const parentX = (parentPos.position - parentPos.maxPositions / 2) * 80 + 320;
                        const parentY = parentPos.level * 70 + 160;
                        
                        if (leftChild < heapSize) {
                          const childPos = getTreePosition(leftChild, heapSize);
                          const childX = (childPos.position - childPos.maxPositions / 2) * 80 + 320;
                          const childY = childPos.level * 70 + 160;
                          
                          connections.push(
                            <line
                              key={`${index}-${leftChild}`}
                              x1={parentX}
                              y1={parentY + 20}
                              x2={childX}
                              y2={childY - 20}
                              stroke="#64748b"
                              strokeWidth="2"
                            />
                          );
                        }
                        
                        if (rightChild < heapSize) {
                          const childPos = getTreePosition(rightChild, heapSize);
                          const childX = (childPos.position - childPos.maxPositions / 2) * 80 + 320;
                          const childY = childPos.level * 70 + 160;
                          
                          connections.push(
                            <line
                              key={`${index}-${rightChild}`}
                              x1={parentX}
                              y1={parentY + 20}
                              x2={childX}
                              y2={childY - 20}
                              stroke="#64748b"
                              strokeWidth="2"
                            />
                          );
                        }
                        
                        return connections;
                      })}
                    </svg>
                    
                    {/* Tree nodes */}
                    {array.slice(0, heapSize).map((item, index) => {
                      const pos = getTreePosition(index, heapSize);
                      const x = (pos.position - pos.maxPositions / 2) * 80 + 320;
                      const y = pos.level * 70 + 160;
                      
                      return (
                        <motion.div
                          key={item.id}
                          className={cn(
                            "absolute w-10 h-10 flex items-center justify-center text-white font-bold text-sm rounded-full border-2 transition-all duration-300 select-none pointer-events-none",
                            item.isSorted 
                              ? "bg-green-500 border-green-400" 
                              : item.isSwapping
                              ? "bg-red-500 border-red-400"
                              : item.isComparing
                              ? "bg-yellow-500 border-yellow-400"
                              : item.isActive
                              ? "bg-blue-500 border-blue-400"
                              : item.isHeapified
                              ? "bg-purple-500 border-purple-400"
                              : "bg-slate-600 border-slate-500"
                          )}
                          style={{
                            left: `${x - 20}px`,
                            top: `${y - 20}px`,
                            zIndex: 2
                          }}
                          animate={{
                            scale: item.isComparing || item.isSwapping || item.isActive ? 1.2 : 1,
                          }}
                        >
                          {item.value}
                        </motion.div>
                      );
                    })}
                  </div>
                  
                  {/* Pan instructions */}
                  <div className="absolute bottom-2 right-2 text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded pointer-events-none">
                    Click & drag to pan
                  </div>
                  
                  {/* Reset pan button */}
                  <button
                    onClick={() => setPanOffset({ x: 0, y: 0 })}
                    className="absolute top-2 right-2 text-xs text-slate-300 bg-slate-700 hover:bg-slate-600 px-2 py-1 rounded transition-colors"
                  >
                    Reset View
                  </button>
                </div>
              </div>
            </div>

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
                        {isPaused ? 'Resume' : 'Start Sort'}
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={resetSort}
                    disabled={isPlaying}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 disabled:bg-slate-600 text-white disabled:text-slate-400 rounded-md font-medium transition-colors"
                  >
                    <RotateCcw size={16} />
                    Reset
                  </button>
                  
                  <button
                    onClick={generateRandomArray}
                    disabled={isPlaying}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 disabled:bg-slate-600 text-white disabled:text-slate-400 rounded-md font-medium transition-colors"
                  >
                    <Shuffle size={16} />
                    Random
                  </button>
                </div>

                {/* Speed Control */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Animation Speed: {Math.round(1000 / speed * 10) / 10}x
                  </label>
                  <input
                    type="range"
                    min="100"
                    max="1000"
                    step="50"
                    value={1100 - speed}
                    onChange={(e) => setSpeed(1100 - parseInt(e.target.value))}
                    disabled={isPlaying}
                    className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>Slow</span>
                    <span>Fast</span>
                  </div>
                </div>

                {/* Legend */}
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-slate-300 mb-3">Color Legend</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                      <span className="text-slate-400">Comparing</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded"></div>
                      <span className="text-slate-400">Swapping</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded"></div>
                      <span className="text-slate-400">Active</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-purple-500 rounded"></div>
                      <span className="text-slate-400">Heapified</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-orange-500 rounded"></div>
                      <span className="text-slate-400">Extracted</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded"></div>
                      <span className="text-slate-400">Sorted</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Code Panel */}
          <div className="space-y-6">
            <CodeHighlighter
              code={HEAP_SORT_CODE}
              language="javascript"
              title="Heap Sort Algorithm"
              steps={CODE_STEPS.heapSort}
              currentStep={currentStep}
            />
          </div>
        </div>

        {/* Information Section */}
        <div className="mt-12 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
              About Heap Sort
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Heap sort is a comparison-based sorting algorithm that uses a binary heap data structure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Time Complexity */}
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
              <h3 className="text-xl font-semibold text-slate-100 mb-4">Time Complexity</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Best Case:</span>
                  <span className="text-green-400 font-mono">O(n log n)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Average Case:</span>
                  <span className="text-yellow-400 font-mono">O(n log n)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Worst Case:</span>
                  <span className="text-red-400 font-mono">O(n log n)</span>
                </div>
              </div>
              <p className="text-slate-400 text-sm mt-4">
                Heap sort has consistent O(n log n) performance in all cases.
              </p>
            </div>

            {/* Space Complexity */}
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
              <h3 className="text-xl font-semibold text-slate-100 mb-4">Space Complexity</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Space Used:</span>
                  <span className="text-green-400 font-mono">O(1)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">In-Place:</span>
                  <span className="text-green-400">Yes</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Stable:</span>
                  <span className="text-red-400">No</span>
                </div>
              </div>
              <p className="text-slate-400 text-sm mt-4">
                Heap sort sorts in-place with constant extra space.
              </p>
            </div>

            {/* Key Features */}
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
              <h3 className="text-xl font-semibold text-slate-100 mb-4">Key Features</h3>
              <ul className="space-y-2 text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">✓</span>
                  <span className="text-sm">Consistent O(n log n) performance</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">✓</span>
                  <span className="text-sm">In-place sorting algorithm</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">✓</span>
                  <span className="text-sm">Uses heap data structure</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">×</span>
                  <span className="text-sm">Not stable</span>
                </li>
              </ul>
            </div>
          </div>

          {/* How It Works */}
          <div className="mt-12 bg-slate-800 rounded-2xl p-8 border border-slate-700">
            <h3 className="text-2xl font-semibold text-slate-100 mb-6">How Heap Sort Works</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-slate-200">Phase 1: Build Max Heap</h4>
                <ol className="space-y-2 text-slate-300 list-decimal list-inside">
                  <li>Start from the last non-leaf node</li>
                  <li>Heapify each node from bottom to top</li>
                  <li>Ensure parent nodes are larger than children</li>
                  <li>Result: Maximum element is at the root</li>
                </ol>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-slate-200">Phase 2: Extract Elements</h4>
                <ol className="space-y-2 text-slate-300 list-decimal list-inside">
                  <li>Move root (maximum) to end of array</li>
                  <li>Reduce heap size by one</li>
                  <li>Heapify the new root</li>
                  <li>Repeat until heap size is 1</li>
                </ol>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-slate-700 rounded-lg">
              <p className="text-slate-300 text-sm">
                <strong className="text-slate-100">Pro Tip:</strong> Heap sort is particularly useful when you need 
                guaranteed O(n log n) performance and can't afford the worst-case O(n²) of quicksort. 
                It's also great for systems with limited memory due to its O(1) space complexity.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
} 