'use client';

import { motion } from 'framer-motion';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../../lib/theme-context';

export default function ThemeToggle() {
  const { theme, setTheme, mounted } = useTheme();

  // Don't render during SSR to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="w-12 h-12 rounded-xl bg-gray-200 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 animate-pulse" />
    );
  }

  const cycleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  const getIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun size={20} className="text-yellow-500" />;
      case 'dark':
        return <Moon size={20} className="text-slate-100" />;
      case 'system':
        return <Monitor size={20} className="text-blue-400" />;
      default:
        return <Moon size={20} className="text-slate-100" />;
    }
  };

  const getLabel = () => {
    switch (theme) {
      case 'light':
        return 'Switch to dark mode';
      case 'dark':
        return 'Switch to system mode';
      case 'system':
        return 'Switch to light mode';
      default:
        return 'Toggle theme';
    }
  };

  return (
    <motion.button
      onClick={cycleTheme}
      className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-gray-200 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={getLabel()}
      title={getLabel()}
    >
      <motion.div
        key={theme} // Force re-render when theme changes
        initial={{ rotate: -180, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        exit={{ rotate: 180, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {getIcon()}
      </motion.div>
    </motion.button>
  );
} 