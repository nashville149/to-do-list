import React, { useState } from 'react';

const TaskList = ({ tasks, addTask, updateTask, deleteTask, onSelectTask }) => {
  const [newTask, setNewTask] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newTask.trim()) {
      addTask(newTask.trim());
      setNewTask('');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h3>Tasks</h3>
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Add new task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          style={{ padding: '10px', marginRight: '10px', width: '300px' }}
        />
        <button type="submit" style={{ padding: '10px' }}>Add Task</button>
      </form>
      
      <div>
        {tasks.map(task => (
          <div key={task.id} style={{ 
            display: 'flex', 
            alignItems: 'center', 
            padding: '10px', 
            border: '1px solid #ddd', 
            margin: '5px 0',
            backgroundColor: task.completed ? '#f0f0f0' : 'white'
          }}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={(e) => updateTask(task.id, { completed: e.target.checked })}
              style={{ marginRight: '10px' }}
            />
            <span style={{ 
              flex: 1, 
              textDecoration: task.completed ? 'line-through' : 'none' 
            }}>
              {task.title}
            </span>
            <button 
              onClick={() => onSelectTask(task.id)}
              style={{ marginRight: '10px', padding: '5px 10px' }}
            >
              Start Pomodoro
            </button>
            <button 
              onClick={() => deleteTask(task.id)}
              style={{ padding: '5px 10px', backgroundColor: '#ff4444', color: 'white' }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskList;