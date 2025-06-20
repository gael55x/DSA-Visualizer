import TreeComingSoon from '../../../components/TreeComingSoon';

export default function BTreePage() {
  return (
    <TreeComingSoon
      title="B-Tree"
      description="Multi-way search tree optimized for systems that read and write large blocks of data, commonly used in databases and file systems."
      features={[
        "Configurable minimum degree (order)",
        "Interactive key insertion and node splitting",
        "Visual representation of internal and leaf nodes",
        "Animated splitting and merging operations",
        "Database indexing simulation",
        "Performance comparison with binary trees"
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
  title: 'B-Tree - Coming Soon | DSA Visualizer',
  description: 'Interactive B-Tree visualization with multi-way nodes and splitting operations - coming soon to DSA Visualizer.',
}; 