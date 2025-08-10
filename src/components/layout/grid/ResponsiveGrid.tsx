import React, { useEffect, useRef } from 'react';
import { LayoutComponent } from '@/types/layout';
import { useLayout } from '@/components/providers/LayoutProvider';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';
import { useAnimations } from '@/hooks/useAnimations';

interface ResponsiveGridProps {
  components?: LayoutComponent[];
  gap?: number;
  minItemWidth?: number;
  onComponentUpdate?: (id: string, updates: Partial<LayoutComponent>) => void;
  className?: string;
}

export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  components: externalComponents,
  gap = 16,
  minItemWidth = 200,
  onComponentUpdate,
  className = '',
}) => {
  const { components: contextComponents, config } = useLayout();
  const { currentBreakpoint, calculateGridColumns } = useResponsiveLayout();
  const { animateGridReorder } = useAnimations();
  const gridRef = useRef<HTMLDivElement>(null);

  const components = externalComponents || contextComponents;
  const columns = calculateGridColumns(currentBreakpoint);

  useEffect(() => {
    if (gridRef.current) {
      const elements = Array.from(gridRef.current.children) as HTMLElement[];
      if (elements.length > 0) {
        animateGridReorder(elements, [], {
          duration: 300,
          easing: 'easeOutQuad',
        });
      }
    }
  }, [columns, animateGridReorder]);

  const calculateGridStyles = () => {
    const columnWidth = `calc((100% - ${(columns - 1) * gap}px) / ${columns})`;
    
    return {
      display: 'grid',
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
      gap: `${gap}px`,
      gridAutoRows: 'minmax(200px, auto)',
    };
  };

  const renderComponent = (component: LayoutComponent) => {
    const style = {
      gridColumn: `span ${Math.min(component.size.width, columns)}`,
      gridRow: `span ${component.size.height}`,
    };

    return (
      <div
        key={component.id}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
        style={style}
      >
        <h3 className="text-lg font-semibold mb-2">{component.title}</h3>
        <div className="text-gray-600">
          {component.type === 'metric' && (
            <div className="text-2xl font-bold text-blue-600">1,234</div>
          )}
          {component.type === 'chart' && (
            <div className="h-32 bg-gray-100 rounded flex items-center justify-center">
              Chart Placeholder
            </div>
          )}
          {component.type === 'table' && (
            <div className="text-sm">Table data would go here</div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      ref={gridRef}
      className={`w-full ${className}`}
      style={calculateGridStyles()}
    >
      {components.map(renderComponent)}
    </div>
  );
};
