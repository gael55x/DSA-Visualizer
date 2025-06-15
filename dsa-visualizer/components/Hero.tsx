'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Code, Zap, GitBranch } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative bg-slate-900 min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>
        
        {/* Animated DSA Nodes */}
        <div className="absolute top-20 left-20 w-4 h-4 bg-sky-400/20 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-32 w-3 h-3 bg-yellow-400/30 rounded-full animate-pulse delay-500"></div>
        <div className="absolute bottom-32 left-40 w-5 h-5 bg-green-400/20 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 right-20 w-3 h-3 bg-purple-400/25 rounded-full animate-pulse delay-700"></div>
        
        {/* Connecting Lines */}
        <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none">
          <line x1="10%" y1="20%" x2="30%" y2="60%" stroke="#38bdf8" strokeWidth="1" className="animate-pulse"/>
          <line x1="70%" y1="25%" x2="85%" y2="70%" stroke="#fbbf24" strokeWidth="1" className="animate-pulse delay-300"/>
          <line x1="20%" y1="80%" x2="80%" y2="30%" stroke="#22d3ee" strokeWidth="1" className="animate-pulse delay-600"/>
        </svg>
      </div>

      <div className="mt-10 relative z-10 max-w-6xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold text-slate-100 mb-6 leading-tight"
          >
            Visualize{' '}
            <span className="bg-gradient-to-r from-sky-400 via-cyan-400 to-yellow-400 bg-clip-text text-transparent">
              Data Structures
            </span>
            <br/>
            <span className="text-4xl md:text-5xl text-slate-300">& Algorithms</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-lg md:text-xl text-slate-400 mb-12 max-w-4xl mx-auto leading-relaxed"
          >
            Master computer science fundamentals through interactive visualizations. 
            Watch algorithms execute step-by-step with comprehensive code analysis and real-time animations.
          </motion.p>

          {/* Feature Highlights */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto"
          >
            {[
              { icon: Zap, text: 'Real-time Animations', desc: 'Watch algorithms execute step by step', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
              { icon: Code, text: 'Code Analysis', desc: 'Comprehensive complexity analysis', color: 'text-sky-400', bg: 'bg-sky-500/10', border: 'border-sky-500/20' },
              { icon: GitBranch, text: 'Interactive Learning', desc: 'Hands-on exploration and control', color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' }
            ].map((feature, index) => (
              <motion.div
                key={feature.text}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                className={`${feature.bg} border ${feature.border} rounded-xl p-6 text-center backdrop-blur-sm`}
              >
                <feature.icon size={24} className={`${feature.color} mx-auto mb-3`} />
                <h3 className="text-slate-100 font-semibold mb-2">{feature.text}</h3>
                <p className="text-slate-400 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
          >
            <Link
              href="/array"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-sky-500/25"
            >
              Start Learning
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link
              href="/sorting/bubble-sort"
              className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-600 hover:border-slate-500 rounded-2xl font-semibold text-lg transition-all duration-300"
            >
              Try Sorting
            </Link>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-wrap justify-center gap-8 text-center"
          >
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-sky-400">5+</span>
              <span className="text-slate-400 text-sm">Data Structures</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-yellow-400">10+</span>
              <span className="text-slate-400 text-sm">Algorithms</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-green-400">100%</span>
              <span className="text-slate-400 text-sm">Interactive</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
} 