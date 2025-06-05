'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Database, ChevronDown, ArrowUpDown } from 'lucide-react';
import { cn } from '../lib/utils';

const dataStructures = [
  { name: 'Arrays', href: '/array' },
  { name: 'Linked Lists', href: '/linked-list' },
  { name: 'Stacks', href: '/stack' },
  { name: 'Queues', href: '/queue' },
  { name: 'Binary Trees', href: '/binary-tree' },
];

const sortingAlgorithms = [
  { name: 'Bubble Sort', href: '/sorting/bubble-sort' },
  { name: 'Selection Sort', href: '/sorting/selection-sort' },
  { name: 'Insertion Sort', href: '/sorting/insertion-sort' },
  { name: 'Merge Sort', href: '/sorting/merge-sort' },
  { name: 'Quick Sort', href: '/sorting/quick-sort' },
  { name: 'Heap Sort', href: '/sorting/heap-sort' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSortingOpen, setIsSortingOpen] = useState(false);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/95 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            href="/"
            className="flex items-center gap-3 text-slate-100 hover:text-sky-400 transition-colors"
          >
            {/* DSA Tree Logo */}
            <div className="relative">
              <svg width="32" height="32" viewBox="0 0 32 32" className="transition-transform hover:scale-110">
                {/* Root node */}
                <circle cx="16" cy="6" r="3" fill="#38bdf8" className="drop-shadow-lg"/>
                
                {/* Connections */}
                <line x1="16" y1="9" x2="10" y2="18" stroke="#64748b" strokeWidth="2"/>
                <line x1="16" y1="9" x2="22" y2="18" stroke="#64748b" strokeWidth="2"/>
                <line x1="10" y1="21" x2="6" y2="26" stroke="#64748b" strokeWidth="1.5"/>
                <line x1="10" y1="21" x2="14" y2="26" stroke="#64748b" strokeWidth="1.5"/>
                
                {/* Child nodes */}
                <circle cx="10" cy="18" r="2.5" fill="#22d3ee" className="drop-shadow-md"/>
                <circle cx="22" cy="18" r="2.5" fill="#22d3ee" className="drop-shadow-md"/>
                
                {/* Leaf nodes */}
                <circle cx="6" cy="26" r="2" fill="#fbbf24" className="drop-shadow-sm"/>
                <circle cx="14" cy="26" r="2" fill="#fbbf24" className="drop-shadow-sm"/>
                <circle cx="22" cy="26" r="2" fill="#fbbf24" className="drop-shadow-sm"/>
              </svg>
            </div>
            <div>
              <span className="font-bold text-xl">DSA Visualizer</span>
              <div className="text-xs text-slate-400 -mt-1">Data Structures & Algorithms</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6">
              {dataStructures.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="group flex items-center gap-2 text-slate-300 hover:text-sky-400 transition-colors"
                >
                  <span className="font-medium">{item.name}</span>
                </Link>
              ))}
              
              {/* Sorting Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsSortingOpen(!isSortingOpen)}
                  className="group flex items-center gap-2 text-slate-300 hover:text-sky-400 transition-colors"
                >
                  <span className="font-medium">Sorting</span>
                  <ChevronDown 
                    size={16} 
                    className={cn(
                      "transition-transform duration-200",
                      isSortingOpen && "rotate-180"
                    )}
                  />
                </button>
                
                <AnimatePresence>
                  {isSortingOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-lg overflow-hidden"
                    >
                      <div className="py-2">
                        {sortingAlgorithms.map((algorithm) => (
                          <Link
                            key={algorithm.name}
                            href={algorithm.href}
                            onClick={() => setIsSortingOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-slate-300 hover:text-sky-400 hover:bg-slate-700/50 transition-colors"
                          >
                            <span className="font-medium">{algorithm.name}</span>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            
            <Link
              href="/about"
              className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-xl font-medium transition-colors"
            >
              About
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-slate-300 hover:text-sky-400 transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden py-4 border-t border-slate-700"
            >
              <div className="space-y-4">
                {dataStructures.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 text-slate-300 hover:text-sky-400 transition-colors p-2"
                  >
                    <span className="font-medium">{item.name}</span>
                  </Link>
                ))}
                
                {/* Mobile Sorting Section */}
                <div className="border-t border-slate-700 pt-4">
                  <div className="flex items-center gap-3 text-slate-300 p-2 mb-2">
                    <ArrowUpDown size={16} />
                    <span className="font-medium">Sorting Algorithms</span>
                  </div>
                  <div className="pl-6 space-y-2">
                    {sortingAlgorithms.map((algorithm) => (
                      <Link
                        key={algorithm.name}
                        href={algorithm.href}
                        onClick={() => setIsOpen(false)}
                        className="block text-slate-400 hover:text-sky-400 transition-colors p-2"
                      >
                        {algorithm.name}
                      </Link>
                    ))}
                  </div>
                </div>
                
                <Link
                  href="/about"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center px-4 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-xl font-medium transition-colors mt-4"
                >
                  About
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
} 