'use client';

import { useState } from 'react';

export default function ArrayVisualizer() {
  const [array, setArray] = useState<number[]>([10, 20, 30, 40, 50]);
  const [newValue, setNewValue] = useState<string>('');
  const [index, setIndex] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);

  const handleAddElement = () => {
    if (newValue.trim() === '') {
      setMessage('Please enter a value');
      return;
    }

    const value = parseInt(newValue);
    if (isNaN(value)) {
      setMessage('Please enter a valid number');
      return;
    }

    setArray([...array, value]);
    setNewValue('');
    setMessage(`Added ${value} to the end of the array`);
    
    // Highlight the new element
    setHighlightedIndex(array.length);
    setTimeout(() => setHighlightedIndex(null), 1500);
  };

  const handleInsertAt = () => {
    if (newValue.trim() === '' || index.trim() === '') {
      setMessage('Please enter both value and index');
      return;
    }

    const value = parseInt(newValue);
    const idx = parseInt(index);

    if (isNaN(value) || isNaN(idx)) {
      setMessage('Please enter valid numbers');
      return;
    }

    if (idx < 0 || idx > array.length) {
      setMessage(`Index must be between 0 and ${array.length}`);
      return;
    }

    const newArray = [...array];
    newArray.splice(idx, 0, value);
    setArray(newArray);
    setNewValue('');
    setIndex('');
    setMessage(`Inserted ${value} at index ${idx}`);
    
    // Highlight the inserted element
    setHighlightedIndex(idx);
    setTimeout(() => setHighlightedIndex(null), 1500);
  };

  const handleRemoveAt = () => {
    if (index.trim() === '') {
      setMessage('Please enter an index');
      return;
    }

    const idx = parseInt(index);

    if (isNaN(idx)) {
      setMessage('Please enter a valid index');
      return;
    }

    if (idx < 0 || idx >= array.length) {
      setMessage(`Index must be between 0 and ${array.length - 1}`);
      return;
    }

    // Highlight the element to be removed
    setHighlightedIndex(idx);
    setTimeout(() => {
      const newArray = [...array];
      const removed = newArray.splice(idx, 1)[0];
      setArray(newArray);
      setIndex('');
      setMessage(`Removed ${removed} from index ${idx}`);
      setHighlightedIndex(null);
    }, 800);
  };

  const handleClear = () => {
    setArray([]);
    setNewValue('');
    setIndex('');
    setMessage('Array cleared');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Array Visualizer</h2>
      
      <div className="mb-8">
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {array.length === 0 ? (
            <div className="p-4 border border-dashed border-gray-300 rounded-md text-gray-500">
              Empty Array
            </div>
          ) : (
            array.map((value, idx) => (
              <div
                key={idx}
                className={`w-16 h-16 flex items-center justify-center border-2 
                  ${highlightedIndex === idx ? 'border-blue-500 bg-blue-100' : 'border-gray-300'} 
                  rounded-md shadow-sm transition-all duration-300`}
              >
                <span className="text-lg">{value}</span>
                <div className="absolute -bottom-6 text-xs text-gray-500">{idx}</div>
              </div>
            ))
          )}
        </div>
        
        <div className="text-sm text-gray-500 text-center mb-4">
          Array Length: {array.length}
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Add Elements</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Value:
                </label>
                <input
                  type="text"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter a number"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Index (optional):
                </label>
                <input
                  type="text"
                  value={index}
                  onChange={(e) => setIndex(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter index"
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleAddElement}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Add to End
                </button>
                <button
                  onClick={handleInsertAt}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  Insert at Index
                </button>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Remove Elements</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Index:
                </label>
                <input
                  type="text"
                  value={index}
                  onChange={(e) => setIndex(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter index"
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleRemoveAt}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Remove at Index
                </button>
                <button
                  onClick={handleClear}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                >
                  Clear Array
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {message && (
          <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-md text-blue-800">
            {message}
          </div>
        )}
      </div>
    </div>
  );
} 