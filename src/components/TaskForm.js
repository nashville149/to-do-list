import React, { useState } from 'react';

const TaskForm = ({ addTask, onClose, projects, selectedProject }) => {
  const [formData, setFormData] = useState({
    title: '',
    priority: 'medium',
    dueDate: '',
    startDate: '',
    duration: 25,
    estimatedTime: 25,
    reminderTime: '',
    emailReminder: false,
    tags: '',
    projectId: selectedProject || '',
    recurring: 'none',
    notes: '',
    subtasks: [],
    checklist: []
  });
  
  const [newSubtask, setNewSubtask] = useState('');
  const [newChecklistItem, setNewChecklistItem] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.title.trim()) {
      addTask({
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        dueDate: formData.dueDate ? new Date(formData.dueDate) : null,
        startDate: formData.startDate ? new Date(formData.startDate) : null,
        duration: parseInt(formData.duration) || 25,
        estimatedTime: parseInt(formData.estimatedTime) || 25,
        reminderTime: formData.reminderTime ? new Date(formData.reminderTime) : null,
        emailReminder: formData.emailReminder,
        projectId: formData.projectId || null,
        recurring: formData.recurring,
        notes: formData.notes,
        subtasks: formData.subtasks,
        checklist: formData.checklist
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
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '10px 0' }}>
          <label style={{ minWidth: '120px' }}>Estimated Time:</label>
          <input
            type="number"
            min="1"
            max="480"
            value={formData.estimatedTime}
            onChange={(e) => setFormData({...formData, estimatedTime: e.target.value})}
            style={{ flex: 1, padding: '10px' }}
            placeholder="How long will this take?"
          />
          <span style={{ fontSize: '12px', color: '#666' }}>minutes</span>
        </div>
        
        <input
          type="datetime-local"
          placeholder="Reminder time"
          value={formData.reminderTime}
          onChange={(e) => setFormData({...formData, reminderTime: e.target.value})}
          style={{ width: '100%', padding: '10px', margin: '10px 0' }}
        />
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '10px 0' }}>
          <input
            type="checkbox"
            id="emailReminder"
            checked={formData.emailReminder}
            onChange={(e) => setFormData({...formData, emailReminder: e.target.checked})}
          />
          <label htmlFor="emailReminder">Send email reminder</label>
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
        
        <select
          value={formData.recurring}
          onChange={(e) => setFormData({...formData, recurring: e.target.value})}
          style={{ width: '100%', padding: '10px', margin: '10px 0' }}
        >
          <option value="none">No Repeat</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
        
        <textarea
          placeholder="Task notes/description"
          value={formData.notes}
          onChange={(e) => setFormData({...formData, notes: e.target.value})}
          style={{ width: '100%', padding: '10px', margin: '10px 0', minHeight: '60px', resize: 'vertical' }}
        />
        
        <div style={{ margin: '10px 0' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Subtasks:</label>
          <div style={{ display: 'flex', gap: '5px', marginBottom: '5px' }}>
            <input
              type="text"
              placeholder="Add subtask"
              value={newSubtask}
              onChange={(e) => setNewSubtask(e.target.value)}
              style={{ flex: 1, padding: '8px' }}
            />
            <button
              type="button"
              onClick={() => {
                if (newSubtask.trim()) {
                  setFormData({...formData, subtasks: [...formData.subtasks, { id: Date.now(), text: newSubtask.trim(), completed: false }]});
                  setNewSubtask('');
                }
              }}
              style={{ padding: '8px 12px', background: '#FF8A65', color: 'white', border: 'none', borderRadius: '4px' }}
            >
              Add
            </button>
          </div>
          {formData.subtasks.map(subtask => (
            <div key={subtask.id} style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '3px' }}>
              <span style={{ flex: 1, fontSize: '14px' }}>• {subtask.text}</span>
              <button
                type="button"
                onClick={() => setFormData({...formData, subtasks: formData.subtasks.filter(s => s.id !== subtask.id)})}
                style={{ padding: '2px 6px', background: '#f44336', color: 'white', border: 'none', borderRadius: '3px', fontSize: '12px' }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
        
        <div style={{ margin: '10px 0' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Checklist:</label>
          <div style={{ display: 'flex', gap: '5px', marginBottom: '5px' }}>
            <input
              type="text"
              placeholder="Add checklist item"
              value={newChecklistItem}
              onChange={(e) => setNewChecklistItem(e.target.value)}
              style={{ flex: 1, padding: '8px' }}
            />
            <button
              type="button"
              onClick={() => {
                if (newChecklistItem.trim()) {
                  setFormData({...formData, checklist: [...formData.checklist, { id: Date.now(), text: newChecklistItem.trim(), completed: false }]});
                  setNewChecklistItem('');
                }
              }}
              style={{ padding: '8px 12px', background: '#FF8A65', color: 'white', border: 'none', borderRadius: '4px' }}
            >
              Add
            </button>
          </div>
          {formData.checklist.map(item => (
            <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '3px' }}>
              <span style={{ flex: 1, fontSize: '14px' }}>☐ {item.text}</span>
              <button
                type="button"
                onClick={() => setFormData({...formData, checklist: formData.checklist.filter(c => c.id !== item.id)})}
                style={{ padding: '2px 6px', background: '#f44336', color: 'white', border: 'none', borderRadius: '3px', fontSize: '12px' }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
        
        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <button type="submit" style={{ flex: 1, padding: '12px' }}>Add Task</button>
          <button type="button" onClick={onClose} style={{ flex: 1, padding: '12px', background: '#ccc' }}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;