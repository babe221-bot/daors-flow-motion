import { useState, useRef, useCallback } from 'react';
import { LayoutComponent } from '@/types/layout';

interface DragState {
  isDragging: boolean;
  draggedItem: LayoutComponent | null;
  draggedOverId: string | null;
  dragOffset: { x: number; y: number };
}

export const useDragDrop = (
  items: LayoutComponent[],
  onReorder: (newOrder: LayoutComponent[]) => void
) => {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    draggedItem: null,
    draggedOverId: null,
    dragOffset: { x: 0, y: 0 },
  });

  const containerRef = useRef<HTMLDivElement>(null);

  const handleDragStart = useCallback((
    e: React.DragEvent<HTMLDivElement>,
    item: LayoutComponent
  ) => {
    setDragState(prev => ({
      ...prev,
      isDragging: true,
      draggedItem: item,
    }));

    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', item.id);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDragEnter = useCallback((
    e: React.DragEvent<HTMLDivElement>,
    targetId: string
  ) => {
    e.preventDefault();
    setDragState(prev => ({
      ...prev,
      draggedOverId: targetId,
    }));
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragState(prev => ({
      ...prev,
      draggedOverId: null,
    }));
  }, []);

  const handleDrop = useCallback((
    e: React.DragEvent<HTMLDivElement>,
    targetId: string
  ) => {
    e.preventDefault();
    
    if (!dragState.draggedItem) return;

    const draggedId = e.dataTransfer.getData('text/plain');
    const newItems = [...items];
    
    const draggedIndex = newItems.findIndex(item => item.id === draggedId);
    const targetIndex = newItems.findIndex(item => item.id === targetId);

    if (draggedIndex !== -1 && targetIndex !== -1) {
      const [draggedItem] = newItems.splice(draggedIndex, 1);
      newItems.splice(targetIndex, 0, draggedItem);
      onReorder(newItems);
    }

    setDragState({
      isDragging: false,
      draggedItem: null,
      draggedOverId: null,
      dragOffset: { x: 0, y: 0 },
    });
  }, [items, dragState.draggedItem, onReorder]);

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
    containerRef,
    handleDragStart,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
    handleDragEnd,
  };
};
