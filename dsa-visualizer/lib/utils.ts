import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const generateRandomArray = (length: number, min: number = 1, max: number = 100): number[] => {
  return Array.from({ length }, () => Math.floor(Math.random() * (max - min + 1)) + min);
};

export const formatTime = (ms: number): string => {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
};

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

export interface AnimationConfig {
  duration: number;
  delay: number;
  ease: string;
}

export const defaultAnimationConfig: AnimationConfig = {
  duration: 0.5,
  delay: 0,
  ease: "easeInOut"
};

export const animationVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  
  slideInLeft: {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 50 }
  },
  
  slideInRight: {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
  },
  
  scale: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 }
  },
  
  bounce: {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 0.6,
        ease: "easeInOut"
      }
    }
  }
}; 