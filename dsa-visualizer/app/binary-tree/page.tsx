import BinaryTreeVisualizer from '../../components/visualizers/BinaryTreeVisualizer';

export default function BinaryTreePage() {
  return (
    <div className="py-8 bg-slate-900">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6 text-center text-slate-100">Binary Tree Data Structure</h1>
        <div className="mb-8 max-w-3xl mx-auto">
          <p className="text-slate-300 mb-4">
            A binary tree is a hierarchical data structure where each node has at most two children, 
            referred to as the left child and the right child.
          </p>
          <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl">
            <h3 className="font-semibold mb-4 text-slate-100">Common Binary Tree Operations:</h3>
            <ul className="list-disc pl-5 space-y-2 text-slate-300">
              <li>Insert: O(log n) average, O(n) worst case</li>
              <li>Search: O(log n) average, O(n) worst case</li>
              <li>Delete: O(log n) average, O(n) worst case</li>
              <li>Traversal: O(n) - In-order, Pre-order, Post-order</li>
              <li>Height: O(n) - Find the height of the tree</li>
            </ul>
          </div>
        </div>
        <BinaryTreeVisualizer />
      </div>
    </div>
  );
}
