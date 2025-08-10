import { useState, useEffect, useCallback } from 'react';
import { defaultBreakpoints, getBreakpoint, isBreakpointUp, getResponsiveValue } from '@/lib/layout/breakpoints';

export const useResponsiveLayout = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [currentBreakpoint, setCurrentBreakpoint] = useState('lg');
  const [isMobile, setIsMobile] = useState(false);

  const handleResize = useCallback(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    setWindowSize({ width, height });
    
    const breakpoint = getBreakpoint(width);
    setCurrentBreakpoint(breakpoint);
    
    setIsMobile(width < 768);
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  const getResponsiveValueHook = useCallback(<T>(
    values: Record<string, T>
  ): T => {
    return getResponsiveValue(values, currentBreakpoint);
  }, [currentBreakpoint]);

  const isBreakpointUpHook = useCallback((target: string): boolean => {
    return isBreakpointUp(currentBreakpoint, target);
  }, [currentBreakpoint]);

  return {
    windowSize,
    currentBreakpoint,
    isMobile,
    isBreakpointUp: isBreakpointUpHook,
    getResponsiveValue: getResponsiveValueHook,
  };
};
