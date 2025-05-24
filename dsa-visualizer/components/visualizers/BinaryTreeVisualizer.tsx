'use client';
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Eye, RotateCcw, ArrowDown, ArrowUp } from 'lucide-react';
import CodeHighlighter from '../ui/CodeHighlighter';
import { cn, delay } from '../../lib/utils';


interface TreeNode {
  value: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

interface TreeElement extends TreeNode {
  isHighlighted: boolean;
}

export default function BinaryTreeVisualizer() {
  const [tree, setTree] = useState<TreeNode[]>([]);
  const [currentOperation, setCurrentOperation] = useState<string>('insert');
  const [isAnimating, setIsAnimating] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [code, setCode] = useState<string>('');
  const [codeSteps, setCodeSteps] = useState<{ line: number; description: string }[]>([]);

  const insertElement = useCallback(async () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setMessage(null);

    const newTree = [...tree];
    const newNode: TreeNode = {
      value: Math.floor(Math.random() * 100),
      left: null,
      right: null, 
    };

    newTree.push(newNode);
    setTree(newTree);

    await delay(1000);

    const newTree2 = [...newTree];
    const newNode2: TreeNode = {
      value: Math.floor(Math.random() * 100),
      left: null,
      right: null,
    };

    newTree2.push(newNode2);
    setTree(newTree2);

    await delay(1000);

    const newTree3 = [...newTree2];
    const newNode3: TreeNode = {
      value: Math.floor(Math.random() * 100),
      left: null,
      right: null,
    };

    newTree3.push(newNode3);
    setTree(newTree3);

    await delay(1000);

    const newTree4 = [...newTree3];
    const newNode4: TreeNode = {
      value: Math.floor(Math.random() * 100),
      left: null,
      right: null,
    };  

    newTree4.push(newNode4);
    setTree(newTree4);

    await delay(1000);

    const newTree5 = [...newTree4];
    const newNode5: TreeNode = {
      value: Math.floor(Math.random() * 100),
      left: null,
      right: null,
    };

    newTree5.push(newNode5);
    setTree(newTree5);

    await delay(1000);

    const newTree6 = [...newTree5];
    const newNode6: TreeNode = {
      value: Math.floor(Math.random() * 100),
      left: null,
      right: null,
    };

    newTree6.push(newNode6);
    setTree(newTree6);
  }, [tree]);

  const deleteElement = useCallback(async () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setMessage(null);

    const newTree = [...tree];
    newTree.pop();
    setTree(newTree);

    await delay(1000);

    const newTree2 = [...newTree];
    newTree2.pop();
    setTree(newTree2);

    await delay(1000);
    const newTree3 = [...newTree2];
    newTree3.pop();
    setTree(newTree3);

    await delay(1000);
    const newTree4 = [...newTree3];
    newTree4.pop();
    setTree(newTree4);
  }, [tree]);

  const clearTree = () => {
    setTree([]);
  };

  const showMessage = (message: string, type: 'success' | 'error' | 'info') => {
    setMessage(message);
  }
}