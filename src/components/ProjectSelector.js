import React, { useState } from 'react';

const ProjectSelector = ({ projects, selectedProject, onSelectProject, onAddProject }) => {
  const [showForm, setShowForm] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', color: '#FF8A65' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newProject.name.trim()) {
      onAddProject(newProject.name.trim(), newProject.color);
      setNewProject({ name: '', color: '#FF8A65' });
      setShowForm(false);
    }
  };

  const getTaskStats = (projectId) => {
    // This will be calculated in parent component
    return { total: 0, completed: 0 };
  };

  return (
    <div style={{ 
      padding: '15px', 
      background: '#FFF8F5', 
      border: '2px solid #FFCCBC', 
      borderRadius: '8px', 
      margin: '10px 0' 
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h4 style={{ margin: 0 }}>Projects</h4>
        <button onClick={() => setShowForm(true)} style={{ padding: '8px 12px', fontSize: '12px' }}>
          + New Project
        </button>
      </div>

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button
          onClick={() => onSelectProject(null)}
          style={{
            padding: '10px 15px',
            border: '2px solid #FFCCBC',
            borderRadius: '20px',
            background: !selectedProject ? '#FF8A65' : 'transparent',
            color: !selectedProject ? 'white' : '#8D6E63',
            cursor: 'pointer'
          }}
        >
          All Tasks
        </button>
        
        {projects.map(project => (
          <button
            key={project.id}
            onClick={() => onSelectProject(project.id)}
            style={{
              padding: '10px 15px',
              border: `2px solid ${project.color}`,
              borderRadius: '20px',
              background: selectedProject === project.id ? project.color : 'transparent',
              color: selectedProject === project.id ? 'white' : project.color,
              cursor: 'pointer'
            }}
          >
            {project.name}
          </button>
        ))}
      </div>

      {showForm && (
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
            width: '300px',
            border: '2px solid #FFCCBC'
          }}>
            <h3>New Project</h3>
            <input
              type="text"
              placeholder="Project name"
              value={newProject.name}
              onChange={(e) => setNewProject({...newProject, name: e.target.value})}
              style={{ width: '100%', padding: '10px', margin: '10px 0' }}
              required
            />
            <input
              type="color"
              value={newProject.color}
              onChange={(e) => setNewProject({...newProject, color: e.target.value})}
              style={{ width: '100%', padding: '10px', margin: '10px 0' }}
            />
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button type="submit" style={{ flex: 1, padding: '12px' }}>Create</button>
              <button type="button" onClick={() => setShowForm(false)} style={{ flex: 1, padding: '12px', background: '#ccc' }}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ProjectSelector;