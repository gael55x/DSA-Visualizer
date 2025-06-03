'use client';

import { useState, useEffect, useCallback } from 'react';
import CodeHighlighter from '../ui/CodeHighlighter';

interface Node {
  value: number;
  id: string;
}

// Linked List operation code templates
const LINKEDLIST_OPERATIONS = {
  insert: `function insertNode(head, value, position) {
  // Create new node
  const newNode = { value, next: null };
  
  // Insert at beginning
  if (position === 0) {
    newNode.next = head;
    return newNode;
  }
  
  // Traverse to position
  let current = head;
  for (let i = 0; i < position - 1; i++) {
    current = current.next;
  }
  
  // Insert the new node
  newNode.next = current.next;
  current.next = newNode;
  
  return head;
}`,

  delete: `function deleteNode(head, position) {
  // Delete from beginning
  if (position === 0) {
    return head.next;
  }
  
  // Traverse to position
  let current = head;
  for (let i = 0; i < position - 1; i++) {
    current = current.next;
  }
  
  // Remove the node
  const nodeToDelete = current.next;
  current.next = nodeToDelete.next;
  
  return head;
}`,

  traverse: `function traverseList(head) {
  // Start from head
  let current = head;
  const values = [];
  
  // Visit each node
  while (current !== null) {
    values.push(current.value);
    current = current.next;
  }
  
  return values;
}`
};

const CODE_STEPS = {
  insert: [
    { line: 2, description: "Create a new node with the given value" },
    { line: 5, description: "Check if inserting at the beginning" },
    { line: 6, description: "Point new node to current head" },
    { line: 7, description: "Return new node as the new head" },
    { line: 11, description: "Traverse to the position before insertion point" },
    { line: 16, description: "Link new node to the next node" },
    { line: 17, description: "Link previous node to the new node" },
    { line: 19, description: "Return the head of the modified list" }
  ],
  
  delete: [
    { line: 2, description: "Check if deleting from the beginning" },
    { line: 3, description: "Return the second node as new head" },
    { line: 7, description: "Traverse to the node before deletion point" },
    { line: 12, description: "Get reference to the node to be deleted" },
    { line: 13, description: "Skip over the node to be deleted" },
    { line: 15, description: "Return the head of the modified list" }
  ],
  
  traverse: [
    { line: 2, description: "Start traversal from the head node" },
    { line: 3, description: "Initialize array to store values" },
    { line: 6, description: "Continue while current node exists" },
    { line: 7, description: "Add current node's value to array" },
    { line: 8, description: "Move to the next node" },
    { line: 11, description: "Return the collected values" }
  ]
};

// Helper function for delays
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

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
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentOperation, setCurrentOperation] = useState<string>('insert');
  const [currentStep, setCurrentStep] = useState(0);

  const handleAddNode = useCallback(async () => {
    if (newValue.trim() === '') {
      setMessage('Please enter a value');
      return;
    }

    const value = parseInt(newValue);
    if (isNaN(value)) {
      setMessage('Please enter a valid number');
      return;
    }

    setIsAnimating(true);
    setCurrentOperation('insert');

    const newNode = { value, id: `node-${nextId}` };
    setNextId(nextId + 1);

    let newNodes = [...nodes];
    let addedAtIndex = -1;

    // Step-by-step animation with code highlighting
    for (let step = 0; step < CODE_STEPS.insert.length; step++) {
      setCurrentStep(step);
      await delay(800);
      
      if (step === 0) {
        // Create new node step
        continue;
      } else if (step === 1 && position === 'start') {
        // Insert at beginning
        newNodes = [newNode, ...nodes];
        addedAtIndex = 0;
        setMessage(`Added ${value} at the beginning of the list`);
        break;
      } else if (step === 4 && (position === 'end' || position === 'index')) {
        // Traverse and insert
        if (position === 'end') {
          newNodes = [...nodes, newNode];
          addedAtIndex = nodes.length;
          setMessage(`Added ${value} at the end of the list`);
        } else if (position === 'index') {
          const idx = parseInt(index);
          if (isNaN(idx) || idx < 0 || idx > nodes.length) {
            setMessage(`Index must be between 0 and ${nodes.length}`);
            setIsAnimating(false);
            return;
          }
          newNodes = [...nodes.slice(0, idx), newNode, ...nodes.slice(idx)];
          addedAtIndex = idx;
          setMessage(`Added ${value} at index ${idx}`);
        }
        break;
      }
    }

    setNodes(newNodes);
    setNewValue('');
    
    // Highlight the new node
    setHighlightedId(newNode.id);
    setTimeout(() => {
      setHighlightedId(null);
      setIsAnimating(false);
    }, 1500);
  }, [newValue, position, index, nodes, nextId]);

  const handleRemoveNode = useCallback(async () => {
    if (nodes.length === 0) {
      setMessage('List is already empty');
      return;
    }

    setIsAnimating(true);
    setCurrentOperation('delete');

    let newNodes = [...nodes];
    let removedNode: Node | null = null;

    // Step-by-step animation with code highlighting
    for (let step = 0; step < CODE_STEPS.delete.length; step++) {
      setCurrentStep(step);
      await delay(800);
      
      if (step === 0 && position === 'start') {
        removedNode = newNodes.shift() || null;
        setMessage(`Removed ${removedNode?.value} from the beginning of the list`);
        break;
      } else if (step === 3 && (position === 'end' || position === 'index')) {
        if (position === 'end') {
          removedNode = newNodes.pop() || null;
          setMessage(`Removed ${removedNode?.value} from the end of the list`);
        } else if (position === 'index') {
          const idx = parseInt(index);
          if (isNaN(idx) || idx < 0 || idx >= nodes.length) {
            setMessage(`Index must be between 0 and ${nodes.length - 1}`);
            setIsAnimating(false);
            return;
          }
          
          // Highlight node to be removed
          setHighlightedId(nodes[idx].id);
          await delay(800);
          
          removedNode = newNodes[idx];
          newNodes.splice(idx, 1);
          setMessage(`Removed ${removedNode?.value} from index ${idx}`);
        }
        break;
      }
    }

    setNodes(newNodes);
    setTimeout(() => {
      setHighlightedId(null);
      setIsAnimating(false);
    }, 800);
  }, [nodes, position, index]);

  const handleTraverse = useCallback(async () => {
    if (nodes.length === 0) {
      setMessage('List is empty - nothing to traverse');
      return;
    }

    setIsAnimating(true);
    setCurrentOperation('traverse');

    // Step-by-step traversal animation
    for (let step = 0; step < CODE_STEPS.traverse.length; step++) {
      setCurrentStep(step);
      await delay(800);
      
      if (step === 2) {
        // Start highlighting nodes one by one
        for (let i = 0; i < nodes.length; i++) {
          setHighlightedId(nodes[i].id);
          await delay(600);
        }
      }
    }

    setMessage(`Traversed ${nodes.length} nodes: [${nodes.map(n => n.value).join(', ')}]`);
    setTimeout(() => {
      setHighlightedId(null);
      setIsAnimating(false);
    }, 1000);
  }, [nodes]);

  const handleClear = () => {
    setNodes([]);
    setMessage('Linked list cleared');
  };

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-100 mb-2">Linked List Visualizer</h1>
          <p className="text-slate-400 text-lg">
            Interactive visualization of linked list operations with step-by-step code execution
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Visualization Panel */}
          <div className="space-y-6">
            {/* List Visualization */}
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
              <h3 className="text-lg font-semibold text-slate-100 mb-4">Linked List Structure</h3>
              
              <div className="mb-8 overflow-x-auto">
                <div className="flex justify-center min-w-max p-4">
                  {nodes.length === 0 ? (
                    <div className="p-4 border border-dashed border-slate-600 rounded-md text-slate-400">
                      Empty Linked List
                    </div>
                  ) : (
                    <div className="flex items-center">
                      {nodes.map((node, idx) => (
                        <div key={node.id} className="flex items-center">
                          <div 
                            className={`w-20 h-16 flex flex-col items-center justify-center border-2 rounded-md shadow-sm transition-all duration-300 ${
                              highlightedId === node.id 
                                ? 'border-sky-400 bg-sky-900/50 text-sky-100' 
                                : 'border-slate-600 bg-slate-700 text-slate-200'
                            }`}
                          >
                            <span className="text-lg font-semibold">{node.value}</span>
                            <span className="text-xs text-slate-400">({idx})</span>
                          </div>
                          {idx < nodes.length - 1 && (
                            <div className="mx-3 flex items-center">
                              <div className="w-8 h-0.5 bg-slate-500"></div>
                              <div className="w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-8 border-l-slate-500"></div>
                            </div>
                          )}
                        </div>
                      ))}
                      <div className="ml-3 px-3 py-2 bg-slate-600 text-slate-300 rounded text-sm">
                        NULL
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="text-sm text-slate-400 text-center mb-4">
                  List Length: {nodes.length}
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
              <h3 className="text-lg font-semibold text-slate-100 mb-4">List Operations</h3>
              
              <div className="space-y-4">
                {/* Insert Node */}
                <div className="p-4 bg-slate-700 rounded-xl">
                  <h4 className="font-medium text-slate-200 mb-3">Insert Node</h4>
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={newValue}
                      onChange={(e) => setNewValue(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-md text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
                      placeholder="Enter a number"
                      disabled={isAnimating}
                    />
                    
                    <div className="flex gap-3">
                      <select
                        value={position}
                        onChange={(e) => setPosition(e.target.value)}
                        className="flex-1 px-3 py-2 bg-slate-600 border border-slate-500 rounded-md text-slate-100 focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
                        disabled={isAnimating}
                      >
                        <option value="start">At Start</option>
                        <option value="end">At End</option>
                        <option value="index">At Index</option>
                      </select>
                      
                      {position === 'index' && (
                        <input
                          type="text"
                          value={index}
                          onChange={(e) => setIndex(e.target.value)}
                          className="w-20 px-3 py-2 bg-slate-600 border border-slate-500 rounded-md text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
                          placeholder="Index"
                          disabled={isAnimating}
                        />
                      )}
                    </div>
                    
                    <button
                      onClick={handleAddNode}
                      disabled={isAnimating || !newValue.trim()}
                      className="w-full px-4 py-2 bg-sky-500 hover:bg-sky-600 disabled:bg-slate-600 text-white disabled:text-slate-400 rounded-md font-medium transition-colors"
                    >
                      {isAnimating && currentOperation === 'insert' ? 'Inserting...' : 'Insert Node'}
                    </button>
                  </div>
                </div>

                {/* Other Operations */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <button
                    onClick={handleRemoveNode}
                    disabled={isAnimating || nodes.length === 0}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-slate-600 text-white disabled:text-slate-400 rounded-md font-medium transition-colors"
                  >
                    {isAnimating && currentOperation === 'delete' ? 'Deleting...' : 'Delete Node'}
                  </button>
                  
                  <button
                    onClick={handleTraverse}
                    disabled={isAnimating || nodes.length === 0}
                    className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 disabled:bg-slate-600 text-slate-900 disabled:text-slate-400 rounded-md font-medium transition-colors"
                  >
                    {isAnimating && currentOperation === 'traverse' ? 'Traversing...' : 'Traverse'}
                  </button>
                  
                  <button
                    onClick={handleClear}
                    disabled={isAnimating}
                    className="px-4 py-2 bg-gray-500 hover:bg-gray-600 disabled:bg-slate-600 text-white disabled:text-slate-400 rounded-md font-medium transition-colors"
                  >
                    Clear List
                  </button>
                </div>
              </div>
              
              {message && (
                <div className="mt-4 p-3 bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-800 rounded-md text-sky-800 dark:text-sky-200">
                  {message}
                </div>
              )}
            </div>
          </div>

          {/* Code Panel */}
          <div className="space-y-6">
            <CodeHighlighter
              code={LINKEDLIST_OPERATIONS[currentOperation as keyof typeof LINKEDLIST_OPERATIONS]}
              language="javascript"
              title={`Linked List ${currentOperation.charAt(0).toUpperCase() + currentOperation.slice(1)} Operation`}
              steps={CODE_STEPS[currentOperation as keyof typeof CODE_STEPS]}
              currentStep={currentStep}
              showControls={false}
            />

            {/* Linked List Properties */}
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
              <h3 className="text-lg font-semibold text-slate-100 mb-4">Linked List Properties</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Data Structure:</span>
                  <span className="text-slate-200">Linear (Dynamic)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Memory Allocation:</span>
                  <span className="text-slate-200">Dynamic</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Insert Time Complexity:</span>
                  <span className="text-green-400">O(1) at head, O(n) at position</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Delete Time Complexity:</span>
                  <span className="text-green-400">O(1) at head, O(n) at position</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Search Time Complexity:</span>
                  <span className="text-yellow-400">O(n)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Space Complexity:</span>
                  <span className="text-yellow-400">O(n)</span>
                </div>
              </div>
            </div>

            {/* Use Cases */}
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
              <h3 className="text-lg font-semibold text-slate-100 mb-4">Common Use Cases</h3>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-sky-400 rounded-full mt-2 flex-shrink-0" />
                  Dynamic memory allocation
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-sky-400 rounded-full mt-2 flex-shrink-0" />
                  Implementation of other data structures
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-sky-400 rounded-full mt-2 flex-shrink-0" />
                  Undo functionality in applications
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-sky-400 rounded-full mt-2 flex-shrink-0" />
                  Music players (next/previous song)
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-sky-400 rounded-full mt-2 flex-shrink-0" />
                  Browser history navigation
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 