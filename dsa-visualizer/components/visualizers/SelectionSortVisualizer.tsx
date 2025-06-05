'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Shuffle, SkipForward } from 'lucide-react';
import CodeHighlighter from '../ui/CodeHighlighter';
import { cn, delay } from '../../lib/utils';

interface ArrayElement {
  value: number;
  id: string;
  isComparing?: boolean;
  isSwapping?: boolean;
  isSorted?: boolean;
  isActive?: boolean;
  isMinimum?: boolean;
}

const SELECTION_SORT_CODE = `function selectionSort(array) {
  const n = array.length;
  
  // Outer loop for each position
  for (let i = 0; i < n - 1; i++) {
    // Find minimum element in remaining array
    let minIndex = i;
    
    // Inner loop to find minimum
    for (let j = i + 1; j < n; j++) {
      // Compare current element with minimum
      if (array[j] < array[minIndex]) {
        minIndex = j;
      }
    }
    
    // Swap minimum element with first element
    if (minIndex !== i) {
      [array[i], array[minIndex]] = [array[minIndex], array[i]];
    }
  }
  
  return array;
}`;

const CODE_STEPS = {
  selectionSort: [
    { lines: [2], description: "Get the length of the array" },
    { lines: [4, 5], description: "Start outer loop for each position" },
    { lines: [6], description: "Initialize minimum index to current position" },
    { lines: [8, 9], description: "Start inner loop to find minimum element" },
    { lines: [10, 11, 12, 13], description: "Compare and update minimum index" },
    { lines: [16, 17, 18], description: "Swap minimum element with current position" },
    { lines: [21], description: "Return the sorted array" }
  ]
};

export default function SelectionSortVisualizer() {
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
  const [currentI, setCurrentI] = useState(0);
  const [currentJ, setCurrentJ] = useState(0);
  const [minIndex, setMinIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [speed, setSpeed] = useState(500);
  const [comparisons, setComparisons] = useState(0);
  const [swaps, setSwaps] = useState(0);

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
    setCurrentI(0);
    setCurrentJ(0);
    setMinIndex(0);
    setIsComplete(false);
    setComparisons(0);
    setSwaps(0);
    setArray(prev => prev.map(item => ({
      ...item,
      isComparing: false,
      isSwapping: false,
      isSorted: false,
      isActive: false,
      isMinimum: false
    })));
  }, []);

  const selectionSort = useCallback(async () => {
    setIsPlaying(true);
    setIsComplete(false);
    
    const arr = [...array];
    const n = arr.length;
    let totalComparisons = 0;
    let totalSwaps = 0;

    // Step 0: Show array length
    setCurrentStep(0);
    await delay(speed);

    for (let i = 0; i < n - 1; i++) {
      setCurrentI(i);
      
      // Step 1: Start outer loop
      setCurrentStep(1);
      await delay(speed);
      
      // Step 2: Initialize minimum index
      let minIdx = i;
      setMinIndex(minIdx);
      setCurrentStep(2);
      
      // Highlight current position and minimum
      setArray(prev => prev.map((item, idx) => ({
        ...item,
        isActive: idx === i,
        isMinimum: idx === minIdx,
        isComparing: false,
        isSwapping: false
      })));
      
      await delay(speed);

      for (let j = i + 1; j < n; j++) {
        setCurrentJ(j);
        
        // Step 3: Start inner loop
        setCurrentStep(3);
        await delay(speed);

        // Step 4: Compare elements
        setCurrentStep(4);
        
        // Highlight comparison
        setArray(prev => prev.map((item, idx) => ({
          ...item,
          isComparing: idx === j,
          isMinimum: idx === minIdx,
          isActive: idx === i,
          isSwapping: false
        })));
        
        totalComparisons++;
        setComparisons(totalComparisons);
        await delay(speed);

        if (arr[j].value < arr[minIdx].value) {
          minIdx = j;
          setMinIndex(minIdx);
          
          // Update minimum highlight
          setArray(prev => prev.map((item, idx) => ({
            ...item,
            isComparing: idx === j,
            isMinimum: idx === minIdx,
            isActive: idx === i,
            isSwapping: false
          })));
          
          await delay(speed);
        }

        // Clear comparison highlight
        setArray(prev => prev.map((item, idx) => ({
          ...item,
          isComparing: false,
          isMinimum: idx === minIdx,
          isActive: idx === i,
          isSwapping: false
        })));
      }

      // Step 5: Swap if needed
      setCurrentStep(5);
      
      if (minIdx !== i) {
        // Highlight swap
        setArray(prev => prev.map((item, idx) => ({
          ...item,
          isSwapping: idx === i || idx === minIdx,
          isMinimum: false,
          isActive: false,
          isComparing: false
        })));
        
        await delay(speed);
        
        // Perform swap
        [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
        totalSwaps++;
        setSwaps(totalSwaps);
        
        // Update array with swapped values
        setArray(prev => {
          const newArr = [...prev];
          [newArr[i], newArr[minIdx]] = [newArr[minIdx], newArr[i]];
          return newArr.map((item, idx) => ({
            ...item,
            isSwapping: idx === i || idx === minIdx
          }));
        });
        
        await delay(speed);
      }

      // Mark current position as sorted
      setArray(prev => prev.map((item, idx) => ({
        ...item,
        isSorted: idx <= i,
        isSwapping: false,
        isMinimum: false,
        isActive: false,
        isComparing: false
      })));
      
      await delay(speed);
    }

    // Mark all as sorted
    setArray(prev => prev.map(item => ({ 
      ...item, 
      isSorted: true,
      isSwapping: false,
      isMinimum: false,
      isActive: false,
      isComparing: false
    })));
    setIsComplete(true);
    setIsPlaying(false);
    setCurrentStep(6);
  }, [array, speed]);

  const handlePlayPause = () => {
    if (isComplete) {
      resetSort();
      return;
    }
    
    if (isPlaying) {
      setIsPlaying(false);
      setIsPaused(true);
    } else {
      selectionSort();
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-100 mb-2">Selection Sort Visualizer</h1>
          <p className="text-slate-400 text-lg">
            Interactive visualization of selection sort algorithm with step-by-step code execution
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
                            "w-12 flex items-center justify-center text-white font-bold text-sm rounded-lg border-2 transition-all duration-300",
                            item.isSorted 
                              ? "bg-green-500 border-green-400 shadow-green-400/25" 
                              : item.isSwapping
                              ? "bg-red-500 border-red-400 shadow-red-400/25"
                              : item.isMinimum
                              ? "bg-purple-500 border-purple-400 shadow-purple-400/25"
                              : item.isComparing
                              ? "bg-yellow-500 border-yellow-400 shadow-yellow-400/25"
                              : item.isActive
                              ? "bg-blue-500 border-blue-400 shadow-blue-400/25"
                              : "bg-slate-600 border-slate-500"
                          )}
                          style={{ height: `${item.value * 3 + 20}px` }}
                          animate={{
                            scale: item.isComparing || item.isSwapping || item.isMinimum || item.isActive ? 1.1 : 1,
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
                  <div>Current Position: {currentI + 1} | Checking: {currentJ + 1} | Min Index: {minIndex + 1}</div>
                  <div>Comparisons: {comparisons} | Swaps: {swaps}</div>
                </div>
              </div>

              {/* Legend */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded border"></div>
                  <span className="text-slate-300">Current Position</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-purple-500 rounded border"></div>
                  <span className="text-slate-300">Current Minimum</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-500 rounded border"></div>
                  <span className="text-slate-300">Comparing</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded border"></div>
                  <span className="text-slate-300">Swapping</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded border"></div>
                  <span className="text-slate-300">Sorted</span>
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
              </div>
            </div>
          </div>

          {/* Code Panel */}
          <div className="space-y-6">
            <CodeHighlighter
              code={SELECTION_SORT_CODE}
              language="javascript"
              title="Selection Sort Algorithm"
              steps={CODE_STEPS.selectionSort}
              currentStep={currentStep}
              showControls={false}
            />
          </div>
        </div>

        {/* Information Section */}
        <div className="mt-12 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
              About Selection Sort
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Understanding the fundamentals, properties, and complexity analysis of the selection sort algorithm
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            
            {/* What is Selection Sort - Takes more space */}
            <div className="xl:col-span-2 bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 border border-slate-700/50 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-100">What is Selection Sort?</h3>
              </div>
              
              <p className="text-slate-300 mb-8 leading-relaxed text-lg">
                Selection Sort works by finding the minimum element from the unsorted portion and placing it at 
                the beginning. It divides the array into sorted and unsorted portions, gradually building the 
                sorted portion by selecting the smallest remaining element in each iteration.
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
                      <span>Simple and intuitive algorithm</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                      <span>In-place sorting (O(1) space)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                      <span>Minimum number of swaps (O(n))</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                      <span>Good for small datasets</span>
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
                      <span>Poor time complexity O(n²)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                      <span>Not stable (relative order not preserved)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                      <span>No early termination possible</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                      <span>Always makes O(n²) comparisons</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Properties Card */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 border border-slate-700/50 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-cyan-500/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-100">Properties</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
                  <span className="text-slate-400 font-medium">Type:</span>
                  <span className="text-slate-200 font-semibold">Comparison</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
                  <span className="text-slate-400 font-medium">Stability:</span>
                  <span className="text-slate-200 font-semibold">Unstable</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
                  <span className="text-slate-400 font-medium">Best Case:</span>
                  <span className="text-red-400 font-mono font-bold">O(n²)</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
                  <span className="text-slate-400 font-medium">Average Case:</span>
                  <span className="text-red-400 font-mono font-bold">O(n²)</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
                  <span className="text-slate-400 font-medium">Worst Case:</span>
                  <span className="text-red-400 font-mono font-bold">O(n²)</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-slate-400 font-medium">Space:</span>
                  <span className="text-green-400 font-mono font-bold">O(1)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Second Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            
            {/* Use Cases */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 border border-slate-700/50 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-100">When to Use</h3>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                {[
                  {title: "Small Arrays", desc: "Efficient for datasets with < 20 elements" },
                  {title: "Memory Constraints", desc: "When O(1) space complexity is required" },
                  {title: "Minimize Swaps", desc: "When swap operations are expensive" },
                  {title: "Educational Purposes", desc: "Teaching basic sorting concepts" },
                  {title: "Simple Implementation", desc: "When code simplicity is priority" }
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
                <div className="w-10 h-10 bg-pink-500/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-100">Algorithm Steps</h3>
              </div>
              
              <div className="space-y-4">
                {[
                  { step: 1, title: "Find Minimum", desc: "Find the smallest element in unsorted portion" },
                  { step: 2, title: "Swap to Position", desc: "Swap minimum with first unsorted element" },
                  { step: 3, title: "Extend Sorted", desc: "Sorted portion grows by one element" },
                  { step: 4, title: "Repeat Process", desc: "Continue with remaining unsorted elements" },
                  { step: 5, title: "Complete Sort", desc: "Process until entire array is sorted" }
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 bg-slate-700/30 rounded-xl border border-slate-600/30">
                    <div className="w-8 h-8 bg-pink-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-pink-400 font-bold text-sm">{item.step}</span>
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
    </div>
  );
} 