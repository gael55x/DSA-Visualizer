import TreeComingSoon from '../../../components/TreeComingSoon';

export default function AVLTreePage() {
  return (
    <TreeComingSoon
      title="AVL Tree"
      description="Self-balancing binary search tree that maintains height balance through rotations, ensuring optimal search performance."
      features={[
        "Interactive node insertion with automatic balancing",
        "Visual representation of left and right rotations",
        "Height calculation and balance factor display",
        "Step-by-step rotation animations",
        "Comparison with unbalanced BST performance",
        "Tree traversal visualizations (inorder, preorder, postorder)"
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
  title: 'AVL Tree - Coming Soon | DSA Visualizer',
  description: 'Interactive AVL tree visualization with automatic balancing and rotation animations - coming soon to DSA Visualizer.',
}; 