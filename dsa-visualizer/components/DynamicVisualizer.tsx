'use client';

import { useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

// Loading fallback component
const VisualizerLoader = () => (
  <div className="min-h-screen bg-slate-900 flex items-center justify-center">
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center"
    >
      <Loader2 className="w-12 h-12 text-sky-400 animate-spin mx-auto mb-4" />
      <p className="text-slate-400 text-lg">Loading visualizer...</p>
      <p className="text-slate-500 text-sm mt-2">Preparing interactive experience</p>
    </motion.div>
  </div>
);

// Error fallback component
const VisualizerError = ({ error, retry }: { error: Error; retry: () => void }) => (
  <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
    <div className="text-center max-w-md">
      <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-red-400 text-2xl">⚠</span>
      </div>
      <h2 className="text-xl font-bold text-slate-100 mb-2">Failed to Load Visualizer</h2>
      <p className="text-slate-400 mb-4">
        {error.message || 'Something went wrong while loading the visualizer.'}
      </p>
      <button
        onClick={retry}
        className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors"
      >
        Try Again
      </button>
    </div>
  </div>
);

// Dynamic imports with loading states
const LazyQuickSortVisualizer = dynamic(
  () => import('./visualizers/QuickSortVisualizer'),
  {
    loading: () => <VisualizerLoader />,
    ssr: false // Prevent SSR for complex visualizers
  }
);

const LazyBubbleSortVisualizer = dynamic(
  () => import('./visualizers/BubbleSortVisualizer'),
  {
    loading: () => <VisualizerLoader />,
    ssr: false
  }
);

const LazyMergeSortVisualizer = dynamic(
  () => import('./visualizers/MergeSortVisualizer'),
  {
    loading: () => <VisualizerLoader />,
    ssr: false
  }
);

const LazyInsertionSortVisualizer = dynamic(
  () => import('./visualizers/InsertionSortVisualizer'),
  {
    loading: () => <VisualizerLoader />,
    ssr: false
  }
);

const LazySelectionSortVisualizer = dynamic(
  () => import('./visualizers/SelectionSortVisualizer'),
  {
    loading: () => <VisualizerLoader />,
    ssr: false
  }
);

const LazyHeapSortVisualizer = dynamic(
  () => import('./visualizers/HeapSortVisualizer'),
  {
    loading: () => <VisualizerLoader />,
    ssr: false
  }
);

const LazyBinaryTreeVisualizer = dynamic(
  () => import('./visualizers/BinaryTreeVisualizer'),
  {
    loading: () => <VisualizerLoader />,
    ssr: false
  }
);

const LazyArrayVisualizer = dynamic(
  () => import('./visualizers/ArrayVisualizer'),
  {
    loading: () => <VisualizerLoader />,
    ssr: false
  }
);

const LazyLinkedListVisualizer = dynamic(
  () => import('./visualizers/LinkedListVisualizer'),
  {
    loading: () => <VisualizerLoader />,
    ssr: false
  }
);

const LazyStackVisualizer = dynamic(
  () => import('./visualizers/StackVisualizer'),
  {
    loading: () => <VisualizerLoader />,
    ssr: false
  }
);

const LazyQueueVisualizer = dynamic(
  () => import('./visualizers/QueueVisualizer'),
  {
    loading: () => <VisualizerLoader />,
    ssr: false
  }
);

const LazyRecursionVisualizer = dynamic(
  () => import('./visualizers/RecursionVisualizer'),
  {
    loading: () => <VisualizerLoader />,
    ssr: false
  }
);

// Visualizer type mapping
const visualizerComponents = {
  'quick-sort': LazyQuickSortVisualizer,
  'bubble-sort': LazyBubbleSortVisualizer,
  'merge-sort': LazyMergeSortVisualizer,
  'insertion-sort': LazyInsertionSortVisualizer,
  'selection-sort': LazySelectionSortVisualizer,
  'heap-sort': LazyHeapSortVisualizer,
  'binary-tree': LazyBinaryTreeVisualizer,
  'array': LazyArrayVisualizer,
  'linked-list': LazyLinkedListVisualizer,
  'stack': LazyStackVisualizer,
  'queue': LazyQueueVisualizer,
  'recursion': LazyRecursionVisualizer,
} as const;

export type VisualizerType = keyof typeof visualizerComponents;

interface DynamicVisualizerProps {
  type: VisualizerType;
  fallback?: React.ComponentType;
}

export default function DynamicVisualizer({ 
  type, 
  fallback: FallbackComponent = VisualizerLoader 
}: DynamicVisualizerProps) {
  const [error, setError] = useState<Error | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    setError(null);
  }, [type, retryKey]);

  const handleRetry = () => {
    setError(null);
    setRetryKey(prev => prev + 1);
  };

  if (error) {
    return <VisualizerError error={error} retry={handleRetry} />;
  }

  const VisualizerComponent = visualizerComponents[type];

  if (!VisualizerComponent) {
    return <VisualizerError 
      error={new Error(`Unknown visualizer type: ${type}`)} 
      retry={handleRetry} 
    />;
  }

  return (
    <Suspense fallback={<FallbackComponent />}>
      <div key={retryKey}>
        <VisualizerComponent />
      </div>
    </Suspense>
  );
} 