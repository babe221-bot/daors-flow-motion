import { LayoutTemplate, LayoutComponent } from '@/types/layout';

export const generateTemplate = (templateName: string): LayoutComponent[] => {
  const templates: Record<string, LayoutComponent[]> = {
    dashboard: [
      {
        id: 'metrics-overview',
        type: 'MetricCard',
        props: { title: 'Total Shipments', value: 1247, trend: '+12%' },
        position: { x: 0, y: 0 },
        size: { width: 3, height: 1 },
      },
      {
        id: 'active-routes',
        type: 'RouteMap',
        props: { showActiveRoutes: true },
        position: { x: 3, y: 0 },
        size: { width: 5, height: 3 },
      },
      {
        id: 'recent-orders',
        type: 'OrderList',
        props: { limit: 10 },
        position: { x: 0, y: 1 },
        size: { width: 3, height: 2 },
      },
    ],
    analytics: [
      {
        id: 'performance-chart',
        type: 'AnimatedChart',
        props: { type: 'line', data: [] },
        position: { x: 0, y: 0 },
        size: { width: 6, height: 2 },
      },
      {
        id: 'kpi-cards',
        type: 'MetricCard',
        props: { title: 'On-Time Delivery', value: '94%', trend: '+2%' },
        position: { x: 0, y: 2 },
        size: { width: 2, height: 1 },
      },
    ],
  };

  return templates[templateName] || templates.dashboard;
};

export const calculateGridPosition = (
  index: number,
  columns: number,
  gap: number,
  itemWidth: number,
  itemHeight: number
): { x: number; y: number } => {
  const row = Math.floor(index / columns);
  const col = index % columns;
  
  return {
    x: col * (itemWidth + gap),
    y: row * (itemHeight + gap),
  };
};

export const generateGridAreas = (
  components: LayoutComponent[],
  columns: number
): string => {
  const maxRow = Math.max(...components.map(c => c.position?.y || 0)) + 1;
  const maxCol = Math.max(...components.map(c => c.position?.x || 0)) + 1;
  
  const grid = Array(maxRow).fill(null).map(() => Array(maxCol).fill('.'));
  
  components.forEach(component => {
    const { x, y } = component.position || { x: 0, y: 0 };
    const { width = 1, height = 1 } = component.size || {};
    
    for (let row = y; row < y + height; row++) {
      for (let col = x; col < x + width; col++) {
        if (grid[row] && grid[row][col] !== undefined) {
          grid[row][col] = component.id;
        }
      }
    }
  });
  
  return grid.map(row => `"${row.join(' ')}"`).join(' ');
};
