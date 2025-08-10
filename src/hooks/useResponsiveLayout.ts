import { useState, useEffect } from 'react';
import { GridConfig, ResponsiveBreakpoint } from '@/types/layout';

interface WindowSize {
  width: number;
  height: number;
}

interface UseResponsiveLayoutReturn {
  windowSize: WindowSize;
  currentBreakpoint: string;
  isMobile: boolean;
  isBreakpointUp: (target: string) => boolean;
  getResponsiveValue: <T>(values: Record<string, T>) => T;
  calculateGridColumns: (breakpoint: string) => number;
}

const defaultConfig: GridConfig = {
  columns: 12,
  gap: 16,
  minItemWidth: 200,
  breakpoints: [
    { name: 'xs', minWidth: 0, columns: 1, containerPadding: 8 },
    { name: 'sm', minWidth: 640, columns: 2, containerPadding: 12 },
    { name: 'md', minWidth: 768, columns: 3, containerPadding: 16 },
    { name: 'lg', minWidth: 1024, columns: 4, containerPadding: 20 },
    { name: 'xl', minWidth: 1280, columns: 6, containerPadding: 24 },
  ],
};

export const useResponsiveLayout = (config: GridConfig = defaultConfig): UseResponsiveLayoutReturn => {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const [currentBreakpoint, setCurrentBreakpoint] = useState('xs');

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const breakpoint = config.breakpoints
      .slice()
      .reverse()
      .find(bp => windowSize.width >= bp.minWidth);
    
    setCurrentBreakpoint(breakpoint?.name || 'xs');
  }, [windowSize.width, config.breakpoints]);

  const isBreakpointUp = (target: string): boolean => {
    const targetBp = config.breakpoints.find(bp => bp.name === target);
    if (!targetBp) return false;
    return windowSize.width >= targetBp.minWidth;
  };

  const getResponsiveValue = <T,>(values: Record<string, T>): T => {
    return values[currentBreakpoint] || values['xs'] || Object.values(values)[0];
  };

  const calculateGridColumns = (breakpoint: string): number => {
    const bp = config.breakpoints.find(b => b.name === breakpoint);
    return bp?.columns || 1;
  };

  return {
    windowSize,
    currentBreakpoint,
    isMobile: windowSize.width < 768,
    isBreakpointUp,
    getResponsiveValue,
    calculateGridColumns,
  };
};
