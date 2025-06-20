import TreeComingSoon from '../../../components/TreeComingSoon';

export default function FenwickTreePage() {
  return (
    <TreeComingSoon
      title="Fenwick Tree (Binary Indexed Tree)"
      description="Efficient data structure for calculating prefix sums and range sum queries with logarithmic update and query time."
      features={[
        "Visual binary representation",
        "Prefix sum calculations",
        "Range sum queries",
        "Point updates with carry propagation",
        "Bit manipulation visualization",
        "Comparison with other range query structures"
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
  title: 'Fenwick Tree (BIT) - Coming Soon | DSA Visualizer',
  description: 'Interactive Fenwick Tree visualization with prefix sums and bit manipulation - coming soon to DSA Visualizer.',
}; 