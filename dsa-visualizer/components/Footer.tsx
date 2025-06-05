import Link from "next/link";
import { Database, Github, Heart } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  const quickLinks = [
    { name: "Arrays", href: "/array" },
    { name: "Linked Lists", href: "/linked-list" },
    { name: "Stacks", href: "/stack" },
    { name: "Queues", href: "/queue" },
    { name: "Binary Trees", href: "/binary-tree" },
  ];

  return (
    <footer className="bg-slate-900 border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-sky-400 to-yellow-400 rounded-lg flex items-center justify-center">
                <Image src="/favicon.svg" alt="DSA Visualizer" width={32} height={32} />
              </div>
              <span className="font-bold text-xl text-slate-100">DSA Visualizer</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Learn data structures and algorithms through interactive visualizations 
              and real-time animations.
            </p>
            <div className="flex items-center gap-2 text-slate-400">
              <span>Made with</span>
              <Heart size={16} className="text-red-400 fill-current" />
              <span>for learners (and for myself lol)</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-100">Data Structures</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-slate-400 hover:text-sky-400 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Additional Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-100">Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/about" 
                  className="text-slate-400 hover:text-sky-400 transition-colors duration-200"
                >
                  About
                </Link>
              </li>
              <li>
                <a 
                  href="https://github.com/gael55x/DSA-Visualizer" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-slate-400 hover:text-sky-400 transition-colors duration-200"
                >
                  <Github size={16} />
                  GitHub
                </a>
              </li>
              <li>
                <Link 
                  href="/docs" 
                  className="text-slate-400 hover:text-sky-400 transition-colors duration-200"
                >
                  Documentation
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            © {currentYear} DSA Visualizer. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link 
              href="/privacy" 
              className="text-slate-500 hover:text-slate-400 text-sm transition-colors duration-200"
            >
              Privacy Policy
            </Link>
            <Link 
              href="/terms" 
              className="text-slate-500 hover:text-slate-400 text-sm transition-colors duration-200"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
} 