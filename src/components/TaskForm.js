import React, { useState } from 'react';

const TaskForm = ({ addTask, onClose, projects, selectedProject }) => {
  const [formData, setFormData] = useState({
    title: '',
    priority: 'medium',
    dueDate: '',
    startDate: '',
    duration: 25,
    tags: '',
    projectId: selectedProject || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.title.trim()) {
      addTask({
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        dueDate: formData.dueDate ? new Date(formData.dueDate) : null,
        startDate: formData.startDate ? new Date(formData.startDate) : null,
        duration: parseInt(formData.duration) || 25,
        projectId: formData.projectId || null
      });
      onClose();
    }
  };

  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      right: 0, 
      bottom: 0, 
      background: 'rgba(0,0,0,0.5)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center' 
    }}>
      <form onSubmit={handleSubmit} style={{ 
        background: '#FFF8F5', 
        padding: '30px', 
        borderRadius: '12px', 
        width: '400px',
        border: '2px solid #FFCCBC'
      }}>
        <h3 style={{ margin: '0 0 20px 0' }}>Add New Task</h3>
        
        <input
          type="text"
          placeholder="Task title"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          style={{ width: '100%', padding: '10px', margin: '10px 0' }}
          required
        />
        
        <select
          value={formData.priority}
          onChange={(e) => setFormData({...formData, priority: e.target.value})}
          style={{ width: '100%', padding: '10px', margin: '10px 0' }}
        >
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>
        
        <input
          type="datetime-local"
          placeholder="Due date"
          value={formData.dueDate}
          onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
          style={{ width: '100%', padding: '10px', margin: '10px 0' }}
        />
        
        <input
          type="date"
          placeholder="Start date"
          value={formData.startDate}
          onChange={(e) => setFormData({...formData, startDate: e.target.value})}
          style={{ width: '100%', padding: '10px', margin: '10px 0' }}
        />
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '10px 0' }}>
          <label style={{ minWidth: '120px' }}>Duration (minutes):</label>
          <input
            type="number"
            min="1"
            max="480"
            value={formData.duration}
            onChange={(e) => setFormData({...formData, duration: e.target.value})}
            style={{ flex: 1, padding: '10px' }}
          />
        </div>
        
        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={formData.tags}
          onChange={(e) => setFormData({...formData, tags: e.target.value})}
          style={{ width: '100%', padding: '10px', margin: '10px 0' }}
        />
        
        <select
          value={formData.projectId}
          onChange={(e) => setFormData({...formData, projectId: e.target.value})}
          style={{ width: '100%', padding: '10px', margin: '10px 0' }}
        >
          <option value="">No Project</option>
          {projects.map(project => (
            <option key={project.id} value={project.id}>{project.name}</option>
          ))}
        </select>
        
        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <button type="submit" style={{ flex: 1, padding: '12px' }}>Add Task</button>
          <button type="button" onClick={onClose} style={{ flex: 1, padding: '12px', background: '#ccc' }}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;