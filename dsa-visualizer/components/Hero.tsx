'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Code, Play, Zap, Eye } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative bg-slate-900 min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-sky-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-sky-500/20 border border-sky-400/30 rounded-full text-sky-400 text-sm font-medium mb-8"
          >
            <Zap size={16} />
            2025 Design • Real-time Animations • Step-by-step Learning
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold text-slate-100 mb-6 leading-tight"
          >
            Learn Data Structures{' '}
            <span className="bg-gradient-to-r from-sky-400 to-yellow-400 bg-clip-text text-transparent">
              Visually
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Interactive visualizations with smooth animations, real-time code execution, 
            and step-by-step explanations. Master DSA concepts through modern, engaging experiences.
          </motion.p>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto"
          >
            <div className="p-6 bg-slate-800/50 border border-slate-700 rounded-2xl backdrop-blur-sm">
              <div className="w-12 h-12 bg-sky-500/20 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Play size={24} className="text-sky-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-100 mb-2">Real-time Animations</h3>
              <p className="text-slate-400 text-sm">
                Watch operations unfold with smooth, optimized animations powered by Framer Motion
              </p>
            </div>

            <div className="p-6 bg-slate-800/50 border border-slate-700 rounded-2xl backdrop-blur-sm">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Code size={24} className="text-yellow-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-100 mb-2">Code Highlighting</h3>
              <p className="text-slate-400 text-sm">
                Follow along with synchronized code execution and line-by-line highlighting
              </p>
            </div>

            <div className="p-6 bg-slate-800/50 border border-slate-700 rounded-2xl backdrop-blur-sm">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Eye size={24} className="text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-100 mb-2">Step-by-step Learning</h3>
              <p className="text-slate-400 text-sm">
                Understand each operation with detailed explanations and visual feedback
              </p>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/array"
              className="group px-8 py-4 bg-sky-500 hover:bg-sky-600 text-white rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-sky-500/25"
            >
              Start with Arrays
              <span className="ml-2 group-hover:translate-x-1 transition-transform inline-block">→</span>
            </Link>
            
            <Link
              href="/about"
              className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-600 hover:border-slate-500 rounded-2xl font-semibold text-lg transition-all duration-300"
            >
              Learn More
            </Link>
          </motion.div>

          {/* Data Structures Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="mt-16 text-center"
          >
            <p className="text-slate-400 text-sm mb-6">Available Data Structures</p>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { name: 'Arrays', href: '/array' },
                { name: 'Linked Lists', href: '/linked-list' },
                { name: 'Stacks', href: '/stack' },
                { name: 'Queues', href: '/queue' },
                { name: 'Binary Trees', href: '/binary-tree' }
              ].map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9 + index * 0.1, duration: 0.5 }}
                >
                  <Link
                    href={item.href}
                    className="px-4 py-2 bg-slate-800/30 hover:bg-slate-700/50 border border-slate-600/50 hover:border-slate-500 text-slate-300 hover:text-slate-100 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105"
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
} 