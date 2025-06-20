import TreeTypeSelector from '../../components/ui/TreeTypeSelector';
import Link from 'next/link';
import { TreePine, ArrowRight, Lock } from 'lucide-react';

const treeTypes = [
  {
    id: 'binary-tree',
    name: 'Binary Search Tree',
    description: 'Basic binary tree with search, insert, and delete operations',
    href: '/binary-tree',
    isActive: true,
    color: 'bg-blue-500',
    gradient: 'from-blue-500 to-blue-600',
    features: ['Insert/Delete/Search', 'Tree Traversals', 'Interactive Operations']
  },
  {
    id: 'avl-tree',
    name: 'AVL Tree',
    description: 'Self-balancing binary search tree with rotation operations',
    href: '/trees/avl-tree',
    isActive: false,
    comingSoon: true,
    color: 'bg-green-500',
    gradient: 'from-green-500 to-green-600',
    features: ['Auto-balancing', 'Rotation Animations', 'Height Calculation']
  },
  {
    id: 'red-black-tree',
    name: 'Red-Black Tree',
    description: 'Balanced binary search tree with color properties',
    href: '/trees/red-black-tree',
    isActive: false,
    comingSoon: true,
    color: 'bg-red-500',
    gradient: 'from-red-500 to-red-600',
    features: ['Color Rules', 'Violation Detection', 'Rebalancing']
  },
  {
    id: 'btree',
    name: 'B-Tree',
    description: 'Multi-way search tree optimized for disk operations',
    href: '/trees/b-tree',
    isActive: false,
    comingSoon: true,
    color: 'bg-purple-500',
    gradient: 'from-purple-500 to-purple-600',
    features: ['Multi-way Nodes', 'Splitting Operations', 'Database Indexing']
  },
  {
    id: 'trie',
    name: 'Trie (Prefix Tree)',
    description: 'Tree structure for storing strings and prefix operations',
    href: '/trees/trie',
    isActive: false,
    comingSoon: true,
    color: 'bg-orange-500',
    gradient: 'from-orange-500 to-orange-600',
    features: ['String Storage', 'Prefix Matching', 'Autocomplete']
  },
  {
    id: 'segment-tree',
    name: 'Segment Tree',
    description: 'Tree for range queries and updates',
    href: '/trees/segment-tree',
    isActive: false,
    comingSoon: true,
    color: 'bg-cyan-500',
    gradient: 'from-cyan-500 to-cyan-600',
    features: ['Range Queries', 'Lazy Propagation', 'Array Operations']
  },
  {
    id: 'fenwick-tree',
    name: 'Fenwick Tree (BIT)',
    description: 'Binary Indexed Tree for efficient prefix sum queries',
    href: '/trees/fenwick-tree',
    isActive: false,
    comingSoon: true,
    color: 'bg-pink-500',
    gradient: 'from-pink-500 to-pink-600',
    features: ['Prefix Sums', 'Bit Operations', 'Range Updates']
  },
  {
    id: 'heap',
    name: 'Binary Heap',
    description: 'Complete binary tree with heap property',
    href: '/trees/heap',
    isActive: false,
    comingSoon: true,
    color: 'bg-yellow-500',
    gradient: 'from-yellow-500 to-yellow-600',
    features: ['Priority Queue', 'Heap Property', 'Min/Max Operations']
  }
];

export default function TreesPage() {
  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl mb-6">
            <TreePine className="w-10 h-10 text-blue-400" />
          </div>
          <h1 className="text-4xl font-bold text-slate-100 mb-2">Tree Visualizers</h1>
          <p className="text-slate-400 text-lg mb-8 max-w-2xl mx-auto">
            Interactive visualization of different tree data structures and their operations. 
            Explore various tree types from basic binary trees to advanced balanced structures.
          </p>
          
          {/* Quick Selector */}
          <div className="flex justify-center mb-12">
            <TreeTypeSelector />
          </div>
        </div>

        {/* Tree Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {treeTypes.map((tree) => (
            <div key={tree.id} className="group relative">
              {tree.comingSoon ? (
                <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 h-full opacity-75 cursor-not-allowed">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-4 h-4 rounded-full ${tree.color} opacity-50`} />
                    <h3 className="text-lg font-bold text-slate-400">{tree.name}</h3>
                    <Lock className="w-4 h-4 text-slate-500 ml-auto" />
                  </div>
                  
                  <p className="text-slate-500 text-sm mb-4">
                    {tree.description}
                  </p>
                  
                  <div className="space-y-2 mb-6">
                    {tree.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs text-slate-500">
                        <div className="w-1 h-1 bg-slate-500 rounded-full" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-auto">
                    <div className="px-4 py-2 bg-slate-700 text-slate-400 rounded-lg text-sm text-center">
                      Coming Soon
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  href={tree.href}
                  className="block bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-slate-600 rounded-2xl p-6 h-full transition-all duration-200 group-hover:scale-105 group-hover:shadow-xl"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-4 h-4 rounded-full ${tree.color}`} />
                    <h3 className="text-lg font-bold text-slate-100">{tree.name}</h3>
                    <ArrowRight className="w-4 h-4 text-slate-400 ml-auto group-hover:text-slate-300 transition-colors" />
                  </div>
                  
                  <p className="text-slate-400 text-sm mb-4">
                    {tree.description}
                  </p>
                  
                  <div className="space-y-2 mb-6">
                    {tree.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs text-slate-400">
                        <div className="w-1 h-1 bg-slate-400 rounded-full" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-auto">
                    <div className={`px-4 py-2 bg-gradient-to-r ${tree.gradient} text-white rounded-lg text-sm text-center font-medium`}>
                      Explore Now
                    </div>
                  </div>
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Statistics Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
            <div className="text-3xl font-bold text-blue-400 mb-2">1</div>
            <div className="text-slate-300 font-medium mb-1">Available Now</div>
            <div className="text-slate-500 text-sm">Binary Search Tree</div>
          </div>
          
          <div className="text-center bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
            <div className="text-3xl font-bold text-yellow-400 mb-2">7</div>
            <div className="text-slate-300 font-medium mb-1">Coming Soon</div>
            <div className="text-slate-500 text-sm">Advanced tree structures</div>
          </div>
          
          <div className="text-center bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
            <div className="text-3xl font-bold text-green-400 mb-2">∞</div>
            <div className="text-slate-300 font-medium mb-1">Learning</div>
            <div className="text-slate-500 text-sm">Opportunities await</div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 border border-slate-700/50 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-100 mb-4">Ready to Start Learning?</h2>
            <p className="text-slate-400 mb-6">
              Begin with our Binary Search Tree visualizer to understand the fundamentals, 
              then explore more advanced structures as they become available.
            </p>
            <Link
              href="/binary-tree"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors"
            >
              <TreePine className="w-4 h-4" />
              Start with Binary Search Tree
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Tree Visualizers | DSA Visualizer',
  description: 'Interactive visualizations of various tree data structures including binary search trees, AVL trees, and more.',
}; 