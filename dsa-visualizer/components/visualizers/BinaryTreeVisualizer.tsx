'use client';

import React from 'react';
import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Search, RotateCcw, Shuffle } from 'lucide-react';
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
    { line: 2, description: "Check if we've reached an empty spot (base case)" },
    { line: 3, description: "Create and return a new node with the value" },
    { line: 7, description: "Compare value with current node to decide direction" },
    { line: 8, description: "Go left if value is smaller" },
    { line: 9, description: "Go right if value is larger" },
    { line: 12, description: "Return the modified tree" }
  ],
  
  search: [
    { line: 2, description: "Check if tree is empty or value is found" },
    { line: 3, description: "Return the node (null if not found, node if found)" },
    { line: 7, description: "If target is smaller, search left subtree" },
    { line: 8, description: "Recursively search the left side" },
    { line: 12, description: "Otherwise, search right subtree" }
  ],
  
  delete: [
    { line: 2, description: "Check if tree is empty" },
    { line: 6, description: "Find the node to delete by comparing values" },
    { line: 7, description: "Go left if target is smaller" },
    { line: 9, description: "Go right if target is larger" },
    { line: 14, description: "Node found! Handle deletion cases" },
    { line: 15, description: "Case 1: Leaf node (no children)" },
    { line: 19, description: "Case 2: Node with one child" },
    { line: 25, description: "Case 3: Node with two children" },
    { line: 26, description: "Find inorder successor (smallest in right subtree)" },
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
  const [searchResult, setSearchResult] = useState<TreeNode | null>(null);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  // Calculate node positions for visualization
  const calculatePositions = useCallback((node: TreeNode | null, x = 400, y = 50, level = 0): TreeNode | null => {
    if (!node) return null;
    
    const spacing = Math.max(200 / (level + 1), 50);
    
    return {
      ...node,
      x,
      y,
      left: node.left ? calculatePositions(node.left, x - spacing, y + 80, level + 1) : null,
      right: node.right ? calculatePositions(node.right, x + spacing, y + 80, level + 1) : null
    };
  }, []);

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
    setCurrentOperation('insert');

    const insertRecursive = async (node: TreeNode | null, val: number): Promise<TreeNode> => {
      // Step through the insertion algorithm
      for (let step = 0; step < CODE_STEPS.insert.length; step++) {
        setCurrentStep(step);
        await delay(600);

        if (step === 0 && node === null) {
          // Base case: create new node
          const newNode: TreeNode = {
            value: val,
            left: null,
            right: null,
            id: generateId(),
            isInserting: true
          };
          return newNode;
        } else if (step === 2 && node) {
          // Highlight current node for comparison
          setRoot(prev => highlightNode(prev, node.id, 'isHighlighted'));
        } else if (step === 3 && node && val < node.value) {
          // Go left
          node.left = await insertRecursive(node.left, val);
          return node;
        } else if (step === 4 && node && val > node.value) {
          // Go right
          node.right = await insertRecursive(node.right, val);
          return node;
        }
      }
      return node!;
    };

    try {
      const newRoot = await insertRecursive(root, value);
      setRoot(newRoot);
      setInputValue('');
      showMessage(`Successfully inserted ${value}`, 'success');
    } catch (error) {
      showMessage('Error inserting node', 'error');
    }

    // Clear highlights
    setTimeout(() => {
      setRoot(prev => clearHighlights(prev));
    }, 1000);

    setIsAnimating(false);
  }, [inputValue, root]);

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
    setCurrentOperation('search');
    setSearchResult(null);

    const searchRecursive = async (node: TreeNode | null, val: number): Promise<TreeNode | null> => {
      for (let step = 0; step < CODE_STEPS.search.length; step++) {
        setCurrentStep(step);
        await delay(600);

        if (step === 0) {
          if (node === null) {
            showMessage(`Value ${val} not found in tree`, 'error');
            return null;
          }
          if (node.value === val) {
            setRoot(prev => highlightNode(prev, node.id, 'isSearching'));
            showMessage(`Found ${val}!`, 'success');
            return node;
          }
        } else if (step === 2 && node) {
          // Highlight current node
          setRoot(prev => highlightNode(prev, node.id, 'isHighlighted'));
          
          if (val < node.value) {
            return await searchRecursive(node.left, val);
          }
        } else if (step === 4 && node) {
          return await searchRecursive(node.right, val);
        }
      }
      return null;
    };

    const result = await searchRecursive(root, value);
    setSearchResult(result);

    // Clear highlights
    setTimeout(() => {
      setRoot(prev => clearHighlights(prev));
    }, 2000);

    setIsAnimating(false);
  }, [searchValue, root]);

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
    setCurrentOperation('delete');

    // Simplified delete for demo - just remove the node
    const deleteRecursive = (node: TreeNode | null, val: number): TreeNode | null => {
      if (!node) return null;
      
      if (val < node.value) {
        node.left = deleteRecursive(node.left, val);
      } else if (val > node.value) {
        node.right = deleteRecursive(node.right, val);
      } else {
        // Node to delete found
        if (!node.left && !node.right) return null;
        if (!node.left) return node.right;
        if (!node.right) return node.left;
        
        // Find inorder successor
        let successor = node.right;
        while (successor.left) {
          successor = successor.left;
        }
        node.value = successor.value;
        node.right = deleteRecursive(node.right, successor.value);
      }
      return node;
    };

    // Step through deletion
    for (let step = 0; step < Math.min(CODE_STEPS.delete.length, 6); step++) {
      setCurrentStep(step);
      await delay(600);
    }

    const newRoot = deleteRecursive(root, value);
    setRoot(newRoot);
    setInputValue('');
    showMessage(`Successfully deleted ${value}`, 'success');
    setIsAnimating(false);
  }, [inputValue, root]);

  const clearTree = () => {
    setRoot(null);
    setMessage('');
    setSearchResult(null);
  };

  const generateRandomTree = () => {
    clearTree();
    const values = [50, 30, 70, 20, 40, 60, 80];
    let newRoot: TreeNode | null = null;
    
    values.forEach(value => {
      newRoot = insertNodeSync(newRoot, value);
    });
    
    setRoot(newRoot);
    showMessage('Generated random tree', 'success');
  };

  const insertNodeSync = (node: TreeNode | null, value: number): TreeNode => {
    if (!node) {
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

  // Helper functions for highlighting
  const highlightNode = (node: TreeNode | null, id: string, highlightType: string): TreeNode | null => {
    if (!node) return null;
    
    const newNode = { ...node };
    if (node.id === id) {
      (newNode as any)[highlightType] = true;
    }
    
    newNode.left = highlightNode(node.left, id, highlightType);
    newNode.right = highlightNode(node.right, id, highlightType);
    
    return newNode;
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

  // Render tree nodes
  const renderNode = (node: TreeNode | null): React.JSX.Element | null => {
    if (!node || !node.x || !node.y) return null;

    return (
      <g key={node.id}>
        {/* Render connections to children */}
        {node.left && node.left.x && node.left.y && (
          <line
            x1={node.x}
            y1={node.y}
            x2={node.left.x}
            y2={node.left.y}
            stroke="currentColor"
            strokeWidth="2"
            className="text-gray-400 dark:text-slate-500"
          />
        )}
        {node.right && node.right.x && node.right.y && (
          <line
            x1={node.x}
            y1={node.y}
            x2={node.right.x}
            y2={node.right.y}
            stroke="currentColor"
            strokeWidth="2"
            className="text-gray-400 dark:text-slate-500"
          />
        )}
        
        {/* Render node */}
        <motion.circle
          cx={node.x}
          cy={node.y}
          r="25"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={cn(
            "transition-all duration-300",
            node.isHighlighted && "fill-yellow-400 stroke-yellow-600",
            node.isSearching && "fill-green-400 stroke-green-600",
            node.isInserting && "fill-blue-400 stroke-blue-600",
            node.isDeleting && "fill-red-400 stroke-red-600",
            !node.isHighlighted && !node.isSearching && !node.isInserting && !node.isDeleting && 
            "fill-white dark:fill-slate-700 stroke-gray-400 dark:stroke-slate-500"
          )}
          strokeWidth="2"
        />
        
        <text
          x={node.x}
          y={node.y + 5}
          textAnchor="middle"
          className="text-sm font-semibold fill-gray-900 dark:fill-slate-100 pointer-events-none"
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
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100 mb-2">
              Binary Search Tree Visualizer
            </h1>
            <p className="text-gray-600 dark:text-slate-400">
              Interactive visualization of binary search tree operations with step-by-step code execution
            </p>
          </div>
          <ThemeToggle />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Tree Visualization */}
          <div className="space-y-6">
            {/* Tree Display */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6 shadow-lg">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-4">Tree Structure</h2>
              
              <div className="bg-gray-50 dark:bg-slate-900 rounded-xl p-4 min-h-[400px] overflow-auto">
                {root ? (
                  <svg width="800" height="400" className="w-full">
                    {renderNode(positionedRoot)}
                  </svg>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500 dark:text-slate-400">
                    <div className="text-center">
                      <div className="text-4xl mb-2">🌳</div>
                      <p>Empty Tree</p>
                      <p className="text-sm">Add some nodes to get started!</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6 shadow-lg">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-4">Operations</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Insert/Delete */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900 dark:text-slate-100">Insert/Delete Node</h3>
                  <input
                    type="number"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Enter a number"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 focus:ring-2 focus:ring-sky-400 focus:border-transparent"
                    disabled={isAnimating}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={insertNode}
                      disabled={isAnimating}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-600 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
                    >
                      <Plus size={16} />
                      Insert
                    </button>
                    <button
                      onClick={deleteNode}
                      disabled={isAnimating}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
                    >
                      <Minus size={16} />
                      Delete
                    </button>
                  </div>
                </div>

                {/* Search */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900 dark:text-slate-100">Search Node</h3>
                  <input
                    type="number"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="Enter number to search"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 focus:ring-2 focus:ring-sky-400 focus:border-transparent"
                    disabled={isAnimating}
                  />
                  <button
                    onClick={searchNode}
                    disabled={isAnimating}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
                  >
                    <Search size={16} />
                    Search
                  </button>
                </div>
              </div>

              {/* Utility buttons */}
              <div className="flex gap-2 mt-6">
                <button
                  onClick={generateRandomTree}
                  disabled={isAnimating}
                  className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
                >
                  <Shuffle size={16} />
                  Random Tree
                </button>
                <button
                  onClick={clearTree}
                  disabled={isAnimating}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
                >
                  <RotateCcw size={16} />
                  Clear
                </button>
              </div>

              {/* Message */}
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-blue-800 dark:text-blue-200 text-sm"
                >
                  {message}
                </motion.div>
              )}
            </div>
          </div>

          {/* Code Panel */}
          <div className="sticky top-6">
            <CodeHighlighter
              code={currentCode}
              language="javascript"
              title={`${currentOperation.charAt(0).toUpperCase() + currentOperation.slice(1)} Algorithm`}
              steps={currentCodeSteps}
              currentStep={currentStep}
              className="h-fit"
            />
          </div>
        </div>
      </div>
    </div>
  );
}