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
  isPivot?: boolean;
  isLeft?: boolean;
  isRight?: boolean;
  isComparing?: boolean;
  isSwapping?: boolean;
  isSorted?: boolean;
  isPartition?: boolean;
  partitionSide?: 'left' | 'right';
}

const QUICK_SORT_CODE = `function quickSort(array, low, high) {
  if (low < high) {
    // Partition the array and get pivot index
    const pivotIndex = partition(array, low, high);
    
    // Recursively sort elements before partition
    quickSort(array, low, pivotIndex - 1);
    
    // Recursively sort elements after partition
    quickSort(array, pivotIndex + 1, high);
  }
}

function partition(array, low, high) {
  // Choose the rightmost element as pivot
  const pivot = array[high];
  let i = low - 1; // Index of smaller element
  
  for (let j = low; j < high; j++) {
    // If current element is smaller than pivot
    if (array[j] < pivot) {
      i++; // Increment index of smaller element
      [array[i], array[j]] = [array[j], array[i]]; // Swap
    }
  }
  
  // Place pivot in correct position
  [array[i + 1], array[high]] = [array[high], array[i + 1]];
  return i + 1; // Return pivot index
}`;

const CODE_STEPS = {
  quickSort: [
    { lines: [1, 2], description: "Check if partition is valid (low < high)" },
    { lines: [3, 4], description: "Partition array and get pivot index" },
    { lines: [6, 7], description: "Recursively sort left partition" },
    { lines: [9, 10], description: "Recursively sort right partition" },
    { lines: [15, 16], description: "Choose rightmost element as pivot" },
    { lines: [17], description: "Initialize index for smaller elements" },
    { lines: [19, 20], description: "Iterate through array elements" },
    { lines: [21, 22], description: "Compare current element with pivot" },
    { lines: [23, 24, 25], description: "Swap elements if current < pivot" },
    { lines: [29, 30], description: "Place pivot in correct position" },
    { lines: [31], description: "Return pivot index" }
  ]
};

export default function QuickSortVisualizer() {
  const [array, setArray] = useState<ArrayElement[]>([
    { value: 64, id: '1' },
    { value: 34, id: '2' },
    { value: 25, id: '3' },
    { value: 12, id: '4' },
    { value: 22, id: '5' },
    { value: 11, id: '6' },
    { value: 90, id: '7' },
    { value: 76, id: '8' }
  ]);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentLow, setCurrentLow] = useState(0);
  const [currentHigh, setCurrentHigh] = useState(0);
  const [currentI, setCurrentI] = useState(-1);
  const [currentJ, setCurrentJ] = useState(0);
  const [pivotIndex, setPivotIndex] = useState(-1);
  const [isComplete, setIsComplete] = useState(false);
  const [speed, setSpeed] = useState(800);
  const [comparisons, setComparisons] = useState(0);
  const [swaps, setSwaps] = useState(0);
  const [recursionDepth, setRecursionDepth] = useState(0);

  // Add cancellation ref for pause functionality
  const cancelRef = useRef(false);

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
    setCurrentLow(0);
    setCurrentHigh(0);
    setCurrentI(-1);
    setCurrentJ(0);
    setPivotIndex(-1);
    setIsComplete(false);
    setComparisons(0);
    setSwaps(0);
    setRecursionDepth(0);
    setArray(prev => prev.map(item => ({
      ...item,
      isPivot: false,
      isLeft: false,
      isRight: false,
      isComparing: false,
      isSwapping: false,
      isSorted: false,
      isPartition: false,
      partitionSide: undefined
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

  const partition = useCallback(async (arr: ArrayElement[], low: number, high: number): Promise<number> => {
    const pivot = arr[high];
    let i = low - 1;
    
    setCurrentLow(low);
    setCurrentHigh(high);
    setPivotIndex(high);
    
    // Step 4: Choose pivot
    setCurrentStep(4);
    setArray(prev => prev.map((item, idx) => ({
      ...item,
      isPivot: idx === high,
      isPartition: idx >= low && idx <= high,
      partitionSide: idx < high ? 'left' : undefined,
      isLeft: false,
      isRight: false,
      isComparing: false,
      isSwapping: false
    })));
    await cancellableDelay(speed);
    
    // Step 5: Initialize i
    setCurrentStep(5);
    setCurrentI(i);
    await cancellableDelay(speed);
    
    for (let j = low; j < high; j++) {
      setCurrentJ(j);
      
      // Step 6: Iterate through array
      setCurrentStep(6);
      await cancellableDelay(speed);
      
      // Step 7: Compare with pivot
      setCurrentStep(7);
      setArray(prev => prev.map((item, idx) => ({
        ...item,
        isComparing: idx === j,
        isLeft: idx === i + 1,
        isRight: idx === j
      })));
      
      const totalComparisons = comparisons + 1;
      setComparisons(totalComparisons);
      await cancellableDelay(speed);
      
      if (arr[j].value < pivot.value) {
        i++;
        setCurrentI(i);
        
        // Step 8: Swap elements
        setCurrentStep(8);
        setArray(prev => prev.map((item, idx) => ({
          ...item,
          isSwapping: idx === i || idx === j,
          isComparing: false,
          isLeft: idx === i,
          isRight: idx === j
        })));
        
        await cancellableDelay(speed);
        
        // Perform swap
        [arr[i], arr[j]] = [arr[j], arr[i]];
        const totalSwaps = swaps + 1;
        setSwaps(totalSwaps);
        
        // Update array with swapped values
        setArray(prev => {
          const newArr = [...prev];
          [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
          return newArr.map((item, idx) => ({
            ...item,
            isSwapping: idx === i || idx === j,
            isLeft: idx === i,
            isRight: idx === j
          }));
        });
        
        await cancellableDelay(speed);
      }
      
      // Clear highlighting
      setArray(prev => prev.map((item, idx) => ({
        ...item,
        isComparing: false,
        isSwapping: false,
        isLeft: false,
        isRight: false,
        isPivot: idx === high,
        isPartition: idx >= low && idx <= high
      })));
    }
    
    // Step 9: Place pivot in correct position
    setCurrentStep(9);
    const pivotPos = i + 1;
    setArray(prev => prev.map((item, idx) => ({
      ...item,
      isSwapping: idx === pivotPos || idx === high,
      isPivot: idx === high
    })));
    
    await cancellableDelay(speed);
    
    // Perform final swap
    [arr[pivotPos], arr[high]] = [arr[high], arr[pivotPos]];
    const totalSwaps = swaps + 1;
    setSwaps(totalSwaps);
    
    // Update array and mark pivot as sorted
    setArray(prev => {
      const newArr = [...prev];
      [newArr[pivotPos], newArr[high]] = [newArr[high], newArr[pivotPos]];
      return newArr.map((item, idx) => ({
        ...item,
        isSorted: idx === pivotPos,
        isSwapping: false,
        isPivot: false,
        isPartition: false,
        partitionSide: undefined
      }));
    });
    
    await cancellableDelay(speed);
    
    // Step 10: Return pivot index
    setCurrentStep(10);
    setPivotIndex(pivotPos);
    await cancellableDelay(speed);
    
    return pivotPos;
  }, [speed, comparisons, swaps]);

  const quickSortRecursive = useCallback(async (arr: ArrayElement[], low: number, high: number, depth: number = 0): Promise<void> => {
    if (low >= high) return;
    
    setRecursionDepth(depth);
    
    // Step 0: Check if partition is valid
    setCurrentStep(0);
    setCurrentLow(low);
    setCurrentHigh(high);
    
    // Highlight current partition
    setArray(prev => prev.map((item, idx) => ({
      ...item,
      isPartition: idx >= low && idx <= high && !item.isSorted,
      partitionSide: idx >= low && idx <= high ? 'left' : undefined
    })));
    
    await cancellableDelay(speed);
    
    // Step 1: Partition array
    setCurrentStep(1);
    const pivotIndex = await partition(arr, low, high);
    
    // Step 2: Recursively sort left partition
    if (low < pivotIndex - 1) {
      setCurrentStep(2);
      setArray(prev => prev.map((item, idx) => ({
        ...item,
        isPartition: idx >= low && idx < pivotIndex && !item.isSorted,
        partitionSide: idx >= low && idx < pivotIndex ? 'left' : undefined
      })));
      await cancellableDelay(speed);
      
      await quickSortRecursive(arr, low, pivotIndex - 1, depth + 1);
    }
    
    // Step 3: Recursively sort right partition
    if (pivotIndex + 1 < high) {
      setCurrentStep(3);
      setArray(prev => prev.map((item, idx) => ({
        ...item,
        isPartition: idx > pivotIndex && idx <= high && !item.isSorted,
        partitionSide: idx > pivotIndex && idx <= high ? 'right' : undefined
      })));
      await cancellableDelay(speed);
      
      await quickSortRecursive(arr, pivotIndex + 1, high, depth + 1);
    }
    
    // Mark elements in current partition as sorted if this is the final call
    if (depth === 0) {
      setArray(prev => prev.map((item, idx) => ({
        ...item,
        isSorted: true,
        isPartition: false,
        partitionSide: undefined
      })));
    }
  }, [speed, partition]);

  const quickSort = useCallback(async () => {
    try {
      cancelRef.current = false;
      setIsPlaying(true);
      setIsComplete(false);
      
      const arr = [...array];
      const totalComparisons = 0;
      const totalSwaps = 0;
      setComparisons(totalComparisons);
      setSwaps(totalSwaps);

      await quickSortRecursive(arr, 0, arr.length - 1);

      setIsComplete(true);
      setIsPlaying(false);
      setCurrentStep(10);
      showSuccess(`Quick sort completed! ${comparisons} comparisons, ${swaps} swaps`);
    } catch (error) {
      // Handle cancellation gracefully
      if (error instanceof Error && error.message === 'Cancelled') {
        setIsPlaying(false);
        setIsPaused(true);
        return;
      }
      throw error;
    }
  }, [array, quickSortRecursive, comparisons, swaps, showSuccess]);

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
      quickSort();
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-100 mb-2">Quick Sort Visualizer</h1>
          <p className="text-slate-400 text-lg">
            Interactive visualization of quick sort algorithm with divide-and-conquer approach
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[5fr_3fr] gap-8">
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
                              ? "bg-green-500 border-green-400 shadow-lg shadow-green-400/25" 
                              : item.isPivot
                              ? "bg-purple-500 border-purple-400 shadow-lg shadow-purple-400/25"
                              : item.isSwapping
                              ? "bg-red-500 border-red-400 shadow-lg shadow-red-400/25"
                              : item.isComparing
                              ? "bg-yellow-500 border-yellow-400 shadow-lg shadow-yellow-400/25"
                              : item.isLeft
                              ? "bg-blue-500 border-blue-400 shadow-lg shadow-blue-400/25"
                              : item.isRight
                              ? "bg-cyan-500 border-cyan-400 shadow-lg shadow-cyan-400/25"
                              : item.isPartition && item.partitionSide === 'left'
                              ? "bg-indigo-500/60 border-indigo-400 shadow-lg shadow-indigo-400/25"
                              : item.isPartition && item.partitionSide === 'right'
                              ? "bg-pink-500/60 border-pink-400 shadow-lg shadow-pink-400/25"
                              : item.isPartition
                              ? "bg-slate-500 border-slate-400 shadow-lg shadow-slate-400/25"
                              : "bg-slate-600 border-slate-500"
                          )}
                          style={{ height: `${item.value * 2.5 + 20}px` }}
                          animate={{
                            scale: item.isComparing || item.isSwapping || item.isPivot ? 1.1 : 1,
                            rotateY: item.isSwapping ? 180 : 0,
                          }}
                          transition={{ 
                            duration: 0.3,
                            type: "spring",
                            stiffness: 300,
                            damping: 20
                          }}
                        >
                          {item.value}
                        </motion.div>
                        <span className="text-xs text-slate-400">[{index}]</span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
                
                {/* Legend */}
                <div className="flex flex-wrap justify-center gap-4 mt-6 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-purple-500 rounded"></div>
                    <span className="text-slate-300">Pivot</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                    <span className="text-slate-300">Comparing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                    <span className="text-slate-300">Swapping</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-indigo-500 rounded"></div>
                    <span className="text-slate-300">Left Partition</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-pink-500 rounded"></div>
                    <span className="text-slate-300">Right Partition</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span className="text-slate-300">Sorted</span>
                  </div>
                </div>
                
                <div className="text-sm text-slate-400 text-center mt-6 space-y-2">
                  <div>Partition: [{currentLow}, {currentHigh}] | Pivot Index: {pivotIndex >= 0 ? pivotIndex : 'N/A'}</div>
                  <div>i: {currentI >= 0 ? currentI : 'N/A'} | j: {currentJ} | Recursion Depth: {recursionDepth}</div>
                  <div>Comparisons: {comparisons} | Swaps: {swaps}</div>
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
                    min="200"
                    max="1000"
                    step="50"
                    value={1200 - speed}
                    onChange={(e) => setSpeed(1200 - parseInt(e.target.value))}
                    disabled={isPlaying}
                    className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>Slow</span>
                    <span>Fast</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Code Panel */}
          <div className="space-y-6">
            <CodeHighlighter
              code={QUICK_SORT_CODE}
              language="javascript"
              title="Quick Sort Algorithm"
              steps={CODE_STEPS.quickSort}
              currentStep={currentStep}
            />
          </div>
        </div>

        {/* Information Section */}
        <div className="mt-12 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
              About Quick Sort
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Understanding the divide-and-conquer approach, partitioning strategy, and complexity analysis of quick sort
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            
            {/* What is Quick Sort - Takes more space */}
            <div className="xl:col-span-2 bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 border border-slate-700/50 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-100">What is Quick Sort?</h3>
              </div>
              
              <p className="text-slate-300 mb-8 leading-relaxed text-lg">
                Quick Sort is a highly efficient divide-and-conquer sorting algorithm. It works by selecting a 'pivot' 
                element and partitioning the array around it, ensuring all elements smaller than the pivot come before it 
                and all larger elements come after. The algorithm then recursively applies the same process to the sub-arrays.
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
                      <span>Average O(n log n) time complexity</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                      <span>In-place sorting (O(log n) space)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                      <span>Cache-efficient due to good locality</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                      <span>Often faster than other O(n log n) algorithms</span>
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
                      <span>Worst case O(n²) time complexity</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                      <span>Not stable (doesn't preserve relative order)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                      <span>Performance depends on pivot selection</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                      <span>Recursive overhead</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Properties Card */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 border border-slate-700/50 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-pink-500/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-100">Properties</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
                  <span className="text-slate-400 font-medium">Type:</span>
                  <span className="text-slate-200 font-semibold">Divide & Conquer</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
                  <span className="text-slate-400 font-medium">Stability:</span>
                  <span className="text-slate-200 font-semibold">Unstable</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
                  <span className="text-slate-400 font-medium">Best Case:</span>
                  <span className="text-green-400 font-mono font-bold">O(n log n)</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
                  <span className="text-slate-400 font-medium">Average Case:</span>
                  <span className="text-blue-400 font-mono font-bold">O(n log n)</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
                  <span className="text-slate-400 font-medium">Worst Case:</span>
                  <span className="text-red-400 font-mono font-bold">O(n²)</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-slate-400 font-medium">Space:</span>
                  <span className="text-blue-400 font-mono font-bold">O(log n)</span>
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
                <h3 className="text-xl font-bold text-slate-100">When to Use</h3>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                {[
                  {title: "General Purpose Sorting", desc: "Most common sorting algorithm in practice" },
                  {title: "Large Datasets", desc: "Excellent performance on large arrays" },
                  {title: "Memory Constrained", desc: "In-place sorting with minimal extra space" },
                  {title: "Random Data", desc: "Performs well on randomly distributed data" },
                  {title: "System Sort Functions", desc: "Used in many standard library implementations" }
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

            {/* Algorithm Steps */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 border border-slate-700/50 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-100">Algorithm Steps</h3>
              </div>
              
              <div className="space-y-4">
                {[
                  { step: 1, title: "Choose Pivot", desc: "Select an element as the pivot (usually last)" },
                  { step: 2, title: "Partition", desc: "Rearrange array around pivot element" },
                  { step: 3, title: "Place Pivot", desc: "Put pivot in its final sorted position" },
                  { step: 4, title: "Divide", desc: "Split array into two sub-arrays" },
                  { step: 5, title: "Conquer", desc: "Recursively sort both sub-arrays" }
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 bg-slate-700/30 rounded-xl border border-slate-600/30">
                    <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-orange-400 font-bold text-sm">{item.step}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-100 mb-1">{item.title}</h4>
                      <p className="text-slate-400 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}