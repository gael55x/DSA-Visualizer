'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Database } from 'lucide-react';
import { cn } from '../lib/utils';

const dataStructures = [
  { name: 'Arrays', href: '/array' },
  { name: 'Linked Lists', href: '/linked-list' },
  { name: 'Stacks', href: '/stack' },
  { name: 'Queues', href: '/queue' },
  { name: 'Binary Trees', href: '/binary-tree' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

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
            className="flex items-center gap-2 text-slate-100 hover:text-sky-400 transition-colors"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-sky-400 to-yellow-400 rounded-lg flex items-center justify-center">
              <Database size={20} className="text-slate-900" />
            </div>
            <span className="font-bold text-xl">DSA Visualizer</span>
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
                    <span className="font-mono text-lg w-8 text-center">
                      {item.icon}
                    </span>
                    <span className="font-medium">{item.name}</span>
                  </Link>
                ))}
                
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