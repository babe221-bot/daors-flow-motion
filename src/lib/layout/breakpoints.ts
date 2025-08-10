import { ResponsiveBreakpoint } from '@/types/layout';

export const defaultBreakpoints: ResponsiveBreakpoint[] = [
  { name: 'xs', minWidth: 0, columns: 1, containerPadding: '16px' },
  { name: 'sm', minWidth: 640, columns: 2, containerPadding: '20px' },
  { name: 'md', minWidth: 768, columns: 3, containerPadding: '24px' },
  { name: 'lg', minWidth: 1024, columns: 4, containerPadding: '32px' },
  { name: 'xl', minWidth: 1280, columns: 6, containerPadding: '40px' },
  { name: '2xl', minWidth: 1536, columns: 8, containerPadding: '48px' },
];

export const getBreakpoint = (width: number): ResponsiveBreakpoint => {
  return [...defaultBreakpoints]
    .reverse()
    .find(bp => width >= bp.minWidth) || defaultBreakpoints[0];
};

export const getResponsiveValue = <T>(
  values: Record<string, T>,
  currentBreakpoint: string
): T => {
  return values[currentBreakpoint] || values['md'] || Object.values(values)[0];
};
