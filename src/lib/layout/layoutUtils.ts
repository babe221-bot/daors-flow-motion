import { LayoutComponent, LayoutTemplate, GridConfig } from '@/types/layout';

export const generateLayoutTemplate = (templateName: string): LayoutComponent[] => {
  const templates: Record<string, LayoutComponent[]> = {
    dashboard: [
      {
        id: 'metrics-1',
        type: 'metric',
        title: 'Total Shipments',
        size: { width: 3, height: 2 },
        position: { x: 0, y: 0 },
        data: { value: 1234, trend: '+12%' },
      },
      {
        id: 'metrics-2',
        type: 'metric',
        title: 'Active Orders',
        size: { width: 3, height: 2 },
        position: { x: 3, y: 0 },
        data: { value: 89, trend: '+5%' },
      },
      {
        id: 'metrics-3',
        type: 'metric',
        title: 'Delivered Today',
        size: { width: 3, height: 2 },
        position: { x: 6, y: 0 },
        data: { value: 45, trend: '-3%' },
      },
      {
        id: 'metrics-4',
        type: 'metric',
        title: 'Pending Issues',
        size: { width: 3, height: 2 },
        position: { x: 9, y: 0 },
        data: { value: 7, trend: '-2%' },
      },
      {
        id: 'chart-1',
        type: 'chart',
        title: 'Shipment Trends',
        size: { width: 6, height: 4 },
        position: { x: 0, y: 2 },
        data: { type: 'line' },
      },
      {
        id: 'table-1',
        type: 'table',
        title: 'Recent Shipments',
        size: { width: 6, height: 4 },
        position: { x: 6, y: 2 },
        data: { columns: ['ID', 'Status', 'ETA'] },
      },
    ],
    analytics: [
      {
        id: 'analytics-1',
        type: 'chart',
        title: 'Revenue Overview',
        size: { width: 8, height: 4 },
        position: { x: 0, y: 0 },
        data: { type: 'bar' },
      },
      {
        id: 'analytics-2',
        type: 'metric',
        title: 'Conversion Rate',
        size: { width: 4, height: 2 },
        position: { x: 8, y: 0 },
        data: { value: '3.2%', trend: '+0.5%' },
      },
    ],
  };

  return templates[templateName] || templates.dashboard;
};

export const normalizeLayout = (components: LayoutComponent[]): LayoutComponent[] => {
  return components.map((component, index) => ({
    ...component,
    id: component.id || `component-${index}`,
    position: component.position || { x: 0, y: 0 },
    size: component.size || { width: 1, height: 1 },
  }));
};

export const calculateResponsiveColumns = (
  containerWidth: number,
  minItemWidth: number,
  gap: number
): number => {
  const availableWidth = containerWidth + gap;
  return Math.max(1, Math.floor(availableWidth / (minItemWidth + gap)));
};

export const generateResponsiveLayout = (
  components: LayoutComponent[],
  columns: number
): LayoutComponent[] => {
  let currentX = 0;
  let currentY = 0;
  let maxHeightInRow = 0;

  return components.map(component => {
    const adjustedWidth = Math.min(component.size.width, columns);
    
    if (currentX + adjustedWidth > columns) {
      currentX = 0;
      currentY += maxHeightInRow;
      maxHeightInRow = 0;
    }

    const positionedComponent = {
      ...component,
      position: { x: currentX, y: currentY },
      size: { ...component.size, width: adjustedWidth },
    };

    currentX += adjustedWidth;
    maxHeightInRow = Math.max(maxHeightInRow, component.size.height);

    return positionedComponent;
  });
};

export const validateLayout = (components: LayoutComponent[]): boolean => {
  return components.every(component => 
    component.id &&
    component.type &&
    component.size.width > 0 &&
    component.size.height > 0
  );
};
