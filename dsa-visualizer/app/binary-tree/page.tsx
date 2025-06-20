import BinaryTreeVisualizer from '../../components/visualizers/BinaryTreeVisualizer';
import TreeTypeSelector from '../../components/ui/TreeTypeSelector';

export default function BinaryTreePage() {
  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Tree Type Selector */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-100 mb-2">Tree Visualizers</h1>
          <p className="text-slate-400 text-lg mb-6">
            Interactive visualization of different tree data structures and their operations
          </p>
          
          {/* Tree Type Selector */}
          <div className="flex justify-center mb-8">
            <TreeTypeSelector />
          </div>
        </div>

        {/* Binary Tree Visualizer */}
        <BinaryTreeVisualizer />
      </div>
    </div>
  );
}
