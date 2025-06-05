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
  isShifting?: boolean;
  isSorted?: boolean;
  isActive?: boolean;
  isKey?: boolean;
}

const INSERTION_SORT_CODE = `function insertionSort(array) {
  const n = array.length;
  
  // Start from second element
  for (let i = 1; i < n; i++) {
    // Current element to be inserted
    let key = array[i];
    let j = i - 1;
    
    // Shift elements to the right
    while (j >= 0 && array[j] > key) {
      array[j + 1] = array[j];
      j--;
    }
    
    // Insert the key at correct position
    array[j + 1] = key;
  }
  
  return array;
}`;

const CODE_STEPS = {
  insertionSort: [
    { lines: [2], description: "Get the length of the array" },
    { lines: [4, 5], description: "Start from second element (index 1)" },
    { lines: [6, 7], description: "Store current element as key and set position" },
    { lines: [9, 10, 11, 12], description: "Shift larger elements to the right" },
    { lines: [15], description: "Insert key at correct position" },
    { lines: [18], description: "Return the sorted array" }
  ]
};

export default function InsertionSortVisualizer() {
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
  const [keyValue, setKeyValue] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [speed, setSpeed] = useState(500);
  const [comparisons, setComparisons] = useState(0);
  const [shifts, setShifts] = useState(0);

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
    setKeyValue(0);
    setIsComplete(false);
    setComparisons(0);
    setShifts(0);
    setArray(prev => prev.map(item => ({
      ...item,
      isComparing: false,
      isShifting: false,
      isSorted: false,
      isActive: false,
      isKey: false
    })));
  }, []);

  const insertionSort = useCallback(async () => {
    setIsPlaying(true);
    setIsComplete(false);
    
    let currentArray = [...array];
    const n = currentArray.length;
    let totalComparisons = 0;
    let totalShifts = 0;

    // Step 0: Show array length
    setCurrentStep(0);
    await delay(speed);

    // Mark first element as sorted
    setArray(prev => prev.map((item, idx) => ({
      ...item,
      isSorted: idx === 0
    })));

    for (let i = 1; i < n; i++) {
      setCurrentI(i);
      
      // Step 1: Start from second element
      setCurrentStep(1);
      await delay(speed);
      
      // Step 2: Store key and set position
      const keyElement = currentArray[i];
      const key = keyElement.value;
      setKeyValue(key);
      let j = i - 1;
      setCurrentJ(j);
      setCurrentStep(2);
      
      // Highlight key element
      setArray(prev => prev.map((item, idx) => ({
        ...item,
        isKey: idx === i,
        isActive: idx === j && j >= 0,
        isComparing: false,
        isShifting: false
      })));
      
      await delay(speed);

      // Step 3: Shift elements
      setCurrentStep(3);
      
      while (j >= 0 && currentArray[j].value > key) {
        totalComparisons++;
        setComparisons(totalComparisons);
        
        // Highlight comparison
        setArray(prev => prev.map((item, idx) => ({
          ...item,
          isComparing: idx === j,
          isKey: idx === i,
          isShifting: false,
          isActive: false
        })));
        
        await delay(speed);
        
        // Shift element in working array
        currentArray[j + 1] = currentArray[j];
        totalShifts++;
        setShifts(totalShifts);
        
        // Update visual array with the current state
        setArray(currentArray.map((item, idx) => ({
          ...item,
          isShifting: idx === j || idx === j + 1,
          isComparing: false,
          isKey: false,
          isActive: false
        })));
        
        await delay(speed);
        
        j--;
        setCurrentJ(j);
      }

      // Final comparison if j >= 0
      if (j >= 0) {
        totalComparisons++;
        setComparisons(totalComparisons);
        
        setArray(prev => prev.map((item, idx) => ({
          ...item,
          isComparing: idx === j,
          isKey: false,
          isShifting: false,
          isActive: false
        })));
        
        await delay(speed);
      }

      // Step 4: Insert key at correct position
      setCurrentStep(4);
      
      // Insert key in working array
      currentArray[j + 1] = keyElement;
      
      // Update visual array with insertion
      setArray(currentArray.map((item, idx) => ({
        ...item,
        isKey: idx === j + 1,
        isSorted: idx <= i,
        isComparing: false,
        isShifting: false,
        isActive: false
      })));
      
      await delay(speed);
      
      // Clear highlighting
      setArray(prev => prev.map((item, idx) => ({
        ...item,
        isKey: false,
        isSorted: idx <= i,
        isComparing: false,
        isShifting: false,
        isActive: false
      })));
      
      await delay(speed);
    }

    // Mark all as sorted
    setArray(prev => prev.map(item => ({ 
      ...item, 
      isSorted: true,
      isKey: false,
      isComparing: false,
      isShifting: false,
      isActive: false
    })));
    setIsComplete(true);
    setIsPlaying(false);
    setCurrentStep(5);
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
      insertionSort();
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-100 mb-2">Insertion Sort Visualizer</h1>
          <p className="text-slate-400 text-lg">
            Interactive visualization of insertion sort algorithm with step-by-step code execution
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                              : item.isKey
                              ? "bg-orange-500 border-orange-400 shadow-orange-400/25"
                              : item.isShifting
                              ? "bg-red-500 border-red-400 shadow-red-400/25"
                              : item.isComparing
                              ? "bg-yellow-500 border-yellow-400 shadow-yellow-400/25"
                              : item.isActive
                              ? "bg-blue-500 border-blue-400 shadow-blue-400/25"
                              : "bg-slate-600 border-slate-500"
                          )}
                          style={{ height: `${item.value * 3 + 20}px` }}
                          animate={{
                            scale: item.isKey || item.isComparing || item.isShifting || item.isActive ? 1.1 : 1,
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
                  <div>Current Index: {currentI + 1} | Key Value: {keyValue} | Position: {currentJ + 1}</div>
                  <div>Comparisons: {comparisons} | Shifts: {shifts}</div>
                </div>
              </div>

              {/* Legend */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-orange-500 rounded border"></div>
                  <span className="text-slate-300">Key Element</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-500 rounded border"></div>
                  <span className="text-slate-300">Comparing</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded border"></div>
                  <span className="text-slate-300">Shifting</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded border"></div>
                  <span className="text-slate-300">Current Position</span>
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
              code={INSERTION_SORT_CODE}
              language="javascript"
              title="Insertion Sort Algorithm"
              steps={CODE_STEPS.insertionSort}
              currentStep={currentStep}
              showControls={false}
            />
          </div>
        </div>

        {/* Information Section */}
        <div className="mt-12 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
              About Insertion Sort
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Understanding the fundamentals, properties, and complexity analysis of the insertion sort algorithm
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            
            {/* What is Insertion Sort - Takes more space */}
            <div className="xl:col-span-2 bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 border border-slate-700/50 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-100">What is Insertion Sort?</h3>
              </div>
              
              <p className="text-slate-300 mb-8 leading-relaxed text-lg">
                Insertion Sort builds the sorted array one element at a time by taking each element from the 
                unsorted portion and inserting it into its correct position in the sorted portion. It's similar 
                to how you would sort playing cards in your hand - picking up cards one by one and placing them 
                in their proper position.
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
                      <span>Efficient for small datasets</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                      <span>Adaptive - O(n) for nearly sorted arrays</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                      <span>Stable sorting algorithm</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                      <span>In-place and online algorithm</span>
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
                      <span>Poor performance for large datasets</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                      <span>O(n²) worst-case time complexity</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                      <span>More writes compared to selection sort</span>
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
                  <span className="text-slate-200 font-semibold">Stable</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
                  <span className="text-slate-400 font-medium">Best Case:</span>
                  <span className="text-green-400 font-mono font-bold">O(n)</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
                  <span className="text-slate-400 font-medium">Average Case:</span>
                  <span className="text-yellow-400 font-mono font-bold">O(n²)</span>
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
                <div className="w-10 h-10 bg-pink-500/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-100">When to Use</h3>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                {[
                  {title: "Small Arrays", desc: "Excellent for datasets with < 50 elements" },
                  {title: "Nearly Sorted Data", desc: "Optimal O(n) performance for sorted arrays" },
                  {title: "Online Algorithm", desc: "Can sort data as it arrives" },
                  {title: "Stable Sorting", desc: "When preserving relative order is important" },
                  {title: "Hybrid Algorithms", desc: "Used in Timsort and Introsort for small subarrays" }
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
                <div className="w-10 h-10 bg-teal-500/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-100">Algorithm Steps</h3>
              </div>
              
              <div className="space-y-4">
                {[
                  { step: 1, title: "Pick Next Element", desc: "Select the next unsorted element as key" },
                  { step: 2, title: "Compare with Sorted", desc: "Compare key with elements in sorted portion" },
                  { step: 3, title: "Shift Elements", desc: "Shift larger elements one position right" },
                  { step: 4, title: "Insert Key", desc: "Place key at its correct position" },
                  { step: 5, title: "Repeat Process", desc: "Continue until all elements are processed" }
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 bg-slate-700/30 rounded-xl border border-slate-600/30">
                    <div className="w-8 h-8 bg-teal-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-teal-400 font-bold text-sm">{item.step}</span>
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