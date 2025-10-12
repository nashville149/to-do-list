import React from 'react';

const TaskFilters = ({ filters, setFilters, tasks }) => {
  const allTags = [...new Set(tasks.flatMap(task => task.tags || []))];

  return (
    <div style={{ 
      padding: '15px', 
      background: '#FFF8F5', 
      border: '2px solid #FFCCBC', 
      borderRadius: '8px', 
      margin: '10px 0',
      display: 'flex',
      gap: '15px',
      flexWrap: 'wrap',
      alignItems: 'center'
    }}>
      <input
        type="text"
        placeholder="Search tasks..."
        value={filters.search}
        onChange={(e) => setFilters({...filters, search: e.target.value})}
        style={{ padding: '8px', minWidth: '200px' }}
      />
      
      <select
        value={filters.priority}
        onChange={(e) => setFilters({...filters, priority: e.target.value})}
        style={{ padding: '8px' }}
      >
        <option value="">All Priorities</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>
      
      <select
        value={filters.status}
        onChange={(e) => setFilters({...filters, status: e.target.value})}
        style={{ padding: '8px' }}
      >
        <option value="">All Tasks</option>
        <option value="pending">Pending</option>
        <option value="completed">Completed</option>
        <option value="overdue">Overdue</option>
      </select>
      
      <select
        value={filters.tag}
        onChange={(e) => setFilters({...filters, tag: e.target.value})}
        style={{ padding: '8px' }}
      >
        <option value="">All Tags</option>
        {allTags.map(tag => (
          <option key={tag} value={tag}>{tag}</option>
        ))}
      </select>
      
      <select
        value={filters.sortBy}
        onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
        style={{ padding: '8px' }}
      >
        <option value="createdAt">Sort by Created</option>
        <option value="dueDate">Sort by Due Date</option>
        <option value="priority">Sort by Priority</option>
        <option value="title">Sort by Title</option>
      </select>
    </div>
  );
};

export default TaskFilters;