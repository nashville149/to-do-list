import React from 'react';

const ProgressStats = ({ tasks, projects, selectedProject }) => {
  const filteredTasks = selectedProject 
    ? tasks.filter(task => task.projectId === selectedProject)
    : tasks;

  const totalTasks = filteredTasks.length;
  const completedTasks = filteredTasks.filter(task => task.completed).length;
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const getProjectStats = () => {
    return projects.map(project => {
      const projectTasks = tasks.filter(task => task.projectId === project.id);
      const total = projectTasks.length;
      const completed = projectTasks.filter(task => task.completed).length;
      const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
      
      return {
        ...project,
        total,
        completed,
        percentage
      };
    });
  };

  const projectStats = getProjectStats();
  const todayCompleted = tasks.filter(task => 
    task.completed && 
    task.updatedAt && 
    new Date(task.updatedAt.toDate()).toDateString() === new Date().toDateString()
  ).length;

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ 
        background: '#FFF8F5', 
        border: '2px solid #FFCCBC', 
        borderRadius: '12px', 
        padding: '20px', 
        marginBottom: '20px' 
      }}>
        <h3 style={{ margin: '0 0 15px 0' }}>
          {selectedProject ? projects.find(p => p.id === selectedProject)?.name : 'Overall'} Progress
        </h3>
        
        <div style={{ marginBottom: '15px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
            <span>{completedTasks} of {totalTasks} tasks completed</span>
            <span style={{ fontWeight: 'bold' }}>{progressPercentage}%</span>
          </div>
          <div style={{ 
            width: '100%', 
            height: '20px', 
            background: '#FFCCBC', 
            borderRadius: '10px', 
            overflow: 'hidden' 
          }}>
            <div style={{ 
              width: `${progressPercentage}%`, 
              height: '100%', 
              background: 'linear-gradient(90deg, #FF8A65, #FF7043)', 
              transition: 'width 0.3s ease' 
            }} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#FF8A65' }}>{todayCompleted}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>Completed Today</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#FF8A65' }}>{totalTasks - completedTasks}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>Remaining</div>
          </div>
        </div>
      </div>

      {!selectedProject && projectStats.length > 0 && (
        <div style={{ 
          background: '#FFF8F5', 
          border: '2px solid #FFCCBC', 
          borderRadius: '12px', 
          padding: '20px' 
        }}>
          <h4 style={{ margin: '0 0 15px 0' }}>Project Progress</h4>
          {projectStats.map(project => (
            <div key={project.id} style={{ marginBottom: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span style={{ color: project.color, fontWeight: 'bold' }}>{project.name}</span>
                <span>{project.completed}/{project.total} ({project.percentage}%)</span>
              </div>
              <div style={{ 
                width: '100%', 
                height: '8px', 
                background: '#FFCCBC', 
                borderRadius: '4px', 
                overflow: 'hidden' 
              }}>
                <div style={{ 
                  width: `${project.percentage}%`, 
                  height: '100%', 
                  background: project.color, 
                  transition: 'width 0.3s ease' 
                }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProgressStats;