'use client';

import { useState, useEffect } from 'react';

interface Node {
  value: number;
  id: string;
}

export default function LinkedListVisualizer() {
  const [nodes, setNodes] = useState<Node[]>([
    { value: 10, id: 'node-1' },
    { value: 20, id: 'node-2' },
    { value: 30, id: 'node-3' },
  ]);
  const [newValue, setNewValue] = useState<string>('');
  const [position, setPosition] = useState<string>('end');
  const [index, setIndex] = useState<string>('0');
  const [message, setMessage] = useState<string>('');
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [nextId, setNextId] = useState<number>(4);

  const handleAddNode = () => {
    if (newValue.trim() === '') {
      setMessage('Please enter a value');
      return;
    }

    const value = parseInt(newValue);
    if (isNaN(value)) {
      setMessage('Please enter a valid number');
      return;
    }

    const newNode = { value, id: `node-${nextId}` };
    setNextId(nextId + 1);

    let newNodes = [...nodes];
    let addedAtIndex = -1;

    if (position === 'start') {
      newNodes = [newNode, ...nodes];
      addedAtIndex = 0;
      setMessage(`Added ${value} at the beginning of the list`);
    } else if (position === 'end') {
      newNodes = [...nodes, newNode];
      addedAtIndex = nodes.length;
      setMessage(`Added ${value} at the end of the list`);
    } else if (position === 'index') {
      const idx = parseInt(index);
      if (isNaN(idx) || idx < 0 || idx > nodes.length) {
        setMessage(`Index must be between 0 and ${nodes.length}`);
        return;
      }

      newNodes = [...nodes.slice(0, idx), newNode, ...nodes.slice(idx)];
      addedAtIndex = idx;
      setMessage(`Added ${value} at index ${idx}`);
    }

    setNodes(newNodes);
    setNewValue('');
    
    // Highlight the new node
    setHighlightedId(newNode.id);
    setTimeout(() => setHighlightedId(null), 1500);
  };

  const handleRemoveNode = () => {
    if (nodes.length === 0) {
      setMessage('List is already empty');
      return;
    }

    let newNodes = [...nodes];
    let removedNode: Node | null = null;

    if (position === 'start') {
      removedNode = newNodes.shift() || null;
      setMessage(`Removed ${removedNode?.value} from the beginning of the list`);
    } else if (position === 'end') {
      removedNode = newNodes.pop() || null;
      setMessage(`Removed ${removedNode?.value} from the end of the list`);
    } else if (position === 'index') {
      const idx = parseInt(index);
      if (isNaN(idx) || idx < 0 || idx >= nodes.length) {
        setMessage(`Index must be between 0 and ${nodes.length - 1}`);
        return;
      }

      // Highlight node to be removed
      setHighlightedId(nodes[idx].id);
      setTimeout(() => {
        removedNode = newNodes[idx];
        newNodes.splice(idx, 1);
        setNodes(newNodes);
        setMessage(`Removed ${removedNode?.value} from index ${idx}`);
        setHighlightedId(null);
      }, 800);
      return;
    }

    setNodes(newNodes);
  };

  const handleClear = () => {
    setNodes([]);
    setMessage('Linked list cleared');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Linked List Visualizer</h2>
      
      <div className="mb-8 overflow-x-auto">
        <div className="flex justify-center min-w-max p-4">
          {nodes.length === 0 ? (
            <div className="p-4 border border-dashed border-gray-300 rounded-md text-gray-500">
              Empty Linked List
            </div>
          ) : (
            <div className="flex items-center">
              {nodes.map((node, idx) => (
                <div key={node.id} className="flex items-center">
                  <div 
                    className={`w-16 h-16 flex flex-col items-center justify-center border-2 
                      ${highlightedId === node.id ? 'border-blue-500 bg-blue-100' : 'border-gray-300'} 
                      rounded-md shadow-sm transition-all duration-300`}
                  >
                    <span className="text-lg">{node.value}</span>
                    <span className="text-xs text-gray-500">({idx})</span>
                  </div>
                  {idx < nodes.length - 1 && (
                    <div className="mx-2 flex items-center">
                      <div className="w-8 h-0.5 bg-gray-400"></div>
                      <div className="w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-8 border-l-gray-400"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="text-sm text-gray-500 text-center mb-4">
          List Length: {nodes.length}
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Add Node</h3>
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
                  Position:
                </label>
                <select
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="start">At Start</option>
                  <option value="end">At End</option>
                  <option value="index">At Index</option>
                </select>
              </div>
              
              {position === 'index' && (
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
              )}
              
              <button
                onClick={handleAddNode}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Add Node
              </button>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Remove Node</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Position:
                </label>
                <select
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="start">From Start</option>
                  <option value="end">From End</option>
                  <option value="index">From Index</option>
                </select>
              </div>
              
              {position === 'index' && (
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
              )}
              
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleRemoveNode}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Remove Node
                </button>
                <button
                  onClick={handleClear}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                >
                  Clear List
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