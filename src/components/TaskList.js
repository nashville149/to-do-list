import React, { useState } from 'react';
import TaskForm from './TaskForm';
import TaskFilters from './TaskFilters';

const TaskList = ({ tasks, addTask, updateTask, deleteTask, updateTaskStatus, onSelectTask, projects, selectedProject }) => {
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

  const getTaskStatus = (task) => {
    if (task.completed || task.status === 'completed') return 'completed';
    if (task.dueDate && new Date(task.dueDate.toDate()) < new Date()) return 'overdue';
    return task.status || 'pending';
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return '#4CAF50';
      case 'overdue': return '#f44336';
      case 'in-progress': return '#FF9800';
      default: return '#9E9E9E';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed': return '✅';
      case 'overdue': return '⚠️';
      case 'in-progress': return '🔄';
      default: return '⏳';
    }
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
      const taskStatus = getTaskStatus(task);
      if (filters.status && taskStatus !== filters.status) return false;
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
            backgroundColor: getTaskStatus(task) === 'completed' ? '#E8F5E8' : 
                             getTaskStatus(task) === 'overdue' ? '#FFEBEE' : 
                             getTaskStatus(task) === 'in-progress' ? '#FFF3E0' : '#FFF8F5',
            borderLeftWidth: '6px',
            borderLeftColor: getPriorityColor(task.priority)
          }}>
            <div style={{ marginRight: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '18px' }}>{getStatusIcon(getTaskStatus(task))}</span>
              <select
                value={getTaskStatus(task)}
                onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                style={{ 
                  padding: '4px 8px', 
                  fontSize: '12px', 
                  border: `1px solid ${getStatusColor(getTaskStatus(task))}`,
                  borderRadius: '4px',
                  background: 'white'
                }}
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
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
                  <span style={{ color: getTaskStatus(task) === 'overdue' ? '#f44336' : '#666' }}>
                    Due: {new Date(task.dueDate.toDate()).toLocaleDateString()}
                    {getTaskStatus(task) === 'overdue' && ' (OVERDUE)'}
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