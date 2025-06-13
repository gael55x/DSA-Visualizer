'use client';

import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import CodeHighlighter from '../ui/CodeHighlighter';
import { ToastContainer } from '../ui/Toast';
import { useToast } from '../../hooks/useToast';
import { delay } from '../../lib/utils';

interface ArrayElement {
  value: number;
  id: string;
  isHighlighted?: boolean;
  isSearching?: boolean;
  isInserting?: boolean;
  isRemoving?: boolean;
}



const ARRAY_OPERATIONS = {
  insert: `function insertAtIndex(array, index, value) {
  // Check if index is valid
  if (index < 0 || index > array.length) {
    throw new Error('Index out of bounds');
  }
  
  // Shift elements to the right
  for (let i = array.length; i > index; i--) {
    array[i] = array[i - 1];
  }
  
  // Insert the new value
  array[index] = value;
  
  return array;
}`,
  
  search: `function linearSearch(array, target) {
  // Iterate through each element
  for (let i = 0; i < array.length; i++) {
    // Check if current element matches target
    if (array[i] === target) {
      return i; // Found! Return the index
    }
  }
  
  return -1; // Not found
}`,
  
  delete: `function deleteAtIndex(array, index) {
  // Check if index is valid
  if (index < 0 || index >= array.length) {
    throw new Error('Index out of bounds');
  }
  
  // Shift elements to the left
  for (let i = index; i < array.length - 1; i++) {
    array[i] = array[i + 1];
  }
  
  // Reduce array length
  array.length--;
  
  return array;
}`
};

const CODE_STEPS = {
  insert: [
    { lines: [2, 3, 4, 5], description: "Validate that the index is within valid bounds" },
    { lines: [7, 8, 9, 10], description: "Start shifting elements from the end to make space" },
    { line: 9, description: "Move each element one position to the right" },
    { line: 13, description: "Insert the new value at the specified index" },
    { line: 15, description: "Return the modified array" }
  ],
  
  search: [
    { lines: [2, 3, 4, 5, 6, 7, 8], description: "Start iterating through the array from index 0" },
    { lines: [4, 5, 6, 7], description: "Compare current element with the target value" },
    { lines: [5, 6], description: "Found a match! Return the current index" },
    { lines: [10], description: "Target not found in the array, return -1" }
  ],
  
  delete: [
    { lines: [2, 3, 4], description: "Validate that the index is within valid bounds" },
    { lines: [7, 8, 9], description: "Start shifting elements from the deletion point" },
    { line: 8, description: "Move each element one position to the left" },
    { line: 12, description: "Reduce the array length to remove the last element" },
    { line: 14, description: "Return the modified array" }
  ]
};

export default function ArrayVisualizer() {
  const [array, setArray] = useState<ArrayElement[]>([
    { value: 10, id: '1', isHighlighted: false },
    { value: 25, id: '2', isHighlighted: false },
    { value: 33, id: '3', isHighlighted: false },
    { value: 47, id: '4', isHighlighted: false },
    { value: 52, id: '5', isHighlighted: false }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [inputIndex, setInputIndex] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentOperation, setCurrentOperation] = useState<string>('insert');
  const [currentStep, setCurrentStep] = useState(0);
  const generateId = () => Math.random().toString(36).substr(2, 9);

  const { toasts, removeToast, showSuccess, showError, showInfo } = useToast();

  const insertElement = useCallback(async () => {
    if (!inputValue.trim()) {
      showError('Please enter a value');
      return;
    }

    const value = parseInt(inputValue);
    if (isNaN(value)) {
      showError('Please enter a valid number');
      return;
    }

    setIsAnimating(true);
    setCurrentOperation('insert');
    
    // Get current array state
    const currentArray = array;
    const index = inputIndex.trim() ? parseInt(inputIndex) : currentArray.length;
    
    if (isNaN(index) || index < 0 || index > currentArray.length) {
      showError(`Index must be between 0 and ${currentArray.length}`);
      setIsAnimating(false);
      return;
    }

    // Step-by-step animation with code highlighting
    for (let step = 0; step < CODE_STEPS.insert.length; step++) {
      setCurrentStep(step);
      await delay(600);

      if (step === 1) {
        // Highlight elements that will be shifted
        setArray(prev => prev.map((item, idx) => ({
          ...item,
          isHighlighted: idx >= index
        })));
      } else if (step === 2) {
        // Animate the shifting
        setArray(prev => {
          const newArray = [...prev];
          for (let i = newArray.length - 1; i >= index; i--) {
            if (newArray[i]) {
              newArray[i].isHighlighted = true;
            }
          }
          return newArray;
        });
        await delay(400);
      } else if (step === 3) {
        // Insert the new element
        const newElement: ArrayElement = {
          value,
          id: generateId(),
          isInserting: true
        };
        
        setArray(prev => {
          const newArray = [...prev];
          newArray.splice(index, 0, newElement);
          
          // Reset highlighting
          return newArray.map(item => ({
            ...item,
            isHighlighted: false,
            isInserting: item.id === newElement.id
          }));
        });
        
        setTimeout(() => {
          setArray(prev => prev.map(item => ({ ...item, isInserting: false })));
        }, 600);
      }
    }

    setInputValue('');
    setInputIndex('');
    showSuccess(`Successfully inserted ${value} at index ${index}`);
    setIsAnimating(false);
  }, [inputValue, inputIndex, array, showSuccess]);

  const searchElement = useCallback(async () => {
    if (!searchValue.trim()) {
      showError('Please enter a value to search');
      return;
    }

    const value = parseInt(searchValue);
    if (isNaN(value)) {
      showError('Please enter a valid number');
      return;
    }

    setIsAnimating(true);
    setCurrentOperation('search');

    // Clear previous highlights
    setArray(prev => prev.map(item => ({ ...item, isHighlighted: false, isSearching: false })));

    // Step 0: Start iterating through the array from index 0
    setCurrentStep(0);
    await delay(800);

    // Start searching from index 0
    for (let i = 0; i < array.length; i++) {
      // Step 1: Compare current element with the target value
      setCurrentStep(1);
      
      // Highlight current element being checked
      setArray(prev => prev.map((item, idx) => ({
        ...item,
        isSearching: idx === i,
        isHighlighted: false
      })));

      await delay(800);

      // Check if found
      if (array[i].value === value) {
        // Step 2: Found a match! Return the current index
        setCurrentStep(2);
        setArray(prev => prev.map((item, idx) => ({
          ...item,
          isSearching: false,
          isHighlighted: idx === i
        })));
        await delay(800);
        
        showSuccess(`Found ${value} at index ${i}!`);
        setIsAnimating(false);
        setSearchValue('');
        return;
      }
    }

    // Step 3: Target not found in the array, return -1
    setCurrentStep(3);
    setArray(prev => prev.map(item => ({ ...item, isSearching: false })));
    await delay(800);
    
    showError(`Value ${value} not found in the array`);
    setSearchValue('');
    setIsAnimating(false);
  }, [searchValue, array, showSuccess, showError]);
    
  const deleteElement = useCallback(async (indexToDelete: number) => {
    if (indexToDelete < 0 || indexToDelete >= array.length) {
      showError('Invalid index for deletion');
      return;
    }

    setIsAnimating(true);
    setCurrentOperation('delete');

    const valueToDelete = array[indexToDelete].value;

    // Step-by-step animation with code highlighting
    for (let step = 0; step < CODE_STEPS.delete.length; step++) {
      setCurrentStep(step);
      await delay(600);

      if (step === 1) {
        // Highlight element to be deleted
        setArray(prev => prev.map((item, idx) => ({
          ...item,
          isHighlighted: idx === indexToDelete,
          isRemoving: idx === indexToDelete
        })));
        await delay(400);
      } else if (step === 2) {
        // Remove element and shift others
        setArray(prev => {
          const newArray = prev.filter((_, idx) => idx !== indexToDelete);
          return newArray.map(item => ({ ...item, isHighlighted: false, isRemoving: false }));
        });
      }
    }

    showSuccess(`Successfully deleted ${valueToDelete} from the array`);
    setIsAnimating(false);
  }, [array, showSuccess]);

  const clearArray = () => {
    setArray([]);
    showInfo('Array cleared');
  };

  const generateRandomArray = () => {
    const randomArray = Array.from({ length: Math.floor(Math.random() * 6) + 3 }, (_) => ({
      value: Math.floor(Math.random() * 100) + 1,
      id: generateId(),
      isHighlighted: false
    }));
    setArray(randomArray);
    showInfo('Generated random array');
  };

  const currentCode = useMemo(() => {
    return ARRAY_OPERATIONS[currentOperation as keyof typeof ARRAY_OPERATIONS];
  }, [currentOperation]);

  const currentCodeSteps = useMemo(() => {
    return CODE_STEPS[currentOperation as keyof typeof CODE_STEPS];
  }, [currentOperation]);

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-100 mb-2">Array Visualizer</h1>
          <p className="text-slate-400 text-lg">
              Interactive visualization of array operations with step-by-step code execution
            </p>
          </div>

        <div className="grid grid-cols-1 lg:grid-cols-[7fr_3fr] gap-8">
          {/* Visualization Panel */}
          <div className="space-y-6">
            {/* Array Visualization */}
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
              <h3 className="text-lg font-semibold text-slate-100 mb-4">Array Structure</h3>
              
              <div className="mb-8 mt-5 overflow-x-auto">
                {array.length === 0 ? (
                  <div className="flex justify-center p-4">
                    <div className="p-4 border border-dashed border-slate-600 rounded-md text-slate-400">
                      Empty Array
                </div>
              </div>
                ) : (
                  <div className="min-w-max mx-auto">
                    <div className="flex gap-2 items-center justify-center">
                <AnimatePresence mode="popLayout">
                        {array.map((item, index) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, scale: 0.8, y: -20 }}
                        animate={{ 
                          opacity: 1, 
                          scale: 1, 
                              y: 0
                        }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        transition={{ duration: 0.3 }}
                        className="relative group"
                      >
                            <div 
                              className={`w-20 h-16 flex flex-col items-center justify-center border-2 rounded-lg shadow-sm transition-all duration-300 ${
                                item.isHighlighted 
                                  ? 'border-green-400 bg-green-900/50 text-green-100 shadow-green-400/25' 
                                  : item.isSearching
                                  ? 'border-yellow-400 bg-yellow-900/50 text-yellow-100 shadow-yellow-400/25'
                                  : item.isInserting
                                  ? 'border-green-400 bg-green-900/50 text-green-100 shadow-green-400/25'
                                  : item.isRemoving
                                  ? 'border-red-400 bg-red-900/50 text-red-100 shadow-red-400/25'
                                  : 'border-slate-600 bg-slate-700 text-slate-200'
                              }`}
                            >
                              <span className="text-lg font-semibold">{item.value}</span>
                              <span className="text-xs text-slate-400">[{index}]</span>
                        </div>
                        
                        {/* Delete Button */}
                        <button
                          onClick={() => deleteElement(index)}
                          disabled={isAnimating}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 disabled:bg-slate-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                        >
                          <Trash2 size={12} />
                        </button>
                      </motion.div>
                        ))}
                </AnimatePresence>
              </div>
                  </div>
                )}

                <div className="text-sm text-slate-400 text-center mt-6">
                  Array Length: {array.length} | Capacity: Dynamic
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
              <h3 className="text-lg font-semibold text-slate-100 mb-4">Array Operations</h3>
              
                <div className="space-y-4">
                {/* Insert Element */}
                <div className="p-4 bg-slate-700 rounded-xl">
                  <h4 className="font-medium text-slate-200 mb-3">Insert Element</h4>
                  <div className="space-y-3">
                    <input
                      type="number"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-md text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
                      placeholder="Enter a number"
                      disabled={isAnimating}
                    />
                    
                    <input
                      type="number"
                      value={inputIndex}
                      onChange={(e) => setInputIndex(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-md text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
                      placeholder={`Index (0-${array.length}), leave empty for end`}
                      disabled={isAnimating}
                    />
                    
                    <button
                      onClick={insertElement}
                      disabled={isAnimating || !inputValue.trim()}
                      className="w-full px-4 py-2 bg-sky-500 hover:bg-sky-600 disabled:bg-slate-600 text-white disabled:text-slate-400 rounded-md font-medium transition-colors"
                    >
                      {isAnimating && currentOperation === 'insert' ? 'Inserting...' : 'Insert Element'}
                    </button>
                  </div>
                </div>

                {/* Search Element */}
                <div className="p-4 bg-slate-700 rounded-xl">
                  <h4 className="font-medium text-slate-200 mb-3">Search Element</h4>
                  <div className="space-y-3">
                    <input
                      type="number"
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-md text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
                      placeholder="Search value"
                      disabled={isAnimating}
                    />
                    
                    <button
                      onClick={searchElement}
                      disabled={isAnimating || !searchValue.trim() || array.length === 0}
                      className="w-full px-4 py-2 bg-yellow-500 hover:bg-yellow-600 disabled:bg-slate-600 text-slate-900 disabled:text-slate-400 rounded-md font-medium transition-colors"
                    >
                      {isAnimating && currentOperation === 'search' ? 'Searching...' : 'Search Array'}
                    </button>
                  </div>
                </div>

                {/* Other Operations */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <button
                    onClick={generateRandomArray}
                    disabled={isAnimating}
                    className="px-4 py-2 bg-purple-500 hover:bg-purple-600 disabled:bg-slate-600 text-white disabled:text-slate-400 rounded-md font-medium transition-colors"
                  >
                    Random Array
                  </button>
                  
                  <button
                    onClick={clearArray}
                    disabled={isAnimating}
                    className="px-4 py-2 bg-gray-500 hover:bg-gray-600 disabled:bg-slate-600 text-white disabled:text-slate-400 rounded-md font-medium transition-colors"
                  >
                    Clear Array
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* Code Panel */}
          <div className="space-y-6">
            <CodeHighlighter
              code={currentCode}
              language="javascript"
              title={`Array ${currentOperation.charAt(0).toUpperCase() + currentOperation.slice(1)} Operation`}
              steps={currentCodeSteps}
              currentStep={currentStep}
            />
          </div>
        </div>

        {/* Information Section */}
        <div className="mt-12 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
              About Arrays
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Understanding the fundamentals, properties, and complexity analysis of array data structures
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            
            {/* What is an Array - Takes more space */}
            <div className="xl:col-span-2 bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 border border-slate-700/50 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-100">What is an Array?</h3>
              </div>
              
              <p className="text-slate-300 mb-8 leading-relaxed text-lg">
                An array is a linear data structure where elements are stored in contiguous memory locations. 
                Each element can be accessed directly using its index, making arrays one of the most fundamental 
                and efficient data structures for random access operations.
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
                      <span>Constant time random access O(1)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                      <span>Memory efficient - no extra pointers</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                      <span>Excellent cache locality</span>
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
                      <span>Fixed size (in static arrays)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                      <span>Expensive insertion/deletion in middle</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                      <span>Memory waste if not fully utilized</span>
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
                  <span className="text-slate-200 font-semibold">Linear Static</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
                  <span className="text-slate-400 font-medium">Memory:</span>
                  <span className="text-slate-200 font-semibold">Contiguous</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
                  <span className="text-slate-400 font-medium">Access:</span>
                  <span className="text-green-400 font-mono font-bold">O(1)</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
                  <span className="text-slate-400 font-medium">Search:</span>
                  <span className="text-yellow-400 font-mono font-bold">O(n)</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
                  <span className="text-slate-400 font-medium">Insert (End):</span>
                  <span className="text-green-400 font-mono font-bold">O(1)</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-slate-400 font-medium">Insert (Middle):</span>
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
                  {title: "Data Storage", desc: "Store collections of similar elements" },
                  {title: "Lookup Tables", desc: "Fast access to data by index" },
                  {title: "Mathematical Computations", desc: "Matrix operations, vectors" },
                  {title: "Sorting Algorithms", desc: "Foundation for sorting implementations" },
                  {title: "Buffer Management", desc: "Temporary storage in I/O operations" }
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
                {/* Access & Search */}
                <div className="bg-green-500/5 border border-green-500/20 rounded-2xl p-5">
                  <h4 className="font-bold mb-4 text-green-400 text-sm uppercase tracking-wide">Access</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">By index</span>
                      <span className="text-green-400 font-mono font-bold text-lg">O(1)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Linear search</span>
                      <span className="text-yellow-400 font-mono font-bold text-lg">O(n)</span>
                    </div>
                  </div>
                </div>

                {/* Insertion */}
                <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-2xl p-5">
                  <h4 className="font-bold mb-4 text-yellow-400 text-sm uppercase tracking-wide">Insertion</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">At end</span>
                      <span className="text-green-400 font-mono font-bold text-lg">O(1)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">At beginning/middle</span>
                      <span className="text-yellow-400 font-mono font-bold text-lg">O(n)</span>
                    </div>
                  </div>
                </div>

                {/* Deletion */}
                <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-5">
                  <h4 className="font-bold mb-4 text-red-400 text-sm uppercase tracking-wide">Deletion</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">From end</span>
                      <span className="text-green-400 font-mono font-bold text-lg">O(1)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">From beginning/middle</span>
                      <span className="text-yellow-400 font-mono font-bold text-lg">O(n)</span>
                    </div>
                  </div>
                </div>
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