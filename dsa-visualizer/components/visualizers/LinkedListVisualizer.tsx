'use client';

import React, { useState, useCallback } from 'react';
import CodeHighlighter from '../ui/CodeHighlighter';

interface Node {
  value: number;
  id: string;
  x?: number;
  y?: number;
  isDragging?: boolean;
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
    { lines: [5, 6, 7], description: "Check if inserting at beginning and handle special case" },
    { lines: [11, 12], description: "Start from head to traverse to position" },
    { lines: [12, 13, 14], description: "Traverse to the position before insertion point" },
    { lines: [17, 18], description: "Link new node to next and previous node to new node" },
    { line: 20, description: "Return the head of the modified list" }
  ],
  
  delete: [
    { lines: [2, 3], description: "Check if deleting from beginning and return new head" },
    { lines: [7, 8], description: "Start from head to traverse to position" },
    { lines: [8, 9, 10], description: "Traverse to the node before deletion point" },
    { lines: [13, 14], description: "Get reference and skip over the node to be deleted" },
    { line: 16, description: "Return the head of the modified list" }
  ],
  
  traverse: [
    { lines: [2, 3], description: "Start traversal from head and initialize array" },
    { lines: [6, 7, 8], description: "Loop: check node exists, add value, move to next" },
    { line: 11, description: "Return the collected values" }
  ]
};

// Helper function for delays
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export default function LinkedListVisualizer() {
  const [nodes, setNodes] = useState<Node[]>([
    { value: 10, id: 'node-1', x: 100, y: 200 },
    { value: 20, id: 'node-2', x: 250, y: 200 },
    { value: 30, id: 'node-3', x: 400, y: 200 },
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
  const [traversalIndex, setTraversalIndex] = useState<number>(-1);
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

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
    setTraversalIndex(-1);

    // Calculate position for new node
    let newX = 100, newY = 200;
    if (nodes.length > 0) {
      if (position === 'start') {
        newX = (nodes[0]?.x || 100) - 150;
        newY = nodes[0]?.y || 200;
      } else if (position === 'end') {
        const lastNode = nodes[nodes.length - 1];
        newX = (lastNode?.x || 100) + 150;
        newY = lastNode?.y || 200;
      } else {
        const idx = parseInt(index);
        if (idx < nodes.length) {
          newX = (nodes[idx]?.x || 100) - 75;
          newY = (nodes[idx]?.y || 200) + 100;
        }
      }
    }

    const newNode = { value, id: `node-${nextId}`, x: newX, y: newY };
    setNextId(nextId + 1);

    let newNodes = [...nodes];

    // Step-by-step animation with code highlighting
    for (let step = 0; step < CODE_STEPS.insert.length; step++) {
      setCurrentStep(step);
      await delay(800);
      
      if (step === 0) {
        // Create new node step
        setMessage(`Creating new node with value ${value}`);
      } else if (step === 1) {
        // Check insertion position
        if (position === 'start') {
          // Insert at beginning
          newNodes = [newNode, ...nodes];
          setMessage(`Added ${value} at the beginning of the list`);
          break;
        }
      } else if (step === 2) {
        // Start traversal for end/index insertion
        if (position === 'end' || position === 'index') {
          setMessage('Starting traversal to find insertion point');
          if (nodes.length > 0) {
            setTraversalIndex(0);
            setHighlightedId(nodes[0].id);
          }
        }
      } else if (step === 3) {
        // Show traversal animation
        if (position === 'index') {
          const idx = parseInt(index);
          if (isNaN(idx) || idx < 0 || idx > nodes.length) {
            setMessage(`Index must be between 0 and ${nodes.length}`);
            setIsAnimating(false);
            return;
          }
          
          // Animate traversal to target position
          for (let i = 0; i < idx && i < nodes.length; i++) {
            setTraversalIndex(i);
            setHighlightedId(nodes[i].id);
            await delay(600);
          }
        } else if (position === 'end') {
          // For end insertion, traverse to the last node
          for (let i = 0; i < nodes.length; i++) {
            setTraversalIndex(i);
            setHighlightedId(nodes[i].id);
            await delay(600);
          }
        }
      } else if (step === 4) {
        // Perform the actual insertion
        setHighlightedId(null);
        if (position === 'end') {
          newNodes = [...nodes, newNode];
          setMessage(`Added ${value} at the end of the list`);
        } else if (position === 'index') {
          const idx = parseInt(index);
          newNodes = [...nodes.slice(0, idx), newNode, ...nodes.slice(idx)];
          setMessage(`Added ${value} at index ${idx}`);
        }
        break;
      }
    }

    setNodes(newNodes);
    setNewValue('');
    setTraversalIndex(-1);
    
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
    setTraversalIndex(-1);

    let newNodes = [...nodes];
    let removedNode: Node | null = null;

    // Step-by-step animation with code highlighting
    for (let step = 0; step < CODE_STEPS.delete.length; step++) {
      setCurrentStep(step);
      await delay(800);
      
      if (step === 0) {
        // Check if deleting from beginning
        if (position === 'start') {
          removedNode = newNodes.shift() || null;
          setMessage(`Removed ${removedNode?.value} from the beginning of the list`);
          break;
        }
      } else if (step === 1) {
        // Start traversal for end/index deletion
        if (position === 'end' || position === 'index') {
          setMessage('Starting traversal to find deletion point');
          if (nodes.length > 0) {
            setTraversalIndex(0);
            setHighlightedId(nodes[0].id);
          }
        }
      } else if (step === 2) {
        // Show traversal animation
        if (position === 'index') {
          const idx = parseInt(index);
          if (isNaN(idx) || idx < 0 || idx >= nodes.length) {
            setMessage(`Index must be between 0 and ${nodes.length - 1}`);
            setIsAnimating(false);
            return;
          }
          
          // Traverse to target position
          for (let i = 0; i <= idx && i < nodes.length; i++) {
            setTraversalIndex(i);
            setHighlightedId(nodes[i].id);
            await delay(600);
          }
          removedNode = nodes[idx];
        } else if (position === 'end') {
          // Traverse to the last node
          for (let i = 0; i < nodes.length; i++) {
            setTraversalIndex(i);
            setHighlightedId(nodes[i].id);
            await delay(600);
          }
          removedNode = nodes[nodes.length - 1];
        }
      } else if (step === 3) {
        // Highlight node to be deleted
        setMessage(`Deleting node with value ${removedNode?.value}`);
        await delay(800);
      } else if (step === 4) {
        // Perform the actual deletion
        setHighlightedId(null);
        if (position === 'end') {
          newNodes.pop();
          setMessage(`Removed ${removedNode?.value} from the end of the list`);
        } else if (position === 'index') {
          const idx = parseInt(index);
          newNodes.splice(idx, 1);
          setMessage(`Removed ${removedNode?.value} from index ${idx}`);
        }
        break;
      }
    }

    setNodes(newNodes);
    setTraversalIndex(-1);
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
    setTraversalIndex(-1);

    // Step-by-step traversal animation
    for (let step = 0; step < CODE_STEPS.traverse.length; step++) {
      setCurrentStep(step);
      await delay(800);
      
      if (step === 0) {
        // Start from head
        setTraversalIndex(0);
        setHighlightedId(nodes[0].id);
      } else if (step === 1) {
        // Initialize values array
        continue;
      } else if (step === 2) {
        // Start the traversal loop
        for (let i = 0; i < nodes.length; i++) {
          setTraversalIndex(i);
          setHighlightedId(nodes[i].id);
          
          // Show "add value to array" step
          if (i < nodes.length) {
            setCurrentStep(3); // Add current node's value
            await delay(600);
            
            if (i < nodes.length - 1) {
              setCurrentStep(4); // Move to next node
              await delay(600);
              setCurrentStep(5); // Check next node
              await delay(600);
            }
          }
        }
        
        // Final step - return values
        setCurrentStep(6);
        await delay(800);
        break;
      }
    }

    setMessage(`Traversed ${nodes.length} nodes: [${nodes.map(n => n.value).join(', ')}]`);
    setTraversalIndex(-1);
    setTimeout(() => {
      setHighlightedId(null);
      setIsAnimating(false);
    }, 1000);
  }, [nodes]);

  const handleClear = () => {
    setNodes([]);
    setMessage('Linked list cleared');
  };

  // Drag handlers
  const handleMouseDown = (e: React.MouseEvent, nodeId: string) => {
    if (isAnimating) return;
    
    e.preventDefault();
    setDraggedNode(nodeId);
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (draggedNode && !isAnimating) {
      const container = document.querySelector('.linked-list-container') as HTMLElement;
      if (!container) return;
      
      const containerRect = container.getBoundingClientRect();
      const newX = e.clientX - containerRect.left - dragOffset.x;
      const newY = e.clientY - containerRect.top - dragOffset.y;
      
      setNodes(prev => prev.map(node => 
        node.id === draggedNode 
          ? { ...node, x: Math.max(50, Math.min(newX, containerRect.width - 100)), y: Math.max(50, Math.min(newY, containerRect.height - 100)) }
          : node
      ));
    }
  }, [draggedNode, dragOffset, isAnimating]);

  const handleMouseUp = useCallback(() => {
    setDraggedNode(null);
  }, []);

  // Add mouse event listeners for dragging
  React.useEffect(() => {
    if (draggedNode) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [draggedNode, handleMouseMove, handleMouseUp]);

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

        <div className="grid grid-cols-1 lg:grid-cols-[7fr_3fr] gap-8">
          {/* Visualization Panel */}
          <div className="space-y-6">
            {/* List Visualization */}
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
              <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
                Linked List Structure
                <span className="text-xs text-slate-400 bg-slate-700 px-2 py-1 rounded">
                  Drag nodes to reposition
                </span>
              </h3>
              
              <div className="mb-8 mt-5">
                {nodes.length === 0 ? (
                  <div className="flex justify-center p-4">
                    <div className="p-4 border border-dashed border-slate-600 rounded-md text-slate-400">
                      Empty Linked List
                    </div>
                  </div>
                ) : (
                  <div className="linked-list-container relative w-full h-96 bg-slate-900/30 rounded-xl border border-slate-600 overflow-hidden">
                    <svg 
                      className="absolute inset-0 w-full h-full pointer-events-none"
                      style={{ zIndex: 1 }}
                    >
                      {/* Draw arrows between connected nodes */}
                                              {nodes.map((node, idx) => {
                          const nextNode = nodes[idx + 1];
                          if (idx < nodes.length - 1 && node.x && node.y && nextNode?.x && nextNode?.y) {
                            const startX = node.x + 40; // center of current node
                            const startY = node.y + 32;
                            const endX = nextNode.x + 40; // center of next node
                            const endY = nextNode.y + 32;
                          
                          return (
                            <line
                              key={`arrow-${node.id}`}
                              x1={startX}
                              y1={startY}
                              x2={endX}
                              y2={endY}
                              stroke={traversalIndex === idx ? '#fbbf24' : '#64748b'}
                              strokeWidth="2"
                              markerEnd="url(#arrowhead)"
                            />
                          );
                        }
                        return null;
                      })}
                      
                      {/* Arrow marker definition */}
                      <defs>
                        <marker
                          id="arrowhead"
                          markerWidth="10"
                          markerHeight="7"
                          refX="9"
                          refY="3.5"
                          orient="auto"
                        >
                          <polygon
                            points="0 0, 10 3.5, 0 7"
                            fill="#64748b"
                          />
                        </marker>
                      </defs>
                    </svg>

                    {/* Render draggable nodes */}
                    {nodes.map((node, idx) => (
                      <div
                        key={node.id}
                        className={`absolute cursor-move select-none transition-all duration-200 ${
                          draggedNode === node.id ? 'z-20 scale-105' : 'z-10'
                        }`}
                        style={{
                          left: node.x || 0,
                          top: node.y || 0,
                          transform: draggedNode === node.id ? 'scale(1.05)' : 'scale(1)',
                        }}
                        onMouseDown={(e) => handleMouseDown(e, node.id)}
                      >
                        {/* Indicator above node */}
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                          {traversalIndex === idx && (
                            <div className="bg-yellow-500 text-black text-xs px-2 py-1 rounded-full font-semibold shadow-lg whitespace-nowrap">
                              CURRENT
                            </div>
                          )}
                          {highlightedId === node.id && traversalIndex !== idx && (
                            <div className="bg-sky-500 text-white text-xs px-2 py-1 rounded-full font-semibold shadow-lg whitespace-nowrap">
                              ACTIVE
                            </div>
                          )}
                        </div>
                        
                        {/* Node */}
                        <div 
                          className={`w-20 h-16 flex flex-col items-center justify-center border-2 rounded-lg shadow-lg transition-all duration-300 ${
                            highlightedId === node.id 
                              ? 'border-sky-400 bg-sky-900/50 text-sky-100 shadow-sky-400/25' 
                              : traversalIndex === idx 
                              ? 'border-yellow-400 bg-yellow-900/50 text-yellow-100 shadow-yellow-400/25'
                              : draggedNode === node.id
                              ? 'border-purple-400 bg-purple-900/50 text-purple-100 shadow-purple-400/25'
                              : 'border-slate-600 bg-slate-700 text-slate-200'
                          }`}
                        >
                          <span className="text-lg font-semibold">{node.value}</span>
                          <span className="text-xs text-slate-400">({idx})</span>
                        </div>
                        
                        {/* Label below node */}
                        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
                          {idx === 0 && (
                            <span className="text-xs text-green-400 font-medium whitespace-nowrap">HEAD</span>
                          )}
                          {idx === nodes.length - 1 && nodes.length > 1 && (
                            <span className="text-xs text-red-400 font-medium whitespace-nowrap">TAIL</span>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    {/* NULL pointer */}
                    {nodes.length > 0 && (
                      <div
                        className="absolute z-10"
                        style={{
                          left: (nodes[nodes.length - 1]?.x || 0) + 120,
                          top: (nodes[nodes.length - 1]?.y || 0) + 20,
                        }}
                      >
                        <div className="px-3 py-2 bg-slate-600 text-slate-300 rounded-lg text-sm font-medium border-2 border-slate-500 shadow-lg">
                          NULL
                        </div>
                        <div className="text-center mt-1">
                          <span className="text-xs text-slate-500 font-medium">END</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="text-sm text-slate-400 text-center mt-6">
                  List Length: {nodes.length}
                  {traversalIndex >= 0 && (
                    <span className="ml-4 text-yellow-400">
                      Traversing: Position {traversalIndex}
                    </span>
                  )}
                  {draggedNode && (
                    <span className="ml-4 text-purple-400">
                      Dragging node...
                    </span>
                  )}
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
                      type="number"
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
                          type="number"
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

            />
          </div>
        </div>

        {/* Separate Information Section */}
        
        <div className="mt-12 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
              About Linked Lists
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Understanding the fundamentals, properties, and complexity analysis of linked list data structures
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            
            {/* What is a Linked List - Takes more space */}
            <div className="xl:col-span-2 bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 border border-slate-700/50 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-100">What is a Linked List?</h3>
              </div>
              
              <p className="text-slate-300 mb-8 leading-relaxed text-lg">
                A linked list is a linear data structure where elements are stored in nodes, each containing data and a 
                pointer to the next node. Unlike arrays, nodes are not stored in contiguous memory locations, making 
                them highly flexible for dynamic operations.
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
                      <span>Dynamic size allocation</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                      <span>Efficient insertion/deletion at head</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                      <span>Memory efficient - no pre-allocation</span>
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
                      <span>No random access to elements</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                      <span>Extra memory for storing pointers</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                      <span>Poor cache locality</span>
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
                  <span className="text-slate-200 font-semibold">Linear Dynamic</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
                  <span className="text-slate-400 font-medium">Memory:</span>
                  <span className="text-slate-200 font-semibold">Dynamic</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
                  <span className="text-slate-400 font-medium">Access:</span>
                  <span className="text-yellow-400 font-mono font-bold">O(n)</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
                  <span className="text-slate-400 font-medium">Search:</span>
                  <span className="text-yellow-400 font-mono font-bold">O(n)</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
                  <span className="text-slate-400 font-medium">Insert (Head):</span>
                  <span className="text-green-400 font-mono font-bold">O(1)</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-slate-400 font-medium">Delete (Head):</span>
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
                <div className="w-10 h-10 bg-cyan-500/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-100">Common Use Cases</h3>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                {[
                  {title: "Dynamic Memory Management", desc: "Allocate memory as needed" },
                  {title: "Data Structure Foundation", desc: "Building blocks for stacks, queues" },
                  {title: "Undo Functionality", desc: "Track operation history" },
                  {title: "Media Players", desc: "Next/previous song navigation" },
                  {title: "Browser History", desc: "Forward/backward page navigation" }
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
                <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-2xl p-5">
                  <h4 className="font-bold mb-4 text-yellow-400 text-sm uppercase tracking-wide">Access & Search</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Access by index</span>
                      <span className="text-yellow-400 font-mono font-bold text-lg">O(n)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Search element</span>
                      <span className="text-yellow-400 font-mono font-bold text-lg">O(n)</span>
                    </div>
                  </div>
                </div>

                {/* Insertion */}
                <div className="bg-green-500/5 border border-green-500/20 rounded-2xl p-5">
                  <h4 className="font-bold mb-4 text-green-400 text-sm uppercase tracking-wide">Insertion</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">At beginning</span>
                      <span className="text-green-400 font-mono font-bold text-lg">O(1)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">At end/position</span>
                      <span className="text-yellow-400 font-mono font-bold text-lg">O(n)</span>
                    </div>
                  </div>
                </div>

                {/* Deletion */}
                <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-5">
                  <h4 className="font-bold mb-4 text-red-400 text-sm uppercase tracking-wide">Deletion</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">From beginning</span>
                      <span className="text-green-400 font-mono font-bold text-lg">O(1)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">From end/by value</span>
                      <span className="text-yellow-400 font-mono font-bold text-lg">O(n)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 