'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useTheme } from '../../lib/theme-context';

interface CodeStep {
  line?: number;
  lines?: number[];
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
  compact?: boolean;
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
  playSpeed = 1000,
  compact = false
}: CodeHighlighterProps) {
  const [copied, setCopied] = useState(false);
  const { theme } = useTheme();

  // Use currentStep directly from props, no local state
  const currentStepLines = steps[currentStep]?.lines || (steps[currentStep]?.line ? [steps[currentStep].line!] : []);

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

  // Create custom renderer for highlighted lines
  const CustomCode = ({ children, ...props }: any) => {
    return (
      <code {...props}>
        {children}
      </code>
    );
  };

  const CustomPre = ({ children, ...props }: any) => {
    return (
      <pre {...props} className="relative">
        {children}
        {/* Overlay for line highlighting */}
        {currentStepLines.map((lineNumber, index) => (
          <motion.div
            key={`highlight-${lineNumber}-${index}`}
            className="absolute pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            style={{
              top: `${(lineNumber - 1) * 1.7 * 14 + 24}px`, // line height * font size + padding
              left: '0',
              right: '0',
              height: `${1.7 * 14}px`, // line height * font size
              backgroundColor: theme === 'dark' 
                ? 'rgba(56, 189, 248, 0.25)' 
                : 'rgba(56, 189, 248, 0.15)',
              borderLeft: '4px solid rgb(56, 189, 248)',
              borderRadius: '6px',
              animation: theme === 'dark' 
                ? 'pulse-highlight-dark 2.5s ease-in-out infinite' 
                : 'pulse-highlight 2.5s ease-in-out infinite',
              boxShadow: theme === 'dark'
                ? '0 0 0 1px rgba(56, 189, 248, 0.3), inset 0 0 0 1px rgba(56, 189, 248, 0.2)'
                : '0 0 0 1px rgba(56, 189, 248, 0.2), inset 0 0 0 1px rgba(56, 189, 248, 0.1)',
              marginLeft: '3em', // Account for line numbers
              zIndex: 1
            }}
          />
        ))}
      </pre>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "bg-gray-50 dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 overflow-hidden shadow-lg",
        compact && "text-sm",
        className
      )}
    >
      {/* Header */}
      <div className={cn(
        "flex items-center justify-between border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800/80",
        compact ? "p-3" : "p-4"
      )}>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className={cn("rounded-full bg-red-400", compact ? "w-2 h-2" : "w-3 h-3")}></div>
            <div className={cn("rounded-full bg-yellow-400", compact ? "w-2 h-2" : "w-3 h-3")}></div>
            <div className={cn("rounded-full bg-green-400", compact ? "w-2 h-2" : "w-3 h-3")}></div>
          </div>
          <h3 className={cn(
            "text-gray-900 dark:text-slate-100 font-semibold",
            compact ? "text-xs" : "text-sm"
          )}>{title}</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={copyCode}
            className={cn(
              "flex items-center gap-1 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors",
              compact ? "px-2 py-1 text-xs" : "px-3 py-1.5 text-xs"
            )}
          >
            <Copy size={compact ? 10 : 12} />
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Code Content */}
      <div className={cn(
        "relative bg-white dark:bg-slate-900",
        compact ? "p-4" : "p-6"
      )}>
        <div className="relative">
          <SyntaxHighlighter
            language={language}
            style={syntaxTheme}
            showLineNumbers={true}
            lineNumberStyle={{
              minWidth: '3em',
              paddingRight: '1em',
              color: theme === 'dark' ? '#64748b' : '#94a3b8',
              fontSize: compact ? '12px' : '13px',
              userSelect: 'none'
            }}
            customStyle={{
              margin: 0,
              padding: compact ? '1rem' : '1.5rem',
              background: 'transparent',
              fontSize: compact ? '13px' : '14px',
              lineHeight: '1.7',
              fontFamily: 'var(--font-geist-mono), "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
              borderRadius: '12px',
              overflow: 'visible'
            }}
            codeTagProps={{
              style: {
                fontFamily: 'var(--font-geist-mono), "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
                fontSize: compact ? '13px' : '14px',
                lineHeight: '1.7'
              }
            }}
            PreTag={CustomPre}
            CodeTag={CustomCode}
          >
            {code}
          </SyntaxHighlighter>
        </div>
      </div>

      {/* Step Information */}
      {steps.length > 0 && (
        <div className={cn(
          "border-t border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800/50",
          compact ? "p-3" : "p-4"
        )}>
          <div className={cn("flex items-center justify-between", compact ? "mb-2" : "mb-3")}>
            <span className={cn(
              "text-gray-600 dark:text-slate-400 font-medium",
              compact ? "text-xs" : "text-xs"
            )}>
              Step {currentStep + 1} of {steps.length}
            </span>
            <div className="flex gap-1">
              {steps.map((_, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => {
                    onStepChange?.(idx);
                  }}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  className={cn(
                    "rounded-full transition-all duration-300",
                    compact ? "w-2 h-2" : "w-3 h-3",
                    idx <= currentStep 
                      ? "bg-sky-400 shadow-lg" 
                      : "bg-gray-300 dark:bg-slate-600 hover:bg-gray-400 dark:hover:bg-slate-500"
                  )}
                />
              ))}
            </div>
          </div>
          
          <AnimatePresence mode="wait">
            {steps[currentStep] && (
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <p className={cn(
                  "text-gray-800 dark:text-slate-200 font-medium",
                  compact ? "text-xs" : "text-sm"
                )}>
                  {steps[currentStep].description}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
} 