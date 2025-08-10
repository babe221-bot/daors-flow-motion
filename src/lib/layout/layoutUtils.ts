import { LayoutComponent } from '@/types/layout';

export const generateLayoutTemplate = (template: string): LayoutComponent[] => {
  const templates: Record<string, LayoutComponent[]> = {
    dashboard: [
      {
        id: 'metrics-1',
        type: 'metric-card',
        title: 'Total Shipments',
        description: '1,234 shipments today',
        width: 1,
        height: 1,
        position: { x: 0, y: 0 },
      },
      {
        id: 'metrics-2',
        type: 'metric-card',
        title: 'Active Routes',
        description: '45 routes active',
        width: 1,
        height: 1,
        position: { x: 1, y: 0 },
      },
      {
        id: 'metrics-3',
        type: 'metric-card',
        title: 'Delivered Today',
        description: '89 deliveries completed',
        width: 1,
        height: 1,
        position: { x: 2, y: 0 },
      },
      {
        id: 'chart-1',
        type: 'chart',
        title: 'Shipment Trends',
        description: 'Weekly shipment analysis',
        width: 2,
        height: 2,
        position: { x: 0, y: 1 },
      },
      {
        id: 'map-1',
        type: 'map',
        title: 'Live Tracking',
        description: 'Real-time fleet tracking',
        width: 2,
        height: 2,
        position: { x: 2, y: 1 },
      },
    ],
    analytics: [
      {
        id: 'analytics-1',
        type: 'chart',
        title: 'Revenue Analytics',
        description: 'Monthly revenue trends',
        width: 3,
        height: 2,
        position: { x: 0, y: 0 },
      },
      {
        id: 'analytics-2',
        type: 'table',
        title: 'Performance Metrics',
        description: 'Key performance indicators',
        width: 2,
        height: 3,
        position: { x: 0, y: 2 },
      },
    ],
  };

  return templates[template] || templates.dashboard;
};

export const calculateGridPosition = (
  index: number,
  columns: number,
  itemWidth: number,
  itemHeight: number,
  gap: number
) => {
  const row = Math.floor(index / columns);
  const col = index % columns;
  
  return {
    x: col * (itemWidth + gap),
    y: row * (itemHeight + gap),
  };
};

export const getResponsiveColumns = (containerWidth: number, minItemWidth: number) => {
  return Math.max(1, Math.floor(containerWidth / minItemWidth));
};

export const generateResponsiveLayout = (
  components: LayoutComponent[],
  containerWidth: number,
  config: { gap: number; minItemWidth: number }
) => {
  const columns = getResponsiveColumns(containerWidth, config.minItemWidth);
  const itemWidth = (containerWidth - (columns - 1) * config.gap) / columns;

  return components.map((component, index) => ({
    ...component,
    width: itemWidth,
    position: calculateGridPosition(
      index,
      columns,
      itemWidth,
      200, // Default height
      config.gap
    ),
  }));
};
