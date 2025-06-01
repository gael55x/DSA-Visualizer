'use client';

import React from 'react';
import { useState, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Search, RotateCcw, Shuffle, Play, Pause, SkipForward, SkipBack, Settings } from 'lucide-react';
import CodeHighlighter from '../ui/CodeHighlighter';
import ThemeToggle from '../ui/ThemeToggle';
import { cn, delay } from '../../lib/utils';

interface TreeNode {
  value: number;
  left: TreeNode | null;
  right: TreeNode | null;
  id: string;
  x?: number;
  y?: number;
  isHighlighted?: boolean;
  isSearching?: boolean;
  isInserting?: boolean;
  isDeleting?: boolean;
  isDragging?: boolean;
}

const TREE_OPERATIONS = {
  insert: `function insert(root, value) {
  // Base case: create new node
  if (root === null) {
    return new TreeNode(value);
  }
  
  // Recursive case: traverse tree
  if (value < root.value) {
    root.left = insert(root.left, value);
  } else if (value > root.value) {
    root.right = insert(root.right, value);
  }
  
  return root;
}`,

  search: `function search(root, value) {
  // Base case: empty tree or found
  if (root === null || root.value === value) {
    return root;
  }
  
  // Search left subtree
  if (value < root.value) {
    return search(root.left, value);
  }
  
  // Search right subtree
  return search(root.right, value);
}`,

  delete: `function deleteNode(root, value) {
  // Base case: empty tree
  if (root === null) {
    return root;
  }
  
  // Find the node to delete
  if (value < root.value) {
    root.left = deleteNode(root.left, value);
  } else if (value > root.value) {
    root.right = deleteNode(root.right, value);
  } else {
    // Node to delete found
    
    // Case 1: No children (leaf node)
    if (root.left === null && root.right === null) {
      return null;
    }
    
    // Case 2: One child
    if (root.left === null) {
      return root.right;
    }
    if (root.right === null) {
      return root.left;
    }
    
    // Case 3: Two children
    // Find inorder successor (smallest in right subtree)
    let successor = root.right;
    while (successor.left !== null) {
      successor = successor.left;
    }
    
    // Replace value with successor
    root.value = successor.value;
    
    // Delete the successor
    root.right = deleteNode(root.right, successor.value);
  }
  
  return root;
}`
};

const CODE_STEPS = {
  insert: [
    { lines: [2, 3], description: "Check if we've reached an empty spot (base case)" },
    { lines: [4], description: "Create and return a new node with the value" },
    { lines: [7, 8], description: "Compare value with current node to decide direction" },
    { lines: [9], description: "Go left if value is smaller" },
    { lines: [10, 11], description: "Go right if value is larger" },
    { lines: [14], description: "Return the modified tree" }
  ],
  
  search: [
    { lines: [2, 3], description: "Check if tree is empty or value is found" },
    { lines: [4], description: "Return the node (null if not found, node if found)" },
    { lines: [7, 8], description: "If target is smaller, search left subtree" },
    { lines: [9], description: "Recursively search the left side" },
    { lines: [12, 13], description: "Otherwise, search right subtree" }
  ],
  
  delete: [
    { lines: [2, 3], description: "Check if tree is empty" },
    { lines: [6, 7], description: "Find the node to delete by comparing values" },
    { lines: [8], description: "Go left if target is smaller" },
    { lines: [9, 10], description: "Go right if target is larger" },
    { lines: [12], description: "Node found! Handle deletion cases" },
    { lines: [14, 15], description: "Case 1: Leaf node (no children)" },
    { lines: [19, 20, 21, 22], description: "Case 2: Node with one child" },
    { lines: [25, 26, 27, 28], description: "Case 3: Node with two children - find successor" },
    { lines: [31], description: "Replace current node's value with successor's value" },
    { lines: [34], description: "Delete the successor node" }
  ]
};

export default function BinaryTreeVisualizer() {
  const [root, setRoot] = useState<TreeNode | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [message, setMessage] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentOperation, setCurrentOperation] = useState<string>('insert');
  const [currentStep, setCurrentStep] = useState(0);
  const [searchResult, setSearchResult] = useState<TreeNode | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [treeOffset, setTreeOffset] = useState({ x: 0, y: 0 });
  const [animationSpeed, setAnimationSpeed] = useState(1200);
  const [isPlaying, setIsPlaying] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  // Calculate node positions for visualization
  const calculatePositions = useCallback((node: TreeNode | null, x = 400, y = 80, level = 0): TreeNode | null => {
    if (!node) return null;
    
    const spacing = Math.max(180 / (level + 1), 60);
    
    return {
      ...node,
      x: x + treeOffset.x,
      y: y + treeOffset.y,
      left: node.left ? calculatePositions(node.left, x - spacing, y + 90, level + 1) : null,
      right: node.right ? calculatePositions(node.right, x + spacing, y + 90, level + 1) : null
    };
  }, [treeOffset]);

  const positionedRoot = useMemo(() => calculatePositions(root), [root, calculatePositions]);

  const showMessage = (text: string, type: 'success' | 'error' | 'info' = 'info') => {
    setMessage(text);
    setTimeout(() => setMessage(''), 3000);
  };

  const insertNode = useCallback(async () => {
    if (!inputValue.trim()) {
      showMessage('Please enter a value', 'error');
      return;
    }

    const value = parseInt(inputValue);
    if (isNaN(value)) {
      showMessage('Please enter a valid number', 'error');
      return;
    }

    setIsAnimating(true);
    setIsPlaying(true);
    setCurrentOperation('insert');

    const insertRecursive = async (node: TreeNode | null, val: number): Promise<TreeNode> => {
      const steps = CODE_STEPS.insert;
      
      for (let step = 0; step < steps.length; step++) {
        setCurrentStep(step);
        await delay(animationSpeed);

        if (step === 0 && node === null) {
          const newNode: TreeNode = {
            value: val,
            left: null,
            right: null,
            id: generateId(),
            isInserting: true
          };
          return newNode;
        } else if (step === 2 && node) {
          setRoot(highlightNode(root, node.id, 'isHighlighted'));
          await delay(animationSpeed * 0.5);
          
          if (val < node.value) {
            setCurrentStep(3);
            await delay(animationSpeed);
            node.left = await insertRecursive(node.left, val);
          } else if (val > node.value) {
            setCurrentStep(4);
            await delay(animationSpeed);
            node.right = await insertRecursive(node.right, val);
          }
          break;
        }
      }
      
      return node!;
    };

    try {
      const newRoot = await insertRecursive(root, value);
      setRoot(newRoot);
      setInputValue('');
      showMessage(`Value ${value} inserted successfully!`, 'success');
    } catch (error) {
      showMessage('Error inserting node', 'error');
    } finally {
      setIsAnimating(false);
      setIsPlaying(false);
      setTimeout(() => setRoot(clearHighlights(root)), 500);
    }
  }, [inputValue, root, animationSpeed]);

  const searchNode = useCallback(async () => {
    if (!searchValue.trim()) {
      showMessage('Please enter a value to search', 'error');
      return;
    }

    const value = parseInt(searchValue);
    if (isNaN(value)) {
      showMessage('Please enter a valid number', 'error');
      return;
    }

    setIsAnimating(true);
    setIsPlaying(true);
    setCurrentOperation('search');

    const searchRecursive = async (node: TreeNode | null, val: number): Promise<TreeNode | null> => {
      const steps = CODE_STEPS.search;
      
      for (let step = 0; step < steps.length; step++) {
        setCurrentStep(step);
        await delay(animationSpeed);

        if (step === 0) {
          if (node === null || node.value === val) {
            if (node) {
              setRoot(highlightNode(root, node.id, 'isSearching'));
              showMessage(`Value ${val} found!`, 'success');
            } else {
              showMessage(`Value ${val} not found`, 'error');
            }
            return node;
          }
        } else if (step === 2 && node) {
          setRoot(highlightNode(root, node.id, 'isHighlighted'));
          await delay(animationSpeed * 0.5);
          
          if (val < node.value) {
            setCurrentStep(3);
            await delay(animationSpeed);
            return await searchRecursive(node.left, val);
          } else {
            setCurrentStep(4);
            await delay(animationSpeed);
            return await searchRecursive(node.right, val);
          }
        }
      }
      
      return null;
    };

    try {
      const result = await searchRecursive(root, value);
      setSearchResult(result);
    } catch (error) {
      showMessage('Error searching node', 'error');
    } finally {
      setIsAnimating(false);
      setIsPlaying(false);
      setTimeout(() => setRoot(clearHighlights(root)), 2000);
    }
  }, [searchValue, root, animationSpeed]);

  const deleteNode = useCallback(async () => {
    if (!inputValue.trim()) {
      showMessage('Please enter a value to delete', 'error');
      return;
    }

    const value = parseInt(inputValue);
    if (isNaN(value)) {
      showMessage('Please enter a valid number', 'error');
      return;
    }

    setIsAnimating(true);
    setIsPlaying(true);
    setCurrentOperation('delete');

    // Simplified delete for animation purposes
    const deleteRecursive = (node: TreeNode | null, val: number): TreeNode | null => {
      if (node === null) return null;
      
      if (val < node.value) {
        node.left = deleteRecursive(node.left, val);
      } else if (val > node.value) {
        node.right = deleteRecursive(node.right, val);
      } else {
        if (node.left === null && node.right === null) return null;
        if (node.left === null) return node.right;
        if (node.right === null) return node.left;
        
        let successor = node.right;
        while (successor.left !== null) {
          successor = successor.left;
        }
        node.value = successor.value;
        node.right = deleteRecursive(node.right, successor.value);
      }
      
      return node;
    };

    // Animate through steps
    const steps = CODE_STEPS.delete;
    for (let step = 0; step < steps.length; step++) {
      setCurrentStep(step);
      await delay(animationSpeed);
    }

    try {
      const newRoot = deleteRecursive(root, value);
      setRoot(newRoot);
      setInputValue('');
      showMessage(`Value ${value} deleted successfully!`, 'success');
    } catch (error) {
      showMessage('Error deleting node', 'error');
    } finally {
      setIsAnimating(false);
      setIsPlaying(false);
    }
  }, [inputValue, root, animationSpeed]);

  const clearTree = () => {
    setRoot(null);
    setMessage('');
    setCurrentStep(0);
    setSearchResult(null);
  };

  const generateRandomTree = () => {
    const values = Array.from({length: 7}, () => Math.floor(Math.random() * 100));
    let newRoot: TreeNode | null = null;
    
    values.forEach(value => {
      newRoot = insertNodeSync(newRoot, value);
    });
    
    setRoot(newRoot);
    showMessage('Random tree generated!', 'success');
  };

  const insertNodeSync = (node: TreeNode | null, value: number): TreeNode => {
    if (node === null) {
      return {
        value,
        left: null,
        right: null,
        id: generateId()
      };
    }
    
    if (value < node.value) {
      node.left = insertNodeSync(node.left, value);
    } else if (value > node.value) {
      node.right = insertNodeSync(node.right, value);
    }
    
    return node;
  };

  const highlightNode = (node: TreeNode | null, id: string, highlightType: string): TreeNode | null => {
    if (!node) return null;
    
    return {
      ...node,
      isHighlighted: highlightType === 'isHighlighted' ? node.id === id : false,
      isSearching: highlightType === 'isSearching' ? node.id === id : false,
      isInserting: highlightType === 'isInserting' ? node.id === id : false,
      isDeleting: highlightType === 'isDeleting' ? node.id === id : false,
      left: highlightNode(node.left, id, highlightType),
      right: highlightNode(node.right, id, highlightType)
    };
  };

  const clearHighlights = (node: TreeNode | null): TreeNode | null => {
    if (!node) return null;
    
    return {
      ...node,
      isHighlighted: false,
      isSearching: false,
      isInserting: false,
      isDeleting: false,
      left: clearHighlights(node.left),
      right: clearHighlights(node.right)
    };
  };

  // Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - treeOffset.x,
      y: e.clientY - treeOffset.y
    });
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      setTreeOffset({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      });
    }
  }, [isDragging, dragOffset]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Render tree nodes
  const renderNode = (node: TreeNode | null): React.JSX.Element | null => {
    if (!node || !node.x || !node.y) return null;

    return (
      <g key={node.id}>
        {/* Render connections to children */}
        {node.left && node.left.x && node.left.y && (
          <motion.line
            x1={node.x}
            y1={node.y}
            x2={node.left.x}
            y2={node.left.y}
            stroke="currentColor"
            strokeWidth="2"
            className="text-gray-400 dark:text-slate-500"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5 }}
          />
        )}
        {node.right && node.right.x && node.right.y && (
          <motion.line
            x1={node.x}
            y1={node.y}
            x2={node.right.x}
            y2={node.right.y}
            stroke="currentColor"
            strokeWidth="2"
            className="text-gray-400 dark:text-slate-500"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5 }}
          />
        )}
        
        {/* Render node */}
        <motion.circle
          cx={node.x}
          cy={node.y}
          r="28"
          initial={{ scale: 0, rotate: 0 }}
          animate={{ 
            scale: 1,
            rotate: node.isHighlighted ? 360 : 0
          }}
          whileHover={{ scale: 1.1 }}
          className={cn(
            "transition-all duration-300 cursor-pointer",
            node.isHighlighted && "fill-yellow-400 stroke-yellow-600 drop-shadow-lg",
            node.isSearching && "fill-green-400 stroke-green-600 drop-shadow-lg",
            node.isInserting && "fill-blue-400 stroke-blue-600 drop-shadow-lg",
            node.isDeleting && "fill-red-400 stroke-red-600 drop-shadow-lg",
            !node.isHighlighted && !node.isSearching && !node.isInserting && !node.isDeleting && 
            "fill-white dark:fill-slate-700 stroke-gray-400 dark:stroke-slate-500"
          )}
          strokeWidth="3"
        />
        
        <text
          x={node.x}
          y={node.y + 6}
          textAnchor="middle"
          className="text-sm font-bold fill-gray-900 dark:fill-slate-100 pointer-events-none select-none"
        >
          {node.value}
        </text>
        
        {/* Render children */}
        {renderNode(node.left)}
        {renderNode(node.right)}
      </g>
    );
  };

  const currentCode = TREE_OPERATIONS[currentOperation as keyof typeof TREE_OPERATIONS];
  const currentCodeSteps = CODE_STEPS[currentOperation as keyof typeof CODE_STEPS];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Compact Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">
              Binary Search Tree
            </h1>
            <p className="text-sm text-gray-600 dark:text-slate-400">
              Interactive visualization with draggable tree
            </p>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Tree Visualization - Full width on large screens */}
          <div className="xl:col-span-2 space-y-4">
            {/* Controls */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-slate-700 p-4 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Input */}
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Value"
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100"
                    disabled={isAnimating}
                  />
                  <button
                    onClick={insertNode}
                    disabled={isAnimating}
                    className="px-3 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-lg text-sm font-medium"
                  >
                    <Plus size={16} />
                  </button>
                  <button
                    onClick={deleteNode}
                    disabled={isAnimating}
                    className="px-3 py-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white rounded-lg text-sm font-medium"
                  >
                    <Minus size={16} />
                  </button>
                </div>

                {/* Search */}
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="Search"
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100"
                    disabled={isAnimating}
                  />
                  <button
                    onClick={searchNode}
                    disabled={isAnimating}
                    className="px-3 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white rounded-lg text-sm font-medium"
                  >
                    <Search size={16} />
                  </button>
                </div>

                {/* Utils */}
                <div className="flex gap-2">
                  <button
                    onClick={generateRandomTree}
                    disabled={isAnimating}
                    className="flex-1 px-3 py-2 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-400 text-white rounded-lg text-sm font-medium"
                  >
                    <Shuffle size={16} />
                  </button>
                  <button
                    onClick={clearTree}
                    disabled={isAnimating}
                    className="flex-1 px-3 py-2 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white rounded-lg text-sm font-medium"
                  >
                    <RotateCcw size={16} />
                  </button>
                </div>
              </div>

              {/* Speed Control */}
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600 dark:text-slate-400">Speed:</span>
                  <input
                    type="range"
                    min="300"
                    max="2000"
                    step="100"
                    value={animationSpeed}
                    onChange={(e) => setAnimationSpeed(parseInt(e.target.value))}
                    className="flex-1"
                    disabled={isAnimating}
                  />
                  <span className="text-sm text-gray-600 dark:text-slate-400 w-16">
                    {(2000 - animationSpeed + 300) / 300}x
                  </span>
                </div>
              </div>
            </div>

            {/* Tree Display */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
              <div className="p-3 border-b border-gray-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-slate-100">Tree Structure</h3>
                  <span className="text-xs text-gray-500 dark:text-slate-400">Drag to move • Hover to interact</span>
                </div>
              </div>
              
              <div 
                className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 min-h-[500px] overflow-hidden cursor-grab active:cursor-grabbing"
                onMouseDown={handleMouseDown}
              >
                {root ? (
                  <svg 
                    ref={svgRef}
                    width="100%" 
                    height="500" 
                    className="w-full"
                    style={{ userSelect: 'none' }}
                  >
                    {renderNode(positionedRoot)}
                  </svg>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500 dark:text-slate-400">
                    <div className="text-center">
                      <div className="text-4xl mb-2">🌳</div>
                      <p className="text-sm font-medium">Empty Tree</p>
                      <p className="text-xs">Add nodes to get started</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Status */}
            {message && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-blue-800 dark:text-blue-200 text-sm"
              >
                {message}
              </motion.div>
            )}
          </div>

          {/* Code Panel */}
          <div className="xl:col-span-1">
            <CodeHighlighter
              code={currentCode}
              language="javascript"
              title={`${currentOperation.charAt(0).toUpperCase() + currentOperation.slice(1)} Algorithm`}
              steps={currentCodeSteps}
              currentStep={currentStep}
              className="h-fit sticky top-4"
              compact={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}