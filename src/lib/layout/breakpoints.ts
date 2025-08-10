import { ResponsiveBreakpoint } from '@/types/layout';

export const defaultBreakpoints: ResponsiveBreakpoint[] = [
  { name: 'xs', minWidth: 0, columns: 1, containerPadding: '16px' },
  { name: 'sm', minWidth: 640, columns: 2, containerPadding: '20px' },
  { name: 'md', minWidth: 768, columns: 3, containerPadding: '24px' },
  { name: 'lg', minWidth: 1024, columns: 4, containerPadding: '32px' },
  { name: 'xl', minWidth: 1280, columns: 6, containerPadding: '40px' },
  { name: '2xl', minWidth: 1536, columns: 8, containerPadding: '48px' },
];

export const getBreakpoint = (width: number): string => {
  const sortedBreakpoints = [...defaultBreakpoints].sort((a, b) => b.minWidth - a.minWidth);
  return sortedBreakpoints.find(bp => width >= bp.minWidth)?.name || 'xs';
};

export const isBreakpointUp = (current: string, target: string): boolean => {
  const currentIndex = defaultBreakpoints.findIndex(bp => bp.name === current);
  const targetIndex = defaultBreakpoints.findIndex(bp => bp.name === target);
  return currentIndex >= targetIndex;
};

export const getResponsiveValue = <T>(
  values: Record<string, T>,
  breakpoint: string
): T => {
  const sortedBreakpoints = [...defaultBreakpoints].sort((a, b) => b.minWidth - a.minWidth);
  const currentIndex = sortedBreakpoints.findIndex(bp => bp.name === breakpoint);
  
  for (let i = currentIndex; i < sortedBreakpoints.length; i++) {
    const bp = sortedBreakpoints[i];
    if (values[bp.name] !== undefined) {
      return values[bp.name];
    }
  }
  
  return values.xs || Object.values(values)[0];
};
