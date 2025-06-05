'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Database, GitBranch, Layers, RotateCcw, ArrowUpDown, Binary } from 'lucide-react';

export default function Features() {
  const dataStructures = [
    {
      title: "Arrays",
      description: "Visualize array operations and understand indexing, insertion, deletion, and searching.",
      icon: Database,
      href: "/array",
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Linked Lists",
      description: "Explore node connections and pointer manipulation in singly linked lists.",
      icon: GitBranch,
      href: "/linked-list",
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "Stacks",
      description: "Master LIFO operations with push, pop, and peek visualizations.",
      icon: Layers,
      href: "/stack",
      color: "from-purple-500 to-violet-500"
    },
    {
      title: "Queues",
      description: "Learn FIFO principles through enqueue and dequeue animations.",
      icon: RotateCcw,
      href: "/queue",
      color: "from-orange-500 to-red-500"
    },
    {
      title: "Binary Trees",
      description: "Understand tree structures with interactive node insertion and traversal.",
      icon: Binary,
      href: "/binary-tree",
      color: "from-indigo-500 to-purple-500"
    },
  ];

  const sortingAlgorithms = [
    {
      title: "Bubble Sort",
      description: "Watch adjacent elements bubble to their correct positions.",
      href: "/sorting/bubble-sort",
      complexity: "O(n²)"
    },
    {
      title: "Selection Sort",
      description: "See how the minimum element gets selected in each pass.",
      href: "/sorting/selection-sort",
      complexity: "O(n²)"
    },
    {
      title: "Insertion Sort",
      description: "Observe elements being inserted into their sorted positions.",
      href: "/sorting/insertion-sort",
      complexity: "O(n²)"
    }
  ];

  return (
    <section className="py-20 bg-slate-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-64 h-64 bg-sky-400/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-yellow-400/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        
        {/* Data Structures Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-slate-100 mb-6">
            Interactive Learning Platform
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Explore data structures and algorithms through hands-on visualizations with comprehensive code analysis.
          </p>
        </motion.div>

        {/* Data Structures Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {dataStructures.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <Link
                  href={item.href}
                  className="group block p-6 bg-slate-800/50 border border-slate-700 rounded-2xl backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-slate-900/50 h-full"
                >
                  <div className="flex flex-col h-full">
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent size={24} className="text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-100 group-hover:text-sky-400 transition-colors">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors flex-grow">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-end mt-4">
                      <ArrowRight 
                        size={16} 
                        className="text-slate-400 group-hover:text-sky-400 group-hover:translate-x-1 transition-all" 
                      />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Sorting Algorithms Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <ArrowUpDown className="text-sky-400" size={32} />
            <h3 className="text-3xl md:text-4xl font-bold text-slate-100">
              Sorting Algorithms
            </h3>
          </div>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Watch sorting algorithms in action with step-by-step comparisons and swaps.
          </p>
        </motion.div>

        {/* Sorting Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {sortingAlgorithms.map((algorithm, index) => (
            <motion.div
              key={algorithm.title}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1, duration: 0.6 }}
            >
              <Link
                href={algorithm.href}
                className="group block p-6 bg-gradient-to-br from-slate-800/50 to-slate-800/30 border border-slate-700 rounded-2xl backdrop-blur-sm hover:from-slate-800/70 hover:to-slate-800/50 transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-lg font-bold text-slate-100 group-hover:text-sky-400 transition-colors">
                    {algorithm.title}
                  </h4>
                  <span className="text-xs font-mono bg-slate-700/50 text-slate-300 px-2 py-1 rounded">
                    {algorithm.complexity}
                  </span>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed group-hover:text-slate-300 transition-colors">
                  {algorithm.description}
                </p>
                <div className="flex items-center justify-end mt-4">
                  <ArrowRight 
                    size={14} 
                    className="text-slate-400 group-hover:text-sky-400 group-hover:translate-x-1 transition-all" 
                  />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-sky-500/10 to-yellow-500/10 border border-sky-500/20 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-slate-100 mb-4">
              Ready to Master Data Structures?
            </h3>
            <p className="text-slate-400 mb-6 max-w-2xl mx-auto">
              Start with the fundamentals and work your way up to complex algorithms. 
              Each visualization includes detailed explanations and time complexity analysis.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/array"
                className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
              >
                <Database size={18} />
                Start with Arrays
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/sorting/bubble-sort"
                className="inline-flex items-center gap-3 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-slate-100 border border-slate-600 hover:border-slate-500 rounded-xl font-semibold transition-all duration-300"
              >
                <ArrowUpDown size={18} />
                Try Sorting
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 