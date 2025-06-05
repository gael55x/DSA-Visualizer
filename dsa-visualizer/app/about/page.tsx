'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Code, Heart, Users, Target, Zap, GitBranch, Coffee } from 'lucide-react';

export default function AboutPage() {
  const features = [
    {
      icon: Zap,
      title: "Interactive Visualizations",
      description: "Watch algorithms come to life with real-time animations and step-by-step execution."
    },
    {
      icon: Code,
      title: "Code Analysis",
      description: "Comprehensive code highlighting and detailed complexity analysis for every algorithm."
    },
    {
      icon: Users,
      title: "Educational Focus",
      description: "Designed with learners in mind, from beginners to advanced computer science students."
    },
    {
      icon: Target,
      title: "Practical Learning",
      description: "Hands-on approach to understanding data structures and algorithms through interaction."
    }
  ];

  const stats = [
    { number: "10+", label: "Data Structures" },
    { number: "15+", label: "Algorithms" },
    { number: "100%", label: "Interactive" },
    { number: "0$", label: "Cost" }
  ];

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 bg-sky-400/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-yellow-400/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-slate-100 mb-6">
              About{' '}
              <span className="bg-gradient-to-r from-sky-400 to-yellow-400 bg-clip-text text-transparent">
                DSA Visualizer
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-400 max-w-4xl mx-auto leading-relaxed">
              Empowering learners to master data structures and algorithms through 
              interactive visualizations and comprehensive educational content.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 relative">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-12 border border-slate-700/50"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-slate-100 mb-6">Our Mission</h2>
                <p className="text-lg text-slate-300 leading-relaxed mb-6">
                  We believe that understanding data structures and algorithms shouldn&apos;t be 
                  intimidating or abstract. Our mission is to make these fundamental 
                  computer science concepts accessible, engaging, and intuitive through 
                  interactive visualizations.
                </p>
                <p className="text-lg text-slate-300 leading-relaxed">
                  Whether you&apos;re a student preparing for technical interviews, a developer 
                  brushing up on fundamentals, or simply curious about how algorithms work, 
                  DSA Visualizer provides the tools you need to learn effectively.
                </p>
              </div>
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-64 h-64 bg-gradient-to-br from-sky-400/20 to-yellow-400/20 rounded-full"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Heart size={80} className="text-sky-400" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-slate-100 mb-4">Why Choose DSA Visualizer?</h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Built with modern web technologies and educational best practices
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
                  className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 hover:bg-slate-800/70 transition-all duration-300"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-sky-400 to-cyan-400 rounded-2xl flex items-center justify-center mb-6">
                    <IconComponent size={32} className="text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-100 mb-4">{feature.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-r from-sky-500/10 to-yellow-500/10 border border-sky-500/20 rounded-3xl p-12"
          >
            <h2 className="text-3xl font-bold text-slate-100 text-center mb-12">By the Numbers</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                  className="text-center"
                >
                  <div className="text-4xl md:text-5xl font-bold text-sky-400 mb-2">{stat.number}</div>
                  <div className="text-slate-300 font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-slate-100 mb-4">Built with Modern Technology</h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Leveraging cutting-edge web technologies to deliver smooth, responsive, and accessible visualizations
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { name: "Next.js", description: "React Framework" },
              { name: "TypeScript", description: "Type Safety" },
              { name: "Tailwind CSS", description: "Styling" },
              { name: "Framer Motion", description: "Animations" }
            ].map((tech, index) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6 text-center hover:bg-slate-800/50 transition-all duration-300"
              >
                <h3 className="text-lg font-bold text-slate-100 mb-2">{tech.name}</h3>
                <p className="text-slate-400 text-sm">{tech.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-slate-800/30 border border-slate-700/50 rounded-3xl p-12"
          >
            <h2 className="text-3xl font-bold text-slate-100 text-center mb-8">Support the Project</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Contribute */}
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <GitBranch size={32} className="text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-slate-100 mb-4">Contribute</h3>
                <p className="text-slate-400 mb-6">
                  Help us improve DSA Visualizer by contributing new features, fixing bugs, or enhancing documentation.
                </p>
                <Link
                  href="https://github.com/gael55x/DSA-Visualizer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 text-green-400 hover:text-green-300 rounded-xl font-semibold transition-all duration-300"
                >
                  <GitBranch size={20} />
                  View on GitHub
                  <ArrowRight size={16} />
                </Link>
              </div>

              {/* Coffee */}
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 text-center">
                <div className="w-16 h-16 bg-yellow-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Coffee size={32} className="text-yellow-400" />
                </div>
                <h3 className="text-2xl font-bold text-slate-100 mb-4">Buy Me a Coffee</h3>
                <p className="text-slate-400 mb-6">
                  Support the development of DSA Visualizer and help us create more amazing educational content.
                </p>
                <Link
                  href="https://buymeacoffee.com/gael55x"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/30 text-yellow-400 hover:text-yellow-300 rounded-xl font-semibold transition-all duration-300"
                >
                  <Coffee size={20} />
                  Buy Coffee
                  <Heart size={16} className="text-red-400" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-100 mb-6">
              Ready to Start Learning?
            </h2>
            <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
              Join thousands of learners who are mastering data structures and algorithms 
              through interactive visualizations.
            </p>
            <Link
              href="/array"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-sky-500/25"
            >
              Start Learning Now
              <ArrowRight size={24} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 