import React, { useState } from 'react';
import TaskForm from './TaskForm';
import TaskFilters from './TaskFilters';

const TaskList = ({ tasks, addTask, updateTask, deleteTask, onSelectTask, projects, selectedProject }) => {
  const [showForm, setShowForm] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    priority: '',
    status: '',
    tag: '',
    sortBy: 'createdAt'
  });

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return '#FF5722';
      case 'medium': return '#FF9800';
      case 'low': return '#4CAF50';
      default: return '#9E9E9E';
    }
  };

  const isOverdue = (task) => {
    return task.dueDate && new Date(task.dueDate.toDate()) < new Date() && !task.completed;
  };

  const isVisible = (task) => {
    if (task.startDate && new Date(task.startDate.toDate()) > new Date()) return false;
    return true;
  };

  const filteredTasks = tasks
    .filter(task => {
      if (!isVisible(task)) return false;
      if (filters.search && !task.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
      if (filters.priority && (task.priority || 'medium') !== filters.priority) return false;
      if (filters.status === 'completed' && !task.completed) return false;
      if (filters.status === 'pending' && task.completed) return false;
      if (filters.status === 'overdue' && !isOverdue(task)) return false;
      if (filters.tag && !task.tags?.includes(filters.tag)) return false;
      return true;
    })
    .sort((a, b) => {
      switch(filters.sortBy) {
        case 'dueDate':
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate.toDate()) - new Date(b.dueDate.toDate());
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority || 'medium'] - priorityOrder[a.priority || 'medium'];
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return new Date(b.createdAt.toDate()) - new Date(a.createdAt.toDate());
      }
    });

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3>Tasks ({filteredTasks.length})</h3>
        <button onClick={() => setShowForm(true)} style={{ padding: '12px 24px' }}>+ Add Task</button>
      </div>
      
      <TaskFilters filters={filters} setFilters={setFilters} tasks={tasks} />
      
      <div>
        {filteredTasks.map(task => (
          <div key={task.id} style={{ 
            display: 'flex', 
            alignItems: 'center', 
            padding: '15px', 
            border: '2px solid #FFCCBC', 
            margin: '10px 0',
            borderRadius: '8px',
            backgroundColor: task.completed ? '#f0f0f0' : isOverdue(task) ? '#FFEBEE' : '#FFF8F5',
            borderLeftWidth: '6px',
            borderLeftColor: getPriorityColor(task.priority)
          }}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={(e) => updateTask(task.id, { completed: e.target.checked })}
              style={{ marginRight: '15px' }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ 
                textDecoration: task.completed ? 'line-through' : 'none',
                fontWeight: 'bold',
                marginBottom: '5px'
              }}>
                {task.title}
              </div>
              <div style={{ fontSize: '12px', color: '#666', display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                {task.dueDate && (
                  <span style={{ color: isOverdue(task) ? '#f44336' : '#666' }}>
                    Due: {new Date(task.dueDate.toDate()).toLocaleDateString()}
                  </span>
                )}
                <span style={{ color: getPriorityColor(task.priority || 'medium') }}>
                  {(task.priority || 'medium').toUpperCase()}
                </span>
                {task.tags?.map(tag => (
                  <span key={tag} style={{ 
                    background: '#FFCCBC', 
                    padding: '2px 6px', 
                    borderRadius: '12px',
                    fontSize: '10px'
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <button 
              onClick={() => onSelectTask(task.id)}
              style={{ marginRight: '10px', padding: '8px 12px' }}
            >
              🍅 Start
            </button>
            <button 
              onClick={() => deleteTask(task.id)}
              style={{ padding: '8px 12px', backgroundColor: '#f44336', color: 'white' }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
      
      {showForm && (
        <TaskForm 
          addTask={addTask} 
          onClose={() => setShowForm(false)}
          projects={projects}
          selectedProject={selectedProject}
        />
      )}
    </div>
  );
};

export default TaskList;