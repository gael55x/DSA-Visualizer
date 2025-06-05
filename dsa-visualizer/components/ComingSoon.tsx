'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Code, Coffee, Sparkles } from 'lucide-react';

interface ComingSoonProps {
  title: string;
  description: string;
  backHref?: string;
  backText?: string;
}

export default function ComingSoon({ 
  title, 
  description, 
  backHref = "/", 
  backText = "Back to Home" 
}: ComingSoonProps) {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Animated Icon */}
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
            className="w-24 h-24 mx-auto mb-8 bg-gradient-to-r from-sky-400 to-yellow-400 rounded-2xl flex items-center justify-center"
          >
            <Code size={40} className="text-slate-900" />
          </motion.div>

          {/* Title */}
          <h1 className="text-4xl md:text-6xl font-bold text-slate-100 mb-4">
            {title}
          </h1>

          {/* Description */}
          <p className="text-xl text-slate-400 mb-8 leading-relaxed">
            {description}
          </p>

          {/* Cooking Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 mb-8"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                <Sparkles className="text-yellow-400" size={24} />
              </motion.div>
              <h2 className="text-2xl font-bold text-slate-100">The Devs are Cooking!</h2>
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                <Coffee className="text-yellow-400" size={24} />
              </motion.div>
            </div>
            <p className="text-slate-300">
              This visualization is currently being developed with love and attention to detail. 
              Check back soon for an amazing interactive experience!
            </p>
          </motion.div>

          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <Link
              href={backHref}
              className="inline-flex items-center gap-3 px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
            >
              <ArrowLeft size={20} />
              {backText}
            </Link>
          </motion.div>

          {/* Progress Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mt-12 flex justify-center space-x-2"
          >
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  delay: 1.2 + i * 0.1,
                  duration: 0.3
                }}
                className="w-2 h-2 bg-slate-600 rounded-full"
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
} 