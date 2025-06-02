'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Database, GitBranch, Layers, RotateCcw } from 'lucide-react';

export default function Features() {
  const features = [
    {
      title: "Arrays",
      description: "Visualize array operations like insertion, deletion, and searching with step-by-step animations.",
      icon: Database,
      href: "/array",
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Linked Lists",
      description: "See how linked list nodes connect and how operations modify the structure in real-time.",
      icon: GitBranch,
      href: "/linked-list",
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "Stacks",
      description: "Understand LIFO (Last-In-First-Out) operations with interactive push and pop visualizations.",
      icon: Layers,
      href: "/stack",
      color: "from-purple-500 to-violet-500"
    },
    {
      title: "Queues",
      description: "Learn FIFO (First-In-First-Out) principles through enqueue and dequeue animations.",
      icon: RotateCcw,
      href: "/queue",
      color: "from-orange-500 to-red-500"
    },
  ];

  return (
    <section id="features" className="py-20 bg-slate-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-64 h-64 bg-sky-400/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-yellow-400/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-slate-100 mb-6">
            Master Data Structures
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Explore interactive visualizations that bring abstract concepts to life. 
            Each data structure comes with hands-on examples and real-time animations.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <Link
                  href={feature.href}
                  className="group block p-8 bg-slate-800/50 border border-slate-700 rounded-2xl backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-slate-900/50"
                >
                  <div className="flex items-start gap-6">
                    <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent size={28} className="text-white" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-2xl font-bold text-slate-100 group-hover:text-sky-400 transition-colors">
                          {feature.title}
                        </h3>
                        <ArrowRight 
                          size={20} 
                          className="text-slate-400 group-hover:text-sky-400 group-hover:translate-x-1 transition-all" 
                        />
                      </div>
                      <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-center mt-16"
        >
          <Link
            href="/binary-tree"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-sky-500 to-yellow-500 hover:from-sky-600 hover:to-yellow-600 text-white rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-sky-500/25"
          >
            <GitBranch size={20} />
            Explore Binary Trees
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
} 