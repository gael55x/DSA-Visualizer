import TreeComingSoon from '../../../components/TreeComingSoon';

export default function RedBlackTreePage() {
  return (
    <TreeComingSoon
      title="Red-Black Tree"
      description="Self-balancing binary search tree with color-coded nodes that maintains balance through color rules and rotations."
      features={[
        "Visual red and black node coloring",
        "Interactive insertion with color flips and rotations",
        "Red-Black tree property enforcement",
        "Animated rebalancing operations",
        "Comparison with other balanced trees",
        "Violation detection and correction visualization"
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
  title: 'Red-Black Tree - Coming Soon | DSA Visualizer',
  description: 'Interactive Red-Black tree visualization with color-coded nodes and balancing operations - coming soon to DSA Visualizer.',
}; 