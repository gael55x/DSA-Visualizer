'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, TreePine, Lock } from 'lucide-react';
import { cn } from '../../lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface TreeType {
  id: string;
  name: string;
  description: string;
  href: string;
  isActive: boolean;
  comingSoon?: boolean;
  color: string;
}

const treeTypes: TreeType[] = [
  {
    id: 'binary-tree',
    name: 'Binary Search Tree',
    description: 'Basic binary tree with search, insert, and delete operations',
    href: '/binary-tree',
    isActive: true,
    color: 'bg-blue-500'
  },
  {
    id: 'avl-tree',
    name: 'AVL Tree',
    description: 'Self-balancing binary search tree with rotation operations',
    href: '/trees/avl-tree',
    isActive: false,
    comingSoon: true,
    color: 'bg-green-500'
  },
  {
    id: 'red-black-tree',
    name: 'Red-Black Tree',
    description: 'Balanced binary search tree with color properties',
    href: '/trees/red-black-tree',
    isActive: false,
    comingSoon: true,
    color: 'bg-red-500'
  },
  {
    id: 'btree',
    name: 'B-Tree',
    description: 'Multi-way search tree optimized for disk operations',
    href: '/trees/b-tree',
    isActive: false,
    comingSoon: true,
    color: 'bg-purple-500'
  },
  {
    id: 'trie',
    name: 'Trie (Prefix Tree)',
    description: 'Tree structure for storing strings and prefix operations',
    href: '/trees/trie',
    isActive: false,
    comingSoon: true,
    color: 'bg-orange-500'
  },
  {
    id: 'segment-tree',
    name: 'Segment Tree',
    description: 'Tree for range queries and updates',
    href: '/trees/segment-tree',
    isActive: false,
    comingSoon: true,
    color: 'bg-cyan-500'
  },
  {
    id: 'fenwick-tree',
    name: 'Fenwick Tree (BIT)',
    description: 'Binary Indexed Tree for efficient prefix sum queries',
    href: '/trees/fenwick-tree',
    isActive: false,
    comingSoon: true,
    color: 'bg-pink-500'
  },
  {
    id: 'heap',
    name: 'Binary Heap',
    description: 'Complete binary tree with heap property',
    href: '/trees/heap',
    isActive: false,
    comingSoon: true,
    color: 'bg-yellow-500'
  }
];

export default function TreeTypeSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Find current tree type based on pathname
  const currentTreeType = treeTypes.find(type => 
    pathname === type.href || 
    (pathname === '/binary-tree' && type.id === 'binary-tree')
  ) || treeTypes[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Current Selection Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-xl transition-all duration-200 min-w-[280px] text-left"
      >
        <div className="flex items-center gap-3 flex-1">
          <div className={cn("w-3 h-3 rounded-full", currentTreeType.color)} />
          <div className="flex-1">
            <div className="text-slate-100 font-medium">{currentTreeType.name}</div>
            <div className="text-slate-400 text-sm">{currentTreeType.description}</div>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-slate-400" />
        </motion.div>
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-600 rounded-xl shadow-2xl z-50 overflow-hidden max-h-96 overflow-y-auto"
          >
            <div className="p-2">
              {treeTypes.map((treeType) => (
                <div key={treeType.id} className="relative">
                  {treeType.comingSoon ? (
                    <div className="flex items-center gap-3 px-3 py-3 text-slate-500 cursor-not-allowed rounded-lg">
                      <div className={cn("w-3 h-3 rounded-full opacity-50", treeType.color)} />
                      <div className="flex-1">
                        <div className="font-medium flex items-center gap-2">
                          {treeType.name}
                          <Lock className="w-3 h-3" />
                        </div>
                        <div className="text-sm">{treeType.description}</div>
                      </div>
                      <div className="text-xs bg-slate-700 px-2 py-1 rounded-full">
                        Coming Soon
                      </div>
                    </div>
                  ) : (
                    <Link
                      href={treeType.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 hover:bg-slate-700",
                        pathname === treeType.href 
                          ? "bg-slate-700 border border-slate-600" 
                          : "hover:bg-slate-700/50"
                      )}
                    >
                      <div className={cn("w-3 h-3 rounded-full", treeType.color)} />
                      <div className="flex-1">
                        <div className="text-slate-100 font-medium">{treeType.name}</div>
                        <div className="text-slate-400 text-sm">{treeType.description}</div>
                      </div>
                      {pathname === treeType.href && (
                        <div className="w-2 h-2 bg-blue-400 rounded-full" />
                      )}
                    </Link>
                  )}
                </div>
              ))}
            </div>
            
            {/* Footer */}
            <div className="border-t border-slate-700 px-4 py-3 bg-slate-800/50">
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <TreePine className="w-4 h-4" />
                <span>More tree types coming soon...</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 