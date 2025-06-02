'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative bg-slate-900 min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-sky-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
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
            Learn Data Structures{' '}
            <span className="bg-gradient-to-r from-sky-400 to-yellow-400 bg-clip-text text-transparent">
              Visually
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Interactive visualizations with step-by-step animations. 
            Master arrays, linked lists, stacks, queues, and trees through hands-on exploration.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Link
              href="/array"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-sky-500 hover:bg-sky-600 text-white rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-sky-500/25"
            >
              <Play size={20} />
              Start Learning
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link
              href="#features"
              className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-600 hover:border-slate-500 rounded-2xl font-semibold text-lg transition-all duration-300"
            >
              Explore Features
            </Link>
          </motion.div>

          {/* Quick Access */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="text-center"
          >
            <p className="text-slate-400 text-sm mb-6">Quick Access</p>
            <div className="flex flex-wrap justify-center gap-3">
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
                  transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
                >
                  <Link
                    href={item.href}
                    className="px-4 py-2 bg-slate-800/50 hover:bg-slate-700/70 border border-slate-600/50 hover:border-slate-500 text-slate-300 hover:text-slate-100 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105"
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