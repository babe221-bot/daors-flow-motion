import { LayoutComponent } from '@/types/layout';

export const generateLayoutTemplate = (templateType: string): LayoutComponent[] => {
  const templates: Record<string, LayoutComponent[]> = {
    dashboard: [
      {
        id: 'metrics-overview',
        type: 'metrics-card',
        props: { title: 'Overview', variant: 'default' },
        position: { x: 0, y: 0 },
        size: { width: 300, height: 200 },
        isDraggable: true,
        isResizable: true,
      },
      {
        id: 'recent-orders',
        type: 'orders-table',
        props: { title: 'Recent Orders', limit: 10 },
        position: { x: 320, y: 0 },
        size: { width: 400, height: 300 },
        isDraggable: true,
        isResizable: true,
      },
      {
        id: 'shipment-map',
        type: 'map-view',
        props: { center: [0, 0], zoom: 10 },
        position: { x: 0, y: 220 },
        size: { width: 300, height: 250 },
        isDraggable: true,
        isResizable: true,
      },
    ],
    analytics: [
      {
        id: 'revenue-chart',
        type: 'chart',
        props: { type: 'line', title: 'Revenue Trends' },
        position: { x: 0, y: 0 },
        size: { width: 500, height: 300 },
        isDraggable: true,
        isResizable: true,
      },
      {
        id: 'performance-metrics',
        type: 'metrics-card',
        props: { variant: 'analytics' },
        position: { x: 520, y: 0 },
        size: { width: 250, height: 300 },
        isDraggable: true,
        isResizable: true,
      },
    ],
  };

  return templates[templateType] || [];
};

export const validateLayout = (layout: LayoutComponent[]): boolean => {
  if (!Array.isArray(layout)) return false;
  
  return layout.every(component => 
    component.id && 
    component.type && 
    typeof component.position.x === 'number' &&
    typeof component.position.y === 'number' &&
    typeof component.size.width === 'number' &&
    typeof component.size.height === 'number'
  );
};

export const normalizeLayout = (layout: LayoutComponent[]): LayoutComponent[] => {
  return layout.map(component => ({
    ...component,
    isDraggable: component.isDraggable ?? true,
    isResizable: component.isResizable ?? true,
    zIndex: component.zIndex ?? 1,
  }));
};

export const getLayoutBounds = (layout: LayoutComponent[]) => {
  if (layout.length === 0) {
    return { minX: 0, minY: 0, maxX: 0, maxY: 0 };
  }

  const minX = Math.min(...layout.map(c => c.position.x));
  const minY = Math.min(...layout.map(c => c.position.y));
  const maxX = Math.max(...layout.map(c => c.position.x + c.size.width));
  const maxY = Math.max(...layout.map(c => c.position.y + c.size.height));

  return { minX, minY, maxX, maxY };
};
