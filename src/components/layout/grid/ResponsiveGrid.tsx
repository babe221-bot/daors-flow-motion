import React from 'react';
import { LayoutComponent } from '@/types/layout';

interface ResponsiveGridProps {
  components?: LayoutComponent[];
  gap?: number;
  minItemWidth?: number;
  onComponentUpdate?: (component: LayoutComponent) => void;
  className?: string;
}

export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  components = [],
  gap = 16,
  minItemWidth = 200,
  onComponentUpdate,
  className = '',
}) => {
  const gridStyle = {
    display: 'grid',
    gap: `${gap}px`,
    gridTemplateColumns: `repeat(auto-fit, minmax(${minItemWidth}px, 1fr))`,
  };

  return (
    <div className={className} style={gridStyle}>
      {components.map((component) => (
        <div
          key={component.id}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
          style={{
            gridColumn: `span ${component.width || 1}`,
            gridRow: `span ${component.height || 1}`,
          }}
        >
          <h3 className="text-lg font-semibold mb-2">{component.title}</h3>
          <p className="text-gray-600">{component.description}</p>
        </div>
      ))}
    </div>
  );
};
