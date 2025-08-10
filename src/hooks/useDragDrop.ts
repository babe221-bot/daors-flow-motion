import { useState, useCallback, useRef } from 'react';
import { LayoutComponent, DragDropState } from '@/types/layout';

interface UseDragDropReturn {
  dragState: DragDropState;
  handleDragStart: (e: React.DragEvent, component: LayoutComponent) => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent, targetId: string) => void;
  handleDragEnd: () => void;
}

export const useDragDrop = (
  components: LayoutComponent[],
  onReorder: (newOrder: LayoutComponent[]) => void
): UseDragDropReturn => {
  const [dragState, setDragState] = useState<DragDropState>({
    isDragging: false,
    draggedItem: null,
    draggedOverId: null,
    dragOffset: { x: 0, y: 0 },
  });

  const handleDragStart = useCallback((e: React.DragEvent, component: LayoutComponent) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', component.id);
    
    setDragState(prev => ({
      ...prev,
      isDragging: true,
      draggedItem: component,
    }));
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    
    if (!dragState.draggedItem || dragState.draggedItem.id === targetId) {
      return;
    }

    const draggedIndex = components.findIndex(c => c.id === dragState.draggedItem!.id);
    const targetIndex = components.findIndex(c => c.id === targetId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newComponents = [...components];
    const [draggedComponent] = newComponents.splice(draggedIndex, 1);
    newComponents.splice(targetIndex, 0, draggedComponent);

    onReorder(newComponents);
  }, [components, dragState.draggedItem, onReorder]);

  const handleDragEnd = useCallback(() => {
    setDragState({
      isDragging: false,
      draggedItem: null,
      draggedOverId: null,
      dragOffset: { x: 0, y: 0 },
    });
  }, []);

  return {
    dragState,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
  };
};
