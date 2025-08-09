// Responsive grid system with anime.js animations
import React, { useRef, useEffect, useState } from 'react';
import { useAnimations } from '@/hooks/useAnimations';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';
import { animateGridItemEntrance, animateBreakpointTransition } from '@/lib/animations/layoutAnimations';
import { calculateGridItemSize, generateGridTemplate, calculateGridArea } from '@/lib/layout/gridSystem';
import { cn } from '@/lib/utils';
import { LayoutComponent, ResponsiveBreakpoint } from '@/types/layout';

interface ResponsiveGridProps {
  components: LayoutComponent[];
  gap?: number;
  minItemWidth?: number;
  className?: string;
  children?: React.ReactNode;
  onComponentUpdate?: (components: LayoutComponent[]) => void;
}

export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  components,
  gap = 24,
  minItemWidth = 200,
  className,
  children,
  onComponentUpdate,
}) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const { createAnimation } = useAnimations();
  const {
    currentBreakpoint,
    getCurrentBreakpointInfo,
    windowSize,
  } = useResponsiveLayout();

  const [mounted, setMounted] = useState(false);
  const [previousBreakpoint, setPreviousBreakpoint] = useState<ResponsiveBreakpoint['name']>(currentBreakpoint);

  const breakpointInfo = getCurrentBreakpointInfo();
  const columns = breakpointInfo.columns;

  // Handle breakpoint changes with animation
  useEffect(() => {
    if (mounted && previousBreakpoint !== currentBreakpoint && gridRef.current) {
      animateBreakpointTransition(gridRef.current, previousBreakpoint, currentBreakpoint);
      setPreviousBreakpoint(currentBreakpoint);
    }
  }, [currentBreakpoint, previousBreakpoint, mounted]);

  // Animate grid items on mount
  useEffect(() => {
    setMounted(true);
    if (gridRef.current) {
      const gridItems = gridRef.current.querySelectorAll('[data-grid-item]');
      animateGridItemEntrance(gridItems as NodeListOf<HTMLElement>);
    }
  }, []);

  // Calculate grid styles
  const gridStyles: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap: `${gap}px`,
    width: '100%',
  };

  // Render grid items
  const renderGridItems = () => {
    return components.map((component) => {
      const gridArea = calculateGridArea(component);
      
      return (
        <div
          key={component.id}
          className={cn(
            'bg-card border border-border rounded-lg p-4 transition-all duration-300',
            'hover:shadow-md hover:border-primary/20',
            component.isDraggable && 'cursor-move',
            component.isResizable && 'resize-both overflow-auto'
          )}
          style={{
            gridArea,
            minWidth: minItemWidth,
          }}
          data-grid-item
          data-component-id={component.id}
          data-component-type={component.type}
        >
          {/* Component content based on type */}
          {renderComponentContent(component)}
        </div>
      );
    });
  };

  // Render component content based on type
  const renderComponentContent = (component: LayoutComponent) => {
    switch (component.type) {
      case 'widget':
        return (
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">Widget</h3>
            <div className="h-20 bg-muted rounded flex items-center justify-center">
              <span className="text-xs text-muted-foreground">Widget Content</span>
            </div>
          </div>
        );
      
      case 'chart':
        return (
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">Chart</h3>
            <div className="h-32 bg-muted rounded flex items-center justify-center">
              <span className="text-xs text-muted-foreground">Chart Visualization</span>
            </div>
          </div>
        );
      
      case 'table':
        return (
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">Data Table</h3>
            <div className="space-y-1">
              {[1, 2, 3].map((row) => (
                <div key={row} className="h-6 bg-muted rounded flex items-center px-2">
                  <span className="text-xs text-muted-foreground">Row {row}</span>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'form':
        return (
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">Form</h3>
            <div className="space-y-2">
              <div className="h-8 bg-muted rounded"></div>
              <div className="h-8 bg-muted rounded"></div>
              <div className="h-6 bg-primary/20 rounded"></div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="h-20 bg-muted rounded flex items-center justify-center">
            <span className="text-xs text-muted-foreground">
              {component.type} Component
            </span>
          </div>
        );
    }
  };

  return (
    <div
      ref={gridRef}
      className={cn(
        'responsive-grid transition-all duration-500 ease-out',
        className
      )}
      style={gridStyles}
      data-breakpoint={currentBreakpoint}
      data-columns={columns}
    >
      {renderGridItems()}
      {children}
    </div>
  );
};

// Grid item wrapper component
export const GridItem: React.FC<{
  children: React.ReactNode;
  gridArea?: string;
  className?: string;
  isDraggable?: boolean;
  isResizable?: boolean;
}> = ({
  children,
  gridArea,
  className,
  isDraggable = false,
  isResizable = false,
}) => {
  return (
    <div
      className={cn(
        'bg-card border border-border rounded-lg p-4 transition-all duration-300',
        'hover:shadow-md hover:border-primary/20',
        isDraggable && 'cursor-move',
        isResizable && 'resize-both overflow-auto',
        className
      )}
      style={{ gridArea }}
      data-grid-item
    >
      {children}
    </div>
  );
};

// Auto-sizing grid container
export const AutoGrid: React.FC<{
  children: React.ReactNode;
  minItemWidth?: number;
  gap?: number;
  className?: string;
}> = ({
  children,
  minItemWidth = 250,
  gap = 24,
  className,
}) => {
  const { windowSize } = useResponsiveLayout();
  
  // Calculate optimal columns based on container width
  const columns = Math.max(1, Math.floor(windowSize.width / (minItemWidth + gap)));
  
  return (
    <div
      className={cn('auto-grid', className)}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: `${gap}px`,
      }}
    >
      {children}
    </div>
  );
};

// Masonry-style grid
export const MasonryGrid: React.FC<{
  children: React.ReactNode;
  columns?: number;
  gap?: number;
  className?: string;
}> = ({
  children,
  columns = 3,
  gap = 24,
  className,
}) => {
  const { isMobile } = useResponsiveLayout();
  const actualColumns = isMobile ? 1 : columns;
  
  return (
    <div
      className={cn('masonry-grid', className)}
      style={{
        columnCount: actualColumns,
        columnGap: `${gap}px`,
      }}
    >
      {React.Children.map(children, (child, index) => (
        <div
          key={index}
          style={{
            breakInside: 'avoid',
            marginBottom: `${gap}px`,
          }}
          data-masonry-item
        >
          {child}
        </div>
      ))}
    </div>
  );
};

// Responsive grid with predefined breakpoints
export const BreakpointGrid: React.FC<{
  children: React.ReactNode;
  breakpoints: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: number;
  className?: string;
}> = ({
  children,
  breakpoints,
  gap = 24,
  className,
}) => {
  const { currentBreakpoint } = useResponsiveLayout();
  const columns = breakpoints[currentBreakpoint] || breakpoints.md || 2;
  
  return (
    <div
      className={cn('breakpoint-grid', className)}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: `${gap}px`,
      }}
      data-breakpoint={currentBreakpoint}
    >
      {children}
    </div>
  );
};