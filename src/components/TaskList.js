import React, { useState } from 'react';
import TaskForm from './TaskForm';
import TaskFilters from './TaskFilters';
import TaskDetails from './TaskDetails';
import CalendarIntegration from './CalendarIntegration';

const TaskList = ({ tasks, addTask, updateTask, deleteTask, updateTaskStatus, onSelectTask, projects, selectedProject }) => {
  const [showForm, setShowForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [calendarTask, setCalendarTask] = useState(null);
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
              <input
                type="checkbox"
                checked={task.completed || getTaskStatus(task) === 'completed'}
                onChange={(e) => {
                  const newStatus = e.target.checked ? 'completed' : 'pending';
                  updateTaskStatus(task.id, newStatus);
                }}
                style={{ 
                  width: '18px', 
                  height: '18px',
                  accentColor: getStatusColor(getTaskStatus(task))
                }}
              />
              <span style={{ fontSize: '16px', color: getStatusColor(getTaskStatus(task)) }}>
                {getStatusIcon(getTaskStatus(task))}
              </span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ 
                textDecoration: task.completed ? 'line-through' : 'none',
                fontWeight: 'bold',
                marginBottom: '5px',
                cursor: 'pointer'
              }}
              onClick={() => setSelectedTask(task)}>
                {task.title}
                {task.recurring !== 'none' && <span style={{ marginLeft: '8px' }}>🔄</span>}
                {task.notes && <span style={{ marginLeft: '8px' }}>📝</span>}
                {task.subtasks?.length > 0 && (
                  <span style={{ marginLeft: '8px', fontSize: '12px', color: '#666' }}>
                    ({task.subtasks.filter(s => s.completed).length}/{task.subtasks.length} subtasks)
                  </span>
                )}
                {task.checklist?.length > 0 && (
                  <span style={{ marginLeft: '8px', fontSize: '12px', color: '#666' }}>
                    ✓{task.checklist.filter(c => c.completed).length}/{task.checklist.length}
                  </span>
                )}
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
                <span style={{ color: '#666' }}>
                  ⏱️ {task.timeSpent || 0}/{task.duration || 25}min
                  {task.estimatedTime && task.estimatedTime !== task.duration && (
                    <span style={{ marginLeft: '5px', fontSize: '11px' }}>
                      (est: {task.estimatedTime}m)
                    </span>
                  )}
                </span>
                {task.reminderTime && (
                  <span style={{ color: '#FF9800', fontSize: '12px' }}>
                    🔔 {new Date(task.reminderTime.toDate()).toLocaleDateString()}
                  </span>
                )}
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
                {task.duration && (
                  <div style={{ 
                    width: '100%', 
                    height: '4px', 
                    background: '#eee', 
                    borderRadius: '2px', 
                    marginTop: '5px',
                    overflow: 'hidden'
                  }}>
                    <div style={{ 
                      width: `${Math.min(((task.timeSpent || 0) / (task.duration || 25)) * 100, 100)}%`, 
                      height: '100%', 
                      background: getTaskStatus(task) === 'completed' ? '#4CAF50' : '#FF8A65',
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                )}
              </div>
            </div>
            <button 
              onClick={() => onSelectTask(task.id, task)}
              style={{ marginRight: '10px', padding: '8px 12px' }}
            >
              🍅 Start ({task.duration || 25}m)
            </button>
            <button 
              onClick={() => setCalendarTask(task)}
              style={{ marginRight: '10px', padding: '8px 12px', backgroundColor: '#4285f4', color: 'white' }}
            >
              📅 Calendar
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
      
      {selectedTask && (
        <TaskDetails 
          task={selectedTask}
          updateTask={updateTask}
          onClose={() => setSelectedTask(null)}
        />
      )}
      
      {calendarTask && (
        <CalendarIntegration 
          task={calendarTask}
          onClose={() => setCalendarTask(null)}
        />
      )}
    </div>
  );
};

export default TaskList;