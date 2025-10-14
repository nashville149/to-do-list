import { useState } from 'react';

export const useDragAndDrop = (tasks, updateTask) => {
  const [draggedTask, setDraggedTask] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  const handleDragStart = (e, task, index) => {
    setDraggedTask({ task, index });
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.outerHTML);
    e.target.style.opacity = '0.5';
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = '1';
    setDraggedTask(null);
    setDragOverIndex(null);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    
    if (!draggedTask || draggedTask.index === targetIndex) {
      setDragOverIndex(null);
      return;
    }

    // Reorder tasks logic would go here
    // For now, we'll just update the task order in a simple way
    console.log(`Moving task from ${draggedTask.index} to ${targetIndex}`);
    
    setDragOverIndex(null);
    setDraggedTask(null);
  };

  const handleStatusDrop = (e, newStatus) => {
    e.preventDefault();
    
    if (draggedTask && draggedTask.task.status !== newStatus) {
      updateTask(draggedTask.task.id, { status: newStatus });
    }
    
    setDraggedTask(null);
    setDragOverIndex(null);
  };

  return {
    draggedTask,
    dragOverIndex,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleStatusDrop
  };
};