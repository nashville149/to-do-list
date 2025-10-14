import React, { useState } from 'react';

const TaskDetails = ({ task, updateTask, onClose }) => {
  const [editingSubtask, setEditingSubtask] = useState(null);
  const [editingChecklist, setEditingChecklist] = useState(null);

  const toggleSubtask = (subtaskId) => {
    const updatedSubtasks = task.subtasks.map(subtask =>
      subtask.id === subtaskId ? { ...subtask, completed: !subtask.completed } : subtask
    );
    updateTask(task.id, { subtasks: updatedSubtasks });
  };

  const toggleChecklistItem = (itemId) => {
    const updatedChecklist = task.checklist.map(item =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );
    updateTask(task.id, { checklist: updatedChecklist });
  };

  const getRecurringText = (recurring) => {
    switch(recurring) {
      case 'daily': return '🔄 Daily';
      case 'weekly': return '🔄 Weekly';
      case 'monthly': return '🔄 Monthly';
      case 'yearly': return '🔄 Yearly';
      default: return '';
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
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{ 
        background: '#FFF8F5', 
        padding: '30px', 
        borderRadius: '12px', 
        width: '500px',
        maxHeight: '80vh',
        overflow: 'auto',
        border: '2px solid #FFCCBC'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0 }}>{task.title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>×</button>
        </div>

        {task.notes && (
          <div style={{ marginBottom: '15px' }}>
            <strong>Notes:</strong>
            <p style={{ margin: '5px 0', padding: '10px', background: '#f9f9f9', borderRadius: '4px' }}>
              {task.notes}
            </p>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
          <div><strong>Priority:</strong> {task.priority?.toUpperCase()}</div>
          <div><strong>Duration:</strong> {task.duration} minutes</div>
          <div><strong>Estimated Time:</strong> {task.estimatedTime || task.duration} minutes</div>
          <div><strong>Time Spent:</strong> {task.timeSpent || 0} minutes</div>
          {task.recurring !== 'none' && <div>{getRecurringText(task.recurring)}</div>}
        </div>
        
        {task.estimatedTime && task.timeSpent > 0 && (
          <div style={{ 
            marginBottom: '15px', 
            padding: '10px', 
            background: task.timeSpent > task.estimatedTime ? '#ffebee' : '#e8f5e8',
            borderRadius: '4px'
          }}>
            <strong>Time Estimate vs Actual:</strong>
            <div style={{ fontSize: '14px', marginTop: '5px' }}>
              {task.timeSpent <= task.estimatedTime ? 
                `✅ On track! ${task.estimatedTime - task.timeSpent} minutes remaining` :
                `⚠️ Over estimate by ${task.timeSpent - task.estimatedTime} minutes`
              }
            </div>
          </div>
        )}

        {task.dueDate && (
          <div style={{ marginBottom: '15px' }}>
            <strong>Due:</strong> {new Date(task.dueDate.toDate()).toLocaleString()}
          </div>
        )}
        
        {task.reminderTime && (
          <div style={{ marginBottom: '15px' }}>
            <strong>Reminder:</strong> {new Date(task.reminderTime.toDate()).toLocaleString()}
            {task.emailReminder && <span style={{ marginLeft: '10px', fontSize: '12px' }}>📧 Email</span>}
          </div>
        )}

        {task.tags && task.tags.length > 0 && (
          <div style={{ marginBottom: '15px' }}>
            <strong>Tags:</strong>
            <div style={{ display: 'flex', gap: '5px', marginTop: '5px', flexWrap: 'wrap' }}>
              {task.tags.map(tag => (
                <span key={tag} style={{ 
                  background: '#FFCCBC', 
                  padding: '3px 8px', 
                  borderRadius: '12px',
                  fontSize: '12px'
                }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {task.subtasks && task.subtasks.length > 0 && (
          <div style={{ marginBottom: '15px' }}>
            <strong>Subtasks ({task.subtasks.filter(s => s.completed).length}/{task.subtasks.length}):</strong>
            <div style={{ marginTop: '10px' }}>
              {task.subtasks.map(subtask => (
                <div key={subtask.id} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px', 
                  padding: '8px',
                  background: subtask.completed ? '#d4edda' : '#fff3cd',
                  margin: '5px 0',
                  borderRadius: '4px'
                }}>
                  <input
                    type="checkbox"
                    checked={subtask.completed}
                    onChange={() => toggleSubtask(subtask.id)}
                  />
                  <span style={{ 
                    flex: 1, 
                    textDecoration: subtask.completed ? 'line-through' : 'none' 
                  }}>
                    {subtask.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {task.checklist && task.checklist.length > 0 && (
          <div style={{ marginBottom: '15px' }}>
            <strong>Checklist ({task.checklist.filter(c => c.completed).length}/{task.checklist.length}):</strong>
            <div style={{ marginTop: '10px' }}>
              {task.checklist.map(item => (
                <div key={item.id} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px', 
                  padding: '8px',
                  background: item.completed ? '#d4edda' : '#f8f9fa',
                  margin: '5px 0',
                  borderRadius: '4px'
                }}>
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => toggleChecklistItem(item.id)}
                  />
                  <span style={{ 
                    flex: 1, 
                    textDecoration: item.completed ? 'line-through' : 'none' 
                  }}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ 
          width: '100%', 
          height: '8px', 
          background: '#eee', 
          borderRadius: '4px', 
          marginTop: '20px',
          overflow: 'hidden'
        }}>
          <div style={{ 
            width: `${Math.min(((task.timeSpent || 0) / (task.duration || 25)) * 100, 100)}%`, 
            height: '100%', 
            background: '#FF8A65',
            transition: 'width 0.3s ease'
          }} />
        </div>
        <p style={{ textAlign: 'center', fontSize: '12px', color: '#666', margin: '5px 0 0 0' }}>
          Progress: {Math.min(Math.round(((task.timeSpent || 0) / (task.duration || 25)) * 100), 100)}%
        </p>
      </div>
    </div>
  );
};

export default TaskDetails;