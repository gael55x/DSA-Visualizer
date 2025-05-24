'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Play, Pause, RotateCcw } from 'lucide-react';
import { cn } from '../../lib/utils';

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

  const codeLines = code.split('\n');
  const highlightedLines = steps
    .filter((s, idx) => idx <= step)
    .map(s => s.line);

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

  const customStyle = {
    ...vscDarkPlus,
    'pre[class*="language-"]': {
      ...vscDarkPlus['pre[class*="language-"]'],
      background: 'var(--background-secondary)',
      border: '1px solid var(--border)',
      borderRadius: '16px',
      padding: '1.5rem',
      margin: 0,
      fontSize: '14px',
      lineHeight: '1.6'
    },
    'code[class*="language-"]': {
      ...vscDarkPlus['code[class*="language-"]'],
      background: 'transparent',
      color: 'var(--foreground)'
    }
  };

  const lineNumberStyle = (lineNumber: number) => ({
    display: 'inline-block',
    width: '100%',
    backgroundColor: highlightedLines.includes(lineNumber) 
      ? 'rgba(56, 189, 248, 0.1)' 
      : 'transparent',
    borderLeft: highlightedLines.includes(lineNumber) 
      ? '3px solid var(--accent-sky)' 
      : '3px solid transparent',
    paddingLeft: '8px',
    transition: 'all 0.3s ease'
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-800/50">
        <h3 className="text-slate-100 font-semibold text-sm">{title}</h3>
        <div className="flex items-center gap-2">
          {showControls && steps.length > 0 && (
            <>
              <button
                onClick={handlePlay}
                className="flex items-center gap-1 px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-medium transition-colors"
              >
                {isPlaying ? <Pause size={12} /> : <Play size={12} />}
                {isPlaying ? 'Pause' : 'Play'}
              </button>
              <button
                onClick={handleReset}
                className="flex items-center gap-1 px-3 py-1.5 bg-slate-600 hover:bg-slate-700 text-white rounded-lg text-xs font-medium transition-colors"
              >
                <RotateCcw size={12} />
                Reset
              </button>
            </>
          )}
          <button
            onClick={copyCode}
            className="flex items-center gap-1 px-3 py-1.5 bg-slate-600 hover:bg-slate-700 text-white rounded-lg text-xs font-medium transition-colors"
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
        <div className="p-4 border-t border-slate-700 bg-slate-800/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400">
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
                    "w-2 h-2 rounded-full transition-colors",
                    idx <= step ? "bg-sky-400" : "bg-slate-600"
                  )}
                />
              ))}
            </div>
          </div>
          
          {steps[step] && (
            <motion.p
              key={step}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-slate-200"
            >
              {steps[step].description}
            </motion.p>
          )}
        </div>
      )}
    </motion.div>
  );
} 