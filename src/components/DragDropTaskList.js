import React from 'react';
import { useDragAndDrop } from '../hooks/useDragAndDrop';

const DragDropTaskList = ({ tasks, updateTask, updateTaskStatus, onSelectTask, deleteTask }) => {
  const {
    draggedTask,
    dragOverIndex,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleStatusDrop
  } = useDragAndDrop(tasks, updateTask);

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'var(--success)';
      case 'overdue': return 'var(--error)';
      case 'in-progress': return 'var(--warning)';
      default: return 'var(--textSecondary)';
    }
  };

  const statusColumns = [
    { id: 'pending', title: '📋 To Do', status: 'pending' },
    { id: 'in-progress', title: '🔄 In Progress', status: 'in-progress' },
    { id: 'completed', title: '✅ Done', status: 'completed' }
  ];

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(3, 1fr)', 
      gap: '20px', 
      padding: '20px',
      minHeight: '400px'
    }}>
      {statusColumns.map(column => (
        <div
          key={column.id}
          style={{
            background: 'var(--cardBg)',
            border: '2px solid var(--border)',
            borderRadius: '12px',
            padding: '15px',
            minHeight: '300px'
          }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => handleStatusDrop(e, column.status)}
        >
          <h4 style={{ 
            margin: '0 0 15px 0', 
            color: 'var(--textPrimary)',
            textAlign: 'center',
            padding: '10px',
            background: 'var(--border)',
            borderRadius: '8px'
          }}>
            {column.title}
          </h4>
          
          {tasks
            .filter(task => (task.status || 'pending') === column.status)
            .map((task, index) => (
              <div
                key={task.id}
                draggable
                onDragStart={(e) => handleDragStart(e, task, index)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, index)}
                style={{
                  padding: '12px',
                  margin: '8px 0',
                  background: dragOverIndex === index ? 'var(--accent)' : 'var(--cardBg)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  cursor: 'grab',
                  color: 'var(--textPrimary)',
                  boxShadow: draggedTask?.task.id === task.id ? '0 4px 8px rgba(0,0,0,0.2)' : 'none',
                  transform: draggedTask?.task.id === task.id ? 'rotate(5deg)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                  {task.title}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--textSecondary)' }}>
                  ⏱️ {task.duration || 25}min
                  {task.dueDate && (
                    <span style={{ marginLeft: '10px' }}>
                      📅 {new Date(task.dueDate.toDate()).toLocaleDateString()}
                    </span>
                  )}
                </div>
                <div style={{ marginTop: '8px', display: 'flex', gap: '5px' }}>
                  <button
                    onClick={() => onSelectTask(task.id, task)}
                    style={{ 
                      padding: '4px 8px', 
                      fontSize: '10px',
                      background: 'var(--accent)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    🍅 Start
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
                    style={{ 
                      padding: '4px 8px', 
                      fontSize: '10px',
                      background: 'var(--error)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
        </div>
      ))}
    </div>
  );
};

export default DragDropTaskList;