// Responsive grid system utilities
import { ResponsiveBreakpoint, GridConfig, LayoutComponent } from '@/types/layout';

// Default responsive breakpoints
export const defaultBreakpoints: ResponsiveBreakpoint[] = [
  { name: 'xs', minWidth: 0, columns: 1, containerPadding: '16px' },
  { name: 'sm', minWidth: 640, columns: 2, containerPadding: '20px' },
  { name: 'md', minWidth: 768, columns: 3, containerPadding: '24px' },
  { name: 'lg', minWidth: 1024, columns: 4, containerPadding: '32px' },
  { name: 'xl', minWidth: 1280, columns: 6, containerPadding: '40px' },
  { name: '2xl', minWidth: 1536, columns: 8, containerPadding: '48px' },
];

// Default grid configuration
export const defaultGridConfig: GridConfig = {
  columns: 12,
  gap: '24px',
  breakpoints: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
  },
};

// Get current breakpoint based on window width
export const getCurrentBreakpoint = (
  width: number,
  breakpoints: ResponsiveBreakpoint[] = defaultBreakpoints
): ResponsiveBreakpoint => {
  return breakpoints
    .slice()
    .reverse()
    .find(bp => width >= bp.minWidth) || breakpoints[0];
};

// Calculate grid item dimensions
export const calculateGridItemSize = (
  component: LayoutComponent,
  containerWidth: number,
  columns: number,
  gap: number
): { width: number; height: number } => {
  const availableWidth = containerWidth - (gap * (columns - 1));
  const columnWidth = availableWidth / columns;
  
  const width = (columnWidth * component.position.width) + (gap * (component.position.width - 1));
  const height = component.position.height * 120; // Base height unit
  
  return { width, height };
};

// Generate CSS Grid template
export const generateGridTemplate = (
  components: LayoutComponent[],
  columns: number
): string => {
  const maxRow = Math.max(...components.map(c => c.position.y + c.position.height));
  const rows = Array(maxRow).fill('120px'); // Base row height
  
  return `repeat(${maxRow}, 120px)`;
};

// Calculate grid area for component
export const calculateGridArea = (component: LayoutComponent): string => {
  const { x, y, width, height } = component.position;
  return `${y + 1} / ${x + 1} / ${y + height + 1} / ${x + width + 1}`;
};

// Validate grid layout
export const validateGridLayout = (
  components: LayoutComponent[],
  maxColumns: number
): { isValid: boolean; conflicts: string[] } => {
  const conflicts: string[] = [];
  const occupiedCells = new Set<string>();
  
  for (const component of components) {
    const { x, y, width, height } = component.position;
    
    // Check bounds
    if (x + width > maxColumns) {
      conflicts.push(`Component ${component.id} exceeds grid width`);
      continue;
    }
    
    if (x < 0 || y < 0) {
      conflicts.push(`Component ${component.id} has negative position`);
      continue;
    }
    
    // Check overlaps
    for (let row = y; row < y + height; row++) {
      for (let col = x; col < x + width; col++) {
        const cellKey = `${row}-${col}`;
        if (occupiedCells.has(cellKey)) {
          conflicts.push(`Component ${component.id} overlaps with another component`);
          break;
        }
        occupiedCells.add(cellKey);
      }
    }
  }
  
  return {
    isValid: conflicts.length === 0,
    conflicts,
  };
};

// Auto-arrange components to avoid overlaps
export const autoArrangeComponents = (
  components: LayoutComponent[],
  maxColumns: number
): LayoutComponent[] => {
  const arranged: LayoutComponent[] = [];
  const occupiedCells = new Set<string>();
  
  // Sort by area (largest first) for better packing
  const sortedComponents = [...components].sort((a, b) => {
    const areaA = a.position.width * a.position.height;
    const areaB = b.position.width * b.position.height;
    return areaB - areaA;
  });
  
  for (const component of sortedComponents) {
    const { width, height } = component.position;
    let placed = false;
    
    // Try to find a valid position
    for (let y = 0; y < 100 && !placed; y++) {
      for (let x = 0; x <= maxColumns - width && !placed; x++) {
        // Check if this position is available
        let canPlace = true;
        for (let row = y; row < y + height && canPlace; row++) {
          for (let col = x; col < x + width && canPlace; col++) {
            if (occupiedCells.has(`${row}-${col}`)) {
              canPlace = false;
            }
          }
        }
        
        if (canPlace) {
          // Mark cells as occupied
          for (let row = y; row < y + height; row++) {
            for (let col = x; col < x + width; col++) {
              occupiedCells.add(`${row}-${col}`);
            }
          }
          
          arranged.push({
            ...component,
            position: { ...component.position, x, y },
          });
          placed = true;
        }
      }
    }
    
    // If we couldn't place it, add it at the end
    if (!placed) {
      const maxY = Math.max(0, ...Array.from(occupiedCells).map(cell => parseInt(cell.split('-')[0])));
      arranged.push({
        ...component,
        position: { ...component.position, x: 0, y: maxY + 1 },
      });
    }
  }
  
  return arranged;
};

// Generate responsive CSS classes
export const generateResponsiveClasses = (
  component: LayoutComponent,
  breakpoints: ResponsiveBreakpoint[]
): string => {
  const classes: string[] = [];
  
  breakpoints.forEach(bp => {
    const { name, columns } = bp;
    const responsiveWidth = Math.min(component.position.width, columns);
    classes.push(`${name}:col-span-${responsiveWidth}`);
  });
  
  return classes.join(' ');
};

// Calculate optimal grid dimensions
export const calculateOptimalGrid = (
  components: LayoutComponent[],
  containerWidth: number,
  minItemWidth: number = 200
): { columns: number; itemWidth: number } => {
  const maxColumns = Math.floor(containerWidth / minItemWidth);
  const optimalColumns = Math.min(maxColumns, 12); // Cap at 12 columns
  const itemWidth = (containerWidth - (24 * (optimalColumns - 1))) / optimalColumns;
  
  return { columns: optimalColumns, itemWidth };
};