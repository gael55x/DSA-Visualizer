import TreeComingSoon from '../../../components/TreeComingSoon';

export default function HeapPage() {
  return (
    <TreeComingSoon
      title="Binary Heap"
      description="Complete binary tree that satisfies the heap property, commonly used for priority queues and heap sort algorithm."
      features={[
        "Interactive min-heap and max-heap modes",
        "Visual heap property enforcement",
        "Insert with bubble-up animation",
        "Extract-min/max with bubble-down",
        "Array representation visualization",
        "Priority queue operations demo"
      ]}
      complexity={{
        search: "O(n)",
        insert: "O(log n)",
        delete: "O(log n)",
        space: "O(n)"
      }}
    />
  );
}

export const metadata = {
  title: 'Binary Heap - Coming Soon | DSA Visualizer',
  description: 'Interactive Binary Heap visualization with priority queue operations - coming soon to DSA Visualizer.',
}; 