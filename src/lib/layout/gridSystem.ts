import { LayoutComponent, GridConfig } from '@/types/layout';
import { getResponsiveValue } from './breakpoints';

export interface GridPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface GridItem extends LayoutComponent {
  gridPosition: GridPosition;
}

export class GridSystem {
  private config: GridConfig;
  private containerWidth: number;
  private breakpoint: string;

  constructor(config: GridConfig, containerWidth: number, breakpoint: string) {
    this.config = config;
    this.containerWidth = containerWidth;
    this.breakpoint = breakpoint;
  }

  calculateGridPositions(components: LayoutComponent[]): GridItem[] {
    const columns = getResponsiveValue(
      this.config.breakpoints?.reduce((acc, bp) => ({ ...acc, [bp.name]: bp.columns }), {}) || {},
      this.breakpoint
    ) as number;

    const gap = this.config.gap;
    const minItemWidth = this.config.minItemWidth;
    
    const availableWidth = this.containerWidth - (columns - 1) * gap;
    const itemWidth = Math.max(minItemWidth, availableWidth / columns);
    
    const gridItems: GridItem[] = [];
    let currentX = 0;
    let currentY = 0;
    let rowHeight = 0;

    components.forEach((component, index) => {
      const column = index % columns;
      
      if (column === 0 && index > 0) {
        currentY += rowHeight + gap;
        currentX = 0;
        rowHeight = 0;
      }

      const itemHeight = component.size?.height || 200;
      rowHeight = Math.max(rowHeight, itemHeight);

      gridItems.push({
        ...component,
        gridPosition: {
          x: currentX,
          y: currentY,
          width: itemWidth,
          height: itemHeight,
        },
      });

      currentX += itemWidth + gap;
    });

    return gridItems;
  }

  calculateNewPosition(
    draggedItem: LayoutComponent,
    targetIndex: number,
    allItems: LayoutComponent[]
  ): GridPosition[] {
    const newOrder = [...allItems];
    const draggedIndex = newOrder.findIndex(item => item.id === draggedItem.id);
    
    if (draggedIndex !== -1) {
      newOrder.splice(draggedIndex, 1);
      newOrder.splice(targetIndex, 0, draggedItem);
    }

    return this.calculateGridPositions(newOrder).map(item => item.gridPosition);
  }

  getContainerHeight(items: GridItem[]): number {
    if (items.length === 0) return 0;
    
    const maxY = Math.max(...items.map(item => item.gridPosition.y + item.gridPosition.height));
    return maxY;
  }
}
