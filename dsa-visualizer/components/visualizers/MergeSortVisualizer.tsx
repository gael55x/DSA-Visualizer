'use client';

import { useState, useCallback, useRef } from 'react';
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
    { lines: [3, 4], description: "Check base case: arrays with 0 or 1 element are already sorted" },
    { lines: [8, 9, 10], description: "Divide: split array into two halves at middle point" },
    { lines: [13, 14], description: "Conquer: recursively sort both halves" },
    { lines: [17], description: "Combine: merge the sorted halves together" },
    { lines: [21, 22, 23], description: "Initialize merge process with pointers and result array" },
    { lines: [26, 27, 28, 29, 30, 31, 32, 33, 34], description: "Compare elements and merge in sorted order" },
    { lines: [37, 38, 39, 40], description: "Add remaining elements from left array" },
    { lines: [43, 44, 45, 46], description: "Add remaining elements from right array" },
    { lines: [48], description: "Return merged result array" }
  ]
};

export default function MergeSortVisualizer() {
  const [array, setArray] = useState<ArrayElement[]>([
    { value: 64, id: 'element-0' },
    { value: 34, id: 'element-1' },
    { value: 25, id: 'element-2' },
    { value: 12, id: 'element-3' },
    { value: 22, id: 'element-4' },
    { value: 11, id: 'element-5' },
    { value: 90, id: 'element-6' },
    { value: 88, id: 'element-7' }
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

  // Add cancellation ref for pause functionality
  const cancelRef = useRef(false);

  const generateId = (index: number) => `element-${index}-${Date.now()}`;

  const generateRandomArray = useCallback(() => {
    const newArray = [];
    for (let i = 0; i < 8; i++) {
      newArray.push({
        value: Math.floor(Math.random() * 100) + 1,
        id: generateId(i)
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

  const merge = async (leftStart: number, leftEnd: number, rightStart: number, rightEnd: number) => {
    // Step 4: Initialize merge process with pointers and result array
    setCurrentStep(4);
    setCurrentOperation(`Merging elements from index ${leftStart} to ${rightEnd}`);
    
    // Highlight elements being merged
    setArray(prev => prev.map((item, idx) => ({
      ...item,
      isMerging: idx >= leftStart && idx <= rightEnd,
      isActive: idx >= leftStart && idx <= rightEnd
    })));

    await delay(speed);

    // Step 5: Compare elements and merge in sorted order
    setCurrentStep(5);
    setCurrentOperation('Comparing and merging elements in sorted order');
    await delay(speed);

    // Create temporary arrays for merging using current array state
    setArray(prev => {
      const currentArray = [...prev];
      const leftArray = currentArray.slice(leftStart, leftEnd + 1);
      const rightArray = currentArray.slice(rightStart, rightEnd + 1);
      
      let i = 0, j = 0, k = leftStart;
      const mergedArray = [...currentArray];
      
      // Create the merge result array first
      const tempResult = [];
      let leftIdx = 0, rightIdx = 0;
      
      // Merge logic to determine order
      while (leftIdx < leftArray.length && rightIdx < rightArray.length) {
        if (leftArray[leftIdx].value <= rightArray[rightIdx].value) {
          tempResult.push(leftArray[leftIdx]);
          leftIdx++;
        } else {
          tempResult.push(rightArray[rightIdx]);
          rightIdx++;
        }
      }
      
      // Add remaining elements from left
      while (leftIdx < leftArray.length) {
        tempResult.push(leftArray[leftIdx]);
        leftIdx++;
      }
      
      // Add remaining elements from right
      while (rightIdx < rightArray.length) {
        tempResult.push(rightArray[rightIdx]);
        rightIdx++;
      }
      
      // Apply the result back to the merged section
      tempResult.forEach((item, idx) => {
        if (leftStart + idx < mergedArray.length) {
          mergedArray[leftStart + idx] = { 
            ...item, 
            isMerging: true,
            isComparing: false,
            isActive: true 
          };
        }
      });
      
      return mergedArray;
    });

    setComparisons(prev => prev + leftEnd - leftStart + rightEnd - rightStart + 2);
    
    // Show step 6: Add remaining elements from left array
    setCurrentStep(6);
    setCurrentOperation('Adding remaining elements from left array');
    await delay(speed);
    
    // Show step 7: Add remaining elements from right array  
    setCurrentStep(7);
    setCurrentOperation('Adding remaining elements from right array');
    await delay(speed);

    // Mark merged section as sorted
    setArray(prev => prev.map((item, idx) => ({
      ...item,
      isMerging: false,
      isActive: false,
      isComparing: false,
      isSorted: idx >= leftStart && idx <= rightEnd ? true : item.isSorted
    })));

    setMerges(prev => prev + 1);
    
    // Step 8: Return merged result
    setCurrentStep(8);
    setCurrentOperation('Merge completed - returning result');
    await delay(speed);
  };

  const mergeSortRecursive = async (left: number, right: number, level: number = 0): Promise<void> => {
    // Update recursion depth
    setRecursionDepth(Math.max(recursionDepth, level + 1));
    
    // Step 0: Check base case: arrays with 0 or 1 element are already sorted
    if (left >= right) {
      setCurrentStep(0);
      setCurrentOperation(`Base case: single element at index ${left} is already sorted`);
      
      setArray(prev => prev.map((item, idx) => ({
        ...item,
        isSorted: idx === left ? true : item.isSorted,
        level: idx === left ? level : item.level
      })));
      
      await delay(speed * 0.5);
      return;
    }

    // Step 1: Divide: split array into two halves at middle point
    setCurrentStep(1);
    setCurrentOperation(`Dividing array from index ${left} to ${right} at level ${level}`);
    
    // Highlight elements being divided
    setArray(prev => prev.map((item, idx) => ({
      ...item,
      isDividing: idx >= left && idx <= right,
      level: idx >= left && idx <= right ? level : item.level
    })));
    
    await delay(speed);

    // Divide
    const middle = Math.floor((left + right) / 2);

    // Mark left and right children
    setArray(prev => prev.map((item, idx) => ({
      ...item,
      leftChild: idx >= left && idx <= middle,
      rightChild: idx >= middle + 1 && idx <= right,
      isDividing: false
    })));

    await delay(speed);

    // Step 2: Conquer: recursively sort both halves
    setCurrentStep(2);
    setCurrentOperation('Recursively sorting left and right halves');
    
    // Conquer - recursively sort both halves
    await mergeSortRecursive(left, middle, level + 1);
    await mergeSortRecursive(middle + 1, right, level + 1);

    // Step 3: Combine: merge the sorted halves together
    setCurrentStep(3);
    setCurrentOperation('Combining: merging sorted halves');
    await delay(speed * 0.5);
    
    // Combine - merge the sorted halves
    await merge(left, middle, middle + 1, right);
    
    // Clear child markings for this level
    setArray(prev => prev.map(item => ({
      ...item,
      leftChild: false,
      rightChild: false,
      isActive: false
    })));
  };

  const mergeSort = useCallback(async () => {
    setIsPlaying(true);
    setIsComplete(false);
    setCurrentOperation('Starting merge sort...');
    setCurrentStep(0);
    
    try {
      await mergeSortRecursive(0, array.length - 1, 0);
      
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
      setCurrentOperation('Merge sort completed! All elements are now sorted.');
      setCurrentStep(8); // Final step - return result
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