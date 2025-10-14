import React, { useState } from 'react';

const FocusMode = ({ tasks, onSelectTask, updateTaskStatus, deleteTask }) => {
  const [focusFilters, setFocusFilters] = useState({
    hideCompleted: true,
    priorityOnly: false,
    todayOnly: false,
    currentProject: null
  });

  const getFocusedTasks = () => {
    return tasks.filter(task => {
      // Hide completed tasks
      if (focusFilters.hideCompleted && task.completed) return false;
      
      // Show only high priority
      if (focusFilters.priorityOnly && task.priority !== 'high') return false;
      
      // Show only today's tasks
      if (focusFilters.todayOnly && task.dueDate) {
        const today = new Date().toDateString();
        const taskDate = new Date(task.dueDate.toDate()).toDateString();
        if (taskDate !== today) return false;
      }
      
      // Show only current project
      if (focusFilters.currentProject && task.projectId !== focusFilters.currentProject) return false;
      
      return true;
    });
  };

  const focusedTasks = getFocusedTasks();

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ 
        background: 'var(--cardBg)', 
        border: '2px solid var(--border)', 
        borderRadius: '12px', 
        padding: '20px', 
        marginBottom: '20px' 
      }}>
        <h2 style={{ color: 'var(--textPrimary)', marginBottom: '20px' }}>🎯 Focus Mode</h2>
        
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginBottom: '20px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={focusFilters.hideCompleted}
              onChange={(e) => setFocusFilters({...focusFilters, hideCompleted: e.target.checked})}
            />
            <span style={{ color: 'var(--textPrimary)' }}>Hide Completed</span>
          </label>
          
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={focusFilters.priorityOnly}
              onChange={(e) => setFocusFilters({...focusFilters, priorityOnly: e.target.checked})}
            />
            <span style={{ color: 'var(--textPrimary)' }}>High Priority Only</span>
          </label>
          
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={focusFilters.todayOnly}
              onChange={(e) => setFocusFilters({...focusFilters, todayOnly: e.target.checked})}
            />
            <span style={{ color: 'var(--textPrimary)' }}>Today Only</span>
          </label>
        </div>
        
        <div style={{ 
          padding: '15px', 
          background: 'var(--border)', 
          borderRadius: '8px', 
          textAlign: 'center' 
        }}>
          <span style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--textPrimary)' }}>
            {focusedTasks.length} tasks in focus
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {focusedTasks.map(task => (
          <div key={task.id} style={{
            background: 'var(--cardBg)',
            border: '2px solid var(--border)',
            borderRadius: '8px',
            padding: '15px',
            borderLeft: `6px solid ${task.priority === 'high' ? 'var(--error)' : task.priority === 'medium' ? 'var(--warning)' : 'var(--success)'}`,
            display: 'flex',
            alignItems: 'center',
            gap: '15px'
          }}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={(e) => updateTaskStatus(task.id, e.target.checked ? 'completed' : 'pending')}
              style={{ width: '20px', height: '20px' }}
            />
            
            <div style={{ flex: 1 }}>
              <div style={{ 
                fontWeight: 'bold', 
                fontSize: '16px', 
                color: 'var(--textPrimary)',
                textDecoration: task.completed ? 'line-through' : 'none'
              }}>
                {task.title}
              </div>
              
              <div style={{ fontSize: '12px', color: 'var(--textSecondary)', marginTop: '5px' }}>
                {task.priority && (
                  <span style={{ 
                    background: task.priority === 'high' ? 'var(--error)' : task.priority === 'medium' ? 'var(--warning)' : 'var(--success)',
                    color: 'white',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '10px',
                    marginRight: '8px'
                  }}>
                    {task.priority.toUpperCase()}
                  </span>
                )}
                
                {task.dueDate && (
                  <span>📅 {new Date(task.dueDate.toDate()).toLocaleDateString()}</span>
                )}
                
                {task.estimatedTime && (
                  <span style={{ marginLeft: '8px' }}>⏱️ {task.estimatedTime}min</span>
                )}
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => onSelectTask(task.id, task)}
                style={{
                  padding: '8px 12px',
                  background: 'var(--accent)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                🍅 Focus
              </button>
              
              <button
                onClick={() => deleteTask(task.id)}
                style={{
                  padding: '8px 12px',
                  background: 'var(--error)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        
        {focusedTasks.length === 0 && (
          <div style={{
            background: 'var(--cardBg)',
            border: '2px solid var(--border)',
            borderRadius: '12px',
            padding: '40px',
            textAlign: 'center',
            color: 'var(--textSecondary)'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '10px' }}>🎯</div>
            <h3>Perfect Focus!</h3>
            <p>No tasks match your focus criteria. Time to relax or adjust your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FocusMode;