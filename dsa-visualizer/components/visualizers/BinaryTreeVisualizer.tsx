'use client';

import React from 'react';
import { useState, useCallback, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus, Search, RotateCcw, Shuffle } from 'lucide-react';
import CodeHighlighter from '../ui/CodeHighlighter';
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
    { line: 4, description: "Create and return a new node with the value" },
    { lines: [7, 8], description: "Compare value with current node to decide direction" },
    { line: 9, description: "Go left if value is smaller" },
    { lines: [10, 11], description: "Go right if value is larger" },
    { line: 14, description: "Return the modified tree" }
  ],
  
  search: [
    { lines: [2, 3], description: "Check if tree is empty or value is found" },
    { line: 4, description: "Return the node (null if not found, node if found)" },
    { lines: [7, 8], description: "If target is smaller, search left subtree" },
    { line: 9, description: "Recursively search the left side" },
    { lines: [12, 13], description: "Otherwise, search right subtree" }
  ],
  
  delete: [
    { lines: [2, 3], description: "Check if tree is empty" },
    { lines: [6, 7], description: "Find the node to delete by comparing values" },
    { line: 8, description: "Go left if target is smaller" },
    { lines: [9, 10], description: "Go right if target is larger" },
    { line: 12, description: "Node found! Handle deletion cases" },
    { lines: [14, 15], description: "Case 1: Leaf node (no children)" },
    { lines: [19, 20, 21, 22], description: "Case 2: Node with one child" },
    { lines: [25, 26, 27, 28], description: "Case 3: Node with two children - find successor" },
    { line: 31, description: "Replace current node's value with successor's value" },
    { line: 34, description: "Delete the successor node" }
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
  const [_searchResult, setSearchResult] = useState<TreeNode | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [treeOffset, setTreeOffset] = useState({ x: 0, y: 0 });
  const [animationSpeed, setAnimationSpeed] = useState(1200);
  const [_isPlaying, setIsPlaying] = useState(false);
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

  const showMessage = (text: string, _type: 'success' | 'error' | 'info' = 'info') => {
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
    
    // Clear previous highlights
    setRoot(prev => clearHighlights(prev));

    const insertRecursive = async (node: TreeNode | null, val: number, parentRoot: TreeNode | null = null): Promise<TreeNode> => {
      // Step 0: Check if empty
      setCurrentStep(0);
      await delay(animationSpeed);
      
      if (node === null) {
        // Step 1: Create new node
        setCurrentStep(1);
        await delay(animationSpeed);
        
        const newNode: TreeNode = {
          value: val,
          left: null,
          right: null,
          id: generateId(),
          isInserting: true
        };
        
        // Update the root immediately if this is the first node
        if (parentRoot === null) {
          setRoot(newNode);
        }
        
        return newNode;
      }

      // Step 2: Compare values
      setCurrentStep(2);
      
      // Highlight current node
      const highlightedRoot = highlightNode(parentRoot || node, node.id, 'isHighlighted');
      setRoot(highlightedRoot);
      await delay(animationSpeed);

      if (val < node.value) {
        // Step 3: Go left
        setCurrentStep(3);
        await delay(animationSpeed);
        node.left = await insertRecursive(node.left, val, parentRoot || node);
      } else if (val > node.value) {
        // Step 4: Go right
        setCurrentStep(4);
        await delay(animationSpeed);
        node.right = await insertRecursive(node.right, val, parentRoot || node);
      } else {
        // Value already exists
        showMessage(`Value ${val} already exists in the tree`, 'error');
        return node;
      }
      
      // Step 5: Return root
      setCurrentStep(5);
      await delay(animationSpeed);
      
      return node;
    };

    try {
      const newRoot = await insertRecursive(root, value, root);
      setRoot(newRoot);
      setInputValue('');
      showMessage(`Value ${value} inserted successfully!`, 'success');
    } catch (_error) {
      showMessage('Error inserting node', 'error');
    } finally {
      setIsAnimating(false);
      setIsPlaying(false);
      setTimeout(() => setRoot(prev => clearHighlights(prev)), 500);
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
      const _steps = CODE_STEPS.search;
      
      // Step 0: Check if empty or found
      setCurrentStep(0);
      await delay(animationSpeed);
      
      if (node === null) {
        showMessage(`Value ${val} not found`, 'error');
        return null;
      }
      
      if (node.value === val) {
        // Step 1: Found the value
        setCurrentStep(1);
        setRoot(prev => highlightNode(prev, node.id, 'isSearching'));
        await delay(animationSpeed);
        showMessage(`Value ${val} found!`, 'success');
        return node;
      }

      // Step 2: Compare and decide direction
      setCurrentStep(2);
      setRoot(prev => highlightNode(prev, node.id, 'isHighlighted'));
      await delay(animationSpeed);
      
      if (val < node.value) {
        // Step 3: Search left
        setCurrentStep(3);
        await delay(animationSpeed);
        return await searchRecursive(node.left, val);
      } else {
        // Step 4: Search right
        setCurrentStep(4);
        await delay(animationSpeed);
        return await searchRecursive(node.right, val);
      }
    };

    try {
      const result = await searchRecursive(root, value);
      setSearchResult(result);
    } catch (_error) {
      showMessage('Error searching node', 'error');
    } finally {
      setIsAnimating(false);
      setIsPlaying(false);
      setTimeout(() => setRoot(prev => clearHighlights(prev)), 2000);
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
    const _steps = CODE_STEPS.delete;
    for (let step = 0; step < _steps.length; step++) {
      setCurrentStep(step);
      await delay(animationSpeed);
    }

    try {
      const newRoot = deleteRecursive(root, value);
      setRoot(newRoot);
      setInputValue('');
      showMessage(`Value ${value} deleted successfully!`, 'success');
    } catch (_error) {
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
            transition={{ duration: 0.3 }}
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
            transition={{ duration: 0.3 }}
          />
        )}
        
        {/* Render node */}
        <motion.circle
          cx={node.x}
          cy={node.y}
          r="28"
          initial={{ scale: 0 }}
          animate={{ 
            scale: 1,
            stroke: node.isHighlighted ? '#EAB308' : 
                   node.isSearching ? '#10B981' : 
                   node.isInserting ? '#3B82F6' : 
                   node.isDeleting ? '#EF4444' : '#9CA3AF'
          }}
          whileHover={{ scale: 1.05 }}
          transition={{ 
            scale: { duration: 0.2 }, 
            stroke: { duration: 0.3 }
          }}
          className={`transition-all duration-300 cursor-pointer ${
            node.isHighlighted 
              ? 'fill-green-100 dark:fill-green-900/50' 
              : node.isSearching
              ? 'fill-green-100 dark:fill-green-900/50'
              : node.isInserting
              ? 'fill-blue-100 dark:fill-blue-900/50'
              : node.isDeleting
              ? 'fill-red-100 dark:fill-red-900/50'
              : 'fill-white dark:fill-slate-700'
          }`}
          strokeWidth="3"
        />
        
        <motion.text
          x={node.x}
          y={node.y + 6}
          textAnchor="middle"
          className="text-sm font-bold fill-gray-900 dark:fill-slate-100 pointer-events-none select-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {node.value}
        </motion.text>
        
        {/* Render children */}
        {renderNode(node.left)}
        {renderNode(node.right)}
      </g>
    );
  };

  const currentCode = TREE_OPERATIONS[currentOperation as keyof typeof TREE_OPERATIONS];
  const currentCodeSteps = CODE_STEPS[currentOperation as keyof typeof CODE_STEPS];

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-100 mb-2">Binary Tree Visualizer</h1>
          <p className="text-slate-400 text-lg">
            Interactive visualization of binary tree operations with step-by-step code execution
          </p>
        </div>

        {/* Operations Bar */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6 shadow-lg mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Insert/Delete */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-slate-300 mb-3">Insert/Delete Node</h3>
              <div className="space-y-3">
                <input
                  type="number"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Enter number"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  disabled={isAnimating}
                />
                <div className="flex gap-2">
                  <button
                    onClick={insertNode}
                    disabled={isAnimating}
                    className="flex-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <Plus size={16} />
                    Insert
                  </button>
                  <button
                    onClick={deleteNode}
                    disabled={isAnimating}
                    className="flex-1 px-3 py-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <Minus size={16} />
                    Delete
                  </button>
                </div>
              </div>
            </div>

            {/* Search */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-slate-300 mb-3">Search Node</h3>
              <div className="space-y-3">
                <input
                  type="number"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Search number"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 focus:ring-2 focus:ring-green-400 focus:border-transparent"
                  disabled={isAnimating}
                />
                <button
                  onClick={searchNode}
                  disabled={isAnimating}
                  className="w-full px-3 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <Search size={16} />
                  Search
                </button>
              </div>
            </div>

            {/* Animation Speed */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-slate-300 mb-3">Animation Speed</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-600 dark:text-slate-400">Fast</span>
                  <input
                    type="range"
                    min="300"
                    max="2000"
                    step="100"
                    value={animationSpeed}
                    onChange={(e) => setAnimationSpeed(parseInt(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer"
                    disabled={isAnimating}
                  />
                  <span className="text-xs text-gray-600 dark:text-slate-400">Slow</span>
                </div>
                <div className="text-center">
                  <span className="text-sm font-medium text-gray-900 dark:text-slate-100">
                    {Math.round((2000 - animationSpeed + 300) / 300)}x Speed
                  </span>
                </div>
              </div>
            </div>

            {/* Utilities */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-slate-300 mb-3">Tree Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={generateRandomTree}
                  disabled={isAnimating}
                  className="w-full px-3 py-2 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <Shuffle size={16} />
                  Random Tree
                </button>
                <button
                  onClick={clearTree}
                  disabled={isAnimating}
                  className="w-full px-3 py-2 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <RotateCcw size={16} />
                  Clear Tree
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[7fr_3fr] gap-8">
          {/* Visualization Panel */}
          <div className="space-y-6">
            {/* Tree Display */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-lg overflow-hidden">
              <div className="p-4 border-b border-gray-200 dark:border-slate-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-100">Tree Structure</h2>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>Drag to move • Hover nodes to interact</span>
                  </div>
                </div>
              </div>
              
              <div 
                className="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 min-h-[500px] overflow-hidden cursor-grab active:cursor-grabbing relative"
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
                      <div className="text-6xl mb-4"></div>
                      <h3 className="text-lg font-semibold mb-2">This Tree is Empty!</h3>
                      <p className="text-sm">Add some nodes to get started!</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Status Message */}
            {message && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl text-blue-800 dark:text-blue-200"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="font-medium">{message}</span>
                </div>
              </motion.div>
            )}
          </div>

          {/* Code Panel */}
          <div className="space-y-6">
            <CodeHighlighter
              code={currentCode}
              language="javascript"
              title={`Binary Tree ${currentOperation.charAt(0).toUpperCase() + currentOperation.slice(1)} Operation`}
              steps={currentCodeSteps}
              currentStep={currentStep}

            />
          </div>
        </div>

        {/* Information Section */}
        <div className="mt-12 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
              About Binary Trees
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Understanding the fundamentals, properties, and complexity analysis of binary tree data structures
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            
            {/* What is a Binary Tree - Takes more space */}
            <div className="xl:col-span-2 bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 border border-slate-700/50 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-100">What is a Binary Tree?</h3>
              </div>
              
              <p className="text-slate-300 mb-8 leading-relaxed text-lg">
                A binary tree is a hierarchical data structure where each node has at most two children, 
                referred to as the left child and right child. In a Binary Search Tree (BST), the left 
                subtree contains values less than the parent, and the right subtree contains values greater than the parent.
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
                      <span>Efficient searching O(log n) average case</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                      <span>Dynamic size with ordered data</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                      <span>In-order traversal gives sorted sequence</span>
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
                      <span>Can become unbalanced O(n) worst case</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                      <span>No constant-time access by index</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                      <span>Extra memory overhead for pointers</span>
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
                  <span className="text-slate-200 font-semibold">Hierarchical</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
                  <span className="text-slate-400 font-medium">Structure:</span>
                  <span className="text-slate-200 font-semibold">Non-linear</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
                  <span className="text-slate-400 font-medium">Search (avg):</span>
                  <span className="text-green-400 font-mono font-bold">O(log n)</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
                  <span className="text-slate-400 font-medium">Search (worst):</span>
                  <span className="text-yellow-400 font-mono font-bold">O(n)</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
                  <span className="text-slate-400 font-medium">Insert (avg):</span>
                  <span className="text-green-400 font-mono font-bold">O(log n)</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-slate-400 font-medium">Delete (avg):</span>
                  <span className="text-green-400 font-mono font-bold">O(log n)</span>
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
                  {title: "Database Indexing", desc: "Fast data retrieval in databases" },
                  {title: "File Systems", desc: "Directory structure organization" },
                  {title: "Expression Parsing", desc: "Parse mathematical expressions" },
                  {title: "Decision Trees", desc: "Machine learning algorithms" },
                  {title: "Huffman Coding", desc: "Data compression algorithms" }
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
                {/* Balanced Tree */}
                <div className="bg-green-500/5 border border-green-500/20 rounded-2xl p-5">
                  <h4 className="font-bold mb-4 text-green-400 text-sm uppercase tracking-wide">Balanced Tree</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Search</span>
                      <span className="text-green-400 font-mono font-bold text-lg">O(log n)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Insert</span>
                      <span className="text-green-400 font-mono font-bold text-lg">O(log n)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Delete</span>
                      <span className="text-green-400 font-mono font-bold text-lg">O(log n)</span>
                    </div>
                  </div>
                </div>

                {/* Unbalanced Tree */}
                <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-2xl p-5">
                  <h4 className="font-bold mb-4 text-yellow-400 text-sm uppercase tracking-wide">Unbalanced Tree</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Search</span>
                      <span className="text-yellow-400 font-mono font-bold text-lg">O(n)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Insert</span>
                      <span className="text-yellow-400 font-mono font-bold text-lg">O(n)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Delete</span>
                      <span className="text-yellow-400 font-mono font-bold text-lg">O(n)</span>
                    </div>
                  </div>
                </div>

                {/* Space Complexity */}
                <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-5">
                  <h4 className="font-bold mb-4 text-blue-400 text-sm uppercase tracking-wide">Space Complexity</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Total space</span>
                      <span className="text-yellow-400 font-mono font-bold text-lg">O(n)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Auxiliary space</span>
                      <span className="text-green-400 font-mono font-bold text-lg">O(log n)</span>
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