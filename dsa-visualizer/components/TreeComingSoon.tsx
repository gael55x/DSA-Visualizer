import { TreePine, Clock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import TreeTypeSelector from './ui/TreeTypeSelector';

interface TreeComingSoonProps {
  title: string;
  description: string;
  features?: string[];
  complexity?: {
    search?: string;
    insert?: string;
    delete?: string;
    space?: string;
  };
}

export default function TreeComingSoon({ 
  title, 
  description, 
  features = [],
  complexity 
}: TreeComingSoonProps) {
  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 border border-slate-700/50 shadow-2xl">
            {/* Icon and Title */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl mb-6">
                <TreePine className="w-10 h-10 text-blue-400" />
              </div>
              <h2 className="text-3xl font-bold text-slate-100 mb-2">{title}</h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                {description}
              </p>
            </div>

            {/* Coming Soon Badge */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-full">
                <Clock className="w-5 h-5 text-yellow-400" />
                <span className="text-yellow-400 font-medium">Coming Soon</span>
              </div>
            </div>

            {/* Features and Complexity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              
              {/* Planned Features */}
              {features.length > 0 && (
                <div className="bg-slate-700/30 rounded-2xl p-6 border border-slate-600/30">
                  <h3 className="text-xl font-bold text-slate-100 mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    Planned Features
                  </h3>
                  <ul className="space-y-3">
                    {features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3 text-slate-300">
                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Time Complexity */}
              {complexity && (
                <div className="bg-slate-700/30 rounded-2xl p-6 border border-slate-600/30">
                  <h3 className="text-xl font-bold text-slate-100 mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    Time Complexity
                  </h3>
                  <div className="space-y-3">
                    {complexity.search && (
                      <div className="flex justify-between items-center py-2 border-b border-slate-600/30">
                        <span className="text-slate-400">Search:</span>
                        <span className="text-green-400 font-mono font-bold">{complexity.search}</span>
                      </div>
                    )}
                    {complexity.insert && (
                      <div className="flex justify-between items-center py-2 border-b border-slate-600/30">
                        <span className="text-slate-400">Insert:</span>
                        <span className="text-blue-400 font-mono font-bold">{complexity.insert}</span>
                      </div>
                    )}
                    {complexity.delete && (
                      <div className="flex justify-between items-center py-2 border-b border-slate-600/30">
                        <span className="text-slate-400">Delete:</span>
                        <span className="text-yellow-400 font-mono font-bold">{complexity.delete}</span>
                      </div>
                    )}
                    {complexity.space && (
                      <div className="flex justify-between items-center py-2">
                        <span className="text-slate-400">Space:</span>
                        <span className="text-purple-400 font-mono font-bold">{complexity.space}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Call to Action */}
            <div className="text-center">
              <p className="text-slate-400 mb-6">
                This visualizer is currently under development. In the meantime, check out our other tree implementations!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/trees"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Tree Overview
                </Link>
                
                <Link
                  href="/binary-tree"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-colors"
                >
                  <TreePine className="w-4 h-4" />
                  Try Binary Search Tree
                </Link>
              </div>
            </div>
          </div>

          {/* Timeline Hint */}
          <div className="mt-8 text-center">
            <p className="text-slate-500 text-sm">
              💡 Tip: Follow our development progress and get notified when new visualizers are released!
            </p>
          </div>
        </div>
      </div>
  );
} 