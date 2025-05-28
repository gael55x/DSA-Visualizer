'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Trash2, Shuffle, RotateCcw, Play, Pause } from 'lucide-react';
import CodeHighlighter from '../ui/CodeHighlighter';
import ThemeToggle from '../ui/ThemeToggle';
import { cn, delay, generateRandomArray } from '../../lib/utils';

interface ArrayElement {
  value: number;
  id: string;
  isHighlighted?: boolean;
  isSearching?: boolean;
  isInserting?: boolean;
  isRemoving?: boolean;
}

interface OperationStep {
  operation: string;
  description: string;
  array: ArrayElement[];
  highlightIndex?: number;
  codeStep: number;
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
    { line: 2, description: "Validate that the index is within valid bounds" },
    { line: 7, description: "Start shifting elements from the end to make space" },
    { line: 8, description: "Move each element one position to the right" },
    { line: 11, description: "Insert the new value at the specified index" },
    { line: 13, description: "Return the modified array" }
  ],
  
  search: [
    { line: 2, description: "Start iterating through the array from index 0" },
    { line: 4, description: "Compare current element with the target value" },
    { line: 5, description: "Found a match! Return the current index" },
    { line: 9, description: "Target not found in the array, return -1" }
  ],
  
  delete: [
    { line: 2, description: "Validate that the index is within valid bounds" },
    { line: 7, description: "Start shifting elements from the deletion point" },
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
  const [message, setMessage] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentOperation, setCurrentOperation] = useState<string>('insert');
  const [currentStep, setCurrentStep] = useState(0);
  const [operationHistory, setOperationHistory] = useState<OperationStep[]>([]);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const showMessage = (text: string, type: 'success' | 'error' | 'info' = 'info') => {
    setMessage(text);
    setTimeout(() => setMessage(''), 3000);
  };

  const addToHistory = (operation: string, description: string, newArray: ArrayElement[], highlightIndex?: number) => {
    const step: OperationStep = {
      operation,
      description,
      array: [...newArray],
      highlightIndex,
      codeStep: currentStep
    };
    setOperationHistory(prev => [...prev.slice(-9), step]);
  };

  const insertElement = useCallback(async () => {
    if (!inputValue.trim()) {
      showMessage('Please enter a value', 'error');
      return;
    }

    const value = parseInt(inputValue);
    if (isNaN(value)) {
      showMessage('Please enter a valid number', 'error');
      return;
    }

    const index = inputIndex.trim() ? parseInt(inputIndex) : array.length;
    if (isNaN(index) || index < 0 || index > array.length) {
      showMessage(`Index must be between 0 and ${array.length}`, 'error');
      return;
    }

    setIsAnimating(true);
    setCurrentOperation('insert');

    // Step-by-step animation with enhanced code highlighting
    for (let step = 0; step < CODE_STEPS.insert.length; step++) {
      setCurrentStep(step);
      await delay(800);

      if (step === 1) {
        // Highlight elements that will be shifted
        const newArray = array.map((item, idx) => ({
          ...item,
          isHighlighted: idx >= index
        }));
        setArray(newArray);
      } else if (step === 2) {
        // Animate the shifting
        const newArray = [...array];
        for (let i = newArray.length - 1; i >= index; i--) {
          if (newArray[i]) {
            newArray[i].isHighlighted = true;
          }
        }
        setArray(newArray);
        await delay(600);
      } else if (step === 3) {
        // Insert the new element
        const newElement: ArrayElement = {
          value,
          id: generateId(),
          isInserting: true
        };
        
        const newArray = [...array];
        newArray.splice(index, 0, newElement);
        
        // Reset highlighting
        const finalArray = newArray.map(item => ({
          ...item,
          isHighlighted: false,
          isInserting: item.id === newElement.id
        }));
        
        setArray(finalArray);
        addToHistory('INSERT', `Inserted ${value} at index ${index}`, finalArray, index);
        
        setTimeout(() => {
          setArray(prev => prev.map(item => ({ ...item, isInserting: false })));
        }, 600);
      }
    }

    setInputValue('');
    setInputIndex('');
    showMessage(`Successfully inserted ${value} at index ${index}`, 'success');
    setIsAnimating(false);
  }, [inputValue, inputIndex, array, currentStep]);

  const searchElement = useCallback(async () => {
    if (!searchValue.trim()) {
      showMessage('Please enter a value to search', 'error');
      return;
    }

    const target = parseInt(searchValue);
    if (isNaN(target)) {
      showMessage('Please enter a valid number', 'error');
      return;
    }

    setIsAnimating(true);
    setCurrentOperation('search');

    // Reset all highlights
    setArray(prev => prev.map(item => ({ ...item, isHighlighted: false, isSearching: false })));

    for (let i = 0; i < array.length; i++) {
      setCurrentStep(1);
      
      // Highlight current element being checked
      setArray(prev => prev.map((item, idx) => ({
        ...item,
        isSearching: idx === i,
        isHighlighted: false
      })));

      await delay(800);

      if (array[i].value === target) {
        setCurrentStep(2);
        setArray(prev => prev.map((item, idx) => ({
          ...item,
          isSearching: false,
          isHighlighted: idx === i
        })));
        
        showMessage(`Found ${target} at index ${i}!`, 'success');
        addToHistory('SEARCH', `Found ${target} at index ${i}`, array, i);
        setIsAnimating(false);
        return;
      }
    }

    setCurrentStep(3);
    setArray(prev => prev.map(item => ({ ...item, isSearching: false })));
    showMessage(`${target} not found in the array`, 'error');
    addToHistory('SEARCH', `${target} not found`, array);
    setIsAnimating(false);
  }, [searchValue, array]);

  const deleteElement = useCallback(async (index: number) => {
    if (index < 0 || index >= array.length) {
      showMessage('Invalid index', 'error');
      return;
    }

    setIsAnimating(true);
    setCurrentOperation('delete');

    const valueToDelete = array[index].value;

    // Step-by-step deletion with enhanced code highlighting
    for (let step = 0; step < CODE_STEPS.delete.length; step++) {
      setCurrentStep(step);
      await delay(800);

      if (step === 0) {
        // Highlight element to be deleted
        setArray(prev => prev.map((item, idx) => ({
          ...item,
          isRemoving: idx === index
        })));
      } else if (step === 1) {
        // Highlight elements that will be shifted
        setArray(prev => prev.map((item, idx) => ({
          ...item,
          isHighlighted: idx > index,
          isRemoving: idx === index
        })));
      } else if (step === 2) {
        // Animate the shifting and remove element
        const newArray = array.filter((_, idx) => idx !== index);
        const finalArray = newArray.map(item => ({
          ...item,
          isHighlighted: false,
          isRemoving: false
        }));
        
        setArray(finalArray);
        addToHistory('DELETE', `Deleted ${valueToDelete} from index ${index}`, finalArray);
      }
    }

    showMessage(`Successfully deleted ${valueToDelete}`, 'success');
    setIsAnimating(false);
  }, [array]);

  const generateNewArray = () => {
    const newArray = generateRandomArray(6, 1, 99).map(value => ({
      value,
      id: generateId(),
      isHighlighted: false
    }));
    setArray(newArray);
    showMessage('Generated new random array', 'success');
  };

  const clearArray = () => {
    setArray([]);
    setOperationHistory([]);
    showMessage('Array cleared', 'info');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 p-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header with Theme Toggle */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-slate-100 mb-2">Array Visualizer</h1>
            <p className="text-gray-600 dark:text-slate-400 text-lg">
              Interactive visualization of array operations with step-by-step code execution
            </p>
          </div>
          <ThemeToggle />
        </motion.div>

        {/* Message Display */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-2xl text-gray-900 dark:text-slate-100 text-center"
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
            {/* Array Display */}
            <div className="bg-gray-50 dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100">Array Contents</h2>
                <div className="flex gap-2">
                  <button
                    onClick={generateNewArray}
                    disabled={isAnimating}
                    className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-400 dark:disabled:bg-slate-600 text-slate-900 disabled:text-slate-400 rounded-xl font-medium transition-colors"
                  >
                    <Shuffle size={16} />
                    Random
                  </button>
                  <button
                    onClick={clearArray}
                    disabled={isAnimating}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 dark:disabled:bg-slate-600 text-white disabled:text-slate-400 rounded-xl font-medium transition-colors"
                  >
                    <RotateCcw size={16} />
                    Clear
                  </button>
                </div>
              </div>

              {/* Array Elements */}
              <div className="flex flex-wrap gap-2 mb-4 min-h-[80px] items-center justify-center">
                <AnimatePresence mode="popLayout">
                  {array.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-gray-500 dark:text-slate-400 text-center py-8"
                    >
                      Array is empty. Add some elements to get started!
                    </motion.div>
                  ) : (
                    array.map((item, index) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, scale: 0.8, y: -20 }}
                        animate={{ 
                          opacity: 1, 
                          scale: 1, 
                          y: 0,
                          backgroundColor: item.isHighlighted 
                            ? 'rgb(56, 189, 248)' 
                            : item.isSearching 
                            ? 'rgb(245, 158, 11)' 
                            : item.isInserting
                            ? 'rgb(34, 197, 94)'
                            : item.isRemoving
                            ? 'rgb(239, 68, 68)'
                            : 'rgb(51, 65, 85)'
                        }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        transition={{ duration: 0.3 }}
                        className="relative group"
                      >
                        <div className="w-16 h-16 flex items-center justify-center rounded-2xl border-2 border-slate-600 text-slate-100 font-bold text-lg shadow-lg">
                          {item.value}
                        </div>
                        
                        {/* Index Label */}
                        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 dark:text-slate-400">
                          [{index}]
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
                    ))
                  )}
                </AnimatePresence>
              </div>

              <div className="text-sm text-gray-600 dark:text-slate-400 text-center">
                Array Length: {array.length} | Max Capacity: ∞
              </div>
            </div>

            {/* Controls */}
            <div className="bg-gray-50 dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">Operations</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Insert Section */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-800 dark:text-slate-200">Insert Element</h4>
                  <div className="space-y-3">
                    <input
                      type="number"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Enter value"
                      disabled={isAnimating}
                      className="w-full px-4 py-3 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-xl text-gray-900 dark:text-slate-100 placeholder-gray-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition-colors disabled:opacity-50"
                    />
                    <input
                      type="number"
                      value={inputIndex}
                      onChange={(e) => setInputIndex(e.target.value)}
                      placeholder={`Index (0-${array.length})`}
                      disabled={isAnimating}
                      className="w-full px-4 py-3 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-xl text-gray-900 dark:text-slate-100 placeholder-gray-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition-colors disabled:opacity-50"
                    />
                    <button
                      onClick={insertElement}
                      disabled={isAnimating || !inputValue}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-sky-500 hover:bg-sky-600 disabled:bg-gray-400 dark:disabled:bg-slate-600 text-white disabled:text-slate-400 rounded-xl font-medium transition-colors"
                    >
                      {isAnimating && currentOperation === 'insert' ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        />
                      ) : (
                        <Plus size={16} />
                      )}
                      Insert Element
                    </button>
                  </div>
                </div>

                {/* Search Section */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-800 dark:text-slate-200">Search Element</h4>
                  <div className="space-y-3">
                    <input
                      type="number"
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      placeholder="Search value"
                      disabled={isAnimating}
                      className="w-full px-4 py-3 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-xl text-gray-900 dark:text-slate-100 placeholder-gray-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition-colors disabled:opacity-50"
                    />
                    <button
                      onClick={searchElement}
                      disabled={isAnimating || !searchValue || array.length === 0}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-400 dark:disabled:bg-slate-600 text-slate-900 disabled:text-slate-400 rounded-xl font-medium transition-colors"
                    >
                      {isAnimating && currentOperation === 'search' ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full"
                        />
                      ) : (
                        <Search size={16} />
                      )}
                      Search Array
                    </button>
                  </div>
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
              code={ARRAY_OPERATIONS[currentOperation as keyof typeof ARRAY_OPERATIONS]}
              language="javascript"
              title={`${currentOperation.charAt(0).toUpperCase() + currentOperation.slice(1)} Algorithm`}
              steps={CODE_STEPS[currentOperation as keyof typeof CODE_STEPS]}
              currentStep={currentStep}
              showControls={false}
            />

            {/* Operation History */}
            {operationHistory.length > 0 && (
              <div className="bg-gray-50 dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">Recent Operations</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {operationHistory.slice(-5).reverse().map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-3 bg-white dark:bg-slate-700 rounded-xl text-sm"
                    >
                      <div className="flex items-center gap-2 text-gray-800 dark:text-slate-200">
                        <span className="px-2 py-1 bg-sky-500 text-white rounded text-xs font-bold">
                          {step.operation}
                        </span>
                        {step.description}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
} 