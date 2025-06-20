import TreeComingSoon from '../../../components/TreeComingSoon';

export default function SegmentTreePage() {
  return (
    <TreeComingSoon
      title="Segment Tree"
      description="Binary tree data structure for efficient range queries and updates on arrays, supporting sum, min, max, and other operations."
      features={[
        "Interactive array visualization",
        "Range sum, min, and max queries",
        "Point and range updates",
        "Lazy propagation demonstration",
        "Query optimization visualization",
        "Real-time performance metrics"
      ]}
      complexity={{
        search: "O(log n)",
        insert: "O(log n)",
        delete: "O(log n)",
        space: "O(n)"
      }}
    />
  );
}

export const metadata = {
  title: 'Segment Tree - Coming Soon | DSA Visualizer',
  description: 'Interactive Segment Tree visualization with range queries and updates - coming soon to DSA Visualizer.',
}; 