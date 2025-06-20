import BinaryTreeVisualizer from '../../components/visualizers/BinaryTreeVisualizer';
import TreeTypeSelector from '../../components/ui/TreeTypeSelector';

export default function BinaryTreePage() {
  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Binary Tree Visualizer */}
        <BinaryTreeVisualizer />
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Binary Search Tree | DSA Visualizer',
  description: 'Interactive Binary Search Tree visualization with insert, search, and delete operations.',
};
