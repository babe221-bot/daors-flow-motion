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
