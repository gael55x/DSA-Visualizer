'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Play, Pause, RotateCcw, BookOpen } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useTheme } from '../../lib/theme-context';

interface CodeStep {
  line: number;
  description: string;
  highlight?: boolean;
}

interface CodeHighlighterProps {
  code: string;
  language?: string;
  steps?: CodeStep[];
  currentStep?: number;
  title?: string;
  className?: string;
  showControls?: boolean;
  onStepChange?: (step: number) => void;
  autoPlay?: boolean;
  playSpeed?: number;
}

export default function CodeHighlighter({
  code,
  language = 'typescript',
  steps = [],
  currentStep = 0,
  title = 'Code',
  className,
  showControls = true,
  onStepChange,
  autoPlay = false,
  playSpeed = 1000
}: CodeHighlighterProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [step, setStep] = useState(currentStep);
  const [showExplanation, setShowExplanation] = useState(true);
  const { theme } = useTheme();

  const codeLines = code.split('\n');
  const highlightedLines = steps
    .filter((s, idx) => idx <= step)
    .map(s => s.line);

  useEffect(() => {
    setStep(currentStep);
  }, [currentStep]);

  useEffect(() => {
    if (autoPlay && isPlaying && steps.length > 0) {
      const timer = setTimeout(() => {
        if (step < steps.length - 1) {
          const nextStep = step + 1;
          setStep(nextStep);
          onStepChange?.(nextStep);
        } else {
          setIsPlaying(false);
        }
      }, playSpeed);

      return () => clearTimeout(timer);
    }
  }, [step, isPlaying, autoPlay, steps.length, playSpeed, onStepChange]);

  const handlePlay = () => {
    if (step >= steps.length - 1) {
      setStep(0);
      onStepChange?.(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setStep(0);
    setIsPlaying(false);
    onStepChange?.(0);
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  };

  const syntaxTheme = theme === 'dark' ? vscDarkPlus : vs;

  const customStyle = {
    ...syntaxTheme,
    'pre[class*="language-"]': {
      ...syntaxTheme['pre[class*="language-"]'],
      background: 'var(--background-secondary)',
      border: '1px solid var(--border)',
      borderRadius: '12px',
      padding: '1.5rem',
      margin: 0,
      fontSize: '14px',
      lineHeight: '1.6',
      fontFamily: 'var(--font-geist-mono), monospace'
    },
    'code[class*="language-"]': {
      ...syntaxTheme['code[class*="language-"]'],
      background: 'transparent',
      color: 'var(--foreground)',
      fontFamily: 'var(--font-geist-mono), monospace'
    }
  };

  const lineNumberStyle = (lineNumber: number) => {
    const isHighlighted = highlightedLines.includes(lineNumber);
    const isCurrentStep = steps[step]?.line === lineNumber;
    
    return {
      display: 'inline-block',
      width: '100%',
      backgroundColor: isCurrentStep 
        ? 'rgba(56, 189, 248, 0.2)' 
        : isHighlighted 
        ? 'rgba(56, 189, 248, 0.1)' 
        : 'transparent',
      borderLeft: isCurrentStep 
        ? '4px solid var(--accent-sky)' 
        : isHighlighted 
        ? '3px solid var(--accent-sky)' 
        : '3px solid transparent',
      paddingLeft: '12px',
      paddingRight: '8px',
      paddingTop: '2px',
      paddingBottom: '2px',
      transition: 'all 0.4s ease',
      animation: isCurrentStep ? 'pulse-highlight 1.5s ease-in-out' : 'none'
    };
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "bg-white dark:bg-slate-800 rounded-2xl border-2 border-gray-200 dark:border-slate-700 overflow-hidden shadow-lg",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
          </div>
          <h3 className="text-gray-900 dark:text-slate-100 font-semibold text-sm">{title}</h3>
        </div>
        <div className="flex items-center gap-2">
          {showControls && steps.length > 0 && (
            <>
              <button
                onClick={() => setShowExplanation(!showExplanation)}
                className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-medium transition-colors"
              >
                <BookOpen size={12} />
                {showExplanation ? 'Hide' : 'Show'} Help
              </button>
              <button
                onClick={handlePlay}
                className="flex items-center gap-1 px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-medium transition-colors"
              >
                {isPlaying ? <Pause size={12} /> : <Play size={12} />}
                {isPlaying ? 'Pause' : 'Play'}
              </button>
              <button
                onClick={handleReset}
                className="flex items-center gap-1 px-3 py-1.5 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-xs font-medium transition-colors"
              >
                <RotateCcw size={12} />
                Reset
              </button>
            </>
          )}
          <button
            onClick={copyCode}
            className="flex items-center gap-1 px-3 py-1.5 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-xs font-medium transition-colors"
          >
            <Copy size={12} />
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Code Content */}
      <div className="relative">
        <SyntaxHighlighter
          language={language}
          style={customStyle}
          showLineNumbers
          lineNumberStyle={lineNumberStyle}
          customStyle={{
            margin: 0,
            padding: '1.5rem',
            background: 'var(--background-secondary)',
            fontSize: '14px'
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>

      {/* Step Information */}
      {steps.length > 0 && (
        <div className="p-4 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-gray-600 dark:text-slate-400 font-medium">
              Step {step + 1} of {steps.length}
            </span>
            <div className="flex gap-1">
              {steps.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setStep(idx);
                    onStepChange?.(idx);
                  }}
                  className={cn(
                    "w-3 h-3 rounded-full transition-all duration-300",
                    idx <= step 
                      ? "bg-sky-400 scale-110" 
                      : "bg-gray-300 dark:bg-slate-600 hover:bg-gray-400 dark:hover:bg-slate-500"
                  )}
                />
              ))}
            </div>
          </div>
          
          <AnimatePresence mode="wait">
            {steps[step] && (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-2"
              >
                <p className="text-sm text-gray-800 dark:text-slate-200 font-medium">
                  {steps[step].description}
                </p>
                
                {showExplanation && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-xs text-gray-600 dark:text-slate-400 bg-blue-50 dark:bg-slate-700/50 p-3 rounded-lg border border-blue-200 dark:border-slate-600"
                  >
                    💡 <strong>What's happening:</strong> This step is highlighting line {steps[step].line} in the code above. 
                    The blue highlight shows which part of the algorithm is currently being executed.
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
} 