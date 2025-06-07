'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Shuffle } from 'lucide-react';
import CodeHighlighter from '../ui/CodeHighlighter';
import { cn, delay } from '../../lib/utils';

interface ArrayElement {
  value: number;
  id: string;
  isComparing?: boolean;
  isMerging?: boolean;
  isSorted?: boolean;
  isActive?: boolean;
  isDividing?: boolean;
  level?: number;
  leftChild?: boolean;
  rightChild?: boolean;
}

const MERGE_SORT_CODE = `function mergeSort(array) {
  // Base case: arrays with 0 or 1 element are already sorted
  if (array.length <= 1) {
    return array;
  }
  
  // Divide: split array into two halves
  const middle = Math.floor(array.length / 2);
  const left = array.slice(0, middle);
  const right = array.slice(middle);
  
  // Conquer: recursively sort both halves
  const sortedLeft = mergeSort(left);
  const sortedRight = mergeSort(right);
  
  // Combine: merge the sorted halves
  return merge(sortedLeft, sortedRight);
}

function merge(left, right) {
  let result = [];
  let leftIndex = 0;
  let rightIndex = 0;
  
  // Compare elements and merge in sorted order
  while (leftIndex < left.length && rightIndex < right.length) {
    if (left[leftIndex] <= right[rightIndex]) {
      result.push(left[leftIndex]);
      leftIndex++;
    } else {
      result.push(right[rightIndex]);
      rightIndex++;
    }
  }
  
  // Add remaining elements from left array
  while (leftIndex < left.length) {
    result.push(left[leftIndex]);
    leftIndex++;
  }
  
  // Add remaining elements from right array
  while (rightIndex < right.length) {
    result.push(right[rightIndex]);
    rightIndex++;
  }
  
  return result;
}`;

const CODE_STEPS = {
  mergeSort: [
    { lines: [2, 3, 4], description: "Check base case: arrays with 0 or 1 element are already sorted" },
    { lines: [7, 8, 9], description: "Divide: split array into two halves at middle point" },
    { lines: [11, 12], description: "Conquer: recursively sort both halves" },
    { lines: [14], description: "Combine: merge the sorted halves together" },
    { lines: [17, 18, 19, 20], description: "Initialize merge process with pointers and result array" },
    { lines: [22, 23, 24, 25, 26, 27, 28, 29], description: "Compare elements and merge in sorted order" },
    { lines: [31, 32, 33, 34], description: "Add remaining elements from left array" },
    { lines: [36, 37, 38, 39], description: "Add remaining elements from right array" },
    { lines: [41], description: "Return merged result array" }
  ]
};

export default function MergeSortVisualizer() {
  const [array, setArray] = useState<ArrayElement[]>([
    { value: 64, id: '1' },
    { value: 34, id: '2' },
    { value: 25, id: '3' },
    { value: 12, id: '4' },
    { value: 22, id: '5' },
    { value: 11, id: '6' },
    { value: 90, id: '7' },
    { value: 88, id: '8' }
  ]);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [speed, setSpeed] = useState(800);
  const [comparisons, setComparisons] = useState(0);
  const [merges, setMerges] = useState(0);
  const [recursionDepth, setRecursionDepth] = useState(0);
  const [currentOperation, setCurrentOperation] = useState('');
  const [mergeLevels, setMergeLevels] = useState<ArrayElement[][]>([]);

  const generateId = () => Math.random().toString(36).substr(2, 9);

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
  }, []);

  const resetSort = useCallback(() => {
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentStep(0);
    setIsComplete(false);
    setComparisons(0);
    setMerges(0);
    setRecursionDepth(0);
    setCurrentOperation('');
    setMergeLevels([]);
    setArray(prev => prev.map(item => ({
      ...item,
      isComparing: false,
      isMerging: false,
      isSorted: false,
      isActive: false,
      isDividing: false,
      level: undefined,
      leftChild: false,
      rightChild: false
    })));
  }, []);

  const merge = async (left: ArrayElement[], right: ArrayElement[], startIndex: number) => {
    const result: ArrayElement[] = [];
    let leftIndex = 0;
    let rightIndex = 0;
    let totalComparisons = comparisons;
    
    setCurrentStep(4);
    setCurrentOperation(`Merging arrays [${left.map(el => el.value).join(', ')}] and [${right.map(el => el.value).join(', ')}]`);
    await delay(speed);

    // Highlight elements being merged
    setArray(prev => prev.map(item => ({
      ...item,
      isMerging: [...left, ...right].some(el => el.id === item.id),
      isActive: [...left, ...right].some(el => el.id === item.id)
    })));

    setCurrentStep(5);
    await delay(speed);

    while (leftIndex < left.length && rightIndex < right.length) {
      totalComparisons++;
      setComparisons(totalComparisons);
      
      // Highlight elements being compared
      setArray(prev => prev.map(item => ({
        ...item,
        isComparing: item.id === left[leftIndex].id || item.id === right[rightIndex].id
      })));

      await delay(speed);

      if (left[leftIndex].value <= right[rightIndex].value) {
        result.push({ ...left[leftIndex], isSorted: true });
        leftIndex++;
      } else {
        result.push({ ...right[rightIndex], isSorted: true });
        rightIndex++;
      }
      
      await delay(speed);
    }

    // Add remaining elements
    setCurrentStep(6);
    while (leftIndex < left.length) {
      result.push({ ...left[leftIndex], isSorted: true });
      leftIndex++;
    }

    setCurrentStep(7);
    while (rightIndex < right.length) {
      result.push({ ...right[rightIndex], isSorted: true });
      rightIndex++;
    }

    // Update the main array with merged result
    setArray(prev => {
      const newArray = [...prev];
      result.forEach((item, idx) => {
        if (startIndex + idx < newArray.length) {
          newArray[startIndex + idx] = { ...item, isMerging: false, isComparing: false };
        }
      });
      return newArray;
    });

    setMerges(prev => prev + 1);
    setCurrentStep(8);
    await delay(speed);

    return result;
  };

  const mergeSortRecursive = async (arr: ArrayElement[], startIndex: number, level: number = 0): Promise<ArrayElement[]> => {
    // Update recursion depth
    setRecursionDepth(Math.max(recursionDepth, level + 1));
    
    // Base case
    if (arr.length <= 1) {
      setCurrentStep(0);
      setCurrentOperation(`Base case: array of length ${arr.length} is already sorted`);
      
      setArray(prev => prev.map(item => ({
        ...item,
        isSorted: arr.some(el => el.id === item.id) ? true : item.isSorted,
        level: arr.some(el => el.id === item.id) ? level : item.level
      })));
      
      await delay(speed);
      return arr;
    }

    setCurrentStep(1);
    setCurrentOperation(`Dividing array [${arr.map(el => el.value).join(', ')}] at level ${level}`);
    
    // Highlight elements being divided
    setArray(prev => prev.map(item => ({
      ...item,
      isDividing: arr.some(el => el.id === item.id),
      level: arr.some(el => el.id === item.id) ? level : item.level
    })));
    
    await delay(speed);

    // Divide
    const middle = Math.floor(arr.length / 2);
    const left = arr.slice(0, middle);
    const right = arr.slice(middle);

    // Mark left and right children
    setArray(prev => prev.map(item => ({
      ...item,
      leftChild: left.some(el => el.id === item.id),
      rightChild: right.some(el => el.id === item.id),
      isDividing: false
    })));

    await delay(speed);

    setCurrentStep(2);
    setCurrentOperation('Recursively sorting left and right halves');
    
    // Conquer - recursively sort both halves
    const sortedLeft = await mergeSortRecursive(left, startIndex, level + 1);
    const sortedRight = await mergeSortRecursive(right, startIndex + middle, level + 1);

    setCurrentStep(3);
    // Combine - merge the sorted halves
    const result = await merge(sortedLeft, sortedRight, startIndex);
    
    // Clear child markings for this level
    setArray(prev => prev.map(item => ({
      ...item,
      leftChild: false,
      rightChild: false,
      isActive: false
    })));

    return result;
  };

  const mergeSort = useCallback(async () => {
    setIsPlaying(true);
    setIsComplete(false);
    setCurrentOperation('Starting merge sort...');
    
    const arr = [...array];
    
    try {
      const sortedArray = await mergeSortRecursive(arr, 0, 0);
      
      // Mark all elements as sorted
      setArray(prev => prev.map(item => ({ 
        ...item, 
        isSorted: true,
        isActive: false,
        isComparing: false,
        isMerging: false,
        isDividing: false,
        leftChild: false,
        rightChild: false
      })));
      
      setIsComplete(true);
      setCurrentOperation('Merge sort completed!');
      setCurrentStep(8);
    } catch (error) {
      console.error('Error during merge sort:', error);
    }
    
    setIsPlaying(false);
  }, [array, speed, comparisons, recursionDepth]);

  const handlePlayPause = () => {
    if (isComplete) {
      resetSort();
      return;
    }
    
    if (isPlaying) {
      setIsPlaying(false);
      setIsPaused(true);
    } else {
      mergeSort();
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-100 mb-2">Merge Sort Visualizer</h1>
          <p className="text-slate-400 text-lg">
            Interactive visualization of merge sort algorithm using divide-and-conquer approach
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[7fr_3fr] gap-8">
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
                            "w-12 flex items-center justify-center text-white font-bold text-sm rounded-lg border-2 transition-all duration-300 relative",
                            item.isSorted 
                              ? "bg-green-500 border-green-400 shadow-green-400/25" 
                              : item.isMerging
                              ? "bg-blue-500 border-blue-400 shadow-blue-400/25"
                              : item.isComparing
                              ? "bg-yellow-500 border-yellow-400 shadow-yellow-400/25"
                              : item.isDividing
                              ? "bg-purple-500 border-purple-400 shadow-purple-400/25"
                              : item.leftChild
                              ? "bg-orange-500 border-orange-400 shadow-orange-400/25"
                              : item.rightChild
                              ? "bg-pink-500 border-pink-400 shadow-pink-400/25"
                              : item.isActive
                              ? "bg-red-500 border-red-400 shadow-red-400/25"
                              : "bg-slate-600 border-slate-500"
                          )}
                          style={{ height: `${item.value * 3 + 20}px` }}
                          animate={{
                            scale: item.isComparing || item.isMerging || item.isDividing ? 1.1 : 1,
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          {item.value}
                          {item.level !== undefined && (
                            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-slate-300 bg-slate-700 px-1 rounded">
                              L{item.level}
                            </div>
                          )}
                        </motion.div>
                        <span className="text-xs text-slate-400">[{index}]</span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
                
                <div className="text-sm text-slate-400 text-center mt-6 space-y-2">
                  <div>Recursion Depth: {recursionDepth} | Comparisons: {comparisons} | Merges: {merges}</div>
                  <div className="text-xs text-slate-500 max-w-2xl mx-auto">
                    {currentOperation}
                  </div>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
              <h3 className="text-lg font-semibold text-slate-100 mb-4">Color Legend</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded border"></div>
                  <span className="text-slate-300">Sorted</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded border"></div>
                  <span className="text-slate-300">Merging</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-500 rounded border"></div>
                  <span className="text-slate-300">Comparing</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-purple-500 rounded border"></div>
                  <span className="text-slate-300">Dividing</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-orange-500 rounded border"></div>
                  <span className="text-slate-300">Left Half</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-pink-500 rounded border"></div>
                  <span className="text-slate-300">Right Half</span>
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
                    max="1200"
                    step="100"
                    value={1400 - speed}
                    onChange={(e) => setSpeed(1400 - parseInt(e.target.value))}
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
              code={MERGE_SORT_CODE}
              language="javascript"
              title="Merge Sort Algorithm"
              steps={CODE_STEPS.mergeSort}
              currentStep={currentStep}
            />
          </div>
        </div>

        {/* Information Section */}
        <div className="mt-12 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
              About Merge Sort
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Discover the power of divide-and-conquer with merge sort, one of the most efficient and stable sorting algorithms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Time Complexity */}
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
              <h3 className="text-xl font-bold text-slate-100 mb-4">Time Complexity</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Best Case:</span>
                  <span className="font-mono text-green-400">O(n log n)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Average Case:</span>
                  <span className="font-mono text-yellow-400">O(n log n)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Worst Case:</span>
                  <span className="font-mono text-red-400">O(n log n)</span>
                </div>
              </div>
            </div>

            {/* Space Complexity */}
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
              <h3 className="text-xl font-bold text-slate-100 mb-4">Space Complexity</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Space Required:</span>
                  <span className="font-mono text-blue-400">O(n)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Stable:</span>
                  <span className="text-green-400">Yes</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">In-Place:</span>
                  <span className="text-red-400">No</span>
                </div>
              </div>
            </div>

            {/* Algorithm Properties */}
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
              <h3 className="text-xl font-bold text-slate-100 mb-4">Key Features</h3>
              <ul className="space-y-2 text-slate-300">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  Divide-and-conquer approach
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  Consistent O(n log n) performance
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  Stable sorting algorithm
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  Excellent for large datasets
                </li>
              </ul>
            </div>
          </div>

          {/* Algorithm Description */}
          <div className="mt-8 bg-slate-800 rounded-2xl p-8 border border-slate-700">
            <h3 className="text-2xl font-bold text-slate-100 mb-6">How Merge Sort Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">1</span>
                </div>
                <h4 className="text-lg font-semibold text-slate-100 mb-2">Divide</h4>
                <p className="text-slate-400 text-sm">
                  Recursively divide the array into smaller subarrays until each contains only one element.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">2</span>
                </div>
                <h4 className="text-lg font-semibold text-slate-100 mb-2">Conquer</h4>
                <p className="text-slate-400 text-sm">
                  Recursively sort the subarrays. Arrays with one element are already sorted.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">3</span>
                </div>
                <h4 className="text-lg font-semibold text-slate-100 mb-2">Combine</h4>
                <p className="text-slate-400 text-sm">
                  Merge the sorted subarrays back together in sorted order to produce the final result.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 